import { z } from "zod";

// Strong password definition
const strongPassword = z
  .string()
  .min(6, "Password must be at least 6 characters")
  .regex(/[A-Z]/, "Must contain at least one uppercase letter")
  .regex(/[a-z]/, "Must contain at least one lowercase letter")
  .regex(/[0-9]/, "Must contain at least one number")
  .regex(/[^A-Za-z0-9]/, "Must contain at least one special symbol");

// 1. Full user schema (API response)
export const UserSchema = z.object({
  _id: z.string(),
  name: z.string(),
  email: z.string().email(),
  phone: z.string().optional(),
  address: z.string(),
  role: z.enum(["member", "librarian", "admin"]),
  createdAt: z.string(),
  updatedAt: z.string(),

  lastBorrowStatus: z.string().optional(),
  reservations: z.number().optional(),
  pendingFines: z.number().optional(),
});

export type User = z.infer<typeof UserSchema>;

// 2. Form schema (used by react-hook-form)
export const UserFormSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Please enter a valid email").optional(),

  phone: z.string().min(8, "Phone must be at least 8 digits").optional(),
  address: z.string().min(5, "Address must be at least 5 characters"),

  role: z.enum(["member", "librarian", "admin"], {
    message: "Invalid role",
  }),

  password: strongPassword.optional(),
});

export type UserFormDTO = z.infer<typeof UserFormSchema>;

// 3. Create DTO → password required
export const UserCreateSchema = UserFormSchema.extend({
  password: strongPassword,
});

export type UserCreateDTO = z.infer<typeof UserCreateSchema>;

// 4. Update DTO → no email, no password
export const UserUpdateSchema = UserFormSchema.omit({
  email: true,
  password: true,
});

export type UserUpdateDTO = z.infer<typeof UserUpdateSchema>;
