
// import React, { useState } from "react";
// import { Link, useLocation } from "react-router-dom";
// import Header from "./Header";
// import Footer from "./Footer";

// interface LayoutProps {
//   children: React.ReactNode;
// }

// const Layout: React.FC<LayoutProps> = ({ children }) => {
//   const [isSidebarOpen, setIsSidebarOpen] = useState(false);
//   const location = useLocation();

//   const navigation = [
//     { name: "Dashboard", href: "/", icon: "📊" },
//     { name: "Books", href: "/books", icon: "📚" },
//     { name: "Users", href: "/users", icon: "👥" },
//     { name: "Borrow", href: "/borrow", icon: "📖" },
//     { name: "Reservations", href: "/reservations", icon: "⏰" },
//     { name: "Reviews", href: "/reviews", icon: "⭐" },
//     { name: "Fines", href: "/fines", icon: "💰" },
//   ];

//   const isActive = (path: string) => location.pathname === path;

//   return (
//     <div className="min-h-screen bg-gray-50 flex flex-col">

//       {/* 🔹 HEADER - Full width ALWAYS */}
//       <Header onMenuToggle={() => setIsSidebarOpen(true)} />

//       {/* 🔹 MAIN WRAPPER */}
//       <div className="flex flex-1">

//         {/* 🔹 SIDEBAR */}
//         <aside
//           className={`
//             fixed inset-y-0 left-0 z-50 w-64 bg-white shadow-lg
//             transform transition-transform duration-300 ease-in-out
//             ${isSidebarOpen ? "translate-x-0" : "-translate-x-full"}
//             lg:translate-x-0 lg:static lg:inset-0
//           `}
//         >
//           <div className="flex items-center justify-between p-4 border-b">
//             <div className="flex items-center space-x-3">
//               <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center text-white font-bold">
//                 L
//               </div>
//               <h1 className="text-xl font-bold text-gray-800">
//                 Library System
//               </h1>
//             </div>
//             <button
//               onClick={() => setIsSidebarOpen(false)}
//               className="lg:hidden p-2 rounded-md text-gray-600 hover:bg-gray-100 transition-colors"
//             >
//               ✖
//             </button>
//           </div>

//           <nav className="p-4">
//             <ul className="space-y-2">
//               {navigation.map((item) => (
//                 <li key={item.name}>
//                   <Link
//                     to={item.href}
//                     onClick={() => setIsSidebarOpen(false)}
//                     className={`flex items-center space-x-3 px-3 py-3 rounded-lg border-l-4 transition-colors
//                       ${
//                         isActive(item.href)
//                           ? "bg-blue-100 text-blue-700 font-medium border-blue-600"
//                           : "text-gray-700 hover:bg-gray-100 border-transparent"
//                       }
//                     `}
//                   >
//                     <span className="text-lg w-6 text-center">{item.icon}</span>
//                     <span>{item.name}</span>
//                   </Link>
//                 </li>
//               ))}
//             </ul>
//           </nav>

//           {/* Sidebar Footer */}
//           <div className="absolute bottom-0 left-0 right-0 p-4 border-t bg-white">
//             <div className="flex items-center space-x-3">
//               <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
//                 <span className="text-blue-600 font-semibold text-sm">A</span>
//               </div>
//               <div className="flex-1 min-w-0">
//                 <p className="text-sm font-medium text-gray-900 truncate">
//                   Admin User
//                 </p>
//                 <p className="text-xs text-gray-500 truncate">
//                   admin@library.com
//                 </p>
//               </div>
//             </div>
//           </div>
//         </aside>

//         {/* 🔹 CONTENT AREA */}
//         <main className="flex-1 lg:ml-64 p-4 md:p-6">{children}</main>
//       </div>

//       {/* 🔹 FOOTER */}
//       <Footer />

//       {/* 🔹 Mobile Overlay */}
//       {isSidebarOpen && (
//         <div
//           className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
//           onClick={() => setIsSidebarOpen(false)}
//         />
//       )}
//     </div>
//   );
// };

// export default Layout;

import React, { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import Header from "./Header";
import Footer from "./Footer";

interface LayoutProps {
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);  // Mobile toggle
  const [isCollapsed, setIsCollapsed] = useState(false);       // Desktop collapse
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

  // Sidebar width
  const sidebarWidth = isCollapsed ? "w-20" : "w-64";
  const contentMargin = isCollapsed ? "lg:ml-20" : "lg:ml-64";

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">

      {/* Header */}
      <Header onMenuToggle={() => setIsSidebarOpen(true)} />

      <div className="flex flex-1">

        {/* Sidebar */}
        <aside
          className={`
            fixed inset-y-0 left-0 z-50 bg-white shadow-lg 
            transform transition-all duration-300 ease-in-out
            ${sidebarWidth}
            ${isSidebarOpen ? "translate-x-0" : "-translate-x-full"}
            lg:translate-x-0 lg:static
          `}
        >
          {/* Sidebar Header */}
          <div className="flex items-center justify-between p-4 border-b">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center text-white font-bold">
                L
              </div>
              {!isCollapsed && (
                <h1 className="text-xl font-bold text-gray-800">
                  Library System
                </h1>
              )}
            </div>

            {/* Collapse Toggle Button */}
            <button
              onClick={() => setIsCollapsed(!isCollapsed)}
              className="hidden lg:flex p-2 rounded-md text-gray-600 hover:bg-gray-100 transition-colors"
            >
              {isCollapsed ? "➡️" : "⬅️"}
            </button>

            {/* Close Button (Mobile) */}
            <button
              onClick={() => setIsSidebarOpen(false)}
              className="lg:hidden p-2 rounded-md text-gray-600 hover:bg-gray-100 transition-colors"
            >
              ✖
            </button>
          </div>

          {/* Navigation */}
          <nav className="p-4">
            <ul className="space-y-2">
              {navigation.map((item) => (
                <li key={item.name}>
                  <Link
                    to={item.href}
                    onClick={() => setIsSidebarOpen(false)}
                    className={`flex items-center px-3 py-3 rounded-lg border-l-4 transition-all ${
                      isActive(item.href)
                        ? "bg-blue-100 text-blue-700 font-medium border-blue-600"
                        : "text-gray-700 hover:bg-gray-100 border-transparent"
                    }`}
                  >
                    {/* Icon */}
                    <span className="text-lg w-10 text-center">{item.icon}</span>

                    {/* Text (hide when collapsed) */}
                    {!isCollapsed && <span>{item.name}</span>}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          {/* Sidebar Footer */}
          <div className="absolute bottom-0 left-0 right-0 p-4 border-t bg-white">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                <span className="text-blue-600 font-semibold text-sm">A</span>
              </div>

              {!isCollapsed && (
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-900 truncate">Admin User</p>
                  <p className="text-xs text-gray-500 truncate">admin@library.com</p>
                </div>
              )}
            </div>
          </div>
        </aside>

        {/* Content */}
        <main className={`flex-1 p-4 md:p-6 transition-all duration-300 ${contentMargin}`}>
          {children}
        </main>
      </div>

      <Footer />

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

