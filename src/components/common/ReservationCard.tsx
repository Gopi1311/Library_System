import React from "react";
import {
  CalendarIcon,
  UserIcon,
  ClockIcon,
  XMarkIcon,
} from "@heroicons/react/24/outline";
import type { Reservation } from "../../validation/reservationSchema";

interface StatusConfig {
  class: string;
  icon: React.ElementType;
  text: string;
}

interface Props {
  reservation: Reservation;
  statusConfig: StatusConfig;
  onCancel: (id: string) => void;
}

const ReservationCard: React.FC<Props> = ({
  reservation,
  statusConfig,
  onCancel,
}) => {
  const StatusIcon = statusConfig.icon;

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-200 hover:shadow-md transition-shadow duration-200 overflow-hidden">
      <div className="p-6">
        {/* Header */}
        <div className="flex justify-between items-start mb-4">
          <div className="flex-1 min-w-0">
            <h3 className="font-bold text-lg text-gray-900 truncate">
              {reservation.bookId?.title}
            </h3>
            <p className="text-sm text-gray-500 mt-1">
              by {reservation.bookId?.author}
            </p>
          </div>

          <span
            className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${statusConfig.class}`}
          >
            <StatusIcon className="w-3 h-3 mr-1" />
            {statusConfig.text}
          </span>
        </div>

        {/* User Info */}
        {reservation.userId?.name && (
          <div className="space-y-3 mb-4">
            <div className="flex items-center text-sm text-gray-600">
              <UserIcon className="w-4 h-4 mr-2 text-gray-400" />
              <span className="font-medium">{reservation.userId?.name}</span>
            </div>

            <div className="flex items-center text-sm text-gray-600">
              <svg
                className="w-4 h-4 mr-2 text-gray-400"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z" />
                <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" />
              </svg>
              {reservation.userId?.email}
            </div>
          </div>
        )}

        {/* Dates */}
        <div className="grid grid-cols-2 gap-4 p-4 bg-gray-50 rounded-xl mb-4">
          <div className="text-center">
            <CalendarIcon className="w-4 h-4 mx-auto mb-1 text-gray-400" />
            <p className="text-xs text-gray-500">Reserved</p>
            <p className="text-sm font-medium text-gray-900">
              {new Date(reservation.reservedDate).toLocaleDateString("en-IN")}
            </p>
          </div>

          <div className="text-center">
            <ClockIcon className="w-4 h-4 mx-auto mb-1 text-gray-400" />
            <p className="text-xs text-gray-500">Expires</p>
            <p className="text-sm font-medium text-gray-900">
              {new Date(reservation.expiryDate).toLocaleDateString("en-IN")}
            </p>
          </div>
        </div>

        {/* Cancel */}
        {reservation.status === "active" && (
          <button
            onClick={() => onCancel(reservation._id)}
            className="w-full inline-flex items-center justify-center px-4 py-2 
            border border-red-200 text-red-700 font-medium rounded-lg 
            hover:bg-red-50 transition-colors duration-200 
            focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-1"
          >
            <XMarkIcon className="w-4 h-4 mr-2" />
            Cancel Reservation
          </button>
        )}
      </div>
    </div>
  );
};

export default ReservationCard;
