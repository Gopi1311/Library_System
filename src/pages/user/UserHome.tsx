import React, { useState, useEffect } from "react";
import StatCard from "../../components/admin/dashBoard/StatCard";
import DashBoardActivity from "../../components/admin/dashBoard/DashBoardActivity";

import { api } from "../../congif/api";
import { LoadingOverlay } from "../../components/common/LoadingOverlay";
import { GlobalError } from "../../components/common/GlobalError";

import type {
  StatCardProps,
  Activity,
  MemberStats,
  QuickAction,
} from "../../validation/dashboardSchema";

import {
  BookOpenIcon,
  ClipboardDocumentCheckIcon,
  ClockIcon,
  CurrencyRupeeIcon,
} from "@heroicons/react/24/outline";

const MemberDashboard: React.FC = () => {
  const [stats, setStats] = useState<MemberStats>({
    activeBorrows: 0,
    reservations: 0,
    fines: 0,
    totalBorrowed: 0,
  });

  const [activities, setActivities] = useState<Activity[]>([]);
  const [loading, setLoading] = useState(false);
  const [fatalError, setFatalError] = useState<string | null>(null);
  const userId = "6923fdc88ec3f845a24f4a35";
  const loadDashboard = async () => {
    try {
      setLoading(true);
      setFatalError(null);

      const results = await Promise.allSettled([
        api.get(`/member/stats/${userId}`),
        api.get(`/member/recent-activities/${userId}`),
      ]);

      if (results[0].status === "fulfilled") {
        const parsed = results[0].value.data;
        setStats(parsed);
      }

      if (results[1].status === "fulfilled") {
        const parsedActs = results[1].value.data.activities;
        setActivities(parsedActs);
      }

      if (results.every((r) => r.status === "rejected")) {
        setFatalError("Failed to load member dashboard");
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadDashboard();
  }, []);

  if (fatalError) {
    return <GlobalError message={fatalError} onRetry={loadDashboard} />;
  }

  const memberCards: StatCardProps[] = [
    {
      label: "Active Borrows",
      value: stats.activeBorrows,
      icon: <ClipboardDocumentCheckIcon className="h-6 w-6" />,
      color: "blue",
    },
    {
      label: "Reservations",
      value: stats.reservations,
      icon: <ClockIcon className="h-6 w-6" />,
      color: "purple",
    },
    {
      label: "Pending Fines",
      value: stats.fines,
      icon: <CurrencyRupeeIcon className="h-6 w-6" />,
      color: "red",
    },
    {
      label: "Total Borrowed",
      value: stats.totalBorrowed,
      icon: <BookOpenIcon className="h-6 w-6" />,
      color: "green",
    },
  ];
  const quickActions: QuickAction[] = [
    {
      to: "/user/browsebook",
      icon: "📖",
      label: "Browse Your Book",
      color: "purple",
    },
    {
      to: "/user/myborrows",
      icon: "📚",
      label: "Borrow History",
      color: "blue",
    },
    {
      to: "/user/profile",
      icon: "👥",
      label: "Personal Information",
      color: "green",
    },
    {
      to: "/user/fines",
      icon: "💰",
      label: "Fine And Payment",
      color: "yellow",
    },
  ];

  return (
    <div className="space-y-6 pb-6 relative">
      {loading && <LoadingOverlay />}

      <p className="text-gray-600">Welcome to your library dashboard</p>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {memberCards.map((card) => (
          <StatCard key={card.label} {...card} />
        ))}
      </div>

      <DashBoardActivity
        recentActivity={activities}
        quickActions={quickActions}
      />
    </div>
  );
};

export default MemberDashboard;
