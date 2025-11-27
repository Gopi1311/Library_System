import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { useState } from "react";

import AdminRoutes from "./routers/AdminRoutes";
import MemberRoutes from "./routers/MemberRouters";
import ProtectedRoute from "./routers/ProtectedRoute";

import AppLayout from "./layout/AppLayout";
import { adminNavigation, userNavigation } from "./constants/navigation";

import Login from "./pages/auth/Login";
import Register from "./pages/auth/Register";

const AppRouter = () => {
  const [user, setUser] = useState(() => {
    const saved = localStorage.getItem("user");
    return saved ? JSON.parse(saved) : null;
  });

  const navigation = user?.role === "admin" ? adminNavigation : userNavigation;

  return (
    <BrowserRouter>
      <Routes>
        {/* public routes */}
        <Route path="/login" element={<Login setUser={setUser} />} />
        <Route path="/register" element={<Register />} />

        {/* protected routes wrapped inside layout */}
        <Route
          path="/*"
          element={
            <AppLayout user={user} setUser={setUser} navigation={navigation}>
              <Routes>
                <Route
                  path="/admin/*"
                  element={
                    <ProtectedRoute
                      userRole={user?.role}
                      allowed={["admin"]}
                      element={<AdminRoutes />}
                    />
                  }
                />

                <Route
                  path="/user/*"
                  element={
                    <ProtectedRoute
                      userRole={user?.role}
                      allowed={["member", "librarian"]}
                      element={<MemberRoutes />}
                    />
                  }
                />

                <Route
                  path="/"
                  element={
                    user?.role === "admin"
                      ? <Navigate to="/admin" />
                      : <Navigate to="/user/home" />
                  }
                />

                <Route path="/unauthorized" element={<h1>Unauthorized</h1>} />
              </Routes>
            </AppLayout>
          }
        />
      </Routes>
    </BrowserRouter>
  );
};

export default AppRouter;
