import { z } from "zod";

export const LoginSchema = z.object({
  email: z.string().email("Invalid email"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

export type LoginDTO = z.infer<typeof LoginSchema>;

export const RegisterSchema = z.object({
  name: z.string().min(2, "Name is required"),
  email: z.string().email("Invalid email"),
  password: z.string().min(6, "Password must be ≥ 6 characters"),
  role: z.enum(["member", "librarian", "admin"]),
  phone: z.string().min(5, "Phone is required"),
  address: z.string().min(5, "Address is required"),
});

export type RegisterDTO = z.infer<typeof RegisterSchema>;
