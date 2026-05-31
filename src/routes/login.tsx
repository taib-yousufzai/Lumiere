import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { SiteLayout } from "@/layouts/SiteLayout";
import { useAuth } from "@/context/AuthContext";

export const Route = createFileRoute("/login")({
  head: () => ({ meta: [{ title: "Sign in — Solara" }] }),
  component: LoginPage,
});

function LoginPage() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    if (login(email, password)) navigate({ to: "/account" });
  };

  return (
    <SiteLayout>
      <div className="container-px mx-auto grid max-w-7xl gap-10 py-16 md:grid-cols-2">
        <div className="hidden overflow-hidden rounded-md md:block">
          <img
            src="https://images.unsplash.com/photo-1620656798932-902f3f3683b1?w=1200&q=80"
            alt=""
            className="h-full w-full object-cover"
          />
        </div>
        <div className="mx-auto w-full max-w-md self-center">
          <h1 className="font-display text-4xl text-secondary">Welcome back</h1>
          <p className="mt-2 text-sm text-muted-foreground">Sign in to your account</p>
          <form onSubmit={submit} className="mt-8 space-y-4">
            <Field label="Email" type="email" value={email} onChange={setEmail} required />
            <Field
              label="Password"
              type="password"
              value={password}
              onChange={setPassword}
              required
            />
            <div className="flex items-center justify-between text-xs">
              <label className="flex items-center gap-2 text-muted-foreground">
                <input type="checkbox" className="accent-[var(--gold)]" /> Remember me
              </label>
              <Link to="/forgot-password" className="text-[var(--gold)] hover:underline">
                Forgot password?
              </Link>
            </div>
            <button className="h-12 w-full rounded-sm bg-secondary text-xs font-medium uppercase tracking-wider text-secondary-foreground hover:bg-[var(--gold)] hover:text-secondary">
              Sign in
            </button>
          </form>
          <p className="mt-6 text-center text-sm text-muted-foreground">
            New to Solara?{" "}
            <Link to="/register" className="text-[var(--gold)] hover:underline">
              Create an account
            </Link>
          </p>
        </div>
      </div>
    </SiteLayout>
  );
}

function Field({
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
