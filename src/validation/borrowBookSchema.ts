import { z } from "zod";

/* User */
export const BorrowUserSchema = z
  .object({
    _id: z.string(),
    name: z.string(),
    email: z.string().email(),
  })
  .passthrough(); // allow extra fields

export type BorrowUser = z.infer<typeof BorrowUserSchema>;

/* Book */
export const BorrowBookSchema = z
  .object({
    _id: z.string(),
    title: z.string(),
    author: z.string(),
  })
  .passthrough(); // allow extra fields

export type BorrowBook = z.infer<typeof BorrowBookSchema>;

/* Borrow Record */
export const BorrowSchema = z
  .object({
    _id: z.string(),
    userId: BorrowUserSchema.optional(),
    bookId: BorrowBookSchema,
    issueDate: z.string(),
    dueDate: z.string(),
    returnDate: z.string().nullable().optional(), // handle null
    status: z.enum(["issued", "returned", "late"]),
    fine: z.number(),
  })
  .passthrough(); // allow extra backend fields

export type Borrow = z.infer<typeof BorrowSchema>;

/* List */
export const BorrowListSchema = z.array(BorrowSchema);

/* Issue Book DTO */
export const IssueBookSchema = z.object({
  userId: z.string().min(1),
  bookId: z.string().min(1),
  days: z.number().min(1).max(60),
});

export type IssueBookDTO = z.infer<typeof IssueBookSchema>;
