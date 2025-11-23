import React, { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import Header from "./Header";
import Footer from "./Footer";

interface LayoutProps {
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
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

  return (
    <div className="flex h-screen overflow-hidden">

      {/* Sidebar */}
      <aside
        className={`
          fixed top-0 left-0 h-full w-64 bg-white shadow-lg z-50
          transition-transform duration-300
          ${isSidebarOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"}
        `}
      >
        {/* Sidebar Header */}
       {/* Sidebar Header */}
<div className="p-4 bg-gray-50 flex items-center space-x-3">
  <div className="w-8 h-8 bg-blue-600 text-white font-bold flex items-center justify-center rounded-lg">
    L
  </div>

  <h1 className="text-lg font-bold text-gray-800">Library System</h1>

  {/* Close (Mobile only) */}
  <button
    className="ml-auto lg:hidden text-gray-600 hover:bg-gray-100 p-2 rounded-md"
    onClick={() => setIsSidebarOpen(false)}
  >
    ✖
  </button>
</div>


        {/* Nav */}
        <nav className="p-4 overflow-y-auto h-[calc(100vh-140px)]">
          <ul className="space-y-2">
            {navigation.map((item) => (
              <li key={item.name}>
                <Link
                  to={item.href}
                  onClick={() => setIsSidebarOpen(false)}
                  className={`
                    flex items-center px-3 py-3 rounded-lg border-l-4 transition-all
                    ${
                      isActive(item.href)
                        ? "bg-blue-100 text-blue-700 border-blue-600"
                        : "text-gray-700 hover:bg-gray-100 border-transparent"
                    }
                  `}
                >
                  <span className="w-8 text-center">{item.icon}</span>
                  <span>{item.name}</span>
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        {/* Sidebar Footer */}
        <div className="p-4 border-t bg-white">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-blue-100 text-blue-600 flex items-center justify-center rounded-full font-semibold">
              A
            </div>
            <div>
              <p className="text-sm font-medium">Admin User</p>
              <p className="text-xs text-gray-500">admin@library.com</p>
            </div>
          </div>
        </div>
      </aside>

      {/* Main content */}
      <div className="flex flex-col flex-1 h-screen overflow-hidden lg:ml-64">
        <Header onMenuToggle={() => setIsSidebarOpen(true)} />

        <main className="flex-1 overflow-y-auto p-4 md:p-6 bg-gray-50">
          {children}
        </main>

        <Footer />
      </div>

      {/* Mobile overlay */}
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
