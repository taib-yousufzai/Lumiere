import { createFileRoute, Link } from "@tanstack/react-router";
import { FiMinus, FiPlus, FiX, FiArrowRight } from "react-icons/fi";
import { useState } from "react";

import { SiteLayout } from "@/layouts/SiteLayout";
import { useCart } from "@/context/CartContext";
import { formatPrice } from "@/utils/format";
import { toast } from "sonner";

export const Route = createFileRoute("/cart")({
  head: () => ({ meta: [{ title: "Your Cart — Solara" }] }),
  component: CartPage,
});

function CartPage() {
  const { items, setQty, remove, subtotal } = useCart();
  const [coupon, setCoupon] = useState("");
  const [discount, setDiscount] = useState(0);
  const shipping = subtotal > 75 || subtotal === 0 ? 0 : 8;
  const total = Math.max(0, subtotal - discount + shipping);

  const apply = (e: React.FormEvent) => {
    e.preventDefault();
    if (coupon.toUpperCase() === "SOLARA10") {
      setDiscount(subtotal * 0.1);
      toast.success("Coupon applied: 10% off");
    } else {
      setDiscount(0);
      toast.error("Invalid coupon code");
    }
  };

  if (items.length === 0) {
    return (
      <SiteLayout>
        <div className="container-px mx-auto max-w-3xl py-24 text-center">
          <h1 className="font-display text-4xl text-secondary md:text-5xl">Your cart is empty</h1>
          <p className="mt-3 text-muted-foreground">Let's find something you love.</p>
          <Link
            to="/shop"
            className="mt-8 inline-flex items-center gap-2 rounded-sm bg-secondary px-6 py-3 text-xs font-medium uppercase tracking-wider text-secondary-foreground hover:bg-[var(--gold)] hover:text-secondary"
          >
            Continue shopping <FiArrowRight />
          </Link>
        </div>
      </SiteLayout>
    );
  }

  return (
    <SiteLayout>
      <div className="container-px mx-auto max-w-7xl py-12">
        <h1 className="font-display text-4xl text-secondary md:text-5xl">Your cart</h1>
        <div className="mt-10 grid gap-12 lg:grid-cols-[1fr_400px]">
          <div className="divide-y divide-border">
            {items.map((it) => (
              <div key={it.id} className="flex gap-4 py-6">
                <Link to="/product/$id" params={{ id: it.id }} className="shrink-0">
                  <img src={it.image} alt={it.name} className="h-28 w-24 rounded-md object-cover" />
                </Link>
                <div className="flex-1">
                  <div className="flex justify-between gap-3">
                    <Link
                      to="/product/$id"
                      params={{ id: it.id }}
                      className="font-medium text-foreground hover:text-[var(--gold)]"
                    >
                      {it.name}
                    </Link>
                    <button
                      onClick={() => remove(it.id)}
                      aria-label="Remove"
                      className="text-muted-foreground hover:text-foreground"
                    >
                      <FiX />
                    </button>
                  </div>
                  <p className="mt-1 text-sm text-muted-foreground">{formatPrice(it.price)}</p>
                  <div className="mt-4 flex items-center justify-between">
                    <div className="flex items-center rounded-sm border border-border">
                      <button onClick={() => setQty(it.id, it.quantity - 1)} className="p-2">
                        <FiMinus size={12} />
                      </button>
                      <span className="w-8 text-center text-sm">{it.quantity}</span>
                      <button onClick={() => setQty(it.id, it.quantity + 1)} className="p-2">
                        <FiPlus size={12} />
                      </button>
                    </div>
                    <span className="font-medium">{formatPrice(it.price * it.quantity)}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <aside className="h-fit rounded-md bg-accent p-6">
            <h2 className="font-display text-2xl text-secondary">Order summary</h2>

            <form onSubmit={apply} className="mt-6 flex">
              <input
                value={coupon}
                onChange={(e) => setCoupon(e.target.value)}
                placeholder="Promo code (try SOLARA10)"
                className="h-11 flex-1 rounded-l-sm border border-border bg-background px-3 text-sm outline-none focus:border-[var(--gold)]"
              />
              <button className="h-11 rounded-r-sm bg-secondary px-4 text-xs font-medium uppercase tracking-wider text-secondary-foreground hover:bg-[var(--gold)] hover:text-secondary">
                Apply
              </button>
            </form>

            <dl className="mt-6 space-y-3 text-sm">
              <div className="flex justify-between">
                <dt>Subtotal</dt>
                <dd>{formatPrice(subtotal)}</dd>
              </div>
              {discount > 0 && (
                <div className="flex justify-between text-[var(--gold)]">
                  <dt>Discount</dt>
                  <dd>-{formatPrice(discount)}</dd>
                </div>
              )}
              <div className="flex justify-between">
                <dt>Shipping</dt>
                <dd>{shipping === 0 ? "Free" : formatPrice(shipping)}</dd>
              </div>
              <div className="flex justify-between border-t border-border pt-3 font-display text-lg text-secondary">
                <dt>Total</dt>
                <dd>{formatPrice(total)}</dd>
              </div>
            </dl>

            <Link
              to="/checkout"
              className="mt-6 inline-flex w-full items-center justify-center gap-2 rounded-sm bg-secondary px-6 py-3 text-xs font-medium uppercase tracking-wider text-secondary-foreground hover:bg-[var(--gold)] hover:text-secondary"
            >
              Checkout <FiArrowRight />
            </Link>
            <Link
              to="/shop"
              className="mt-3 block text-center text-xs uppercase tracking-wider text-muted-foreground hover:text-foreground"
            >
              Continue shopping
            </Link>
          </aside>
        </div>
      </div>
    </SiteLayout>
  );
}
