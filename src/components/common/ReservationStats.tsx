import React from "react";
import type { Reservation } from "../../validation/reservationSchema";

import {
  ClockIcon,
  CheckBadgeIcon,
  XMarkIcon,
} from "@heroicons/react/24/outline";

interface StatsSummaryProps {
  reservations: Reservation[];
}

const ReservationStats: React.FC<StatsSummaryProps> = ({ reservations }) => {
  const active = reservations.filter((r) => r.status === "active").length;
  const completed = reservations.filter((r) => r.status === "completed").length;
  const cancelled = reservations.filter((r) => r.status === "cancelled").length;

  const cards = [
    {
      label: "Active Reservations",
      value: active,
      color: "text-blue-600",
      bg: "bg-blue-50",
      icon: ClockIcon,
    },
    {
      label: "Completed",
      value: completed,
      color: "text-green-600",
      bg: "bg-green-50",
      icon: CheckBadgeIcon,
    },
    {
      label: "Cancelled",
      value: cancelled,
      color: "text-red-600",
      bg: "bg-red-50",
      icon: XMarkIcon,
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
      {cards.map((c, i) => (
        <div
          key={i}
          className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6"
        >
          <div className="flex items-center">
            <div className={`p-3 rounded-xl ${c.bg}`}>
              <c.icon className={`w-6 h-6 ${c.color}`} />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">{c.label}</p>
              <p className="text-2xl font-bold text-gray-900">{c.value}</p>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default ReservationStats;
