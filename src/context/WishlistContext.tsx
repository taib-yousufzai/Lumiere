import { createContext, useContext, useEffect, useState, type ReactNode } from "react";
import { toast } from "sonner";

interface WishCtx {
  ids: string[];
  toggle: (id: string) => void;
  has: (id: string) => boolean;
  remove: (id: string) => void;
  clear: () => void;
}

const Ctx = createContext<WishCtx | null>(null);
const KEY = "lj_wish_v1";

export function WishlistProvider({ children }: { children: ReactNode }) {
  const [ids, setIds] = useState<string[]>([]);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(KEY);
      if (raw) setIds(JSON.parse(raw));
    } catch {
      // Ignore errors reading from localStorage during SSR or invalid JSON
    }
  }, []);

  useEffect(() => {
    localStorage.setItem(KEY, JSON.stringify(ids));
  }, [ids]);

  const toggle = (id: string) => {
    setIds((prev) => {
      if (prev.includes(id)) {
        toast("Removed from wishlist");
        return prev.filter((x) => x !== id);
      }
      toast.success("Added to wishlist");
      return [...prev, id];
    });
  };

  const remove = (id: string) => setIds((prev) => prev.filter((x) => x !== id));
  const has = (id: string) => ids.includes(id);
  const clear = () => setIds([]);

  return <Ctx.Provider value={{ ids, toggle, has, remove, clear }}>{children}</Ctx.Provider>;
}

export function useWishlist() {
  const v = useContext(Ctx);
  if (!v) throw new Error("useWishlist must be used inside WishlistProvider");
  return v;
}
