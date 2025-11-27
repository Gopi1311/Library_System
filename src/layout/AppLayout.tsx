import React, { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import Header from "../components/Header";
import Footer from "../components/Footer";
import { api } from "../congif/api";
interface LayoutProps {
  children: React.ReactNode;
  navigation: { name: string; href: string; icon: string }[];
  user: { name: string; email: string; role: string } | null;
  setUser: (user: any) => void;
}

const AppLayout: React.FC<LayoutProps> = ({
  children,
  navigation,
  user,
  setUser,
}) => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const location = useLocation();

  const isActive = (path: string) => location.pathname === path;

  const navigate = useNavigate();
  const handleLogout = async () => {
    try {
      await api.post("/auth/logout", {}, { withCredentials: true });
      localStorage.removeItem("user");
      setUser(null);
      navigate("/login", { replace: true });
      window.location.reload();
    } catch (err) {
      console.error("Logout error:", err);
      alert("Unable to logout. Try again.");
    }
  };

  return (
    <div className="flex h-screen overflow-hidden">
      {/* Sidebar */}
      <aside
        className={`fixed top-0 left-0 h-full w-64 bg-white shadow-lg z-50
        transition-transform duration-300
        ${
          isSidebarOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
        }
      `}
      >
        {/* Sidebar Header */}
        <div className="p-4 bg-gray-50 flex items-center space-x-3">
          <div className="w-8 h-8 bg-blue-600 text-white font-bold flex items-center justify-center rounded-lg">
            L
          </div>
          <h1 className="text-lg font-bold">Library System</h1>

          <button
            className="ml-auto lg:hidden text-gray-600 hover:bg-gray-100 p-2 rounded-md"
            onClick={() => setIsSidebarOpen(false)}
          >
            ✖
          </button>
        </div>

        {/* Navigation */}
        <nav className="p-4 overflow-y-auto h-[calc(100vh-140px)]">
          <ul className="space-y-2">
            {navigation.map((item) => (
              <li key={item.name}>
                <Link
                  to={item.href}
                  onClick={() => setIsSidebarOpen(false)}
                  className={`flex items-center px-3 py-3 rounded-lg border-l-4 transition-all 
                    ${
                      isActive(item.href)
                        ? "bg-blue-100 text-blue-700 border-blue-600"
                        : "text-gray-700 hover:bg-gray-100 border-transparent"
                    }`}
                >
                  <span className="w-8 text-center">{item.icon}</span>
                  <span>{item.name}</span>
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        {/*sideBar Footer */}
        <div className="p-4 border-t bg-white">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-blue-100 text-blue-600 flex items-center justify-center rounded-full font-semibold">
              {user?.name?.charAt(0) ?? "U"}
            </div>
            <div>
              <p className="text-sm font-medium">
                {user?.name ?? "Unknown User"}
              </p>
            </div>

            <button
              onClick={handleLogout}
              className="flex items-center  text-white bg-red-600 px-2 py-1 rounded hover:bg-red-400 "  >
              🚪 Logout
            </button>
          </div>
        </div>
      </aside>

      {/* MAIN CONTENT */}
      <div className="flex flex-col flex-1 h-screen overflow-hidden lg:ml-64">
        <Header onMenuToggle={() => setIsSidebarOpen(true)} />
        <main className="flex-1 overflow-y-auto p-4 md:p-6 bg-gray-50">
          {children}
        </main>
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

export default AppLayout;
