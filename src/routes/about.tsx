import { createFileRoute } from "@tanstack/react-router";
import { SiteLayout } from "@/layouts/SiteLayout";

export const Route = createFileRoute("/about")({
  head: () => ({
    meta: [
      { title: "About — Lumière Jewelry" },
      { name: "description", content: "Our story: modern, ethical, everyday fine jewelry." },
    ],
  }),
  component: AboutPage,
});

function AboutPage() {
  return (
    <SiteLayout>
      <section className="relative overflow-hidden bg-accent">
        <div className="container-px mx-auto max-w-4xl py-20 text-center">
          <span className="text-xs uppercase tracking-[0.25em] text-[var(--gold)]">Our story</span>
          <h1 className="mt-3 font-display text-5xl text-secondary md:text-6xl text-balance">
            Jewelry should feel like you, only a little more golden.
          </h1>
          <p className="mt-6 text-base text-muted-foreground">
            Lumière was founded on a simple belief: meaningful jewelry shouldn't be reserved for
            special occasions. We design pieces that move from your morning coffee to your evening
            out — built to last, priced to wear, made with care.
          </p>
        </div>
      </section>

      <section className="container-px mx-auto grid max-w-7xl gap-12 py-20 md:grid-cols-3">
        {[
          {
            t: "Ethical",
            d: "Recycled metals, responsibly sourced stones, and partner workshops we visit ourselves.",
          },
          {
            t: "Lasting",
            d: "Hypoallergenic, tarnish-resistant, and built to be worn every day — water, sweat, life.",
          },
          {
            t: "Honest pricing",
            d: "We design and sell direct, so you pay for craft — not markups.",
          },
        ].map((b) => (
          <div key={b.t}>
            <h3 className="font-display text-3xl text-secondary">{b.t}</h3>
            <p className="mt-3 text-sm text-muted-foreground">{b.d}</p>
          </div>
        ))}
      </section>

      <section className="container-px mx-auto max-w-7xl pb-20">
        <div className="aspect-[16/7] overflow-hidden rounded-md">
          <img
            src="https://images.unsplash.com/photo-1611591437281-460bfbe1220a?w=1600&q=80"
            alt="Lumière workshop"
            className="h-full w-full object-cover"
          />
        </div>
      </section>
    </SiteLayout>
  );
}
