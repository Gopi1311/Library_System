import { z } from "zod";

//
// 1) FULL BOOK SCHEMA (GET API RESPONSE)
//
export const BookSchema = z.object({
  _id: z.string(),

  title: z.string(),
  author: z.string(),

  isbn: z.string().nullable().optional(),

  publisher: z.string().optional(),
  genre: z.string().optional(),

  publicationYear: z.number(),
  totalCopies: z.number(),
  availableCopies: z.number(),

  shelfLocation: z.string().optional(),
  summary: z.string().optional(),

  createdAt: z.string(),
  updatedAt: z.string(),
});

export type Book = z.infer<typeof BookSchema>;

//
// 2) ONE FORM SCHEMA FOR BOTH CREATE & EDIT
//
export const BookFormSchema = z.object({
  title: z.string().min(2, { message: "Title must be at least 2 characters" }),

  author: z
    .string()
    .min(2, { message: "Author must be at least 2 characters" }),

  isbn: z.string().min(1, { message: "ISBN must be generated" }).optional(),

  publisher: z
    .string()
    .min(2, { message: "Publisher must be at least 2 characters" }),

  genre: z.string().min(2, { message: "Genre must be at least 2 characters" }),
  publicationYear: z
    .number({ message: "Publication year must be a number" })
    .int({ message: "Year must be a whole number" }),

  totalCopies: z
    .number({ message: "Total copies must be a number" })
    .int({ message: "Total copies must be a whole number" }),

  availableCopies: z
    .number({ message: "Available copies must be a number" })
    .int({ message: "Available copies must be a whole number" })
    .optional(),

  shelfLocation: z
    .string()
    .min(2, { message: "Shelf location must be at least 2 characters" }),

  summary: z
    .string()
    .min(5, { message: "Summary must be at least 5 characters" }),
});

export type BookFormDTO = z.infer<typeof BookFormSchema>;
