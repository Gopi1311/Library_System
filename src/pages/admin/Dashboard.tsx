import React, { useState, useEffect } from "react";
import StatCard from "../../components/admin/dashBoard/StatCard";
import DashBoardActivity from "../../components/admin/dashBoard/DashBoardActivity";
import type {
  DashboardStats,
  Activity,
  StatCardProps,
  QuickAction,
} from "../../validation/dashboardSchema";
import { api } from "../../congif/api";
import { LoadingOverlay } from "../../components/common/LoadingOverlay";
import { GlobalError } from "../../components/common/GlobalError";
import Chart from "./Chart";

import {
  BookOpenIcon,
  UsersIcon,
  ClipboardDocumentCheckIcon,
  ClockIcon,
  CurrencyRupeeIcon,
} from "@heroicons/react/24/outline";

const Dashboard: React.FC = () => {
  const [stats, setStats] = useState<DashboardStats>({
    totalBooks: 0,
    totalCustomers: 0,
    activeBorrows: 0,
    pendingReservations: 0,
    totalFines: 0,
  });

  const [recentActivity, setRecentActivity] = useState<Activity[]>([]);
  const [loading, setLoading] = useState(false);
  const [fatalError, setFatalError] = useState<string | null>(null);

  const loadDashboard = async () => {
    setLoading(true);
    setFatalError(null);

    const results = await Promise.allSettled([
      api.get("/admin/stats"),
      api.get("/admin/recent-activities"),
    ]);

    // Stats data
    if (results[0].status === "fulfilled") {
      console.log("Data:", results[0].value.data);
      setStats(results[0].value.data);
    }

    // Recent activity data
    if (results[1].status === "fulfilled") {
      setRecentActivity(results[1].value.data.recentActivities);
    }

    // If both fail → fatal error
    if (results.every((r) => r.status === "rejected")) {
      const reason =
        results[0].status === "rejected" && results[0].reason instanceof Error
          ? results[0].reason.message
          : "Failed to load dashboard data";

      setFatalError(reason);
    }

    setLoading(false);
  };

  useEffect(() => {
    Promise.resolve().then(() => loadDashboard());
  }, []);

  if (fatalError) {
    return <GlobalError message={fatalError} onRetry={loadDashboard} />;
  }

  const dashboardCards: StatCardProps[] = [
    {
      label: "Total Books",
      value: stats.totalBooks,
      icon: <BookOpenIcon className="h-6 w-6" />,
      color: "blue",
    },
    {
      label: "Total Users",
      value: stats.totalCustomers,
      icon: <UsersIcon className="h-6 w-6" />,
      color: "green",
    },
    {
      label: "Active Borrows",
      value: stats.activeBorrows,
      icon: <ClipboardDocumentCheckIcon className="h-6 w-6" />,
      color: "yellow",
    },
    {
      label: "Pending Reservations",
      value: stats.pendingReservations,
      icon: <ClockIcon className="h-6 w-6" />,
      color: "purple",
    },
    {
      label: "Total Fines",
      value: stats.totalFines,
      icon: <CurrencyRupeeIcon className="h-6 w-6" />,
      color: "red",
    },
  ];
  const quickActions: QuickAction[] = [
    {
      to: "/admin/books?action=add",
      icon: "📚",
      label: "Add New Book",
      color: "blue",
    },
    {
      to: "/admin/users?action=add",
      icon: "👥",
      label: "Add New User",
      color: "green",
    },
    { to: "/admin/borrow", icon: "📖", label: "Issue Book", color: "purple" },
    { to: "/admin/fines", icon: "💰", label: "Process Fine", color: "yellow" },
  ];

  return (
    <div className="space-y-6 pb-6 relative">
      {loading && <LoadingOverlay />}

      <p className="text-gray-600">Welcome to your library management system</p>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-6">
        {dashboardCards.map((card) => (
          <StatCard key={card.label} {...card} />
        ))}
      </div>
<div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
  {/* LEFT SIDE — Activity (takes 2/3 width) */}
  <div className="lg:col-span-2">
    <DashBoardActivity recentActivity={recentActivity}  quickActions={quickActions}/>
  </div>

  {/* RIGHT SIDE — Chart (takes 1/3 width) */}
  <div className="lg:col-span-1">
    <Chart />
  </div>
</div>


    </div>
  );
};

export default Dashboard;
