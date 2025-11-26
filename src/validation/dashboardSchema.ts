import { z } from "zod";
import type React from "react";

/* -------------------- 1) ADMIN DASHBOARD STATS -------------------- */

export const DashboardStatsSchema = z.object({
  totalBooks: z.number(),
  totalCustomers: z.number(),
  activeBorrows: z.number(),
  pendingReservations: z.number(),
  totalFines: z.number(),
});

export type DashboardStats = z.infer<typeof DashboardStatsSchema>;

/* -------------------- 2) MEMBER DASHBOARD STATS -------------------- */

export const MemberStatsSchema = z.object({
  activeBorrows: z.number(),
  reservations: z.number(),
  fines: z.number(),
  totalBorrowed: z.number(),
});

export type MemberStats = z.infer<typeof MemberStatsSchema>;

/* -------------------- 3) STAT CARD -------------------- */

export const StatCardDataSchema = z.object({
  label: z.string(),
  value: z.union([z.number(), z.string()]),
  color: z.enum(["blue", "green", "yellow", "purple", "red"]),
});

export type StatCardData = z.infer<typeof StatCardDataSchema>;

export interface StatCardProps extends StatCardData {
  icon: React.ReactNode;
}

/* -------------------- 4) ACTIVITY -------------------- */

export const ActivitySchema = z.object({
  type: z.enum(["borrow", "return", "reservation", "fine_payment"]),
  user: z.string().optional(),
  book: z.string().optional(),
  amount: z.number().optional(),
  time: z.string(),
});

export type Activity = z.infer<typeof ActivitySchema>;

export const ActivityListSchema = z.array(ActivitySchema);

/* -------------------- 5) QUICK ACTION -------------------- */

export const QuickActionSchema = z.object({
  to: z.string(),
  icon: z.string(),
  label: z.string(),
  color: z.enum(["blue", "green", "yellow", "purple"]),
});

export type QuickAction = z.infer<typeof QuickActionSchema>;
