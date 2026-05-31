import { Link, useNavigate, useRouterState } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FiSearch, FiHeart, FiShoppingBag, FiUser, FiMenu, FiX } from "react-icons/fi";
import { useCart } from "@/context/CartContext";
import { useWishlist } from "@/context/WishlistContext";
import { useAuth } from "@/context/AuthContext";
import { formatPrice } from "@/utils/format";

const NAV = [
  { to: "/", label: "Home" },
  { to: "/shop", label: "Shop" },
  { to: "/shop", label: "Rings", search: { category: "rings" as const } },
  { to: "/shop", label: "Necklaces", search: { category: "necklaces" as const } },
  { to: "/shop", label: "Earrings", search: { category: "earrings" as const } },
  { to: "/about", label: "About" },
  { to: "/contact", label: "Contact" },
];

export function Navbar() {
  const [open, setOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [q, setQ] = useState("");
  const [scrolled, setScrolled] = useState(false);
  const { count, setDrawerOpen } = useCart();
  const { ids } = useWishlist();
  const { user } = useAuth();
  const navigate = useNavigate();
  const path = useRouterState({ select: (s) => s.location.pathname });

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 10);
    onScroll();
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    setOpen(false);
    setSearchOpen(false);
  }, [path]);

  const submitSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (!q.trim()) return;
    navigate({ to: "/shop", search: { q: q.trim() } });
    setSearchOpen(false);
    setQ("");
  };

  return (
    <>
      <div className="bg-secondary py-2 text-center text-[11px] uppercase tracking-[0.2em] text-secondary-foreground">
        Complimentary shipping on orders over {formatPrice(75)} · 30-day returns
      </div>

      <header
        className={`sticky top-0 z-40 w-full border-b border-border bg-background/90 backdrop-blur transition ${
          scrolled ? "shadow-sm" : ""
        }`}
      >
        <div className="container-px mx-auto flex h-16 max-w-7xl items-center justify-between gap-4">
          <button
            type="button"
            className="lg:hidden"
            onClick={() => setOpen(true)}
            aria-label="Open menu"
          >
            <FiMenu size={22} />
          </button>

          <Link to="/" className="font-display text-2xl font-semibold tracking-wide text-secondary">
            Lumière<span className="text-[var(--gold)]">.</span>
          </Link>

          <nav className="hidden items-center gap-8 lg:flex">
            {NAV.map((n, i) => (
              <Link
                key={i}
                to={n.to}
                search={n.search as Record<string, unknown>}
                className="text-sm text-foreground/80 transition hover:text-[var(--gold)]"
                activeProps={{ className: "text-[var(--gold)]" }}
                activeOptions={{ exact: n.to === "/" }}
              >
                {n.label}
              </Link>
            ))}
          </nav>

          <div className="flex items-center gap-3 sm:gap-4">
            <button
              type="button"
              onClick={() => setSearchOpen((v) => !v)}
              aria-label="Search"
              className="text-foreground/80 transition hover:text-[var(--gold)]"
            >
              <FiSearch size={18} />
            </button>
            <Link
              to={user ? "/account" : "/login"}
              aria-label="Account"
              className="hidden text-foreground/80 transition hover:text-[var(--gold)] sm:inline"
            >
              <FiUser size={18} />
            </Link>
            <Link
              to="/wishlist"
              aria-label="Wishlist"
              className="relative text-foreground/80 transition hover:text-[var(--gold)]"
            >
              <FiHeart size={18} />
              {ids.length > 0 && (
                <span className="absolute -right-2 -top-2 grid h-4 min-w-4 place-items-center rounded-full bg-[var(--gold)] px-1 text-[10px] font-semibold text-secondary">
                  {ids.length}
                </span>
              )}
            </Link>
            <button
              onClick={() => setDrawerOpen(true)}
              aria-label="Cart"
              className="relative text-foreground/80 transition hover:text-[var(--gold)] cursor-pointer"
            >
              <FiShoppingBag size={18} />
              {count > 0 && (
                <span className="absolute -right-2 -top-2 grid h-4 min-w-4 place-items-center rounded-full bg-[var(--gold)] px-1 text-[10px] font-semibold text-secondary">
                  {count}
                </span>
              )}
            </button>
          </div>
        </div>

        <AnimatePresence>
          {searchOpen && (
            <motion.form
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              onSubmit={submitSearch}
              className="overflow-hidden border-t border-border bg-background"
            >
              <div className="container-px mx-auto flex h-14 max-w-7xl items-center gap-3">
                <FiSearch className="text-muted-foreground" />
                <input
                  autoFocus
                  value={q}
                  onChange={(e) => setQ(e.target.value)}
                  placeholder="Search for rings, necklaces, gifts..."
                  className="h-full flex-1 bg-transparent outline-none placeholder:text-muted-foreground"
                />
                <button
                  type="button"
                  onClick={() => setSearchOpen(false)}
                  className="text-muted-foreground hover:text-foreground"
                >
                  <FiX />
                </button>
              </div>
            </motion.form>
          )}
        </AnimatePresence>
      </header>

      {/* Mobile drawer */}
      <AnimatePresence>
        {open && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setOpen(false)}
              className="fixed inset-0 z-50 bg-secondary/60 backdrop-blur-sm lg:hidden"
            />
            <motion.aside
              initial={{ x: "-100%" }}
              animate={{ x: 0 }}
              exit={{ x: "-100%" }}
              transition={{ type: "tween", duration: 0.3 }}
              className="fixed inset-y-0 left-0 z-50 w-80 max-w-[85%] bg-background p-6 lg:hidden"
            >
              <div className="flex items-center justify-between">
                <span className="font-display text-xl">Menu</span>
                <button type="button" onClick={() => setOpen(false)} aria-label="Close">
                  <FiX size={20} />
                </button>
              </div>
              <nav className="mt-8 flex flex-col gap-1">
                {NAV.map((n, i) => (
                  <Link
                    key={i}
                    to={n.to}
                    search={n.search as Record<string, unknown>}
                    className="rounded-md px-3 py-3 text-base text-foreground hover:bg-accent"
                  >
                    {n.label}
                  </Link>
                ))}
                <div className="my-4 h-px bg-border" />
                <Link
                  to={user ? "/account" : "/login"}
                  className="rounded-md px-3 py-3 text-base hover:bg-accent"
                >
                  {user ? "My Account" : "Sign In"}
                </Link>
                <Link to="/wishlist" className="rounded-md px-3 py-3 text-base hover:bg-accent">
                  Wishlist
                </Link>
                <button
                  onClick={() => {
                    setOpen(false);
                    setDrawerOpen(true);
                  }}
                  className="rounded-md px-3 py-3 text-left text-base hover:bg-accent cursor-pointer"
                >
                  Cart
                </button>
              </nav>
            </motion.aside>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
