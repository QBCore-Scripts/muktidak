"use client";

import { useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardAction, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import type { UiText } from "@/lib/i18n";
import type { BankAccount } from "@/lib/types";
import { Reveal } from "./Reveal";

export function AccountCards({ accounts, t }: { accounts: BankAccount[]; t: UiText }) {
  const [copied, setCopied] = useState("");

  async function copy(number: string) {
    await navigator.clipboard.writeText(number);
    setCopied(number);
  }

  if (accounts.length === 0) {
    return <p className="text-muted-foreground">{t.noAccounts}</p>;
  }

  return (
    <div className="grid gap-5 md:grid-cols-2">
      {accounts.map((account, index) => (
        <Reveal key={account.id} index={index % 2}>
          <Card className="lift h-full rounded-2xl ring-forest/8 [--card-spacing:--spacing(6)]">
            <CardHeader>
              <CardTitle className="text-2xl text-forest">{account.bank}</CardTitle>
              <CardDescription>{account.branch}</CardDescription>
              <CardAction>
                <Badge variant="secondary">{account.accountType}</Badge>
              </CardAction>
            </CardHeader>
            <CardContent>
              <Separator className="mb-4" />
              <dl className="grid gap-3 text-sm">
                <div className="flex justify-between gap-4">
                  <dt className="text-muted-foreground">{t.accountName}</dt>
                  <dd className="text-right font-medium">{account.accountName}</dd>
                </div>
                <div className="flex items-center justify-between gap-4">
                  <dt className="text-muted-foreground">{t.accountNumber}</dt>
                  <dd className="font-mono text-base font-medium tracking-wider">{account.accountNumber}</dd>
                </div>
              </dl>
            </CardContent>
            <CardFooter className="mt-auto bg-paper">
              <Button
                variant={copied === account.accountNumber ? "secondary" : "outline"}
                size="lg"
                className="rounded-full px-4"
                onClick={() => copy(account.accountNumber)}
              >
                {copied === account.accountNumber ? t.copied : t.copyNumber}
              </Button>
            </CardFooter>
          </Card>
        </Reveal>
      ))}
    </div>
  );
}
