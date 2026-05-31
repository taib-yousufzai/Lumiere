import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect } from "react";
import { SiteLayout } from "@/layouts/SiteLayout";
import { useCart } from "@/context/CartContext";
import { useAuth } from "@/context/AuthContext";
import { formatPrice } from "@/utils/format";
import { toast } from "sonner";

export const Route = createFileRoute("/checkout")({
  head: () => ({ meta: [{ title: "Redirecting... — Solara" }] }),
  component: CheckoutPage,
});

function CheckoutPage() {
  const { items, subtotal, clear } = useCart();
  const { addOrder, user } = useAuth();
  const navigate = useNavigate();

  const shipping = subtotal > 75 || subtotal === 0 ? 0 : 8;
  const tax = subtotal * 0.05;
  const total = subtotal + shipping + tax;

  useEffect(() => {
    if (items.length === 0) {
      navigate({ to: "/" });
      return;
    }

    const orderId = "SOL-" + Math.random().toString(36).slice(2, 8).toUpperCase();

    // Save order to history
    addOrder({
      id: orderId,
      date: new Date().toISOString(),
      total,
      items: items.map((i) => ({
        name: i.name,
        quantity: i.quantity,
        price: i.price,
        image: i.image,
      })),
      status: "Processing",
    });

    // Construct WhatsApp details
    const itemsText = items
      .map((i) => `- ${i.quantity}x ${i.name} (${formatPrice(i.price * i.quantity)})`)
      .join("\n");
    
    const importData = items.map((i) => ({ id: i.id, q: i.quantity }));
    const importUrl = `${window.location.origin}/?import_order=${encodeURIComponent(JSON.stringify(importData))}`;
    
    const message = `Hello Solara India, I would like to place an order!\n\n` +
      `*Order ID:* ${orderId}\n` +
      `*Total:* ${formatPrice(total)}\n\n` +
      `*Items:*\n${itemsText}\n\n` +
      `*View Order Link:*\n${importUrl}`;

    const whatsappUrl = `https://wa.me/917710714508?text=${encodeURIComponent(message)}`;

    // Clear cart
    clear();
    toast.success("Redirecting to WhatsApp to complete your order...");
    
    // Redirect
    window.location.href = whatsappUrl;
  }, [items, total, addOrder, clear, navigate]);

  return (
    <SiteLayout>
      <div className="container-px mx-auto max-w-3xl py-32 text-center">
        <h1 className="font-display text-3xl text-secondary">Redirecting to WhatsApp...</h1>
        <p className="mt-3 text-muted-foreground">Please wait while we prepare your order details.</p>
        <div className="mt-8 flex justify-center">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-[var(--gold)] border-t-transparent"></div>
        </div>
      </div>
    </SiteLayout>
  );
}
