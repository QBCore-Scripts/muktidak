export async function adminFetch<T>(url: string, init?: RequestInit): Promise<T> {
  const res = await fetch(url, { ...init, signal: init?.signal ?? AbortSignal.timeout(15000) });
  const data = (await res.json().catch(() => ({}))) as T & { error?: string };
  if (res.status === 401) {
    window.location.href = "/admin/login";
    throw new Error("প্রবেশ করা প্রয়োজন");
  }
  if (!res.ok) throw new Error(data.error || "অনুরোধ ব্যর্থ হয়েছে");
  return data;
}
