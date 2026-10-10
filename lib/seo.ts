export const siteNameBn = "বাংলাদেশ মুক্তির ডাক-৭১";
export const siteNameEn = "Bangladesh Muktir Dak 71";

export const siteDescription =
  "বাংলাদেশ মুক্তির ডাক-৭১ (Bangladesh Muktir Dak 71) গণতন্ত্র পুনরুদ্ধার ও মুজিববাদ প্রতিষ্ঠার লক্ষ্যে গড়া জনগণের রাজনৈতিক দল — মাঠের সংগঠন, জেলা দপ্তর ও খোলা হিসাবের রাজনীতি।";

export const siteKeywords = [
  siteNameBn,
  siteNameEn,
  "Muktir Dak 71",
  "Mukti Dak 71",
  "মুক্তির ডাক-৭১",
  "মুক্তির ডাক ৭১",
  "বাংলাদেশের রাজনৈতিক দল",
  "বাংলাদেশ রাজনৈতিক দল",
  "জনগণের রাজনৈতিক দল",
  "বাংলাদেশ রাজনীতি",
  "জেলা রাজনীতি বাংলাদেশ",
  "Bangladesh political party",
  "political party Bangladesh",
  "Bangladesh politics",
  "Bangladesh Muktir Dak",
];

export function siteUrl() {
  const configured = process.env.NEXT_PUBLIC_SITE_URL?.trim().replace(/\/$/, "");
  return configured || "https://bdmuktirdak71.org";
}

export function jsonLdScript(data: unknown) {
  return JSON.stringify(data).replace(/</g, "\\u003c");
}
