import { createHash, randomBytes, scryptSync, timingSafeEqual } from "crypto";
import { cookies } from "next/headers";
import { deleteSession, findSession, saveSession } from "./db";

const COOKIE = "md_session";
const WEEK = 60 * 60 * 24 * 7;

export function hashPassword(password: string) {
  const salt = randomBytes(16).toString("hex");
  const passwordHash = scryptSync(password, salt, 32).toString("hex");
  return { salt, passwordHash };
}

export function verifyPassword(password: string, salt: string, passwordHash: string) {
  try {
    if (!password || password.length > 200 || !salt || !/^[0-9a-f]{64}$/.test(passwordHash)) return false;
    const actual = scryptSync(password, salt, 32);
    const expected = Buffer.from(passwordHash, "hex");
    if (expected.length !== actual.length) return false;
    return timingSafeEqual(actual, expected);
  } catch {
    return false;
  }
}

function hashToken(token: string) {
  return createHash("sha256").update(token).digest("hex");
}

export async function getSession() {
  const jar = await cookies();
  const token = jar.get(COOKIE)?.value;
  if (!token || token.length < 32 || token.length > 200) return null;
  const row = findSession(hashToken(token));
  if (!row || row.expires < Date.now()) {
    if (row) deleteSession(hashToken(token));
    return null;
  }
  return { email: row.email };
}

export async function setSession(email: string) {
  const token = randomBytes(32).toString("base64url");
  saveSession(hashToken(token), email, Date.now() + WEEK * 1000);
  const jar = await cookies();
  jar.set(COOKIE, token, {
    httpOnly: true,
    sameSite: "strict",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: WEEK,
  });
}

export async function clearSession() {
  const jar = await cookies();
  const token = jar.get(COOKIE)?.value;
  if (token) deleteSession(hashToken(token));
  jar.delete(COOKIE);
}
