import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { toast } from "sonner";
import { SiteLayout } from "@/layouts/SiteLayout";

export const Route = createFileRoute("/forgot-password")({
  head: () => ({ meta: [{ title: "Forgot Password — Lumière" }] }),
  component: ForgotPage,
});

function ForgotPage() {
  const [email, setEmail] = useState("");
  const [sent, setSent] = useState(false);

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    setSent(true);
    toast.success("If an account exists, a reset link has been sent.");
  };

  return (
    <SiteLayout>
      <div className="container-px mx-auto max-w-md py-20">
        <h1 className="font-display text-4xl text-secondary">Forgot password</h1>
        <p className="mt-2 text-sm text-muted-foreground">
          Enter the email associated with your account and we'll send you a reset link.
        </p>
        {sent ? (
          <div className="mt-8 rounded-md bg-accent p-6 text-sm">
            Check your inbox for instructions to reset your password.
          </div>
        ) : (
          <form onSubmit={submit} className="mt-8 space-y-4">
            <label className="block">
              <span className="mb-1 block text-xs uppercase tracking-wider text-muted-foreground">
                Email
              </span>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="h-12 w-full rounded-sm border border-border bg-background px-3 text-sm outline-none focus:border-[var(--gold)]"
              />
            </label>
            <button className="h-12 w-full rounded-sm bg-secondary text-xs font-medium uppercase tracking-wider text-secondary-foreground hover:bg-[var(--gold)] hover:text-secondary">
              Send reset link
            </button>
          </form>
        )}
        <p className="mt-6 text-center text-sm">
          <Link to="/login" className="text-[var(--gold)] hover:underline">
            Back to sign in
          </Link>
        </p>
      </div>
    </SiteLayout>
  );
}
