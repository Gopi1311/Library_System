import React, { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import Header from "./Header";
import Footer from "./Footer";

interface LayoutProps {
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isCollapsed, setIsCollapsed] = useState(false);
  const location = useLocation();

  const navigation = [
    { name: "Dashboard", href: "/", icon: "📊" },
    { name: "Books", href: "/books", icon: "📚" },
    { name: "Users", href: "/users", icon: "👥" },
    { name: "Borrow", href: "/borrow", icon: "📖" },
    { name: "Reservations", href: "/reservations", icon: "⏰" },
    { name: "Reviews", href: "/reviews", icon: "⭐" },
    { name: "Fines", href: "/fines", icon: "💰" },
  ];

  const isActive = (path: string) => location.pathname === path;

  const sidebarWidth = isCollapsed ? "w-20" : "w-64";
  const headerMargin = isCollapsed ? "lg:ml-20" : "lg:ml-64";

  return (
    <div className="min-h-screen bg-gray-50 flex">

      {/* ---- Sidebar (fixed & full height) ---- */}
      <aside
        className={`fixed top-0 left-0 h-screen bg-white shadow-lg z-50
          transform transition-all duration-300 ease-in-out
          ${sidebarWidth}
          ${isSidebarOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"}
        `}
      >
        {/* Sidebar Top */}
        <div className="flex items-center justify-between p-4 border-b">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center text-white font-bold">L</div>
            {!isCollapsed && <h1 className="text-xl font-bold text-gray-800">Library System</h1>}
          </div>

          {/* Collapse button (Desktop) */}
          <button
            onClick={() => setIsCollapsed(!isCollapsed)}
            className="hidden lg:flex p-2 rounded-md text-gray-600 hover:bg-gray-100"
          >
            {isCollapsed ? "➡️" : "⬅️"}
          </button>

          {/* Close button (Mobile) */}
          <button
            onClick={() => setIsSidebarOpen(false)}
            className="lg:hidden p-2 rounded-md text-gray-600 hover:bg-gray-100"
          >
            ✖
          </button>
        </div>

        {/* Navigation */}
        <nav className="p-4 overflow-y-auto h-[calc(100vh-150px)]">
          <ul className="space-y-2">
            {navigation.map((item) => (
              <li key={item.name}>
                <Link
                  to={item.href}
                  onClick={() => setIsSidebarOpen(false)}
                  className={`flex items-center px-3 py-3 rounded-lg border-l-4
                    transition-all
                    ${
                      isActive(item.href)
                        ? "bg-blue-100 text-blue-700 border-blue-600"
                        : "text-gray-700 hover:bg-gray-100 border-transparent"
                    }
                  `}
                >
                  <span className="text-lg w-10 text-center">{item.icon}</span>
                  {!isCollapsed && <span>{item.name}</span>}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        {/* Sidebar Footer */}
        <div className="absolute bottom-0 left-0 right-0 lg:p-4.5 p-4 border-t bg-white">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
              <span className="text-blue-600 font-semibold text-sm">A</span>
            </div>
            {!isCollapsed && (
              <div>
                <p className="text-sm font-medium">Admin User</p>
                <p className="text-xs text-gray-500">admin@library.com</p>
              </div>
            )}
          </div>
        </div>
      </aside>

      {/* ---- Main Content (Shifted by Sidebar) ---- */}
      <div className={`flex flex-col flex-1 min-h-screen transition-all duration-300 ${headerMargin}`}>

        {/* Header */}
        <Header onMenuToggle={() => setIsSidebarOpen(true)} />

        {/* Scrollable Content */}
        <main className="flex-1  overflow-y-auto  p-4 md:p-6">
          {children}
        </main>

        {/* Footer */}
        <Footer />
      </div>

      {/* Mobile Overlay */}
      {isSidebarOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}
    </div>
  );
};

export default Layout;
