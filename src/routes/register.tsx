import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { SiteLayout } from "@/layouts/SiteLayout";
import { useAuth } from "@/context/AuthContext";

export const Route = createFileRoute("/register")({
  head: () => ({ meta: [{ title: "Create account — Lumière" }] }),
  component: RegisterPage,
});

function RegisterPage() {
  const { register } = useAuth();
  const navigate = useNavigate();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    if (register(name, email, password)) navigate({ to: "/account" });
  };

  return (
    <SiteLayout>
      <div className="container-px mx-auto grid max-w-7xl gap-10 py-16 md:grid-cols-2">
        <div className="mx-auto w-full max-w-md self-center">
          <h1 className="font-display text-4xl text-secondary">Create your account</h1>
          <p className="mt-2 text-sm text-muted-foreground">
            Join Lumière and enjoy 10% off your first order.
          </p>
          <form onSubmit={submit} className="mt-8 space-y-4">
            <F label="Full name" value={name} onChange={setName} required />
            <F label="Email" type="email" value={email} onChange={setEmail} required />
            <F label="Password" type="password" value={password} onChange={setPassword} required />
            <button className="h-12 w-full rounded-sm bg-secondary text-xs font-medium uppercase tracking-wider text-secondary-foreground hover:bg-[var(--gold)] hover:text-secondary">
              Create account
            </button>
          </form>
          <p className="mt-6 text-center text-sm text-muted-foreground">
            Already have an account?{" "}
            <Link to="/login" className="text-[var(--gold)] hover:underline">
              Sign in
            </Link>
          </p>
        </div>
        <div className="hidden overflow-hidden rounded-md md:block">
          <img
            src="https://images.unsplash.com/photo-1611652022419-a9419f74343d?w=1200&q=80"
            alt=""
            className="h-full w-full object-cover"
          />
        </div>
      </div>
    </SiteLayout>
  );
}

function F({
  label,
  type = "text",
  value,
  onChange,
  required,
}: {
  label: string;
  type?: string;
  value: string;
  onChange: (v: string) => void;
  required?: boolean;
}) {
  return (
    <label className="block">
      <span className="mb-1 block text-xs uppercase tracking-wider text-muted-foreground">
        {label}
      </span>
      <input
        type={type}
        value={value}
        required={required}
        onChange={(e) => onChange(e.target.value)}
        className="h-12 w-full rounded-sm border border-border bg-background px-3 text-sm outline-none focus:border-[var(--gold)]"
      />
    </label>
  );
}
