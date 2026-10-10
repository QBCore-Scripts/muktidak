import { cookies } from "next/headers";
import { cache } from "react";
import { getSettings } from "./db";
import { LOCALE_COOKIE, pageMeta, uiText, type Locale, type PageKey } from "./i18n";

export const getLocale = cache(async (): Promise<Locale> => {
  return (await cookies()).get(LOCALE_COOKIE)?.value === "en" ? "en" : "bn";
});

export const getSite = cache(async () => {
  const [locale, settings] = await Promise.all([getLocale(), getSettings()]);
  return { locale, t: uiText[locale], settings };
});

export async function localizedMeta(key: PageKey) {
  return pageMeta[await getLocale()][key];
}
