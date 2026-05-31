export type Category = "rings" | "necklaces" | "earrings" | "bracelets" | "anklets" | "mens";

export interface Product {
  id: string;
  name: string;
  category: Category;
  description: string;
  price: number;
  discountPrice?: number;
  rating: number;
  reviewCount: number;
  stock: number;
  images: string[];
  featured: boolean;
  bestSeller: boolean;
  newArrival: boolean;
  material: string;
  weight: string;
  care: string;
  createdAt: string;
}

// Unsplash jewelry image pool (lifestyle + product). Reused/rotated per product.
const IMG = [
  "/images/ring_gold.png",
  "/images/necklace_gold.png",
  "/images/earrings_pearl.png",
  "/images/bracelet_diamond.png",
  "https://images.unsplash.com/photo-1599643477877-530eb83abc8e?w=900&q=80",
  "https://images.unsplash.com/photo-1605100804763-247f67b3557e?w=900&q=80",
  "https://images.unsplash.com/photo-1611591437281-460bfbe1220a?w=900&q=80",
  "https://images.unsplash.com/photo-1535632787350-4e68ef0ac584?w=900&q=80",
  "https://images.unsplash.com/photo-1602173574767-37ac01994b2a?w=900&q=80",
  "https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?w=900&q=80",
  "https://images.unsplash.com/photo-1573408301185-9146fe634ad0?w=900&q=80",
  "https://images.unsplash.com/photo-1620656798932-902f3f3683b1?w=900&q=80",
  "https://images.unsplash.com/photo-1561591128-8b4ee99e8af3?w=900&q=80",
  "https://images.unsplash.com/photo-1611652022419-a9419f74343d?w=900&q=80",
  "https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?w=900&q=80",
  "https://images.unsplash.com/photo-1617038220319-276d3cfab638?w=900&q=80",
  "https://images.unsplash.com/photo-1588444837495-c6cfeb53f32d?w=900&q=80",
  "https://images.unsplash.com/photo-1612863730159-c3c8b1eedf72?w=900&q=80",
  "https://images.unsplash.com/photo-1506630448388-4e683c67ddb0?w=900&q=80",
  "https://images.unsplash.com/photo-1531995811006-35cb42e1a022?w=900&q=80",
];

const CATEGORY_META: Record<Category, { label: string; names: string[]; materials: string[] }> = {
  rings: {
    label: "Rings",
    names: [
      "Solitaire",
      "Halo",
      "Eternity",
      "Stacking",
      "Signet",
      "Vintage",
      "Twist",
      "Pavé",
      "Bezel",
      "Cluster",
    ],
    materials: ["14K Gold Vermeil", "Sterling Silver 925", "Rose Gold Plated", "Solid 10K Gold"],
  },
  necklaces: {
    label: "Necklaces",
    names: [
      "Pendant",
      "Choker",
      "Layered",
      "Lariat",
      "Heart",
      "Initial",
      "Bar",
      "Coin",
      "Pearl",
      "Chain",
    ],
    materials: ["Sterling Silver 925", "14K Gold Plated", "Stainless Steel", "Brass with Gold"],
  },
  earrings: {
    label: "Earrings",
    names: [
      "Studs",
      "Hoops",
      "Drops",
      "Huggies",
      "Threaders",
      "Climbers",
      "Chandelier",
      "Ear Cuff",
      "Tassel",
      "Mini Hoops",
    ],
    materials: ["14K Gold Vermeil", "Sterling Silver 925", "Hypoallergenic Steel"],
  },
  bracelets: {
    label: "Bracelets",
    names: [
      "Tennis",
      "Cuff",
      "Bangle",
      "Charm",
      "Chain Link",
      "Beaded",
      "Pearl",
      "Stacking",
      "Friendship",
      "Slider",
    ],
    materials: ["Sterling Silver 925", "14K Gold Plated", "Stainless Steel"],
  },
  anklets: {
    label: "Anklets",
    names: [
      "Beaded",
      "Chain",
      "Charm",
      "Layered",
      "Pearl",
      "Heart",
      "Star",
      "Shell",
      "Crystal",
      "Coin",
    ],
    materials: ["Sterling Silver 925", "14K Gold Plated", "Brass"],
  },
  mens: {
    label: "Men's Jewelry",
    names: [
      "Signet Ring",
      "Cuban Chain",
      "Leather Bracelet",
      "Pendant",
      "Dog Tag",
      "Beaded Bracelet",
      "ID Bracelet",
      "Cross Pendant",
      "Bar Necklace",
      "Band Ring",
    ],
    materials: ["Stainless Steel", "Sterling Silver 925", "Black Titanium", "Leather & Steel"],
  },
};

const CARE =
  "Avoid contact with perfume, lotion, and water. Store in a dry pouch. Polish gently with a soft cloth.";

function seedRand(seed: number) {
  let s = seed;
  return () => {
    s = (s * 9301 + 49297) % 233280;
    return s / 233280;
  };
}

function makeProducts(): Product[] {
  const cats: Category[] = ["rings", "necklaces", "earrings", "bracelets", "anklets", "mens"];
  const out: Product[] = [];
  let id = 1;
  cats.forEach((cat, ci) => {
    const meta = CATEGORY_META[cat];
    const count = cat === "mens" || cat === "anklets" ? 14 : 18;
    for (let i = 0; i < count; i++) {
      const r = seedRand(id * 7 + ci);
      const baseName = meta.names[i % meta.names.length];
      const variants = ["Gold", "Silver", "Rose", "Pearl", "Crystal", "Classic", "Mini", "Bold"];
      const variant = variants[Math.floor(r() * variants.length)];
      const price = Math.round((25 + r() * 175) * 100) / 100;
      const hasDiscount = r() > 0.55;
      const discount = hasDiscount ? Math.round(price * (0.7 + r() * 0.2) * 100) / 100 : undefined;
      const imgStart = Math.floor(r() * IMG.length);
      const images = [
        IMG[imgStart % IMG.length],
        IMG[(imgStart + 3) % IMG.length],
        IMG[(imgStart + 6) % IMG.length],
        IMG[(imgStart + 9) % IMG.length],
      ];
      out.push({
        id: String(id),
        name: `${variant} ${baseName} ${meta.label.replace(/s$/, "")}`.trim(),
        category: cat,
        description: `An elegant ${baseName.toLowerCase()} ${meta.label.toLowerCase().replace(/s$/, "")} crafted with care. Hypoallergenic, tarnish-resistant, and made to be worn every day.`,
        price,
        discountPrice: discount,
        rating: Math.round((3.8 + r() * 1.2) * 10) / 10,
        reviewCount: Math.floor(12 + r() * 380),
        stock: Math.floor(3 + r() * 40),
        images,
        featured: r() > 0.75,
        bestSeller: r() > 0.7,
        newArrival: r() > 0.7,
        material: meta.materials[Math.floor(r() * meta.materials.length)],
        weight: `${(1.5 + r() * 8).toFixed(1)}g`,
        care: CARE,
        createdAt: new Date(Date.now() - Math.floor(r() * 90) * 86400000).toISOString(),
      });
      id++;
    }
  });
  return out;
}

export const PRODUCTS: Product[] = makeProducts();

export const CATEGORIES: { id: Category; label: string; image: string }[] = [
  { id: "rings", label: "Rings", image: IMG[2] },
  { id: "necklaces", label: "Necklaces", image: IMG[0] },
  { id: "earrings", label: "Earrings", image: IMG[5] },
  { id: "bracelets", label: "Bracelets", image: IMG[7] },
  { id: "anklets", label: "Anklets", image: IMG[9] },
  { id: "mens", label: "Men's", image: IMG[11] },
];

export const REVIEWS = [
  {
    id: 1,
    name: "Aanya S.",
    rating: 5,
    text: "Absolutely stunning quality for the price. I get compliments every time I wear it.",
    location: "Mumbai",
  },
  {
    id: 2,
    name: "Priya K.",
    rating: 5,
    text: "The packaging felt like a gift to myself. Pieces are dainty and so well made.",
    location: "Delhi",
  },
  {
    id: 3,
    name: "Sara L.",
    rating: 4,
    text: "Lovely, lightweight, and doesn't tarnish. My new everyday go-to.",
    location: "Bengaluru",
  },
  {
    id: 4,
    name: "Meera R.",
    rating: 5,
    text: "Bought 3 pieces, all gorgeous. Customer service was lovely too.",
    location: "Pune",
  },
  {
    id: 5,
    name: "Tara V.",
    rating: 5,
    text: "Perfect for layering. Looks far more expensive than it is.",
    location: "Hyderabad",
  },
];

export function getProduct(id: string) {
  return PRODUCTS.find((p) => p.id === id);
}

export function getRelated(id: string, limit = 4) {
  const p = getProduct(id);
  if (!p) return [];
  return PRODUCTS.filter((x) => x.category === p.category && x.id !== id).slice(0, limit);
}
