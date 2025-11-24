// src/validation/userSchema.ts
import { z } from "zod";

//
// 1) FULL USER SCHEMA (GET API RESPONSE)
//
export const UserSchema = z.object({
  _id: z.string(),
  name: z.string(),
  email: z.string().email(),
  phone: z.string().optional(),
  address: z.string(),
  role: z.enum(["member", "librarian"]), // matches your User interface
  createdAt: z.string(),
  updatedAt: z.string(),

  lastBorrowStatus: z.string().optional(),
  reservations: z.number().optional(),
  pendingFines: z.number().optional(),
});

export type User = z.infer<typeof UserSchema>;


//
// 2) FORM SCHEMA (USED BY REACT HOOK FORM)
//   - used for BOTH create & edit UI
//
export const UserFormSchema = z.object({
  name: z
    .string()
    .min(2, { message: "Name must be at least 2 characters" }),

  email: z
    .string()
    .email({ message: "Please enter a valid email" }),

  phone: z
    .string()
    .min(8, { message: "Phone must be at least 8 digits" })
    .optional(),

  address: z
    .string()
    .min(5, { message: "Address must be at least 5 characters" }),

  // UI uses "member" & "librarian"
  role: z.enum(["member", "librarian"], {
      message: "Role must be member or librarian",
  }),

  // password only required when creating
  password: z
    .string()
    .min(6, { message: "Password must be at least 6 characters" })
    .optional(),
});

export type UserFormDTO = z.infer<typeof UserFormSchema>;


//
// 3) CREATE / UPDATE DTOs (from Zod, no manual interfaces)
//
export const UserCreateSchema = UserFormSchema.extend({
  password: z
    .string()
    .min(6, { message: "Password must be at least 6 characters" }),
});

export type UserCreateDTO = z.infer<typeof UserCreateSchema>;

export const UserUpdateSchema = UserFormSchema.omit({
  email: true,
  password: true,
}).extend({
  role: z.enum(["member", "librarian"]),
});

export type UserUpdateDTO = z.infer<typeof UserUpdateSchema>;
