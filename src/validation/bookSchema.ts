import { z } from "zod";

// 1) API RESPONSE SCHEMA
export const BookSchema = z.object({
  _id: z.string(),
  title: z.string(),
  author: z.string(),
  isbn: z.string().nullable().optional(),
  publisher: z.string().nullable().optional(),
  genre: z.string().nullable().optional(),
  publicationYear: z.number(),
  totalCopies: z.number(),
  availableCopies: z.number(),
  shelfLocation: z.string().nullable().optional(),
  summary: z.string().nullable().optional(),
  createdAt: z.string(),
  updatedAt: z.string(),
});

export type Book = z.infer<typeof BookSchema>;


// 2) FORM SCHEMA (UI only — loose)
export const BookFormSchema = z.object({
  title: z.string().min(2, "Title must be at least 2 characters"),
  author: z.string().min(2, "Author must be at least 2 characters"),

  // optional in FORM → required only when creating
  isbn: z.string().optional(),

  publisher: z
    .string()
    .min(2, "Publisher must be at least 2 characters")
    .optional(),

  genre: z.string().min(2, "Genre must be at least 2 characters").optional(),

  publicationYear: z.number().int("Year must be a whole number"),
  totalCopies: z.number().int("Total copies must be a whole number"),

  availableCopies: z
    .number()
    .int("Available copies must be a whole number")
    .optional(),

  shelfLocation: z
    .string()
    .min(2, "Shelf must be at least 2 characters")
    .optional(),

  summary: z.string().min(5, "Summary must be at least 5 characters").optional(),
});

export type BookFormDTO = z.infer<typeof BookFormSchema>;


// 3) CREATE SCHEMA (strict)
export const BookCreateSchema = BookFormSchema.extend({
  isbn: z.string().min(1, "ISBN required"),
  availableCopies: z.number().int("Available copies required"),
});

export type BookCreateDTO = z.infer<typeof BookCreateSchema>;


// 4) UPDATE SCHEMA (only editable fields)
export const BookUpdateSchema = BookFormSchema.omit({
  isbn: true,
  availableCopies: true,
});

export type BookUpdateDTO = z.infer<typeof BookUpdateSchema>;
