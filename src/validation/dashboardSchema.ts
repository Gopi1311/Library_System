// src/validation/dashboardSchema.ts
import { z } from "zod";
import type React from "react";

/* -------------------- 1) DashboardStats -------------------- */

export const DashboardStatsSchema = z.object({
  totalBooks: z.number(),
  totalCustomers: z.number(),
  activeBorrows: z.number(),
  pendingReservations: z.number(),
  totalFines: z.number(),
});

export type DashboardStats = z.infer<typeof DashboardStatsSchema>;

/* -------------------- 2) StatCard (data + props) -------------------- */

// Schema for the *data* part (what you might get from API, etc.)
export const StatCardDataSchema = z.object({
  label: z.string(),
  value: z.union([z.number(), z.string()]),
  color: z.enum(["blue", "green", "yellow", "purple", "red"]),
});

export type StatCardData = z.infer<typeof StatCardDataSchema>;

// React component props = data from schema + icon (not validated by Zod)
export interface StatCardProps extends StatCardData {
  icon: React.ReactNode;
}

/* -------------------- 3) Activity -------------------- */

export const ActivitySchema = z.object({
  type: z.enum(["borrow", "return", "reservation", "fine_payment"]),
  user: z.string(),
  book: z.string().optional(),
  amount: z.number().optional(),
  time: z.string(), // e.g. ISO string or "2 hours ago"
});

export type Activity = z.infer<typeof ActivitySchema>;

// Optional: list schemas if you validate arrays
export const ActivityListSchema = z.array(ActivitySchema);
