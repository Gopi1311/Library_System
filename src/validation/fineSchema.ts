import { z } from "zod";
import { UserSchema } from "./userSchema";                 // ← your existing schema
import { BorrowSchema } from "./borrowBookSchema";         // ← includes bookId populated

/* Borrow inside Payment (usually only partial borrow) */
export const BorrowInsidePaymentSchema = BorrowSchema.pick({
  _id: true,
  bookId: true,
  issueDate: true,
  dueDate: true,
  returnDate: true,
  fine: true,
}).passthrough();

/* Fine Payment Schema */
export const FinePaymentSchema = z.object({
  _id: z.string(),
  userId: UserSchema,                      // full populated user
  borrowId: BorrowInsidePaymentSchema,     // borrow with nested book
  amount: z.number().min(1, "Amount must be at least 1"),
  method: z.enum(["cash", "card", "online"]),
  paymentDate: z.string(),                 // ISO date string
});

/* Type */
export type FinePayment = z.infer<typeof FinePaymentSchema>;
