import { Link } from "@tanstack/react-router";
import { FiInstagram, FiFacebook, FiTwitter, FiYoutube } from "react-icons/fi";
import { toast } from "sonner";

export function Footer() {
  const subscribe = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    toast.success("Subscribed to our newsletter");
    e.currentTarget.reset();
  };

  return (
    <footer className="mt-24 border-t border-border bg-accent">
      <div className="container-px mx-auto max-w-7xl py-16">
        <div className="grid gap-12 md:grid-cols-2 lg:grid-cols-4">
          <div>
            <Link to="/" className="font-display text-2xl font-semibold text-secondary">
              Solara<span className="text-[var(--gold)]">.</span>
            </Link>
            <p className="mt-4 max-w-xs text-sm text-muted-foreground">
              Modern, everyday fine jewelry. Designed to be worn, loved, and layered.
            </p>
            <div className="mt-6 flex gap-3 text-secondary">
              <a href="#" aria-label="Instagram" className="hover:text-[var(--gold)]">
                <FiInstagram />
              </a>
              <a href="#" aria-label="Facebook" className="hover:text-[var(--gold)]">
                <FiFacebook />
              </a>
              <a href="#" aria-label="Twitter" className="hover:text-[var(--gold)]">
                <FiTwitter />
              </a>
              <a href="#" aria-label="YouTube" className="hover:text-[var(--gold)]">
                <FiYoutube />
              </a>
            </div>
            <div className="mt-6 space-y-2 border-t border-border pt-6 text-xs text-muted-foreground">
              <p><span className="font-medium text-secondary">Company Name:</span> solara India</p>
              <p><span className="font-medium text-secondary">GST:</span> 09ABRCS5093E1ZS</p>
              <p>
                <span className="font-medium text-secondary">Address:</span><br />
                C-25 sector-8 noida<br />
                Gautam Buddha Nagar<br />
                Uttar Pradesh<br />
                Noida-20130
              </p>
              <p><span className="font-medium text-secondary">Mobile Number:</span> +91 77107 14508</p>
            </div>
          </div>

          <div>
            <h4 className="font-display text-base text-secondary">Shop</h4>
            <ul className="mt-4 space-y-2 text-sm text-muted-foreground">
              <li>
                <Link
                  to="/shop"
                  search={{ category: "rings" }}
                  className="hover:text-[var(--gold)]"
                >
                  Rings
                </Link>
              </li>
              <li>
                <Link
                  to="/shop"
                  search={{ category: "necklaces" }}
                  className="hover:text-[var(--gold)]"
                >
                  Necklaces
                </Link>
              </li>
              <li>
                <Link
                  to="/shop"
                  search={{ category: "earrings" }}
                  className="hover:text-[var(--gold)]"
                >
                  Earrings
                </Link>
              </li>
              <li>
                <Link
                  to="/shop"
                  search={{ category: "bracelets" }}
                  className="hover:text-[var(--gold)]"
                >
                  Bracelets
                </Link>
              </li>
              <li>
                <Link to="/shop" search={{ category: "mens" }} className="hover:text-[var(--gold)]">
                  Men's
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="font-display text-base text-secondary">Support</h4>
            <ul className="mt-4 space-y-2 text-sm text-muted-foreground">
              <li>
                <Link to="/contact" className="hover:text-[var(--gold)]">
                  Contact
                </Link>
              </li>
              <li>
                <a href="#" className="hover:text-[var(--gold)]">
                  Shipping & Returns
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-[var(--gold)]">
                  Care Guide
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-[var(--gold)]">
                  Size Guide
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-[var(--gold)]">
                  FAQs
                </a>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="font-display text-base text-secondary">Stay in the loop</h4>
            <p className="mt-4 text-sm text-muted-foreground">
              New arrivals, private sales, and 10% off your first order.
            </p>
            <form onSubmit={subscribe} className="mt-4 flex">
              <input
                type="email"
                required
                placeholder="Your email"
                className="h-11 flex-1 rounded-l-sm border border-border bg-background px-3 text-sm outline-none focus:border-[var(--gold)]"
              />
              <button
                type="submit"
                className="h-11 rounded-r-sm bg-secondary px-4 text-xs font-medium uppercase tracking-wider text-secondary-foreground hover:bg-[var(--gold)] hover:text-secondary"
              >
                Subscribe
              </button>
            </form>
          </div>
        </div>

        <div className="mt-12 flex flex-col items-center justify-between gap-4 border-t border-border pt-6 text-xs text-muted-foreground md:flex-row">
          <p>© {new Date().getFullYear()} Solara India. All rights reserved.</p>
          <p>Crafted with care · Hypoallergenic · Tarnish resistant</p>
        </div>
      </div>
    </footer>
  );
}
