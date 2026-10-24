import { latinDigits } from "./english";
import type { ApplicationStatus } from "./types";

export const applicationCopy = {
  org: "বাংলাদেশ মুক্তির ডাক-৭১ কেন্দ্রীয় কমিটি",
  title: "কেন্দ্রীয় কমিটিতে পদ-প্রত্যাশীদের তথ্য সংগ্রহ ফরম",
  role: "৫ই আগষ্ট ২০২৪ইং পটপরিবর্তনের পর মুক্তিযুদ্ধের ইতিহাস সংরক্ষণ ও বঙ্গবন্ধুর সম্মান সমুন্নত রাখতে এবং গণতন্ত্র পুনরুদ্ধারের লড়াইয়ে আপনার ভূমিকা:",
  cases: "মামলার সংখ্যা ও কারাবরণ:",
  mujib: "মুজিববাদ প্রতিষ্ঠার লড়াইয়ে আপনার ভূমিকা বলুন:",
  pledge:
    "আমি অঙ্গীকার করছি যে, এই ফরমে উল্লেখিত সকল তথ্য সঠিক এবং আমি স্বাধীনতার মহান স্থপতি জাতির পিতা বঙ্গবন্ধু শেখ মুজিবুর রহমানের আদর্শে অনুপ্রাণিত হয়ে বাংলাদেশ মুক্তির ডাক-৭১ এর গঠনতন্ত্র, ঘোষণাপত্র ও লক্ষ্য এবং উদ্দেশ্য বাস্তবায়নে মুজিববাদ প্রতিষ্ঠার লড়াইয়ে নিরলসভাবে কাজ করে যাবো। দেশের বর্তমান গণতান্ত্রিক সংকট মোকাবিলা করে স্বাধীনতা পুনরুদ্ধারে সর্বোচ্চ ভূমিকা রাখবো। দৃঢ়ভাবে এই প্রত্যয় ব্যক্ত করছি।",
  note: "বিঃদ্রঃ আমি দৃঢ়ভাবে অঙ্গীকার করছি যে, সংগঠনের যেকোনো সিদ্ধান্ত আমার নিকট চূড়ান্ত ও শিরোধার্য। আমার কাঙ্ক্ষিত পদ বা দায়িত্ব প্রাপ্তি না ঘটলেও, নেতৃত্বের প্রতি অবিচল আস্থা রেখে দলের আদর্শিক শৃঙ্খলা রক্ষা এবং সাংগঠনিক পরিশীলতা বজায় রাখব।",
};

export const applicationStatusLabel: Record<ApplicationStatus, string> = {
  new: "নতুন",
  review: "যাচাই চলছে",
  accepted: "গৃহীত",
  rejected: "বাতিল",
};

export function digitsOnly(value: string) {
  return latinDigits(value).replace(/\D/g, "");
}

export function phoneOf(value: string) {
  let digits = digitsOnly(value);
  if (digits.startsWith("880")) digits = digits.slice(3);
  if (digits.length === 10 && digits.startsWith("1")) digits = `0${digits}`;
  return /^01[3-9]\d{8}$/.test(digits) ? digits : "";
}

export function nidOf(value: string) {
  const digits = digitsOnly(value);
  return digits.length === 10 || digits.length === 13 || digits.length === 17 ? digits : "";
}

export function nextFormNo(items: { formNo: string }[]) {
  let max = 0;
  for (const item of items) {
    const match = /^MD71-(\d+)$/.exec(item.formNo);
    const value = match ? Number(match[1]) : 0;
    if (value > max) max = value;
  }
  return `MD71-${String(max + 1).padStart(4, "0")}`;
}

export function memberLabel(value: "yes" | "no") {
  return value === "yes" ? "হ্যাঁ" : "না";
}
