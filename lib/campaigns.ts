import { charDofaDemands, charDofaPledge, charDofaTitle } from "./char-dofa";
import { obosthanCardTitle, obosthanDemands, obosthanHost, obosthanIntro, obosthanPlace, obosthanSlides } from "./obosthan";
import type { Campaign } from "./types";

export function campaignPath(slug: string) {
  return `/campaign/${slug}`;
}

export function campaignDemands(text: string) {
  return text
    .split(/\n+/)
    .map((line) => line.replace(/^\s*[০-৯0-9]+[.।)\-]\s*/, "").trim())
    .filter(Boolean);
}

export function bnNumeral(value: number) {
  return String(value).replace(/[0-9]/g, (digit) => "০১২৩৪৫৬৭৮৯"[Number(digit)]);
}

export function defaultCampaigns(): Campaign[] {
  return [
    {
      id: "campaign-char-dofa",
      spot: "banner",
      slug: "char-dofa",
      title: charDofaTitle,
      intro: "",
      lead: charDofaPledge,
      place: "",
      host: "",
      demands: charDofaDemands.join("\n"),
      images: [{ url: "/campaign/signature.jpg", alt: "গণস্বাক্ষর সংগ্রহ কর্মসূচি" }],
      published: true,
    },
    {
      id: "campaign-obosthan",
      spot: "highlight",
      slug: "obosthan",
      title: obosthanCardTitle,
      intro: obosthanIntro,
      lead: "",
      place: obosthanPlace,
      host: obosthanHost,
      demands: obosthanDemands.join("\n"),
      images: obosthanSlides.map((slide) => ({ url: slide.src, alt: slide.alt })),
      published: true,
    },
  ];
}
