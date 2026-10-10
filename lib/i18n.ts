export type Locale = "bn" | "en";

export const LOCALE_COOKIE = "lang";

export function intlLocale(locale: Locale) {
  return locale === "en" ? "en-US" : "bn-BD";
}

export function pad2(value: number, locale: Locale) {
  return new Intl.NumberFormat(intlLocale(locale), { minimumIntegerDigits: 2 }).format(value);
}

const bn = {
  skipToMain: "মূল অংশে যান",
  mainMenu: "প্রধান মেনু",
  mobileMenu: "মোবাইল মেনু",
  menu: "মেনু",
  close: "বন্ধ",
  language: "ভাষা",
  heroVideo: "ব্যাকগ্রাউন্ড ভিডিও",
  statDonations: "দলীয় তহবিল",
  statMembers: "সক্রিয় সদস্য",
  statDistricts: "জেলা দপ্তর",
  noNotices: "এখনো কোনো নোটিশ নেই।",
  noPosts: "এখনো কোনো লেখা প্রকাশ হয়নি।",
  read: "পড়ুন",
  allNotices: "← সব নোটিশ",
  allPosts: "← সব লেখা",
  members: "সদস্য",
  footerPages: "পাতা",
  footerContact: "যোগাযোগ",
  address: "ঠিকানা",
  phone: "ফোন",
  email: "ইমেইল",
  name: "নাম",
  message: "বার্তা",
  company: "কোম্পানি",
  sendTitle: "বার্তা পাঠান",
  sendText: "নাম, ফোন ও বার্তা দিন। দপ্তর থেকে যোগাযোগ করা হবে।",
  sending: "পাঠানো হচ্ছে…",
  sent: "বার্তা পৌঁছেছে। দপ্তর থেকে উত্তর আসবে।",
  sendFailed: "পাঠানো যায়নি",
  noAccounts: "এখন কোনো অ্যাকাউন্ট দান পাতায় খোলা নেই।",
  accountName: "নাম",
  accountNumber: "নম্বর",
  copied: "কপি হয়েছে",
  copyNumber: "নম্বর কপি করুন",
  notice: "নোটিশ",
  blog: "ব্লগ",
};

export type UiText = typeof bn;

const en: UiText = {
  skipToMain: "Skip to main content",
  mainMenu: "Main menu",
  mobileMenu: "Mobile menu",
  menu: "Menu",
  close: "Close",
  language: "Language",
  heroVideo: "Background video",
  statDonations: "Party fund",
  statMembers: "Active members",
  statDistricts: "District offices",
  noNotices: "No notices yet.",
  noPosts: "No posts published yet.",
  read: "Read",
  allNotices: "← All notices",
  allPosts: "← All posts",
  members: "members",
  footerPages: "Pages",
  footerContact: "Contact",
  address: "Address",
  phone: "Phone",
  email: "Email",
  name: "Name",
  message: "Message",
  company: "Company",
  sendTitle: "Send a message",
  sendText: "Share your name, phone and message. The office will get back to you.",
  sending: "Sending…",
  sent: "Message received. The office will reply soon.",
  sendFailed: "Could not send",
  noAccounts: "No donation accounts are open right now.",
  accountName: "Name",
  accountNumber: "Number",
  copied: "Copied",
  copyNumber: "Copy number",
  notice: "Notice",
  blog: "Blog",
};

export const uiText: Record<Locale, UiText> = { bn, en };

export type PageKey = "about" | "activities" | "blogs" | "committee" | "contact" | "districts" | "donate" | "gallery" | "manifesto" | "notices" | "objectives" | "vision";

export const pageMeta: Record<Locale, Record<PageKey, { title: string; description: string }>> = {
  bn: {
    about: {
      title: "পরিচিতি",
      description: "বাংলাদেশ মুক্তির ডাক-৭১ (Bangladesh Muktir Dak 71) — গণতন্ত্র পুনরুদ্ধার ও মুজিববাদ প্রতিষ্ঠার লক্ষ্যে গড়া জনগণের রাজনৈতিক প্ল্যাটফর্মের পরিচিতি।",
    },
    activities: {
      title: "কার্যক্রম",
      description: "বাংলাদেশ মুক্তির ডাক-৭১ (Bangladesh Muktir Dak 71) এর মাঠের মানবিক ও রাজনৈতিক কর্মসূচি, সংগঠন গড়ে তোলা এবং গণতান্ত্রিক আন্দোলনের চলমান কার্যক্রম।",
    },
    blogs: {
      title: "ব্লগ",
      description: "বাংলাদেশ মুক্তির ডাক-৭১ (Bangladesh Muktir Dak 71) এর নেতাকর্মীদের লেখা বিশ্লেষণ, মাঠের অভিজ্ঞতা ও রাজনৈতিক মতামত।",
    },
    contact: {
      title: "যোগাযোগ",
      description: "বাংলাদেশ মুক্তির ডাক-৭১ (Bangladesh Muktir Dak 71) কেন্দ্রীয় ও জেলা দপ্তরের সাথে সরাসরি যোগাযোগের তথ্য।",
    },
    districts: {
      title: "জেলা ও দপ্তর",
      description: "বাংলাদেশ মুক্তির ডাক-৭১ (Bangladesh Muktir Dak 71) এর জেলা ও স্থানীয় দপ্তরের সংগঠন, দায়িত্বপ্রাপ্ত ব্যক্তি ও সদস্যসংখ্যা।",
    },
    donate: {
      title: "দান",
      description: "বাংলাদেশ মুক্তির ডাক-৭১ (Bangladesh Muktir Dak 71) এর স্বচ্ছ ও খোলা দান হিসাব, যেখানে আপনার সহায়তা সরাসরি গণতান্ত্রিক রাজনীতি ও মাঠের কর্মসূচিতে যায়।",
    },
    gallery: {
      title: "গ্যালারি",
      description: "বাংলাদেশ মুক্তির ডাক-৭১ (Bangladesh Muktir Dak 71) এর ছবি, ডকুমেন্ট ও রাজনৈতিক কর্মসূচির ভিজ্যুয়াল আর্কাইভ।",
    },
    committee: {
      title: "কেন্দ্রীয় কার্যনির্বাহী সংসদ",
      description: "বাংলাদেশ মুক্তির ডাক-৭১ (Bangladesh Muktir Dak 71) এর নীতি নির্ধারণী ফোরাম কেন্দ্রীয় কার্যনির্বাহী সংসদের কাঠামো, ভূমিকা ও দায়িত্ব।",
    },
    manifesto: {
      title: "ঘোষণাপত্র",
      description: "বাংলাদেশ মুক্তির ডাক-৭১ (Bangladesh Muktir Dak 71) এর ঘোষণাপত্র—গণতান্ত্রিক রাষ্ট্র, মুজিববাদ ও স্বচ্ছ সংগঠন পরিচালনার প্রতিশ্রুতি।",
    },
    notices: {
      title: "নোটিশ",
      description: "বাংলাদেশ মুক্তির ডাক-৭১ (Bangladesh Muktir Dak 71) থেকে প্রকাশিত সব ধরনের অফিসিয়াল নোটিশ, বিবৃতি ও সাংগঠনিক ঘোষণা।",
    },
    objectives: {
      title: "লক্ষ্য এবং উদ্দেশ্য",
      description: "বাংলাদেশ মুক্তির ডাক-৭১ (Bangladesh Muktir Dak 71) এর রাজনৈতিক লক্ষ্য, সাংগঠনিক উদ্দেশ্য ও কর্মসূচির অক্ষসমূহের সংক্ষিপ্ত বর্ণনা।",
    },
    vision: {
      title: "ভিশন",
      description: "বাংলাদেশ মুক্তির ডাক-৭১ (Bangladesh Muktir Dak 71) — গণতন্ত্র পুনরুদ্ধার, মুজিববাদ প্রতিষ্ঠা ও মাঠের রাজনীতিনির্ভর বৈষম্যহীন বাংলাদেশের ভিশন।",
    },
  },
  en: {
    about: { title: "About", description: "About Bangladesh Muktir Dak 71, a people's political party." },
    activities: { title: "Activities", description: "Grassroots activities of Bangladesh Muktir Dak 71." },
    blogs: { title: "Blog", description: "Writing from Bangladesh Muktir Dak 71." },
    contact: { title: "Contact", description: "Get in touch with Bangladesh Muktir Dak 71." },
    districts: { title: "Districts & offices", description: "District offices of Bangladesh Muktir Dak 71." },
    donate: { title: "Donate", description: "Open donation accounts of Bangladesh Muktir Dak 71." },
    gallery: { title: "Gallery", description: "Photos and documents from Bangladesh Muktir Dak 71." },
    committee: { title: "Central executive council", description: "The central executive council of Bangladesh Muktir Dak 71." },
    manifesto: { title: "Manifesto", description: "The manifesto of Bangladesh Muktir Dak 71." },
    notices: { title: "Notices", description: "Notices and announcements from Bangladesh Muktir Dak 71." },
    objectives: { title: "Aims and objectives", description: "The aims and objectives of Bangladesh Muktir Dak 71." },
    vision: { title: "Vision", description: "Bangladesh Muktir Dak 71 — the vision of grassroots politics." },
  },
};

