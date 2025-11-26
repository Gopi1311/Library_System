import React from "react";
import type { StatCardProps } from "../../../validation/dashboardSchema";

const COLOR_MAP = {
  blue: "bg-blue-100 text-blue-600",
  green: "bg-green-100 text-green-600",
  yellow: "bg-yellow-100 text-yellow-600",
  purple: "bg-purple-100 text-purple-600",
  red: "bg-red-100 text-red-600",
} as const;

const StatCard: React.FC<StatCardProps> = ({ label, value, icon, color }) => {
  return (
    <div className="bg-white rounded-lg shadow p-6 hover:shadow-md transition cursor-pointer">
      <div className="flex items-center">
        <div className={`p-3 rounded-full ${COLOR_MAP[color]} mr-4`}>
          {icon}
        </div>

        <div>
          <p className="text-sm text-gray-600">{label}</p>
          <p className="text-2xl font-bold text-gray-900">
            {Number(value ?? 0).toLocaleString()}
          </p>
        </div>
      </div>
    </div>
  );
};

export default StatCard;
