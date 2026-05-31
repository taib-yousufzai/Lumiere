import { createContext, useContext, useEffect, useState, type ReactNode } from "react";
import { toast } from "sonner";

export interface User {
  id: string;
  name: string;
  email: string;
}

export interface Order {
  id: string;
  date: string;
  total: number;
  items: { name: string; quantity: number; price: number; image: string }[];
  status: "Processing" | "Shipped" | "Delivered";
}

interface AuthCtx {
  user: User | null;
  orders: Order[];
  login: (email: string, password: string) => boolean;
  register: (name: string, email: string, password: string) => boolean;
  logout: () => void;
  updateProfile: (patch: Partial<User>) => void;
  addOrder: (o: Order) => void;
}

const Ctx = createContext<AuthCtx | null>(null);
const USERS = "lj_users_v1";
const SESSION = "lj_session_v1";
const ORDERS = "lj_orders_v1";

type StoredUser = User & { password: string };

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [orders, setOrders] = useState<Order[]>([]);

  useEffect(() => {
    try {
      const s = localStorage.getItem(SESSION);
      if (s) setUser(JSON.parse(s));
      const o = localStorage.getItem(ORDERS);
      if (o) setOrders(JSON.parse(o));
    } catch {
      // Ignore errors reading from localStorage during SSR or invalid JSON
    }
  }, []);

  useEffect(() => {
    if (user) localStorage.setItem(SESSION, JSON.stringify(user));
    else localStorage.removeItem(SESSION);
  }, [user]);

  useEffect(() => {
    localStorage.setItem(ORDERS, JSON.stringify(orders));
  }, [orders]);

  const readUsers = (): StoredUser[] => {
    try {
      return JSON.parse(localStorage.getItem(USERS) || "[]");
    } catch {
      return [];
    }
  };
  const writeUsers = (u: StoredUser[]) => localStorage.setItem(USERS, JSON.stringify(u));

  const login: AuthCtx["login"] = (email, password) => {
    const found = readUsers().find((u) => u.email === email && u.password === password);
    if (!found) {
      toast.error("Invalid email or password");
      return false;
    }
    const { password: _p, ...safe } = found;
    setUser(safe);
    toast.success(`Welcome back, ${safe.name}`);
    return true;
  };

  const register: AuthCtx["register"] = (name, email, password) => {
    const users = readUsers();
    if (users.some((u) => u.email === email)) {
      toast.error("An account with that email already exists");
      return false;
    }
    const newUser: StoredUser = { id: crypto.randomUUID(), name, email, password };
    writeUsers([...users, newUser]);
    const { password: _p, ...safe } = newUser;
    setUser(safe);
    toast.success("Account created");
    return true;
  };

  const logout = () => {
    setUser(null);
    toast("Signed out");
  };

  const updateProfile: AuthCtx["updateProfile"] = (patch) => {
    if (!user) return;
    const next = { ...user, ...patch };
    setUser(next);
    const users = readUsers().map((u) => (u.id === user.id ? { ...u, ...patch } : u));
    writeUsers(users);
    toast.success("Profile updated");
  };

  const addOrder = (o: Order) => setOrders((prev) => [o, ...prev]);

  return (
    <Ctx.Provider value={{ user, orders, login, register, logout, updateProfile, addOrder }}>
      {children}
    </Ctx.Provider>
  );
}

export function useAuth() {
  const v = useContext(Ctx);
  if (!v) throw new Error("useAuth must be used inside AuthProvider");
  return v;
}
