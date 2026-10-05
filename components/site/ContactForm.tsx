"use client";

import { FormEvent, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import type { Locale, UiText } from "@/lib/i18n";

export function ContactForm({ t, locale }: { t: UiText; locale: Locale }) {
  const [status, setStatus] = useState<"idle" | "sending" | "sent" | "error">("idle");
  const [error, setError] = useState("");

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = event.currentTarget;
    const data = Object.fromEntries(new FormData(form).entries());
    setStatus("sending");
    setError("");
    const res = await fetch("/api/contact", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
    const body = (await res.json().catch(() => ({}))) as { error?: string };
    if (!res.ok) {
      setStatus("error");
      setError(locale === "bn" && body.error ? body.error : t.sendFailed);
      return;
    }
    form.reset();
    setStatus("sent");
  }

  return (
    <Card className="relative rounded-3xl ring-forest/8 [--card-spacing:--spacing(6)]">
      <CardHeader>
        <CardTitle className="text-2xl text-forest">{t.sendTitle}</CardTitle>
        <CardDescription>{t.sendText}</CardDescription>
      </CardHeader>
      <CardContent>
        <form id="contact-form" onSubmit={onSubmit} className="grid gap-5">
          <div className="grid gap-5 sm:grid-cols-2">
            <div className="grid gap-2">
              <Label htmlFor="contact-name">{t.name}</Label>
              <Input id="contact-name" name="name" required autoComplete="name" className="h-11 bg-white px-3" />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="contact-phone">{t.phone}</Label>
              <Input id="contact-phone" name="phone" required autoComplete="tel" className="h-11 bg-white px-3" />
            </div>
          </div>
          <div className="grid gap-2">
            <Label htmlFor="contact-email">{t.email}</Label>
            <Input id="contact-email" name="email" type="email" autoComplete="email" className="h-11 bg-white px-3" />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="contact-body">{t.message}</Label>
            <Textarea id="contact-body" name="body" required rows={5} className="min-h-32 bg-white px-3" />
          </div>
          <label className="absolute -left-[9999px]" aria-hidden="true">
            {t.company}
            <input name="company" tabIndex={-1} autoComplete="off" />
          </label>
        </form>
      </CardContent>
      <CardFooter className="flex-wrap gap-3 bg-paper">
        <Button type="submit" form="contact-form" size="xl" disabled={status === "sending"}>
          {status === "sending" ? t.sending : t.sendTitle}
        </Button>
        {status === "sent" ? <p className="text-sm text-leaf">{t.sent}</p> : null}
        {status === "error" ? <p className="text-sm text-destructive">{error}</p> : null}
      </CardFooter>
    </Card>
  );
}
