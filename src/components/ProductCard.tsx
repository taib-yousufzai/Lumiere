import { Link } from "@tanstack/react-router";
import { motion } from "framer-motion";
import { FiHeart, FiShoppingBag } from "react-icons/fi";
import { useCart } from "@/context/CartContext";
import { useWishlist } from "@/context/WishlistContext";
import type { Product } from "@/data/products";
import { formatPrice } from "@/utils/format";
import { RatingStars } from "./RatingStars";

export function ProductCard({ product }: { product: Product }) {
  const { add } = useCart();
  const { has, toggle } = useWishlist();
  const wished = has(product.id);
  const price = product.discountPrice ?? product.price;
  const hasDiscount = !!product.discountPrice;
  const off = hasDiscount
    ? Math.round(((product.price - (product.discountPrice as number)) / product.price) * 100)
    : 0;

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-40px" }}
      transition={{ duration: 0.45, ease: "easeOut" }}
      className="group relative"
    >
      <Link
        to="/product/$id"
        params={{ id: product.id }}
        className="block overflow-hidden rounded-md bg-accent"
      >
        <div className="relative aspect-[4/5] overflow-hidden">
          <img
            src={product.images[0]}
            alt={product.name}
            loading="lazy"
            className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
          />
          <img
            src={product.images[1]}
            alt=""
            aria-hidden
            loading="lazy"
            className="absolute inset-0 h-full w-full object-cover opacity-0 transition-opacity duration-500 group-hover:opacity-100"
          />
          {hasDiscount && (
            <span className="absolute left-3 top-3 rounded-sm bg-secondary px-2 py-0.5 text-[10px] font-medium uppercase tracking-wider text-secondary-foreground">
              {off}% off
            </span>
          )}
          {product.newArrival && !hasDiscount && (
            <span className="absolute left-3 top-3 rounded-sm bg-gold px-2 py-0.5 text-[10px] font-medium uppercase tracking-wider text-secondary">
              New
            </span>
          )}
          <button
            type="button"
            onClick={(e) => {
              e.preventDefault();
              toggle(product.id);
            }}
            aria-label="Add to wishlist"
            className="absolute right-3 top-3 grid h-9 w-9 place-items-center rounded-full bg-background/90 backdrop-blur transition hover:bg-background"
          >
            <FiHeart
              className={wished ? "fill-[var(--gold)] text-[var(--gold)]" : "text-secondary"}
              size={16}
            />
          </button>
        </div>
      </Link>

      <div className="pt-3">
        <Link to="/product/$id" params={{ id: product.id }}>
          <h3 className="line-clamp-1 text-sm font-medium text-foreground transition group-hover:text-[var(--gold)]">
            {product.name}
          </h3>
        </Link>
        <div className="mt-1 flex items-center gap-2">
          <RatingStars value={product.rating} size={12} />
          <span className="text-xs text-muted-foreground">({product.reviewCount})</span>
        </div>
        <div className="mt-1.5 flex items-baseline gap-2">
          <span className="text-sm font-semibold text-foreground">{formatPrice(price)}</span>
          {hasDiscount && (
            <span className="text-xs text-muted-foreground line-through">
              {formatPrice(product.price)}
            </span>
          )}
        </div>

        <button
          type="button"
          onClick={() =>
            add({ id: product.id, name: product.name, price, image: product.images[0] })
          }
          className="mt-3 inline-flex w-full items-center justify-center gap-2 rounded-sm border border-secondary/20 bg-background py-2 text-xs font-medium uppercase tracking-wider text-secondary transition hover:bg-secondary hover:text-secondary-foreground"
        >
          <FiShoppingBag size={14} /> Add to cart
        </button>
      </div>
    </motion.div>
  );
}
