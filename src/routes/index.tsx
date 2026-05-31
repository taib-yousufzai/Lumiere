import { createFileRoute, Link } from "@tanstack/react-router";
import { motion } from "framer-motion";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Pagination } from "swiper/modules";
import { FiArrowRight, FiTruck, FiRefreshCw, FiShield, FiGift } from "react-icons/fi";
import "swiper/css";
import "swiper/css/pagination";

import { SiteLayout } from "@/layouts/SiteLayout";
import { ProductCard } from "@/components/ProductCard";
import { RatingStars } from "@/components/RatingStars";
import { formatPrice } from "@/utils/format";
import { CATEGORIES, PRODUCTS, REVIEWS } from "@/data/products";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Lumière — Modern Fine Jewelry, Made Everyday" },
      {
        name: "description",
        content:
          "Premium-feel, affordable jewelry. Shop rings, necklaces, earrings, bracelets, anklets and men's pieces.",
      },
      { property: "og:title", content: "Lumière — Modern Fine Jewelry" },
      { property: "og:description", content: "Premium-feel, affordable jewelry for every day." },
    ],
  }),
  component: HomePage,
});

const HERO = "https://images.unsplash.com/photo-1617038260897-41a1f14a8ca0?w=1600&q=80";

function HomePage() {
  const trending = PRODUCTS.filter((p) => p.featured).slice(0, 8);
  const bestSellers = PRODUCTS.filter((p) => p.bestSeller).slice(0, 8);
  const newArrivals = PRODUCTS.filter((p) => p.newArrival).slice(0, 8);

  return (
    <SiteLayout>
      {/* Hero */}
      <section className="relative overflow-hidden bg-accent">
        <div className="container-px mx-auto grid max-w-7xl gap-12 py-16 md:grid-cols-2 md:items-center md:py-24 lg:py-32">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7 }}
          >
            <span className="text-xs uppercase tracking-[0.25em] text-[var(--gold)]">
              The Autumn Edit
            </span>
            <h1 className="mt-4 font-display text-5xl leading-[1.05] text-secondary md:text-6xl lg:text-7xl text-balance">
              Jewelry that moves <em className="text-[var(--gold)]">with you</em>.
            </h1>
            <p className="mt-6 max-w-md text-base text-muted-foreground">
              Modern, lightweight pieces designed for the everyday. Hypoallergenic,
              tarnish-resistant, and made to be layered, loved, and lived in.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link
                to="/shop"
                className="inline-flex items-center gap-2 rounded-sm bg-secondary px-6 py-3 text-xs font-medium uppercase tracking-wider text-secondary-foreground transition hover:bg-[var(--gold)] hover:text-secondary"
              >
                Shop the edit <FiArrowRight />
              </Link>
              <Link
                to="/shop"
                search={{ category: "necklaces" }}
                className="inline-flex items-center gap-2 rounded-sm border border-secondary/30 px-6 py-3 text-xs font-medium uppercase tracking-wider text-secondary transition hover:border-[var(--gold)] hover:text-[var(--gold)]"
              >
                New Necklaces
              </Link>
            </div>
            <div className="mt-10 flex items-center gap-6 text-xs text-muted-foreground">
              <div className="flex items-center gap-2">
                <RatingStars value={5} />
                <span>4.9 · 12,000+ reviews</span>
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.96 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8 }}
            className="relative aspect-[4/5] overflow-hidden rounded-md"
          >
            <img
              src={HERO}
              alt="Model wearing Lumière jewelry"
              className="h-full w-full object-cover"
            />
            <div className="absolute bottom-6 left-6 rounded-md bg-background/95 p-4 shadow-soft backdrop-blur">
              <p className="font-display text-lg text-secondary">From {formatPrice(29)}</p>
              <p className="text-xs text-muted-foreground">Free shipping over {formatPrice(75)}</p>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Trust strip */}
      <section className="border-y border-border bg-background">
        <div className="container-px mx-auto grid max-w-7xl gap-6 py-8 sm:grid-cols-2 md:grid-cols-4">
          {[
            { Icon: FiTruck, t: `Free shipping over ${formatPrice(75)}` },
            { Icon: FiRefreshCw, t: "30-day easy returns" },
            { Icon: FiShield, t: "2-year warranty" },
            { Icon: FiGift, t: "Complimentary gift wrap" },
          ].map(({ Icon, t }, i) => (
            <div key={i} className="flex items-center gap-3 text-sm text-foreground">
              <Icon className="text-[var(--gold)]" size={20} />
              <span>{t}</span>
            </div>
          ))}
        </div>
      </section>

      {/* Categories */}
      <section className="container-px mx-auto max-w-7xl py-20">
        <div className="mb-10 text-center">
          <span className="text-xs uppercase tracking-[0.25em] text-[var(--gold)]">Shop by</span>
          <h2 className="mt-2 font-display text-4xl text-secondary md:text-5xl">Categories</h2>
        </div>
        <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-6">
          {CATEGORIES.map((c) => (
            <Link
              key={c.id}
              to="/shop"
              search={{ category: c.id }}
              className="group block overflow-hidden rounded-md bg-accent"
            >
              <div className="aspect-square overflow-hidden">
                <img
                  src={c.image}
                  alt={c.label}
                  loading="lazy"
                  className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-110"
                />
              </div>
              <div className="p-3 text-center">
                <span className="text-sm font-medium text-secondary group-hover:text-[var(--gold)]">
                  {c.label}
                </span>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* Trending */}
      <Section
        title="Trending Now"
        subtitle="Pieces our community loves this month"
        products={trending}
        viewAllTo="/shop"
      />

      {/* Editorial banner */}
      <section className="container-px mx-auto my-20 max-w-7xl">
        <div className="relative grid overflow-hidden rounded-md bg-secondary text-secondary-foreground md:grid-cols-2">
          <div className="p-10 md:p-16">
            <span className="text-xs uppercase tracking-[0.25em] text-[var(--gold)]">
              Gift Edit
            </span>
            <h3 className="mt-3 font-display text-4xl md:text-5xl">
              For her, for him,
              <br />
              for forever.
            </h3>
            <p className="mt-4 max-w-md text-sm opacity-80">
              Thoughtfully curated gift sets, wrapped in our signature champagne-and-gold packaging.
            </p>
            <Link
              to="/shop"
              className="mt-8 inline-flex items-center gap-2 border-b border-[var(--gold)] pb-1 text-sm uppercase tracking-wider text-[var(--gold)]"
            >
              Explore gifts <FiArrowRight />
            </Link>
          </div>
          <div className="aspect-square md:aspect-auto">
            <img
              src="https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?w=1200&q=80"
              alt="Gift edit"
              loading="lazy"
              className="h-full w-full object-cover"
            />
          </div>
        </div>
      </section>

      <Section
        title="Best Sellers"
        subtitle="Tried, tested, treasured"
        products={bestSellers}
        viewAllTo="/shop"
      />
      <Section
        title="New Arrivals"
        subtitle="Fresh from the studio"
        products={newArrivals}
        viewAllTo="/shop"
      />

      {/* Reviews */}
      <section className="bg-accent py-20">
        <div className="container-px mx-auto max-w-7xl">
          <div className="mb-10 text-center">
            <span className="text-xs uppercase tracking-[0.25em] text-[var(--gold)]">
              Loved by you
            </span>
            <h2 className="mt-2 font-display text-4xl text-secondary md:text-5xl">
              From our community
            </h2>
          </div>
          <Swiper
            modules={[Autoplay, Pagination]}
            autoplay={{ delay: 4500 }}
            pagination={{ clickable: true }}
            spaceBetween={24}
            slidesPerView={1}
            breakpoints={{ 768: { slidesPerView: 2 }, 1024: { slidesPerView: 3 } }}
            className="pb-12"
          >
            {REVIEWS.map((r) => (
              <SwiperSlide key={r.id}>
                <div className="h-full rounded-md bg-background p-6 shadow-soft">
                  <RatingStars value={r.rating} />
                  <p className="mt-4 font-display text-lg leading-snug text-secondary">
                    "{r.text}"
                  </p>
                  <p className="mt-6 text-xs uppercase tracking-wider text-muted-foreground">
                    {r.name} · {r.location}
                  </p>
                </div>
              </SwiperSlide>
            ))}
          </Swiper>
        </div>
      </section>

      {/* Instagram */}
      <section className="container-px mx-auto max-w-7xl py-20">
        <div className="mb-8 text-center">
          <span className="text-xs uppercase tracking-[0.25em] text-[var(--gold)]">
            @lumiere.jewelry
          </span>
          <h2 className="mt-2 font-display text-3xl text-secondary md:text-4xl">
            As seen on Instagram
          </h2>
        </div>
        <div className="grid grid-cols-2 gap-2 md:grid-cols-6">
          {PRODUCTS.slice(0, 12).map((p) => (
            <a key={p.id} href="#" className="block aspect-square overflow-hidden">
              <img
                src={p.images[0]}
                alt=""
                loading="lazy"
                className="h-full w-full object-cover transition-transform duration-500 hover:scale-110"
              />
            </a>
          ))}
        </div>
      </section>
    </SiteLayout>
  );
}

function Section({
  title,
  subtitle,
  products,
  viewAllTo,
}: {
  title: string;
  subtitle: string;
  products: typeof PRODUCTS;
  viewAllTo: string;
}) {
  return (
    <section className="container-px mx-auto max-w-7xl py-16">
      <div className="mb-10 flex items-end justify-between gap-6">
        <div>
          <span className="text-xs uppercase tracking-[0.25em] text-[var(--gold)]">{subtitle}</span>
          <h2 className="mt-2 font-display text-4xl text-secondary md:text-5xl">{title}</h2>
        </div>
        <Link
          to={viewAllTo}
          className="hidden items-center gap-2 border-b border-secondary pb-1 text-xs uppercase tracking-wider text-secondary hover:border-[var(--gold)] hover:text-[var(--gold)] md:inline-flex"
        >
          View all <FiArrowRight />
        </Link>
      </div>
      <div className="grid grid-cols-2 gap-x-4 gap-y-10 sm:grid-cols-3 lg:grid-cols-4">
        {products.map((p) => (
          <ProductCard key={p.id} product={p} />
        ))}
      </div>
    </section>
  );
}
