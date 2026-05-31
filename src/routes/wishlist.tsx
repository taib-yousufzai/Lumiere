import { createFileRoute, Link } from "@tanstack/react-router";
import { FiX, FiShoppingBag } from "react-icons/fi";

import { SiteLayout } from "@/layouts/SiteLayout";
import { useWishlist } from "@/context/WishlistContext";
import { useCart } from "@/context/CartContext";
import { PRODUCTS } from "@/data/products";
import { formatPrice } from "@/utils/format";
import { RatingStars } from "@/components/RatingStars";

export const Route = createFileRoute("/wishlist")({
  head: () => ({ meta: [{ title: "Your Wishlist — Lumière" }] }),
  component: WishPage,
});

function WishPage() {
  const { ids, remove } = useWishlist();
  const { add } = useCart();
  const items = PRODUCTS.filter((p) => ids.includes(p.id));

  return (
    <SiteLayout>
      <div className="container-px mx-auto max-w-7xl py-12">
        <h1 className="font-display text-4xl text-secondary md:text-5xl">Your wishlist</h1>
        <p className="mt-2 text-sm text-muted-foreground">{items.length} saved pieces</p>

        {items.length === 0 ? (
          <div className="py-24 text-center text-muted-foreground">
            Your wishlist is empty.{" "}
            <Link to="/shop" className="text-[var(--gold)] underline">
              Browse the shop
            </Link>
            .
          </div>
        ) : (
          <div className="mt-10 divide-y divide-border">
            {items.map((p) => {
              const price = p.discountPrice ?? p.price;
              return (
                <div key={p.id} className="flex gap-4 py-6">
                  <Link to="/product/$id" params={{ id: p.id }}>
                    <img
                      src={p.images[0]}
                      alt={p.name}
                      className="h-28 w-24 rounded-md object-cover"
                    />
                  </Link>
                  <div className="flex-1">
                    <div className="flex justify-between gap-3">
                      <Link
                        to="/product/$id"
                        params={{ id: p.id }}
                        className="font-medium hover:text-[var(--gold)]"
                      >
                        {p.name}
                      </Link>
                      <button
                        onClick={() => remove(p.id)}
                        aria-label="Remove"
                        className="text-muted-foreground hover:text-foreground"
                      >
                        <FiX />
                      </button>
                    </div>
                    <div className="mt-1 flex items-center gap-2">
                      <RatingStars value={p.rating} size={12} />
                      <span className="text-xs text-muted-foreground">({p.reviewCount})</span>
                    </div>
                    <p className="mt-1 text-sm font-medium">{formatPrice(price)}</p>
                    <button
                      onClick={() => {
                        add({ id: p.id, name: p.name, price, image: p.images[0] });
                        remove(p.id);
                      }}
                      className="mt-3 inline-flex items-center gap-2 rounded-sm bg-secondary px-4 py-2 text-xs font-medium uppercase tracking-wider text-secondary-foreground hover:bg-[var(--gold)] hover:text-secondary"
                    >
                      <FiShoppingBag size={14} /> Move to cart
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </SiteLayout>
  );
}
