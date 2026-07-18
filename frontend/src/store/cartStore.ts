// ============================================
// BookStore — Cart Store (Zustand)
// ============================================

import { create } from "zustand";
import type { Book, CartItem } from "@/types";

interface CartState {
  items: CartItem[];
  isOpen: boolean;
  addItem: (book: Book) => void;
  removeItem: (bookId: number) => void;
  updateQuantity: (bookId: number, quantity: number) => void;
  clearCart: () => void;
  toggleCart: () => void;
  openCart: () => void;
  closeCart: () => void;
  totalItems: () => number;
  totalPrice: () => number;
  hydrate: () => void;
}

export const useCartStore = create<CartState>((set, get) => ({
  items: [],
  isOpen: false,

  addItem: (book) => {
    const { items } = get();
    const existing = items.find((item) => item.book.id === book.id);

    let newItems: CartItem[];
    if (existing) {
      newItems = items.map((item) =>
        item.book.id === book.id
          ? { ...item, quantity: item.quantity + 1 }
          : item
      );
    } else {
      newItems = [...items, { book, quantity: 1 }];
    }

    set({ items: newItems });
    persistCart(newItems);
  },

  removeItem: (bookId) => {
    const newItems = get().items.filter((item) => item.book.id !== bookId);
    set({ items: newItems });
    persistCart(newItems);
  },

  updateQuantity: (bookId, quantity) => {
    if (quantity <= 0) {
      get().removeItem(bookId);
      return;
    }
    const newItems = get().items.map((item) =>
      item.book.id === bookId ? { ...item, quantity } : item
    );
    set({ items: newItems });
    persistCart(newItems);
  },

  clearCart: () => {
    set({ items: [] });
    persistCart([]);
  },

  toggleCart: () => set((state) => ({ isOpen: !state.isOpen })),
  openCart: () => set({ isOpen: true }),
  closeCart: () => set({ isOpen: false }),

  totalItems: () =>
    get().items.reduce((sum, item) => sum + item.quantity, 0),

  totalPrice: () =>
    get().items.reduce(
      (sum, item) => sum + parseFloat(item.book.price) * item.quantity,
      0
    ),

  hydrate: () => {
    if (typeof window === "undefined") return;
    const stored = localStorage.getItem("cart");
    if (stored) {
      try {
        const items = JSON.parse(stored) as CartItem[];
        set({ items });
      } catch {
        set({ items: [] });
      }
    }
  },
}));

function persistCart(items: CartItem[]) {
  if (typeof window !== "undefined") {
    localStorage.setItem("cart", JSON.stringify(items));
  }
}
