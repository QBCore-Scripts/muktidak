import type { SiteCopy } from "./copy";

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
  statDonations: "গৃহীত দান",
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
  statDonations: "Donations received",
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

export type PageKey = "about" | "activities" | "blogs" | "contact" | "districts" | "donate" | "gallery" | "notices" | "vision";

export const pageMeta: Record<Locale, Record<PageKey, { title: string; description: string }>> = {
  bn: {
    about: { title: "পরিচিতি", description: "বাংলাদেশ মুক্তির ডাক-৭১ (Bangladesh Muktir Dak 71) রাজনৈতিক দলের পরিচিতি।" },
    activities: { title: "কার্যক্রম", description: "বাংলাদেশ মুক্তির ডাক-৭১ (Bangladesh Muktir Dak 71) এর মাঠের কার্যক্রম।" },
    blogs: { title: "ব্লগ", description: "বাংলাদেশ মুক্তির ডাক-৭১ (Bangladesh Muktir Dak 71) এর ব্লগ।" },
    contact: { title: "যোগাযোগ", description: "বাংলাদেশ মুক্তির ডাক-৭১ (Bangladesh Muktir Dak 71) এর সাথে যোগাযোগ।" },
    districts: { title: "জেলা ও দপ্তর", description: "বাংলাদেশ মুক্তির ডাক-৭১ (Bangladesh Muktir Dak 71) এর জেলা দপ্তর।" },
    donate: { title: "দান", description: "বাংলাদেশ মুক্তির ডাক-৭১ (Bangladesh Muktir Dak 71) এর খোলা দান হিসাব।" },
    gallery: { title: "গ্যালারি", description: "বাংলাদেশ মুক্তির ডাক-৭১ (Bangladesh Muktir Dak 71) এর ছবি ও ডকুমেন্ট।" },
    notices: { title: "নোটিশ", description: "বাংলাদেশ মুক্তির ডাক-৭১ (Bangladesh Muktir Dak 71) এর নোটিশ ও ঘোষণা।" },
    vision: { title: "ভিশন", description: "বাংলাদেশ মুক্তির ডাক-৭১ (Bangladesh Muktir Dak 71) — মাঠের রাজনীতির ভিশন।" },
  },
  en: {
    about: { title: "About", description: "About Bangladesh Muktir Dak 71, a people's political party." },
    activities: { title: "Activities", description: "Grassroots activities of Bangladesh Muktir Dak 71." },
    blogs: { title: "Blog", description: "Writing from Bangladesh Muktir Dak 71." },
    contact: { title: "Contact", description: "Get in touch with Bangladesh Muktir Dak 71." },
    districts: { title: "Districts & offices", description: "District offices of Bangladesh Muktir Dak 71." },
    donate: { title: "Donate", description: "Open donation accounts of Bangladesh Muktir Dak 71." },
    gallery: { title: "Gallery", description: "Photos and documents from Bangladesh Muktir Dak 71." },
    notices: { title: "Notices", description: "Notices and announcements from Bangladesh Muktir Dak 71." },
    vision: { title: "Vision", description: "Bangladesh Muktir Dak 71 — the vision of grassroots politics." },
  },
};

export const englishCopy: Omit<SiteCopy, "footerNote"> = {
  headerLine: "Bangladesh Muktir Dak 71 — a people's political party",
  footerLine: "",
  flavorLine: "Political party · Muktir Dak 71",
  homeDate: "Political party",
  homeFreedom: "Standing with people is our politics.",
  quoteLabel: "In our words",
  homeDonate: "Donate",
  homeAbout: "About us",
  homeWorkTitle: "Grassroots programmes",
  homeNoticeTitle: "Notices",
  homeNoticesLink: "View all",
  homeNote: "The party's accounts are digital and open — so people can check them for themselves.",
  navHome: "Home",
  navAbout: "About",
  navVision: "Vision",
  navActivities: "Activities",
  navGallery: "Gallery",
  navNotices: "Notices",
  navBlogs: "Blog",
  navDistricts: "Districts",
  navContact: "Contact",
  navDonate: "Donate",
  donateKicker: "For the party's work",
  donateTitle: "Support",
  donateText: "Support goes to the party's field work. Send directly to the accounts below and write your name and purpose in the reference.",
  donateNote: "Money goes straight to the party's account. Receipts are reconciled by the office.",
  galleryKicker: "In the field",
  galleryTitle: "Gallery",
  galleryText: "Photos of the party's work and rallies. Personal documents are never posted here.",
  noticesKicker: "From the party",
  noticesTitle: "Notices & announcements",
  noticesText: "Only what the party has officially published appears here.",
  blogsKicker: "Party writing",
  blogsTitle: "Blog",
  blogsText: "Writing from the party — field experience and positions. Only published posts appear here.",
  homeBlogTitle: "Recent writing",
  homeBlogsLink: "All posts",
  districtsKicker: "Organisation",
  districtsTitle: "Districts & offices",
  districtsText: "The party's work runs from district offices. Contact names are listed here.",
  contactKicker: "Reach the party",
  contactTitle: "Contact",
  contactOffice: "Central office",
  visionKicker: "Our position",
  activitiesKicker: "Programmes",
  visionPoints:
    "Grassroots politics\nWe don't announce and walk away. We stay in the areas we speak for.\n\nDistrict leadership\nDecisions are made at district offices. The centre only reconciles accounts and policy.\n\nOpen ledger\nDonations, members and programme accounts stay public. Hidden promises are not our politics.",
};
