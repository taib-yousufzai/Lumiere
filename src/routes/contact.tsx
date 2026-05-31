import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { toast } from "sonner";
import { FiMail, FiPhone, FiMapPin } from "react-icons/fi";
import { SiteLayout } from "@/layouts/SiteLayout";

export const Route = createFileRoute("/contact")({
  head: () => ({
    meta: [
      { title: "Contact — Lumière Jewelry" },
      { name: "description", content: "Get in touch with the Lumière team." },
    ],
  }),
  component: ContactPage,
});

function ContactPage() {
  const [sent, setSent] = useState(false);

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    setSent(true);
    toast.success("Message sent. We'll be in touch soon.");
  };

  return (
    <SiteLayout>
      <div className="container-px mx-auto grid max-w-7xl gap-12 py-16 lg:grid-cols-2">
        <div>
          <span className="text-xs uppercase tracking-[0.25em] text-[var(--gold)]">Say hello</span>
          <h1 className="mt-3 font-display text-5xl text-secondary md:text-6xl">Get in touch</h1>
          <p className="mt-4 max-w-md text-muted-foreground">
            Questions about a piece, an order, or just want to chat jewelry? We typically reply
            within one business day.
          </p>

          <div className="mt-10 space-y-5 text-sm">
            <div className="flex items-center gap-3">
              <FiMail className="text-[var(--gold)]" /> hello@lumiere.example
            </div>
            <div className="flex items-center gap-3">
              <FiPhone className="text-[var(--gold)]" /> +1 (555) 010-4321
            </div>
            <div className="flex items-center gap-3">
              <FiMapPin className="text-[var(--gold)]" /> 24 Atelier Lane, NYC
            </div>
          </div>
        </div>

        <form onSubmit={submit} className="space-y-4 rounded-md bg-accent p-8">
          {(["Name", "Email", "Subject"] as const).map((l) => (
            <label key={l} className="block">
              <span className="mb-1 block text-xs uppercase tracking-wider text-muted-foreground">
                {l}
              </span>
              <input
                required
                type={l === "Email" ? "email" : "text"}
                className="h-12 w-full rounded-sm border border-border bg-background px-3 text-sm outline-none focus:border-[var(--gold)]"
              />
            </label>
          ))}
          <label className="block">
            <span className="mb-1 block text-xs uppercase tracking-wider text-muted-foreground">
              Message
            </span>
            <textarea
              required
              rows={5}
              className="w-full rounded-sm border border-border bg-background p-3 text-sm outline-none focus:border-[var(--gold)]"
            />
          </label>
          <button className="h-12 w-full rounded-sm bg-secondary text-xs font-medium uppercase tracking-wider text-secondary-foreground hover:bg-[var(--gold)] hover:text-secondary">
            {sent ? "Sent ✓ Send another" : "Send message"}
          </button>
        </form>
      </div>
    </SiteLayout>
  );
}
