import { z } from "zod";

export const ReviewUserSchema = z
  .object({
    _id: z.string(),
    name: z.string(),
    email: z.string().email(),
  })
  .strict();

export type ReviewUser = z.infer<typeof ReviewUserSchema>;

export const ReviewBookSchema = z
  .object({
    _id: z.string(),
    title: z.string(),
    author: z.string(),
  })
  .strict();

export type ReviewBook = z.infer<typeof ReviewBookSchema>;

export const ReviewSchema = z
  .object({
    _id: z.string(),
    userId: ReviewUserSchema,
    bookId: ReviewBookSchema,
    rating: z.number().min(1).max(5),
    review: z.string(),
    createdAt: z.string(),
  })
  .strict();

export type Review = z.infer<typeof ReviewSchema>;

export const ReviewListSchema = z.array(ReviewSchema);
