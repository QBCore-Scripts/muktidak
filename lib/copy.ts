export type SiteCopy = {
  headerLine: string;
  footerLine: string;
  footerNote: string;
  flavorLine: string;
  homeDate: string;
  homeFreedom: string;
  quoteLabel: string;
  homeDonate: string;
  homeAbout: string;
  homeWorkTitle: string;
  homeNoticeTitle: string;
  homeNoticesLink: string;
  homeNote: string;
  navHome: string;
  navAbout: string;
  navVision: string;
  navActivities: string;
  navGallery: string;
  navNotices: string;
  navBlogs: string;
  navDistricts: string;
  navContact: string;
  navDonate: string;
  donateKicker: string;
  donateTitle: string;
  donateText: string;
  donateNote: string;
  galleryKicker: string;
  galleryTitle: string;
  galleryText: string;
  noticesKicker: string;
  noticesTitle: string;
  noticesText: string;
  blogsKicker: string;
  blogsTitle: string;
  blogsText: string;
  homeBlogTitle: string;
  homeBlogsLink: string;
  districtsKicker: string;
  districtsTitle: string;
  districtsText: string;
  contactKicker: string;
  contactTitle: string;
  contactOffice: string;
  visionKicker: string;
  activitiesKicker: string;
  visionPoints: string;
  heroTitle: string;
  heroPhilosophy: string;
  heroPillars: string;
  linkManifesto: string;
  linkObjectives: string;
  linkCommittee: string;
  highlightKicker: string;
  highlightOne: string;
  highlightTwo: string;
  highlightThree: string;
  heroVideo: string;
};

export function defaultCopy(): SiteCopy {
  return {
    headerLine: "বাংলাদেশ মুক্তির ডাক-৭১ — গণতন্ত্র পুনরুদ্ধার ও মুজিববাদ প্রতিষ্ঠার রাজনৈতিক দল",
    footerLine: "",
    footerNote: "Developed by Syntaxx Technology",
    flavorLine: "রাজনৈতিক দল · বাংলাদেশ মুক্তির ডাক-৭১",
    homeDate: "গণতন্ত্র পুনরুদ্ধারের লড়াই",
    homeFreedom: "মানুষের মর্যাদা, ভোটের অধিকার ও নিরাপদ জীবনের পক্ষে আমাদের রাজনীতি।",
    quoteLabel: "দলের কথা",
    homeDonate: "দান করুন",
    homeAbout: "পরিচিতি পড়ুন",
    homeWorkTitle: "মাঠের কর্মসূচি",
    homeNoticeTitle: "নোটিশ",
    homeNoticesLink: "সব দেখুন",
    homeNote: "দলের হিসাব ডিজিটাল ও খোলা — যাতে মানুষ নিজে মিলিয়ে নিতে পারে।",
    navHome: "প্রচ্ছদ",
    navAbout: "পরিচিতি",
    navVision: "ভিশন",
    navActivities: "কার্যক্রম",
    navGallery: "গ্যালারি",
    navNotices: "নোটিশ",
    navBlogs: "ব্লগ",
    navDistricts: "জেলা",
    navContact: "যোগাযোগ",
    navDonate: "দান করুন",
    donateKicker: "দলের গণতান্ত্রিক কাজে",
    donateTitle: "সহযোগিতা ও সংহতি",
    donateText:
      "আপনার সহযোগিতা বাংলাদেশ মুক্তির ডাক-৭১-এর গণতান্ত্রিক আন্দোলন, সংগঠন গড়ে তোলা ও মাঠের মানবিক কর্মসূচিতে সরাসরি ব্যয় হয়। নিচের হিসাবগুলিতে সরাসরি জমা দিন; রেফারেন্সে নিজের নাম, জেলা ও উদ্দেশ্য লিখুন। প্রচারণায় ব্যবহৃত নম্বরের বদলে মূল হিসাব নম্বর ব্যবহার করতে অ্যাডমিন প্যানেল থেকে যাচাই করে নিন।",
    donateNote:
      "প্রতিটি টাকা দলের কেন্দ্রীয় ও জেলা দপ্তরের দ্বৈত স্বাক্ষরে পরিচালিত স্বচ্ছ হিসাবে যুক্ত হয়। নির্ধারিত সময়ে রসিদ ও হিসাব মিলিয়ে দেখা যায়, যাতে কোনো গোপন তহবিল বা অডিটহীন খরচ না থাকে।",
    galleryKicker: "মাঠ",
    galleryTitle: "গ্যালারি",
    galleryText:
      "মাঠের কর্মসূচি, জনসভা, দরিদ্র মানুষের পাশে দাঁড়ানোর মুহূর্ত ও রাজনৈতিক সংগ্রামের নথি এখানে রাখা হয়। ব্যক্তিগত গোপনীয় নথি বা যাচাইহীন ছবি কখনোই প্রকাশ করা হয় না।",
    noticesKicker: "দলের আনুষ্ঠানিক ঘোষণা",
    noticesTitle: "নোটিশ, বিবৃতি ও নির্দেশনা",
    noticesText:
      "বাংলাদেশ মুক্তির ডাক-৭১ থেকে প্রকাশিত সকল অফিসিয়াল বিবৃতি, নোটিশ, সাংগঠনিক নির্দেশনা ও কর্মসূচি–সংক্রান্ত ঘোষণাই এখানে থাকে। গুজব বা অননুমোদিত বক্তব্য এখানে কখনোই প্রকাশ করা হয় না।",
    blogsKicker: "দলের বিশ্লেষণ ও মতামত",
    blogsTitle: "ব্লগ ও রাজনৈতিক লেখা",
    blogsText:
      "দলের নীতিগত অবস্থান, মাঠের অভিজ্ঞতা, সমসাময়িক রাজনীতির বিশ্লেষণ ও ভবিষ্যৎ পরিকল্পনা নিয়ে সংগঠনের নেতাকর্মীদের লেখা এখানে প্রকাশিত হয়। প্রকাশের আগে তথ্য ও ভাষা যাচাই করা হয়।",
    homeBlogTitle: "সাম্প্রতিক লেখা",
    homeBlogsLink: "সব লেখা",
    districtsKicker: "সংগঠন",
    districtsTitle: "জেলা ও দপ্তর",
    districtsText:
      "বাংলাদেশ মুক্তির ডাক-৭১ জেলা–উপজেলা–ওয়ার্ডভিত্তিক সংগঠিত রাজনৈতিক কাঠামো গড়ে তোলে। প্রতিটি জেলার দপ্তরের ঠিকানা, যোগাযোগকারী ও আনুমানিক সদস্যসংখ্যা এখানে উল্লেখ থাকে।",
    contactKicker: "দলের সঙ্গে যোগাযোগ",
    contactTitle: "যোগাযোগ",
    contactOffice: "কেন্দ্রীয় দপ্তর",
    visionKicker: "আমাদের রাজনৈতিক অবস্থান",
    activitiesKicker: "মাঠের কর্মসূচি",
    visionPoints:
      "গণতন্ত্রের মাঠের রাজনীতি\nনির্বাচনের মৌসুমে নয়, সারা বছর এলাকায় থেকে জনগণের প্রশ্ন, ভোটাধিকার ও জীবনের নিরাপত্তা নিয়ে কাজ করি।\n\nজেলা–ভিত্তিক নেতৃত্ব\nদলীয় সিদ্ধান্ত জেলা ও থানা দপ্তর থেকে শুরু হয়; কেন্দ্র মুজিববাদের আলোকে নীতি, সমন্বয় ও চূড়ান্ত জবাবদিহি নিশ্চিত করে।\n\nখোলা ও প্রমাণযোগ্য হিসাব\nদান, সদস্য ফি ও কর্মসূচির প্রতিটি খরচ লিখিত নথি ও ডিজিটাল ড্যাশবোর্ডে থাকে; যে কেউ মিলিয়ে দেখতে পারেন। গোপন চুক্তি ও অদৃশ্য তহবিল আমাদের রাজনীতিতে নেই।",
    heroTitle: "গনতন্ত্র পুনরুদ্ধার ও মুজিববাদ প্রতিষ্ঠার লড়াইয়ে যোগ দিন",
    heroPhilosophy: "মুজিববাদ বাঙালির মুক্তির দর্শন",
    heroPillars: "জাতীয়তাবাদ\nগনতন্ত্র\nসমাজতন্ত্র\nধর্মনিরপেক্ষতা",
    linkManifesto: "ঘোষণাপত্র",
    linkObjectives: "লক্ষ্য এবং উদ্দেশ্য",
    linkCommittee: "কেন্দ্রীয় কার্যনির্বাহী সংসদ",
    highlightKicker: "১৬ই নভেম্বরঃ",
    highlightOne: "গনতন্ত্রের ভয়াবহ সংকট থেকে বিজয়ের পথে অগ্রযাত্রা",
    highlightTwo: "সংগ্রাম ও অর্জনে বাংলাদেশ মুক্তির ডাক-৭১ এর গৌরবময় ইতিহাস",
    highlightThree: "ঐতিহাসিক ৭ দফা",
    heroVideo: "Wh0q8vdH-ro",
  };
}

const longKeys = new Set<keyof SiteCopy>([
  "footerNote",
  "homeNote",
  "donateText",
  "donateNote",
  "galleryText",
  "noticesText",
  "blogsText",
  "districtsText",
  "visionPoints",
  "heroTitle",
  "heroPillars",
  "highlightOne",
  "highlightTwo",
]);

export function mergeCopy(value: unknown): SiteCopy {
  const defaults = defaultCopy();
  const raw = value && typeof value === "object" ? (value as Record<string, unknown>) : {};
  const out = { ...defaults };
  for (const key of Object.keys(defaults) as (keyof SiteCopy)[]) {
    if (typeof raw[key] !== "string") continue;
    out[key] = raw[key]
      .replace(/[\u0000-\u0008\u000B\u000C\u000E-\u001F\u007F]/g, "")
      .trim()
      .slice(0, longKeys.has(key) ? 2000 : 240);
  }
  return out;
}

export function parseCopy(value: unknown): SiteCopy {
  if (typeof value !== "string" || !value.trim()) return defaultCopy();
  try {
    return mergeCopy(JSON.parse(value));
  } catch {
    return defaultCopy();
  }
}

export function visionCards(text: string) {
  return text
    .split(/\n{2,}/)
    .map((block) => {
      const [title, ...rest] = block.trim().split("\n");
      return { title: title?.trim() ?? "", text: rest.join(" ").trim() };
    })
    .filter((item) => item.title);
}
