"use client";

import { useState } from "react";
import type { BankAccount } from "@/lib/types";

export function AccountCards({ accounts }: { accounts: BankAccount[] }) {
  const [copied, setCopied] = useState("");

  async function copy(number: string) {
    await navigator.clipboard.writeText(number);
    setCopied(number);
  }

  if (accounts.length === 0) {
    return <p className="text-muted">এখন কোনো অ্যাকাউন্ট দান পাতায় খোলা নেই।</p>;
  }

  return (
    <div className="grid gap-4 md:grid-cols-2">
      {accounts.map((account) => (
        <article key={account.id} className="panel rounded-2xl border border-line bg-paper p-5">
          <p className="text-sm text-leaf">{account.accountType}</p>
          <h2 className="mt-1 text-xl font-semibold text-forest">{account.bank}</h2>
          <p className="text-sm text-muted">{account.branch}</p>
          <dl className="mt-4 grid gap-2 text-sm">
            <div className="flex justify-between gap-4">
              <dt className="text-muted">নাম</dt>
              <dd className="text-right font-medium">{account.accountName}</dd>
            </div>
            <div className="flex justify-between gap-4">
              <dt className="text-muted">নম্বর</dt>
              <dd className="font-medium tracking-wide">{account.accountNumber}</dd>
            </div>
          </dl>
          <button type="button" onClick={() => copy(account.accountNumber)} className="mt-4 rounded-lg border border-line px-3 py-2 text-sm font-medium hover:border-leaf">
            {copied === account.accountNumber ? "কপি হয়েছে" : "নম্বর কপি"}
          </button>
        </article>
      ))}
    </div>
  );
}
