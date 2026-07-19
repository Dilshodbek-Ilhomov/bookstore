// ============================================
// BookStore — Constants & Configuration
// ============================================

export const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL ||
  (process.env.NODE_ENV === "development"
    ? "http://127.0.0.1:8000/api"
    : "https://api.book-store.uz/api");

export const SITE_NAME = "BookStore";
export const SITE_TAGLINE = "Read More, Grow More";
export const SITE_DESCRIPTION =
  "O'zbekistonning eng yaxshi onlayn kitob do'koni. Minglab kitoblarni kashf eting, o'qing va o'sing.";

export const NAV_LINKS = [
  { label: "Bosh sahifa", href: "/" },
  { label: "Kitoblar", href: "/books" },
  { label: "Kategoriyalar", href: "/books?view=categories" },
  { label: "Biz haqimizda", href: "#about" },
] as const;

// Design tokens
export const COLORS = {
  gold: {
    DEFAULT: "#c9a84c",
    light: "#e2c97e",
    muted: "#8b7635",
    dark: "#7a6530",
  },
  navy: {
    DEFAULT: "#0a0e17",
    light: "#111827",
    surface: "#1a2236",
    border: "#1e293b",
  },
  text: {
    primary: "#f0ede6",
    secondary: "#8b95a8",
    muted: "#5a6478",
  },
} as const;

// Animation easings
export const EASE = {
  smooth: [0.16, 1, 0.3, 1] as [number, number, number, number],
  bounce: [0.34, 1.56, 0.64, 1] as [number, number, number, number],
  out: [0, 0, 0.2, 1] as [number, number, number, number],
} as const;
