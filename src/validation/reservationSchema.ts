import { z } from "zod";
import { UserSchema } from "./userSchema";
import { BookSchema } from "./bookSchema";

export const ReserveBookSchema = z
  .object({
    userId: z.string().min(1, "User is required"),
    bookId: z.string().min(1, "Book is required"),
  })
  .strict();
export type ReserveBookDTO = z.infer<typeof ReserveBookSchema>;

export const ReservationSchema = z
  .object({
    _id: z.string(),
    userId: UserSchema,
    bookId: BookSchema,
    reservedDate: z.string(),
    expiryDate: z.string(),
    status: z.enum(["active", "completed", "cancelled"]),
  })
  .strict();
export type Reservation = z.infer<typeof ReservationSchema>;
