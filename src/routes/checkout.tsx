import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { FiCheck } from "react-icons/fi";

import { SiteLayout } from "@/layouts/SiteLayout";
import { useCart } from "@/context/CartContext";
import { useAuth } from "@/context/AuthContext";
import { formatPrice } from "@/utils/format";
import { toast } from "sonner";

export const Route = createFileRoute("/checkout")({
  head: () => ({ meta: [{ title: "Checkout — Lumière" }] }),
  component: CheckoutPage,
});

function CheckoutPage() {
  const { items, subtotal, clear } = useCart();
  const { addOrder, user } = useAuth();
  const navigate = useNavigate();
  const shipping = subtotal > 75 || subtotal === 0 ? 0 : 8;
  const tax = subtotal * 0.05;
  const total = subtotal + shipping + tax;
  const [sameAsShipping, setSameAsShipping] = useState(true);
  const [payment, setPayment] = useState("card");
  const [placing, setPlacing] = useState(false);

  const place = (e: React.FormEvent) => {
    e.preventDefault();
    if (items.length === 0) return;
    setPlacing(true);
    setTimeout(() => {
      addOrder({
        id: "LUM-" + Math.random().toString(36).slice(2, 8).toUpperCase(),
        date: new Date().toISOString(),
        total,
        items: items.map((i) => ({
          name: i.name,
          quantity: i.quantity,
          price: i.price,
          image: i.image,
        })),
        status: "Processing",
      });
      clear();
      toast.success("Order placed successfully");
      navigate({ to: user ? "/account" : "/" });
    }, 900);
  };

  if (items.length === 0) {
    return (
      <SiteLayout>
        <div className="container-px mx-auto max-w-3xl py-24 text-center">
          <h1 className="font-display text-4xl">Nothing to check out</h1>
          <p className="mt-3 text-muted-foreground">Add something to your cart first.</p>
        </div>
      </SiteLayout>
    );
  }

  return (
    <SiteLayout>
      <div className="container-px mx-auto max-w-7xl py-12">
        <h1 className="font-display text-4xl text-secondary md:text-5xl">Checkout</h1>

        <form onSubmit={place} className="mt-10 grid gap-12 lg:grid-cols-[1fr_400px]">
          <div className="space-y-10">
            <Section title="Contact">
              <Input label="Email" type="email" required defaultValue={user?.email} />
            </Section>

            <Section title="Shipping address">
              <div className="grid gap-4 sm:grid-cols-2">
                <Input label="First name" required defaultValue={user?.name.split(" ")[0]} />
                <Input label="Last name" required />
                <Input label="Address" required className="sm:col-span-2" />
                <Input label="City" required />
                <Input label="State / Region" required />
                <Input label="ZIP / Postal code" required />
                <Input label="Phone" type="tel" required />
              </div>
            </Section>

            <Section title="Billing">
              <label className="flex items-center gap-2 text-sm">
                <input
                  type="checkbox"
                  checked={sameAsShipping}
                  onChange={(e) => setSameAsShipping(e.target.checked)}
                  className="accent-[var(--gold)]"
                />
                Billing same as shipping
              </label>
              {!sameAsShipping && (
                <div className="mt-4 grid gap-4 sm:grid-cols-2">
                  <Input label="Address" required className="sm:col-span-2" />
                  <Input label="City" required />
                  <Input label="ZIP / Postal code" required />
                </div>
              )}
            </Section>

            <Section title="Payment method">
              <div className="space-y-2">
                {[
                  { id: "card", label: "Credit / Debit Card" },
                  { id: "upi", label: "UPI" },
                  { id: "paypal", label: "PayPal" },
                  { id: "cod", label: "Cash on Delivery" },
                ].map((p) => (
                  <label
                    key={p.id}
                    className={`flex cursor-pointer items-center justify-between rounded-md border px-4 py-3 text-sm transition ${
                      payment === p.id
                        ? "border-[var(--gold)] bg-[var(--gold-soft)]/40"
                        : "border-border"
                    }`}
                  >
                    <span className="flex items-center gap-3">
                      <input
                        type="radio"
                        checked={payment === p.id}
                        onChange={() => setPayment(p.id)}
                        className="accent-[var(--gold)]"
                      />
                      {p.label}
                    </span>
                    {payment === p.id && <FiCheck className="text-[var(--gold)]" />}
                  </label>
                ))}
              </div>
              {payment === "card" && (
                <div className="mt-4 grid gap-4 sm:grid-cols-2">
                  <Input
                    label="Card number"
                    required
                    placeholder="•••• •••• •••• ••••"
                    className="sm:col-span-2"
                  />
                  <Input label="Expiry (MM/YY)" required />
                  <Input label="CVV" required type="password" />
                </div>
              )}
            </Section>
          </div>

          <aside className="h-fit rounded-md bg-accent p-6">
            <h2 className="font-display text-2xl text-secondary">Order summary</h2>
            <div className="mt-4 max-h-72 space-y-3 overflow-auto">
              {items.map((it) => (
                <div key={it.id} className="flex items-center gap-3">
                  <img src={it.image} alt="" className="h-14 w-14 rounded object-cover" />
                  <div className="flex-1 text-sm">
                    <p className="line-clamp-1 text-foreground">{it.name}</p>
                    <p className="text-xs text-muted-foreground">Qty {it.quantity}</p>
                  </div>
                  <span className="text-sm">{formatPrice(it.price * it.quantity)}</span>
                </div>
              ))}
            </div>

            <dl className="mt-6 space-y-2 text-sm">
              <Row label="Subtotal" value={formatPrice(subtotal)} />
              <Row label="Shipping" value={shipping ? formatPrice(shipping) : "Free"} />
              <Row label="Tax (est.)" value={formatPrice(tax)} />
              <div className="flex justify-between border-t border-border pt-3 font-display text-lg text-secondary">
                <dt>Total</dt>
                <dd>{formatPrice(total)}</dd>
              </div>
            </dl>

            <button
              type="submit"
              disabled={placing}
              className="mt-6 inline-flex w-full items-center justify-center gap-2 rounded-sm bg-secondary px-6 py-3 text-xs font-medium uppercase tracking-wider text-secondary-foreground transition hover:bg-[var(--gold)] hover:text-secondary disabled:opacity-50"
            >
              {placing ? "Placing order..." : "Place order"}
            </button>
            <p className="mt-3 text-center text-[11px] text-muted-foreground">
              This is a demo. No real payment is processed.
            </p>
          </aside>
        </form>
      </div>
    </SiteLayout>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section>
      <h2 className="mb-4 font-display text-2xl text-secondary">{title}</h2>
      {children}
    </section>
  );
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex justify-between">
      <dt>{label}</dt>
      <dd>{value}</dd>
    </div>
  );
}

function Input({
  label,
  className = "",
  ...props
}: { label: string; className?: string } & React.InputHTMLAttributes<HTMLInputElement>) {
  return (
    <label className={`block ${className}`}>
      <span className="mb-1 block text-xs uppercase tracking-wider text-muted-foreground">
        {label}
      </span>
      <input
        {...props}
        className="h-11 w-full rounded-sm border border-border bg-background px-3 text-sm outline-none focus:border-[var(--gold)]"
      />
    </label>
  );
}
