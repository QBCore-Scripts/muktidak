import type { SiteCopy } from "./copy";

export type Settings = {
  name: string;
  shortName: string;
  tagline: string;
  quote: string;
  phone: string;
  email: string;
  address: string;
  copy: SiteCopy;
};

export type AdminAuth = {
  email: string;
  salt: string;
  passwordHash: string;
  loginRevision?: number;
};

export type Member = {
  id: string;
  name: string;
  phone: string;
  district: string;
  role: string;
  status: "active" | "inactive";
  joined: string;
};

export type Donation = {
  id: string;
  donor: string;
  phone: string;
  amount: number;
  method: string;
  purpose: string;
  date: string;
  status: "received" | "pending";
};

export type BankAccount = {
  id: string;
  bank: string;
  branch: string;
  accountName: string;
  accountNumber: string;
  accountType: string;
  visible: boolean;
};

export type Notice = {
  id: string;
  title: string;
  body: string;
  date: string;
  published: boolean;
};

export type BlogPost = {
  id: string;
  slug: string;
  title: string;
  excerpt: string;
  body: string;
  cover: string;
  author: string;
  date: string;
  published: boolean;
};

export type PageContent = {
  id: string;
  slug: string;
  title: string;
  body: string;
};

export type MediaItem = {
  id: string;
  name: string;
  folder: string;
  size: number;
  url: string;
  private: boolean;
  stored?: string;
};

export type District = {
  id: string;
  name: string;
  office: string;
  contact: string;
  phone: string;
  members: number;
};

export type Activity = {
  id: string;
  title: string;
  summary: string;
  date: string;
};

export type Message = {
  id: string;
  name: string;
  phone: string;
  email: string;
  body: string;
  date: string;
  read: boolean;
};

export type Database = {
  settings: Settings;
  admin: AdminAuth;
  members: Member[];
  donations: Donation[];
  accounts: BankAccount[];
  notices: Notice[];
  blogs: BlogPost[];
  pages: PageContent[];
  media: MediaItem[];
  districts: District[];
  activities: Activity[];
  messages: Message[];
};

export type ListKey =
  | "members"
  | "donations"
  | "accounts"
  | "notices"
  | "blogs"
  | "pages"
  | "media"
  | "districts"
  | "activities"
  | "messages";
