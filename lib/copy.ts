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
};

export function defaultCopy(): SiteCopy {
  return {
    headerLine: "বাংলাদেশ মুক্তির ডাক-৭১ — জনগণের রাজনৈতিক দল",
    footerLine: "",
    footerNote: "Developed by Syntaxx Technology",
    flavorLine: "রাজনৈতিক দল · মুক্তির ডাক-৭১",
    homeDate: "রাজনৈতিক দল",
    homeFreedom: "মানুষের পাশে দাঁড়ানোই আমাদের রাজনীতি।",
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
    donateKicker: "দলের কাজে",
    donateTitle: "সহযোগিতা",
    donateText: "সহযোগিতা দলের মাঠের কাজে যায়। নিচের অ্যাকাউন্টে সরাসরি পাঠান। রেফারেন্সে নিজের নাম ও উদ্দেশ্য লিখুন। নমুনা নম্বর থাকলে অ্যাডমিন থেকে আসল নম্বর বসান।",
    donateNote: "টাকা সরাসরি দলের হিসাবে যায়। রসিদ দপ্তর থেকে মিলিয়ে নেওয়া হয়।",
    galleryKicker: "মাঠ",
    galleryTitle: "গ্যালারি",
    galleryText: "দলের কাজ ও সমাবেশের ছবি। ব্যক্তিগত নথি এখানে থাকে না।",
    noticesKicker: "দলের কথা",
    noticesTitle: "নোটিশ ও ঘোষণা",
    noticesText: "দল থেকে যা প্রকাশ করা হয়েছে, শুধু সেটাই এখানে।",
    blogsKicker: "দলের কলম",
    blogsTitle: "ব্লগ",
    blogsText: "দলের লেখা, মাঠের অভিজ্ঞতা ও অবস্থান। প্রকাশিত লেখাই এখানে দেখা যায়।",
    homeBlogTitle: "সাম্প্রতিক লেখা",
    homeBlogsLink: "সব লেখা",
    districtsKicker: "সংগঠন",
    districtsTitle: "জেলা ও দপ্তর",
    districtsText: "দলের কাজ জেলা দপ্তর থেকে চলে। যোগাযোগের নাম এখানে।",
    contactKicker: "দলের সঙ্গে",
    contactTitle: "যোগাযোগ",
    contactOffice: "কেন্দ্রীয় দপ্তর",
    visionKicker: "অবস্থান",
    activitiesKicker: "কর্মসূচি",
    visionPoints: "মাঠের রাজনীতি\nঘোষণা দিয়ে সরে যাই না। যে এলাকার কথা বলি, সেখানেই থাকি।\n\nজেলার নেতৃত্ব\nসিদ্ধান্ত জেলা দপ্তরে। কেন্দ্র শুধু হিসাব ও নীতি মিলায়।\n\nখোলা খতিয়ান\nদান, সদস্য ও কর্মসূচির হিসাব সামনে থাকে। লুকানো প্রতিশ্রুতি আমাদের রাজনীতি নয়।",
  };
}

const longKeys = new Set<keyof SiteCopy>(["footerNote", "homeNote", "donateText", "donateNote", "blogsText", "visionPoints"]);

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
