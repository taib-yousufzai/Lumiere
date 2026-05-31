import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { useState } from "react";
import { motion } from "framer-motion";
import { FiHeart, FiShoppingBag, FiMinus, FiPlus, FiTruck, FiRefreshCw } from "react-icons/fi";

import { SiteLayout } from "@/layouts/SiteLayout";
import { RatingStars } from "@/components/RatingStars";
import { ProductCard } from "@/components/ProductCard";
import { getProduct, getRelated } from "@/data/products";
import { useCart } from "@/context/CartContext";
import { useWishlist } from "@/context/WishlistContext";
import { formatPrice } from "@/utils/format";

export const Route = createFileRoute("/product/$id")({
  loader: ({ params }) => {
    const product = getProduct(params.id);
    if (!product) throw notFound();
    return { product, related: getRelated(params.id) };
  },
  head: ({ loaderData }) => ({
    meta: loaderData
      ? [
          { title: `${loaderData.product.name} — Lumière` },
          { name: "description", content: loaderData.product.description },
          { property: "og:title", content: loaderData.product.name },
          { property: "og:image", content: loaderData.product.images[0] },
        ]
      : [],
  }),
  component: ProductPage,
  notFoundComponent: () => (
    <SiteLayout>
      <div className="container-px mx-auto max-w-3xl py-32 text-center">
        <h1 className="font-display text-4xl">Product not found</h1>
        <Link to="/shop" className="mt-6 inline-block text-[var(--gold)] underline">
          Back to shop
        </Link>
      </div>
    </SiteLayout>
  ),
});

function ProductPage() {
  const { product, related } = Route.useLoaderData();
  const [activeImg, setActiveImg] = useState(0);
  const [qty, setQty] = useState(1);
  const [tab, setTab] = useState<"details" | "care" | "reviews">("details");
  const { add } = useCart();
  const { has, toggle } = useWishlist();
  const wished = has(product.id);
  const price = product.discountPrice ?? product.price;

  const [zoomStyle, setZoomStyle] = useState<React.CSSProperties>({});
  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const { left, top, width, height } = e.currentTarget.getBoundingClientRect();
    const x = ((e.clientX - left) / width) * 100;
    const y = ((e.clientY - top) / height) * 100;
    setZoomStyle({
      transformOrigin: `${x}% ${y}%`,
      transform: "scale(2.2)",
    });
  };
  const handleMouseLeave = () => {
    setZoomStyle({});
  };

  return (
    <SiteLayout>
      <div className="container-px mx-auto max-w-7xl py-10">
        <nav className="mb-8 text-xs text-muted-foreground">
          <Link to="/" className="hover:text-foreground">
            Home
          </Link>{" "}
          /{" "}
          <Link
            to="/shop"
            search={{ category: product.category }}
            className="hover:text-foreground capitalize"
          >
            {product.category}
          </Link>{" "}
          / <span className="text-foreground">{product.name}</span>
        </nav>

        <div className="grid gap-12 md:grid-cols-2">
          {/* Images */}
          <div>
            <motion.div
              key={activeImg}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.3 }}
              onMouseMove={handleMouseMove}
              onMouseLeave={handleMouseLeave}
              className="group relative aspect-square overflow-hidden rounded-md bg-accent cursor-zoom-in"
            >
              <img
                src={product.images[activeImg]}
                alt={product.name}
                style={zoomStyle}
                className="h-full w-full object-cover transition-transform duration-100 ease-out"
              />
            </motion.div>
            <div className="mt-4 grid grid-cols-4 gap-3">
              {product.images.map((src: string, i: number) => (
                <button
                  key={i}
                  onClick={() => setActiveImg(i)}
                  className={`aspect-square overflow-hidden rounded-md border-2 transition ${
                    activeImg === i ? "border-[var(--gold)]" : "border-transparent"
                  }`}
                >
                  <img src={src} alt="" className="h-full w-full object-cover" />
                </button>
              ))}
            </div>
          </div>

          {/* Info */}
          <div>
            <span className="text-xs uppercase tracking-[0.25em] text-[var(--gold)]">
              {product.material}
            </span>
            <h1 className="mt-3 font-display text-4xl text-secondary md:text-5xl">
              {product.name}
            </h1>
            <div className="mt-3 flex items-center gap-3">
              <RatingStars value={product.rating} />
              <span className="text-sm text-muted-foreground">
                {product.rating} · {product.reviewCount} reviews
              </span>
            </div>

            <div className="mt-6 flex items-baseline gap-3">
              <span className="font-display text-3xl text-secondary">{formatPrice(price)}</span>
              {product.discountPrice && (
                <>
                  <span className="text-lg text-muted-foreground line-through">
                    {formatPrice(product.price)}
                  </span>
                  <span className="rounded-sm bg-[var(--gold-soft)] px-2 py-0.5 text-xs font-medium text-secondary">
                    Save {formatPrice(product.price - product.discountPrice)}
                  </span>
                </>
              )}
            </div>

            <p className="mt-6 text-sm leading-relaxed text-muted-foreground">
              {product.description}
            </p>

            <div className="mt-8 flex items-center gap-4">
              <div className="flex items-center rounded-sm border border-border">
                <button
                  onClick={() => setQty(Math.max(1, qty - 1))}
                  className="p-3"
                  aria-label="Decrease"
                >
                  <FiMinus size={14} />
                </button>
                <span className="w-10 text-center text-sm">{qty}</span>
                <button onClick={() => setQty(qty + 1)} className="p-3" aria-label="Increase">
                  <FiPlus size={14} />
                </button>
              </div>
              <button
                onClick={() =>
                  add({ id: product.id, name: product.name, price, image: product.images[0] }, qty)
                }
                className="inline-flex flex-1 items-center justify-center gap-2 rounded-sm bg-secondary px-6 py-3 text-xs font-medium uppercase tracking-wider text-secondary-foreground transition hover:bg-[var(--gold)] hover:text-secondary"
              >
                <FiShoppingBag /> Add to cart
              </button>
              <button
                onClick={() => toggle(product.id)}
                aria-label="Wishlist"
                className="grid h-12 w-12 place-items-center rounded-sm border border-border transition hover:border-[var(--gold)]"
              >
                <FiHeart className={wished ? "fill-[var(--gold)] text-[var(--gold)]" : ""} />
              </button>
            </div>

            <div className="mt-6 flex items-center gap-2 text-xs text-muted-foreground">
              <span className="inline-block h-2 w-2 rounded-full bg-emerald-500" />
              In stock · {product.stock} available
            </div>

            <div className="mt-8 grid grid-cols-2 gap-4 rounded-md bg-accent p-4 text-sm">
              <div className="flex items-center gap-2">
                <FiTruck className="text-[var(--gold)]" /> Free shipping over {formatPrice(75)}
              </div>
              <div className="flex items-center gap-2">
                <FiRefreshCw className="text-[var(--gold)]" /> 30-day returns
              </div>
            </div>

            {/* Tabs */}
            <div className="mt-10 border-b border-border">
              <div className="flex gap-6">
                {(["details", "care", "reviews"] as const).map((t) => (
                  <button
                    key={t}
                    onClick={() => setTab(t)}
                    className={`pb-3 text-xs uppercase tracking-wider transition ${
                      tab === t
                        ? "border-b-2 border-[var(--gold)] text-[var(--gold)]"
                        : "text-muted-foreground hover:text-foreground"
                    }`}
                  >
                    {t === "details"
                      ? "Details"
                      : t === "care"
                        ? "Care"
                        : `Reviews (${product.reviewCount})`}
                  </button>
                ))}
              </div>
            </div>
            <div className="py-6 text-sm leading-relaxed text-muted-foreground">
              {tab === "details" && (
                <dl className="grid grid-cols-2 gap-y-3">
                  <dt className="text-foreground">Material</dt>
                  <dd>{product.material}</dd>
                  <dt className="text-foreground">Weight</dt>
                  <dd>{product.weight}</dd>
                  <dt className="text-foreground">Category</dt>
                  <dd className="capitalize">{product.category}</dd>
                  <dt className="text-foreground">Stock</dt>
                  <dd>{product.stock}</dd>
                </dl>
              )}
              {tab === "care" && <p>{product.care}</p>}
              {tab === "reviews" && (
                <ReviewSection
                  productId={product.id}
                  rating={product.rating}
                  count={product.reviewCount}
                />
              )}
            </div>
          </div>
        </div>

        {/* Related */}
        {related.length > 0 && (
          <section className="mt-24">
            <h2 className="mb-8 font-display text-3xl text-secondary md:text-4xl">
              You may also love
            </h2>
            <div className="grid grid-cols-2 gap-x-4 gap-y-10 sm:grid-cols-3 lg:grid-cols-4">
              {related.map((p: typeof product) => (
                <ProductCard key={p.id} product={p} />
              ))}
            </div>
          </section>
        )}
      </div>
    </SiteLayout>
  );
}

function ReviewSection({
  productId,
  rating,
  count,
}: {
  productId: string;
  rating: number;
  count: number;
}) {
  const KEY = `lj_reviews_${productId}`;
  const [list, setList] = useState<{ name: string; rating: number; text: string; date: string }[]>(
    () => {
      try {
        return JSON.parse(localStorage.getItem(KEY) || "[]");
      } catch {
        return [];
      }
    },
  );
  const [name, setName] = useState("");
  const [stars, setStars] = useState(5);
  const [text, setText] = useState("");

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    const next = [{ name, rating: stars, text, date: new Date().toISOString() }, ...list];
    setList(next);
    localStorage.setItem(KEY, JSON.stringify(next));
    setName("");
    setText("");
    setStars(5);
  };

  return (
    <div>
      <div className="mb-6 flex items-center gap-6 rounded-md bg-accent p-6">
        <div className="text-center">
          <div className="font-display text-4xl text-secondary">{rating}</div>
          <RatingStars value={rating} />
          <div className="mt-1 text-xs text-muted-foreground">{count + list.length} reviews</div>
        </div>
        <div className="flex-1 space-y-1">
          {[5, 4, 3, 2, 1].map((s) => {
            const pct = s === 5 ? 78 : s === 4 ? 16 : s === 3 ? 4 : s === 2 ? 1 : 1;
            return (
              <div key={s} className="flex items-center gap-2 text-xs">
                <span className="w-3 text-foreground">{s}</span>
                <div className="h-1.5 flex-1 rounded-full bg-border">
                  <div
                    className="h-full rounded-full bg-[var(--gold)]"
                    style={{ width: `${pct}%` }}
                  />
                </div>
                <span className="w-8 text-right text-muted-foreground">{pct}%</span>
              </div>
            );
          })}
        </div>
      </div>

      <div className="space-y-4">
        {list.map((r, i) => (
          <div key={i} className="rounded-md border border-border p-4">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-foreground">{r.name}</span>
              <RatingStars value={r.rating} />
            </div>
            <p className="mt-2 text-sm text-muted-foreground">{r.text}</p>
          </div>
        ))}
        {list.length === 0 && (
          <p className="text-sm text-muted-foreground">Be the first to write a review.</p>
        )}
      </div>

      <form onSubmit={submit} className="mt-8 space-y-3 rounded-md border border-border p-5">
        <h4 className="font-display text-lg text-secondary">Write a review</h4>
        <input
          required
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Your name"
          className="h-11 w-full rounded-sm border border-border bg-background px-3 text-sm outline-none focus:border-[var(--gold)]"
        />
        <div className="flex items-center gap-2">
          <span className="text-sm text-foreground">Rating:</span>
          {[1, 2, 3, 4, 5].map((s) => (
            <button
              type="button"
              key={s}
              onClick={() => setStars(s)}
              className={s <= stars ? "text-[var(--gold)]" : "text-muted-foreground/40"}
            >
              ★
            </button>
          ))}
        </div>
        <textarea
          required
          value={text}
          onChange={(e) => setText(e.target.value)}
          rows={4}
          placeholder="Share your thoughts..."
          className="w-full rounded-sm border border-border bg-background p-3 text-sm outline-none focus:border-[var(--gold)]"
        />
        <button className="rounded-sm bg-secondary px-6 py-3 text-xs font-medium uppercase tracking-wider text-secondary-foreground hover:bg-[var(--gold)] hover:text-secondary">
          Submit review
        </button>
      </form>
    </div>
  );
}
