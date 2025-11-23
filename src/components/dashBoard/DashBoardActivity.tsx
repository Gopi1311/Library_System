import React from "react";
import { Link } from "react-router-dom";
import type { Activity } from "../../types";

interface DashBoardActivityProps {
  recentActivity: Activity[];
}
const quickActions = [
  {
    to: "/books?action=add",
    icon: "📚",
    label: "Add New Book",
    color: "blue",
  },
  {
    to: "/users?action=add",
    icon: "👥",
    label: "Add New User",
    color: "green",
  },
  {
    to: "/borrow",
    icon: "📖",
    label: "Issue Book",
    color: "purple",
  },
  {
    to: "/fines",
    icon: "💰",
    label: "Process Fine",
    color: "yellow",
  },
];

const DashBoardActivity: React.FC<DashBoardActivityProps> = ({
  recentActivity,
}) => {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* Recent Activity */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold">Recent Activity</h2>
          <span className="text-sm text-blue-600 font-medium cursor-pointer">
            View All
          </span>
        </div>

        <div className="space-y-4">
          {recentActivity.map((activity, index) => (
            <div
              key={index}
              className="flex items-center space-x-3 p-3 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <div
                className={`w-10 h-10 rounded-full flex items-center justify-center ${
                  activity.type === "borrow"
                    ? "bg-blue-100 text-blue-600"
                    : activity.type === "return"
                    ? "bg-green-100 text-green-600"
                    : activity.type === "reservation"
                    ? "bg-purple-100 text-purple-600"
                    : "bg-yellow-100 text-yellow-600"
                }`}
              >
                {activity.type === "borrow"
                  ? "📖"
                  : activity.type === "return"
                  ? "↩️"
                  : activity.type === "reservation"
                  ? "⏰"
                  : "💰"}
              </div>

              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-gray-900 truncate">
                  {activity.user}{" "}
                  {activity.type === "fine_payment"
                    ? `paid $${activity.amount} fine`
                    : `${activity.type}ed "${activity.book}"`}
                </p>
                <p className="text-xs text-gray-500">{activity.time}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Quick Actions */}
      <div className="bg-white rounded-lg shadow-lg p-6">
        <h2 className="text-lg font-semibold mb-4">Quick Actions</h2>

        <div className="grid grid-cols-2 gap-4">
          {quickActions.map((action, index) => (
            <Link
              key={index}
              to={action.to}
              className={`lg:p-14 p-4 border-2 border-dashed border-gray-300 rounded-lg 
      ${
        action.color === "blue"
          ? "hover:border-blue-500 hover:bg-blue-50"
          : action.color === "green"
          ? "hover:border-green-500 hover:bg-green-50"
          : action.color === "purple"
          ? "hover:border-purple-500 hover:bg-purple-50"
          : "hover:border-yellow-500 hover:bg-yellow-50"
      }
      transition-colors text-center group`}
            >
              <span className="text-2xl mb-2 block group-hover:scale-110 transition-transform">
                {action.icon}
              </span>

              <span className="text-sm font-medium text-gray-700">
                {action.label}
              </span>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
};

export default DashBoardActivity;
