export interface Book {
  _id: string;
  title: string;
  author: string;
  isbn: string;
  publisher?: string;
  genre?: string;
  publicationYear: number;
  totalCopies: number;
  availableCopies: number;
  shelfLocation?: string;
  summary?: string;
  createdAt: string;
  updatedAt: string;
}

/** Used when creating a book */
export interface BookCreateDTO {
  title: string;
  author: string;
  isbn: string;
  publisher: string;
  genre: string;
  publicationYear: number;
  totalCopies: number;
  availableCopies: number;
  shelfLocation: string;
  summary: string;
}

/** Used when updating a book */
export interface BookUpdateDTO {
  title: string;
  author: string;
  publisher: string;
  genre: string;
  publicationYear: number;
  totalCopies: number;
  shelfLocation: string;
  summary: string;
}

export interface BookFormData {
  title: string;
  author: string;
  isbn: string;
  publisher: string;
  genre: string;
  publicationYear: number;
  totalCopies: number;
  shelfLocation: string;
  summary: string;
}

export interface UserFormData {
  name: string;
  email: string;
  phone?: string;
  address: string;
  role: "member" | "librarian";  // admin account not created from UI
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

  lastBorrowStatus?: string;
  reservations?: number;
  pendingFines?: number;
}


export interface DashboardStats {
  totalBooks: number;
  totalCustomers: number;
  activeBorrows: number;
  pendingReservations: number;
  totalFines: number;
}

export interface StatCardProps {
  title: string;
  value: number;
  icon: string;
  color: string;
  link: string;
}
export interface Activity {
  type: "borrow" | "return" | "reservation" | "fine_payment";
  user: string;
  book?: string;
  amount?: number;
  time: string;
}

export interface Borrow {
  _id: string;
  userId: string;
  bookId: string;
  issueDate: string;
  dueDate: string;
  returnDate?: string;
  status: "issued" | "returned" | "late";
  fine: number;
  user?: User;
  book?: Book;
}

export interface Reservation {
  _id: string;
  userId: string;
  bookId: string;
  reservedDate: string;
  expiryDate: string;
  status: "active" | "completed" | "cancelled";
  user?: User;
  book?: Book;
}

export interface Review {
  _id: string;
  userId: string;
  bookId: string;
  rating: number;
  review: string;
  user?: User;
  book?: Book;
  createdAt: string;
}

export interface FinePayment {
  _id: string;
  userId: string;
  borrowId: string;
  amount: number;
  method: string;
  paymentDate: string;
  user?: User;
  borrow?: Borrow;
}
