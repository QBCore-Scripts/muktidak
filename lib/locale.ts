import { cookies } from "next/headers";
import { cache } from "react";
import { getSettings } from "./db";
import { LOCALE_COOKIE, englishCopy, pageMeta, uiText, type Locale, type PageKey } from "./i18n";
import { siteNameEn } from "./seo";

export const getLocale = cache(async (): Promise<Locale> => {
  return (await cookies()).get(LOCALE_COOKIE)?.value === "en" ? "en" : "bn";
});

export const getSite = cache(async () => {
  const [locale, settings] = await Promise.all([getLocale(), getSettings()]);
  if (locale === "bn") return { locale, t: uiText.bn, settings };
  return {
    locale,
    t: uiText.en,
    settings: { ...settings, name: siteNameEn, shortName: "Muktir Dak 71", copy: { ...settings.copy, ...englishCopy } },
  };
});

export async function localizedMeta(key: PageKey) {
  return pageMeta[await getLocale()][key];
}
