export function formatBdt(amount: number) {
  return `৳${new Intl.NumberFormat("bn-BD").format(amount)}`;
}

export function formatDate(iso: string) {
  const value = iso.length === 10 ? `${iso}T00:00:00` : iso;
  return new Intl.DateTimeFormat("bn-BD", {
    day: "numeric",
    month: "long",
    year: "numeric",
    timeZone: "Asia/Dhaka",
  }).format(new Date(value));
}

export function formatSize(bytes: number) {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${Math.round(bytes / 1024)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

export function todayISO() {
  return new Intl.DateTimeFormat("en-CA", {
    timeZone: "Asia/Dhaka",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).format(new Date());
}

export function monthKey(iso = todayISO()) {
  return iso.slice(0, 7);
}
