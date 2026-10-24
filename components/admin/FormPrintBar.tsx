"use client";

import Link from "next/link";

export function FormPrintBar({ formNo }: { formNo: string }) {
  return (
    <div className="no-print sticky top-0 z-20 flex flex-wrap items-center justify-between gap-3 border-b border-line bg-paper/95 px-4 py-3 backdrop-blur-md">
      <div>
        <p className="text-sm font-medium text-forest">ফরম {formNo}</p>
        <p className="text-xs text-muted">প্রিন্ট উইন্ডোতে গন্তব্য PDF রাখুন।</p>
      </div>
      <div className="flex flex-wrap gap-2">
        <Link href="/admin/applications" className="rounded-full border border-line px-4 py-2 text-sm">
          তালিকায় ফিরুন
        </Link>
        <button type="button" onClick={() => window.print()} className="rounded-full bg-forest px-4 py-2 text-sm font-medium text-paper">
          ফরম ডাউনলোড
        </button>
      </div>
    </div>
  );
}
