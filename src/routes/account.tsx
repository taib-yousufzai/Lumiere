import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { FiUser, FiPackage, FiHeart, FiSettings, FiLogOut } from "react-icons/fi";

import { SiteLayout } from "@/layouts/SiteLayout";
import { useAuth, type User } from "@/context/AuthContext";
import { useWishlist } from "@/context/WishlistContext";
import { PRODUCTS } from "@/data/products";
import { formatPrice } from "@/utils/format";

type Tab = "profile" | "orders" | "wishlist" | "settings";

export const Route = createFileRoute("/account")({
  head: () => ({ meta: [{ title: "My Account — Solara" }] }),
  component: AccountPage,
});

function AccountPage() {
  const { user, logout, orders, updateProfile } = useAuth();
  const { ids } = useWishlist();
  const navigate = useNavigate();
  const [tab, setTab] = useState<Tab>("profile");

  useEffect(() => {
    if (!user) navigate({ to: "/login" });
  }, [user, navigate]);

  if (!user) return null;

  const wishItems = PRODUCTS.filter((p) => ids.includes(p.id));

  const TABS: { id: Tab; label: string; Icon: React.ComponentType<{ size?: number }> }[] = [
    { id: "profile", label: "Profile", Icon: FiUser },
    { id: "orders", label: "Orders", Icon: FiPackage },
    { id: "wishlist", label: "Wishlist", Icon: FiHeart },
    { id: "settings", label: "Settings", Icon: FiSettings },
  ];

  return (
    <SiteLayout>
      <div className="container-px mx-auto max-w-7xl py-12">
        <h1 className="font-display text-4xl text-secondary md:text-5xl">My account</h1>
        <p className="mt-2 text-sm text-muted-foreground">Welcome back, {user.name}</p>

        <div className="mt-10 grid gap-10 lg:grid-cols-[220px_1fr]">
          <aside className="space-y-1">
            {TABS.map(({ id, label, Icon }) => (
              <button
                key={id}
                onClick={() => setTab(id)}
                className={`flex w-full items-center gap-3 rounded-md px-4 py-3 text-sm transition ${
                  tab === id ? "bg-secondary text-secondary-foreground" : "hover:bg-accent"
                }`}
              >
                <Icon size={16} /> {label}
              </button>
            ))}
            <button
              onClick={() => {
                logout();
                navigate({ to: "/" });
              }}
              className="flex w-full items-center gap-3 rounded-md px-4 py-3 text-sm text-muted-foreground hover:bg-accent"
            >
              <FiLogOut size={16} /> Sign out
            </button>
          </aside>

          <div>
            {tab === "profile" && (
              <Card title="Profile information">
                <ProfileForm user={user} onSave={updateProfile} />
              </Card>
            )}
            {tab === "orders" && (
              <Card title="Order history">
                {orders.length === 0 ? (
                  <p className="text-sm text-muted-foreground">
                    No orders yet.{" "}
                    <Link to="/shop" className="text-[var(--gold)] underline">
                      Start shopping
                    </Link>
                    .
                  </p>
                ) : (
                  <div className="space-y-4">
                    {orders.map((o) => (
                      <div key={o.id} className="rounded-md border border-border p-4">
                        <div className="flex flex-wrap items-center justify-between gap-2 text-sm">
                          <span className="font-medium">{o.id}</span>
                          <span className="text-xs text-muted-foreground">
                            {new Date(o.date).toLocaleDateString()}
                          </span>
                          <span className="rounded-full bg-[var(--gold-soft)] px-3 py-1 text-xs text-secondary">
                            {o.status}
                          </span>
                          <span className="font-medium">{formatPrice(o.total)}</span>
                        </div>
                        <div className="mt-3 flex gap-2">
                          {o.items.slice(0, 4).map((i, idx) => (
                            <img
                              key={idx}
                              src={i.image}
                              alt=""
                              className="h-12 w-12 rounded object-cover"
                            />
                          ))}
                          {o.items.length > 4 && (
                            <div className="grid h-12 w-12 place-items-center rounded bg-accent text-xs">
                              +{o.items.length - 4}
                            </div>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </Card>
            )}
            {tab === "wishlist" && (
              <Card title="Your wishlist">
                {wishItems.length === 0 ? (
                  <p className="text-sm text-muted-foreground">No saved items yet.</p>
                ) : (
                  <div className="grid grid-cols-2 gap-4 sm:grid-cols-3">
                    {wishItems.map((p) => (
                      <Link key={p.id} to="/product/$id" params={{ id: p.id }} className="block">
                        <img
                          src={p.images[0]}
                          alt={p.name}
                          className="aspect-square w-full rounded-md object-cover"
                        />
                        <p className="mt-2 line-clamp-1 text-sm">{p.name}</p>
                        <p className="text-xs text-muted-foreground">
                          {formatPrice(p.discountPrice ?? p.price)}
                        </p>
                      </Link>
                    ))}
                  </div>
                )}
              </Card>
            )}
            {tab === "settings" && (
              <Card title="Account settings">
                <p className="text-sm text-muted-foreground">
                  Email preferences, notifications, and privacy settings will appear here.
                </p>
                <div className="mt-6 space-y-3">
                  {["Marketing emails", "Order updates", "New arrivals"].map((s) => (
                    <label
                      key={s}
                      className="flex items-center justify-between rounded-md border border-border p-4 text-sm"
                    >
                      <span>{s}</span>
                      <input type="checkbox" defaultChecked className="accent-[var(--gold)]" />
                    </label>
                  ))}
                </div>
              </Card>
            )}
          </div>
        </div>
      </div>
    </SiteLayout>
  );
}

function Card({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="rounded-md border border-border bg-background p-6">
      <h2 className="mb-6 font-display text-2xl text-secondary">{title}</h2>
      {children}
    </div>
  );
}

function ProfileForm({ user, onSave }: { user: User; onSave: (p: Partial<User>) => void }) {
  const [name, setName] = useState(user.name);
  const [email, setEmail] = useState(user.email);
  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        onSave({ name, email });
      }}
      className="space-y-4"
    >
      <label className="block">
        <span className="mb-1 block text-xs uppercase tracking-wider text-muted-foreground">
          Full name
        </span>
        <input
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="h-12 w-full rounded-sm border border-border bg-background px-3 text-sm outline-none focus:border-[var(--gold)]"
        />
      </label>
      <label className="block">
        <span className="mb-1 block text-xs uppercase tracking-wider text-muted-foreground">
          Email
        </span>
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="h-12 w-full rounded-sm border border-border bg-background px-3 text-sm outline-none focus:border-[var(--gold)]"
        />
      </label>
      <button className="rounded-sm bg-secondary px-6 py-3 text-xs font-medium uppercase tracking-wider text-secondary-foreground hover:bg-[var(--gold)] hover:text-secondary">
        Save changes
      </button>
    </form>
  );
}
