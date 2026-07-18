// ============================================
// BookStore — TypeScript Type Definitions
// ============================================

export interface Category {
  id: number;
  name: string;
}

export interface Author {
  id: number;
  full_name: string;
}

export interface Book {
  id: number;
  cover_image: string | null;
  book_file: string | null;
  title: string;
  description: string;
  price: string; // DecimalField returns string
  stock: number;
  category: number;
  authors: number[];
  created_at: string;
}

export interface BookDetail extends Omit<Book, "category" | "authors"> {
  category: Category;
  authors: Author[];
}

export interface Review {
  id: number;
  user: number;
  book: number;
  rating: number | null;
  comment: string;
  created_at: string;
}

export interface ReviewWithUser extends Omit<Review, "user"> {
  user: {
    id: number;
    email: string;
    first_name: string;
    last_name: string;
  };
}

export interface OrderItem {
  id: number;
  book: Book;
  quantity: number;
  price: string;
  total_price: string;
}

export interface Order {
  id: number;
  status: "pending" | "completed" | "cancelled";
  created_at: string;
  items: OrderItem[];
}

export interface User {
  id: number;
  email: string;
  first_name: string;
  last_name: string;
}

export interface AuthTokens {
  access: string;
  refresh: string;
  user?: User;
}

export interface PaginatedResponse<T> {
  count: number;
  next: string | null;
  previous: string | null;
  results: T[];
}

// Cart (client-side only)
export interface CartItem {
  book: Book;
  quantity: number;
}
