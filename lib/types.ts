import type { SiteCopy } from "./copy";

export type Settings = {
  name: string;
  shortName: string;
  tagline: string;
  quote: string;
  phone: string;
  email: string;
  address: string;
  logoUrl: string;
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

export const postSections = ["manifesto", "objectives", "committee"] as const;
export type PostSection = (typeof postSections)[number];

export type Post = {
  id: string;
  section: PostSection;
  title: string;
  body: string;
  cover: string;
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
  category: string;
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

export const applicationStatuses = ["new", "review", "accepted", "rejected"] as const;
export type ApplicationStatus = (typeof applicationStatuses)[number];

export type Application = {
  id: string;
  formNo: string;
  nameBn: string;
  nameEn: string;
  desiredPost: string;
  nid: string;
  education: string;
  occupation: string;
  mobile: string;
  district: string;
  upazila: string;
  address: string;
  newMember: "yes" | "no";
  previousPost: string;
  roleAfter: string;
  cases: string;
  mujibRole: string;
  signature: string;
  photoStored: string;
  date: string;
  status: ApplicationStatus;
  note: string;
};

export const campaignSpots = ["banner", "highlight"] as const;
export type CampaignSpot = (typeof campaignSpots)[number];

export type CampaignImage = {
  url: string;
  alt: string;
};

export type Campaign = {
  id: string;
  spot: CampaignSpot;
  slug: string;
  title: string;
  intro: string;
  lead: string;
  place: string;
  host: string;
  demands: string;
  images: CampaignImage[];
  published: boolean;
};

export type Database = {
  settings: Settings;
  admin: AdminAuth;
  members: Member[];
  donations: Donation[];
  accounts: BankAccount[];
  notices: Notice[];
  posts: Post[];
  blogs: BlogPost[];
  pages: PageContent[];
  media: MediaItem[];
  districts: District[];
  activities: Activity[];
  messages: Message[];
  campaigns: Campaign[];
  applications: Application[];
};

export type ListKey =
  | "members"
  | "donations"
  | "accounts"
  | "notices"
  | "posts"
  | "blogs"
  | "pages"
  | "media"
  | "districts"
  | "activities"
  | "messages"
  | "campaigns"
  | "applications";
