import React from "react";
import { useLocation } from "react-router-dom";

interface HeaderProps {
  onMenuToggle: () => void;
}

const pageTitles: Record<string, string> = {
  "/": "Dashboard",
  "/books": "Book Collection",
  "/users": "User Management",
  "/borrow": "Borrow Management",
  "/reservations": "Reservations",
  "/reviews": "Reviews",
  "/fines": "Fines & Payments",
};

const Header: React.FC<HeaderProps> = ({ onMenuToggle }) => {
  const { pathname } = useLocation();
  const title = pageTitles[pathname] || "Library System";

  return (
    <header className="bg-white/80 backdrop-blur-md shadow-md sticky top-0 z-40">
      <div className="flex items-center justify-between p-4">

        {/* Mobile Menu Button */}
        <button
          onClick={onMenuToggle}
          className="lg:hidden p-2 rounded-md text-gray-600 hover:bg-gray-100 transition"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
              d="M4 6h16M4 12h16M4 18h16"
            />
          </svg>
        </button>

        {/* Page Title */}
        <h1 className="text-2xl font-bold text-gray-900">
          {title}
        </h1>

        {/* Right Section */}
        <div className="flex items-center space-x-4">

          {/* Notification Bell */}
          <button className="relative p-2 rounded-full hover:bg-gray-100 transition">
            <svg className="w-6 h-6 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                d="M15 17h5l-1.405-1.405A2.032 2.032 
                0 0118 14.158V11a6.002 6.002 
                0 00-4-5.659V4a2 2 0 
                10-4 0v1.341C7.67 6.165 
                6 8.388 6 11v3.159c0 
                .538-.214 1.055-.595 
                1.436L4 17h5m6 0v1a3 
                3 0 11-6 0v-1m6 0H9"
              />
            </svg>
            <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
          </button>

          {/* User Avatar */}
          <div className="w-9 h-9 bg-blue-600 rounded-full flex items-center justify-center text-white font-semibold cursor-pointer">
            A
          </div>
        </div>

      </div>
    </header>
  );
};

export default Header;
