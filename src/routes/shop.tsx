import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { FiFilter, FiX } from "react-icons/fi";
import { z } from "zod";

import { SiteLayout } from "@/layouts/SiteLayout";
import { ProductGrid } from "@/components/ProductGrid";
import { CATEGORIES, PRODUCTS, type Category } from "@/data/products";
import { formatPrice } from "@/utils/format";

const searchSchema = z.object({
  category: z.enum(["rings", "necklaces", "earrings", "bracelets", "anklets", "mens"]).optional(),
  q: z.string().optional(),
  sort: z.enum(["newest", "popular", "price-asc", "price-desc"]).optional(),
  max: z.number().optional(),
});

export const Route = createFileRoute("/shop")({
  validateSearch: searchSchema,
  head: () => ({
    meta: [
      { title: "Shop — Lumière Jewelry" },
      { name: "description", content: "Browse our full collection of modern fine jewelry." },
    ],
  }),
  component: ShopPage,
});

function ShopPage() {
  const { category, q, sort, max } = Route.useSearch();
  const navigate = useNavigate({ from: "/shop" });
  const [mobileFilters, setMobileFilters] = useState(false);

  const maxPrice = max ?? 250;
  const sortVal = sort ?? "newest";

  const filtered = useMemo(() => {
    let list = [...PRODUCTS];
    if (category) list = list.filter((p) => p.category === category);
    if (q) {
      const t = q.toLowerCase();
      list = list.filter(
        (p) => p.name.toLowerCase().includes(t) || p.description.toLowerCase().includes(t),
      );
    }
    list = list.filter((p) => (p.discountPrice ?? p.price) <= maxPrice);
    switch (sortVal) {
      case "popular":
        list.sort((a, b) => b.reviewCount - a.reviewCount);
        break;
      case "price-asc":
        list.sort((a, b) => (a.discountPrice ?? a.price) - (b.discountPrice ?? b.price));
        break;
      case "price-desc":
        list.sort((a, b) => (b.discountPrice ?? b.price) - (a.discountPrice ?? a.price));
        break;
      default:
        list.sort((a, b) => +new Date(b.createdAt) - +new Date(a.createdAt));
    }
    return list;
  }, [category, q, sortVal, maxPrice]);

  const setSearch = (patch: Partial<z.infer<typeof searchSchema>>) =>
    navigate({ search: (prev: z.infer<typeof searchSchema>) => ({ ...prev, ...patch }) });

  const Filters = (
    <div className="space-y-8">
      <div>
        <h3 className="mb-3 text-xs font-semibold uppercase tracking-wider text-secondary">
          Category
        </h3>
        <div className="space-y-1.5">
          <button
            onClick={() => setSearch({ category: undefined })}
            className={`block w-full text-left text-sm transition ${!category ? "text-[var(--gold)]" : "text-foreground hover:text-[var(--gold)]"}`}
          >
            All Jewelry
          </button>
          {CATEGORIES.map((c) => (
            <button
              key={c.id}
              onClick={() => setSearch({ category: c.id })}
              className={`block w-full text-left text-sm transition ${
                category === c.id
                  ? "text-[var(--gold)]"
                  : "text-foreground hover:text-[var(--gold)]"
              }`}
            >
              {c.label}
            </button>
          ))}
        </div>
      </div>

      <div>
        <h3 className="mb-3 text-xs font-semibold uppercase tracking-wider text-secondary">
          Max price
        </h3>
        <input
          type="range"
          min={25}
          max={250}
          step={5}
          value={maxPrice}
          onChange={(e) => setSearch({ max: Number(e.target.value) })}
          className="w-full accent-[var(--gold)]"
        />
        <div className="mt-2 flex justify-between text-xs text-muted-foreground">
          <span>{formatPrice(25)}</span>
          <span className="font-medium text-foreground">{formatPrice(maxPrice)}</span>
        </div>
      </div>

      {(category || q || max) && (
        <button
          onClick={() => navigate({ search: {} })}
          className="text-xs uppercase tracking-wider text-muted-foreground hover:text-foreground"
        >
          Clear all filters
        </button>
      )}
    </div>
  );

  return (
    <SiteLayout>
      <div className="border-b border-border bg-accent">
        <div className="container-px mx-auto max-w-7xl py-12">
          <h1 className="font-display text-4xl text-secondary md:text-5xl">
            {category ? CATEGORIES.find((c) => c.id === category)?.label : "All Jewelry"}
          </h1>
          {q && (
            <p className="mt-2 text-sm text-muted-foreground">
              Results for "<span className="text-foreground">{q}</span>"
            </p>
          )}
          <p className="mt-2 text-sm text-muted-foreground">{filtered.length} pieces</p>
        </div>
      </div>

      <div className="container-px mx-auto max-w-7xl py-10">
        <div className="grid gap-10 lg:grid-cols-[220px_1fr]">
          <aside className="hidden lg:block">{Filters}</aside>

          <div>
            <div className="mb-6 flex items-center justify-between gap-3">
              <button
                onClick={() => setMobileFilters(true)}
                className="inline-flex items-center gap-2 rounded-sm border border-border px-3 py-2 text-xs uppercase tracking-wider lg:hidden"
              >
                <FiFilter /> Filters
              </button>
              <select
                value={sortVal}
                onChange={(e) =>
                  setSearch({
                    sort: e.target.value as "newest" | "popular" | "price-asc" | "price-desc",
                  })
                }
                className="rounded-sm border border-border bg-background px-3 py-2 text-sm outline-none focus:border-[var(--gold)]"
              >
                <option value="newest">Newest</option>
                <option value="popular">Popularity</option>
                <option value="price-asc">Price: Low to High</option>
                <option value="price-desc">Price: High to Low</option>
              </select>
            </div>

            <ProductGrid products={filtered} />
          </div>
        </div>
      </div>

      {mobileFilters && (
        <>
          <div
            onClick={() => setMobileFilters(false)}
            className="fixed inset-0 z-50 bg-secondary/60 backdrop-blur-sm lg:hidden"
          />
          <aside className="fixed inset-y-0 right-0 z-50 w-80 max-w-[85%] overflow-y-auto bg-background p-6 lg:hidden">
            <div className="mb-6 flex items-center justify-between">
              <span className="font-display text-xl">Filters</span>
              <button onClick={() => setMobileFilters(false)} aria-label="Close">
                <FiX />
              </button>
            </div>
            {Filters}
          </aside>
        </>
      )}
    </SiteLayout>
  );
}
