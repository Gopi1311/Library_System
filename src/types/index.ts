import type { Book } from "../validation/bookSchema";
/* =========================================================
   USER TYPES
   ========================================================= */

export interface UserFormData {
  name: string;
  email: string;
  phone?: string;
  address: string;
  role: "member" | "librarian";
  password?: string;
}

export interface UserCreateDTO {
  name: string;
  email: string;
  phone?: string;
  address: string;
  role: "member" | "librarian";
  password: string;
}

export interface UserUpdateDTO {
  name: string;
  phone?: string;
  address: string;
  role: "member" | "librarian";
}

export interface User {
  _id: string;
  name: string;
  email: string;
  phone?: string;
  address: string;
  role: "user" | "librarian";
  createdAt: string;
  updatedAt: string;

  // Optional computed fields
  lastBorrowStatus?: string;
  reservations?: number;
  pendingFines?: number;
}


/* =========================================================
   DASHBOARD TYPES
   ========================================================= */

export interface DashboardStats {
  totalBooks: number;
  totalCustomers: number;
  activeBorrows: number;
  pendingReservations: number;
  totalFines: number;
}

export interface StatCardProps {
  label: string;
  value: number | string;
  icon: React.ReactNode;
  color: "blue" | "green" | "yellow" | "purple" | "red";
}

export interface Activity {
  type: "borrow" | "return" | "reservation" | "fine_payment";
  user: string;
  book?: string;
  amount?: number;
  time: string;
}


/* =========================================================
   BORROW TYPES (OUTSTANDING FINES)
   ========================================================= */

export interface Borrow {
  _id: string;
  userId: User;     // Populated user object
  bookId: Book;     // Populated book object
  issueDate: string;
  dueDate: string;
  returnDate?: string;
  status: "issued" | "returned" | "late";
  fine: number;
}


/* =========================================================
   PAYMENT HISTORY TYPES
   ========================================================= */

/**
 * Borrow object nested inside FinePayment history API.
 */
export interface BorrowInsidePayment {
  _id: string;
  issueDate: string;
  dueDate: string;
  status: string;
  fine: number;
  bookId: Book;     // Populated
}

/**
 * FinePayment returned from API with populated user + borrow + book.
 */
export interface FinePayment {
  _id: string;
  userId: User;                     // Populated
  borrowId: BorrowInsidePayment;    // Populated with nested book
  amount: number;
  method: "cash" | "card" | "online";
  paymentDate: string;
}


/* =========================================================
   RESERVATION TYPES
   ========================================================= */

export interface Reservation {
  _id: string;
  userId: User;
  bookId: Book;
  reservedDate: string;
  expiryDate: string;
  status: "active" | "completed" | "cancelled";
}


/* =========================================================
   REVIEW TYPES
   ========================================================= */

export interface Review {
  _id: string;
  userId: User;
  bookId: Book;
  rating: number;
  review: string;
  createdAt: string;
}
