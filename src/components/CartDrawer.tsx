import { Link } from "@tanstack/react-router";
import { FiTrash2, FiMinus, FiPlus, FiShoppingBag } from "react-icons/fi";
import { useCart } from "@/context/CartContext";
import { formatPrice } from "@/utils/format";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";

export function CartDrawer() {
  const { items, subtotal, setQty, remove, drawerOpen, setDrawerOpen } = useCart();

  return (
    <Sheet open={drawerOpen} onOpenChange={setDrawerOpen}>
      <SheetContent className="flex h-full w-full flex-col sm:max-w-md bg-background border-l border-border p-6 shadow-2xl">
        <SheetHeader className="border-b border-border pb-4">
          <SheetTitle className="flex items-center gap-2 font-display text-xl text-secondary">
            <FiShoppingBag className="text-[var(--gold)]" /> Your Cart
          </SheetTitle>
        </SheetHeader>

        {items.length === 0 ? (
          <div className="flex flex-1 flex-col items-center justify-center py-12 text-center">
            <div className="rounded-full bg-accent p-4 text-muted-foreground mb-4">
              <FiShoppingBag size={24} />
            </div>
            <p className="text-sm font-medium text-foreground">Your cart is empty</p>
            <p className="text-xs text-muted-foreground mt-1">
              Add beautiful fine jewelry pieces to get started.
            </p>
            <button
              onClick={() => setDrawerOpen(false)}
              className="mt-6 rounded-sm bg-secondary px-6 py-2.5 text-xs font-medium uppercase tracking-wider text-secondary-foreground hover:bg-[var(--gold)] hover:text-secondary transition"
            >
              Continue Shopping
            </button>
          </div>
        ) : (
          <>
            {/* Items list */}
            <div className="flex-1 overflow-y-auto py-4 space-y-4 pr-1 scrollbar-thin">
              {items.map((item) => (
                <div key={item.id} className="flex gap-4 border-b border-border/40 pb-4">
                  <div className="h-20 w-20 shrink-0 overflow-hidden rounded bg-accent">
                    <img src={item.image} alt={item.name} className="h-full w-full object-cover" />
                  </div>
                  <div className="flex flex-1 flex-col justify-between">
                    <div>
                      <div className="flex justify-between gap-2">
                        <Link
                          to="/product/$id"
                          params={{ id: item.id }}
                          onClick={() => setDrawerOpen(false)}
                          className="text-sm font-medium hover:text-[var(--gold)] transition line-clamp-1"
                        >
                          {item.name}
                        </Link>
                        <span className="text-sm font-medium whitespace-nowrap">
                          {formatPrice(item.price * item.quantity)}
                        </span>
                      </div>
                      <p className="text-xs text-muted-foreground mt-0.5">
                        {formatPrice(item.price)} each
                      </p>
                    </div>

                    <div className="flex items-center justify-between mt-2">
                      <div className="flex items-center rounded border border-border">
                        <button
                          onClick={() => setQty(item.id, item.quantity - 1)}
                          className="p-1.5 hover:bg-accent text-muted-foreground transition"
                          aria-label="Decrease quantity"
                        >
                          <FiMinus size={12} />
                        </button>
                        <span className="w-8 text-center text-xs font-medium">{item.quantity}</span>
                        <button
                          onClick={() => setQty(item.id, item.quantity + 1)}
                          className="p-1.5 hover:bg-accent text-muted-foreground transition"
                          aria-label="Increase quantity"
                        >
                          <FiPlus size={12} />
                        </button>
                      </div>
                      <button
                        onClick={() => remove(item.id)}
                        className="text-muted-foreground hover:text-destructive p-1 transition"
                        aria-label="Remove item"
                      >
                        <FiTrash2 size={14} />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Footer Summary */}
            <div className="border-t border-border pt-4 bg-background">
              <div className="flex justify-between text-base font-medium mb-4">
                <span>Subtotal</span>
                <span>{formatPrice(subtotal)}</span>
              </div>
              <p className="text-xs text-muted-foreground mb-4">
                Taxes and shipping calculated at checkout. Free shipping over {formatPrice(75)}!
              </p>

              <div className="grid gap-2">
                <Link
                  to="/checkout"
                  onClick={() => setDrawerOpen(false)}
                  className="flex w-full items-center justify-center rounded-sm bg-secondary py-3 text-xs font-medium uppercase tracking-wider text-secondary-foreground hover:bg-[var(--gold)] hover:text-secondary transition"
                >
                  Proceed to Checkout
                </Link>
                <Link
                  to="/cart"
                  onClick={() => setDrawerOpen(false)}
                  className="flex w-full items-center justify-center rounded-sm border border-secondary/20 py-3 text-xs font-medium uppercase tracking-wider text-secondary hover:bg-accent transition"
                >
                  View Shopping Bag
                </Link>
              </div>
            </div>
          </>
        )}
      </SheetContent>
    </Sheet>
  );
}
