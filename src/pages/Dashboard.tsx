import React, { useState, useEffect } from "react";
import { StatCard } from "../components/dashBoard/StatCard";
import DashBoardActivity from "../components/dashBoard/DashBoardActivity";

import type { Activity, DashboardStats, StatCardProps } from "../types";
import { api } from "../congif/api";

const Dashboard: React.FC = () => {
  const [stats, setStats] = useState<DashboardStats>({
    totalBooks: 0,
    totalCustomers: 0,
    activeBorrows: 0,
    pendingReservations: 0,
    totalFines: 0,
  });

  const [recentActivity, setRecentActivity] = useState<Activity[]>([]);

  const fetchStats = async () => {
    try {
      const { data } = await api.get<DashboardStats>("/admin/stats");

      console.log(data);

      setStats(data);
    } catch (err) {
      console.error("Failed to load statistics", err);
    }
  };

 const fetchRecentActivity = async () => {
    try {
      const { data } = await api.get("/admin/recent-activities");
      // backend returns: { recentActivities: [...] }
      setRecentActivity(data.recentActivities);
    } catch (err) {
      console.error("Failed to load recent activities", err);
    }
  };

  useEffect(() => {
    fetchStats();
    fetchRecentActivity();
  }, []);

 

  const dashboardCards: StatCardProps[] = [
    {
      title: "Total Books",
      value: stats.totalBooks,
      icon: "📚",
      color: "bg-blue-100 text-blue-600",
      link: "/books",
    },
    {
      title: "Total Users",
      value: stats.totalCustomers,
      icon: "👥",
      color: "bg-green-100 text-green-600",
      link: "/users",
    },

    {
      title: "Active Borrows",
      value: stats.activeBorrows,
      icon: "📖",
      color: "bg-yellow-100 text-yellow-600",
      link: "/borrow",
    },
    {
      title: "Pending Reservations",
      value: stats.pendingReservations,
      icon: "⏰",
      color: "bg-purple-100 text-purple-600",
      link: "/reservations",
    },
    {
      title: "Total Fines",
      value: stats.totalFines,
      icon: "💰",
      color: "bg-red-100 text-red-600",
      link: "/fines",
    },
  ];

  return (
    <div className="space-y-6 pb-6">
      {/* Header */}
      <div>
        <p className="text-gray-600">
          Welcome to your library management system
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-6">
        {dashboardCards.map((card) => (
          <StatCard key={card.title} {...card} />
        ))}
      </div>

      {/* Recent Activity + Actions */}
      <DashBoardActivity recentActivity={recentActivity} />
    </div>
  );
};

export default Dashboard;
