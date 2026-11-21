"use client";

import { useId, useRef, useState, type FormEvent } from "react";
import { ButtonLink, Button } from "@/components/ui/button";
import { whatsappLink } from "@/lib/site";

const field =
  "mt-1.5 h-12 w-full rounded-2xl border-2 border-cocoa/60 bg-milk px-4 text-base outline-none transition-[border-color,box-shadow] focus:border-cocoa focus:shadow-[0_0_0_4px_rgb(242_190_107/0.6)] aria-[invalid=true]:border-[#b3261e]";
const label = "block text-[0.95rem] font-semibold";

type Values = { name: string; phone: string; email: string; area: string; message: string };

/**
 * The enquiry form at the foot of a puppy page. Name and phone are required, the rest is optional,
 * and the message starts pre-filled for this puppy. There is no backend: a valid enquiry shows a
 * thank-you with the same details ready to send on WhatsApp, where the team answers.
 */
export function EnquiryForm({ subject, defaultMessage }: { subject: string; defaultMessage: string }) {
  const ids = {
    name: useId(),
    phone: useId(),
    phoneHint: useId(),
    email: useId(),
    area: useId(),
    message: useId(),
  };
  const [values, setValues] = useState<Values>({
    name: "",
    phone: "",
    email: "",
    area: "",
    message: defaultMessage,
  });
  const [bad, setBad] = useState<(keyof Values)[]>([]);
  const [sent, setSent] = useState(false);
  const form = useRef<HTMLFormElement>(null);

  const set = (key: keyof Values) => (event: { target: { value: string } }) => {
    setValues((v) => ({ ...v, [key]: event.target.value }));
    setBad((list) => list.filter((k) => k !== key));
  };

  const submit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    // "website" is a honey-pot that only bots fill in.
    const bot = String(new FormData(event.currentTarget).get("website") ?? "") !== "";
    const found: (keyof Values)[] = [];
    if (values.name.trim().length < 2) found.push("name");
    if (values.phone.replace(/\D/g, "").length < 7) found.push("phone");
    if (values.email.trim() && !/^\S+@\S+\.\S+$/.test(values.email.trim())) found.push("email");
    if (!bot && found.length) {
      setBad(found);
      form.current?.querySelector<HTMLElement>(`[name="${found[0]}"]`)?.focus();
      return;
    }
    setSent(true);
  };

  if (sent) {
    const text = [
      values.message.trim(),
      `My name is ${values.name.trim()}${values.area.trim() ? `, I live in ${values.area.trim()}` : ""}.`,
    ].join(" ");
    return (
      <div role="status" className="rounded-3xl border-[3px] border-cocoa bg-honey p-7 text-center">
        <p className="font-plush text-[1.8rem] leading-tight">
          Thank you, {values.name.trim().split(" ")[0]}!
        </p>
        <p className="mx-auto mt-2 max-w-[36ch] text-cocoa-soft">
          Your note about {subject} is ready. The team replies fastest on WhatsApp.
        </p>
        <ButtonLink href={whatsappLink(text)} variant="whatsapp" className="mt-5">
          Continue on WhatsApp
        </ButtonLink>
      </div>
    );
  }

  const invalid = (key: keyof Values) => (bad.includes(key) ? true : undefined);

  return (
    <form ref={form} noValidate className="space-y-5" onSubmit={submit}>
      <div className="grid gap-5 sm:grid-cols-2">
        <div>
          <label htmlFor={ids.name} className={label}>
            Your name<span className="text-toffee-ink"> *</span>
          </label>
          <input
            id={ids.name}
            name="name"
            autoComplete="name"
            required
            minLength={2}
            maxLength={80}
            className={field}
            value={values.name}
            onChange={set("name")}
            aria-invalid={invalid("name") ?? false}
          />
        </div>
        <div>
          <label htmlFor={ids.phone} className={label}>
            Phone or WhatsApp<span className="text-toffee-ink"> *</span>
          </label>
          <input
            id={ids.phone}
            name="phone"
            type="tel"
            inputMode="tel"
            autoComplete="tel"
            required
            className={field}
            aria-describedby={ids.phoneHint}
            value={values.phone}
            onChange={set("phone")}
            aria-invalid={invalid("phone") ?? false}
          />
          <p id={ids.phoneHint} className="mt-1 text-sm text-cocoa-soft">
            With country code, e.g. +971 50 123 4567
          </p>
        </div>
        <div>
          <label htmlFor={ids.email} className={label}>
            Email<span className="font-normal text-cocoa-soft"> (optional)</span>
          </label>
          <input
            id={ids.email}
            name="email"
            type="email"
            autoComplete="email"
            className={field}
            value={values.email}
            onChange={set("email")}
            aria-invalid={invalid("email") ?? false}
          />
        </div>
        <div>
          <label htmlFor={ids.area} className={label}>
            Your area<span className="font-normal text-cocoa-soft"> (optional)</span>
          </label>
          <input
            id={ids.area}
            name="area"
            autoComplete="address-level2"
            maxLength={80}
            className={field}
            value={values.area}
            onChange={set("area")}
          />
          <p className="mt-1 text-sm text-cocoa-soft">e.g. Dubai Marina</p>
        </div>
      </div>
      <div>
        <label htmlFor={ids.message} className={label}>
          Message <span className="font-normal text-cocoa-soft">(optional)</span>
        </label>
        <textarea
          id={ids.message}
          name="message"
          rows={4}
          maxLength={2000}
          className="mt-1.5 w-full rounded-2xl border-2 border-cocoa/60 bg-milk px-4 py-3 text-base leading-6 transition-[border-color,box-shadow] outline-none focus:border-cocoa focus:shadow-[0_0_0_4px_rgb(242_190_107/0.6)]"
          value={values.message}
          onChange={set("message")}
        />
      </div>
      <div aria-hidden="true" className="absolute -left-[9999px] h-0 w-0 overflow-hidden">
        <label>
          Website
          <input tabIndex={-1} autoComplete="off" name="website" defaultValue="" />
        </label>
      </div>
      {bad.length > 0 ? (
        <p role="alert" className="rounded-2xl bg-blush px-4 py-3 text-[0.95rem]">
          Almost there. Please check your {bad.map((k) => (k === "phone" ? "phone number" : k)).join(" and ")}
          .
        </p>
      ) : null}
      <Button type="submit">Send enquiry</Button>
    </form>
  );
}
