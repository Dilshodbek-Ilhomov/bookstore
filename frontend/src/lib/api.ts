// ============================================
// BookStore — API Client (fetch wrapper + JWT)
// ============================================

import { API_BASE_URL } from "./constants";
import type {
  Book,
  Category,
  Author,
  Review,
  Order,
  AuthTokens,
  User,
  PaginatedResponse,
} from "@/types";

// ---- Token management ----
function getAccessToken(): string | null {
  if (typeof window === "undefined") return null;
  return localStorage.getItem("access_token");
}

function getRefreshToken(): string | null {
  if (typeof window === "undefined") return null;
  return localStorage.getItem("refresh_token");
}

function setTokens(tokens: AuthTokens) {
  localStorage.setItem("access_token", tokens.access);
  localStorage.setItem("refresh_token", tokens.refresh);
}

function clearTokens() {
  localStorage.removeItem("access_token");
  localStorage.removeItem("refresh_token");
}

// ---- Core fetch wrapper ----
async function apiFetch<T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<T> {
  const url = `${API_BASE_URL}${endpoint}`;
  const headers: Record<string, string> = {
    ...(options.headers as Record<string, string>),
  };

  // Don't set Content-Type for FormData
  if (!(options.body instanceof FormData)) {
    headers["Content-Type"] = "application/json";
  }

  const token = getAccessToken();
  if (token) {
    headers["Authorization"] = `Bearer ${token}`;
  }

  let response = await fetch(url, { ...options, headers });

  // If 401, try refreshing token
  if (response.status === 401) {
    if (getRefreshToken()) {
      const refreshResponse = await fetch(`${API_BASE_URL}/auth/refresh/`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ refresh: getRefreshToken() }),
      });

      if (refreshResponse.ok) {
        const data = await refreshResponse.json();
        localStorage.setItem("access_token", data.access);
        headers["Authorization"] = `Bearer ${data.access}`;
        response = await fetch(url, { ...options, headers });
      } else {
        clearTokens();
        throw new Error("Session expired");
      }
    } else {
      clearTokens();
      throw new Error("Session expired");
    }
  }

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    let errorMessage = errorData.detail || errorData.message;
    if (!errorMessage && typeof errorData === "object" && errorData !== null) {
      const messages = Object.entries(errorData)
        .map(([key, val]) => {
          const valStr = Array.isArray(val) ? val.join(", ") : String(val);
          return key === "non_field_errors" ? valStr : `${key}: ${valStr}`;
        })
        .join(" | ");
      if (messages) errorMessage = messages;
    }
    throw new Error(errorMessage || `HTTP ${response.status}`);
  }

  // Handle 204 No Content
  if (response.status === 204) {
    return {} as T;
  }

  return response.json();
}

// ---- Auth API ----
export const authAPI = {
  login: async (email: string, password: string): Promise<AuthTokens> => {
    const tokens = await apiFetch<AuthTokens>("/auth/login/", {
      method: "POST",
      body: JSON.stringify({ email, password }),
    });
    setTokens(tokens);
    return tokens;
  },

  register: async (data: {
    email: string;
    password: string;
    password2: string;
    first_name: string;
    last_name: string;
  }): Promise<User> => {
    return apiFetch<User>("/auth/register/", {
      method: "POST",
      body: JSON.stringify(data),
    });
  },

  me: async (): Promise<User> => {
    return apiFetch<User>("/auth/me/");
  },

  updateProfile: async (data: FormData | Partial<User>): Promise<User> => {
    return apiFetch<User>("/auth/me/", {
      method: "PATCH",
      body: data instanceof FormData ? data : JSON.stringify(data),
    });
  },

  logout: () => {
    clearTokens();
  },
};

// ---- Users API ----
export const usersAPI = {
  getProfile: (id: number): Promise<User> => apiFetch(`/auth/profile/${id}/`),
};

// ---- Books API ----
export const booksAPI = {
  list: (params?: {
    page?: number;
    category?: number;
    search?: string;
    ordering?: string;
  }): Promise<PaginatedResponse<Book>> => {
    const searchParams = new URLSearchParams();
    if (params?.page) searchParams.set("page", String(params.page));
    if (params?.category)
      searchParams.set("category", String(params.category));
    if (params?.search) searchParams.set("search", params.search);
    if (params?.ordering) searchParams.set("ordering", params.ordering);
    const qs = searchParams.toString();
    return apiFetch(`/books/${qs ? `?${qs}` : ""}`);
  },

  get: (id: number): Promise<Book> => apiFetch(`/books/${id}/`),
};

// ---- Categories API ----
export const categoriesAPI = {
  list: (): Promise<PaginatedResponse<Category>> => apiFetch("/categories/"),
};

// ---- Authors API ----
export const authorsAPI = {
  list: (): Promise<PaginatedResponse<Author>> => apiFetch("/authors/"),
};

// ---- Reviews API ----
export const reviewsAPI = {
  list: (bookId?: number): Promise<PaginatedResponse<Review>> => {
    const qs = bookId ? `?book=${bookId}` : "";
    return apiFetch(`/reviews/${qs}`);
  },

  create: (data: {
    book: number;
    rating: number;
    comment: string;
  }): Promise<Review> =>
    apiFetch("/reviews/", {
      method: "POST",
      body: JSON.stringify(data),
    }),

  update: (
    id: number,
    data: { rating?: number; comment?: string }
  ): Promise<Review> =>
    apiFetch(`/reviews/${id}/`, {
      method: "PATCH",
      body: JSON.stringify(data),
    }),

  delete: (id: number): Promise<void> =>
    apiFetch(`/reviews/${id}/`, {
      method: "DELETE",
    }),
};

// ---- Orders API ----
export const ordersAPI = {
  list: (): Promise<PaginatedResponse<Order>> => apiFetch("/orders/"),

  create: (
    items: { book: number; quantity: number }[]
  ): Promise<Order> =>
    apiFetch("/orders/", {
      method: "POST",
      body: JSON.stringify({ items }),
    }),
};
