// types/index.ts
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

export interface UserFormData {
  name: string;
  email: string;
  phone: string;
  membershipId: string;
  role: 'user' | 'admin';
  password?: string;
}

export interface BookFormData {
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

export interface User {
  _id: string;
  name: string;
  email: string;
  phone?: string;
  membershipId: string;
  role: 'user' | 'admin';
  createdAt: string;
  updatedAt: string;
}

export interface Borrow {
  _id: string;
  userId: string;
  bookId: string;
  issueDate: string;
  dueDate: string;
  returnDate?: string;
  status: 'issued' | 'returned' | 'late';
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
  status: 'active' | 'completed' | 'cancelled';
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