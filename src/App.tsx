import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import AdminRoutes from "./routers/AdminRoutes";
import MemberRoutes from "./routers/MemberRouters";
import ProtectedRoute from "./routers/ProtectedRoute";

import AppLayout from "./layout/AppLayout";
import { adminNavigation, userNavigation } from "./constants/navigation";
import Login from "./pages/auth/Login";
import Register from "./pages/auth/Register";
const AppRouter = () => {
  const userString = localStorage.getItem("user");
  const user = userString ? JSON.parse(userString) : null;

  const navigation = user.role === "admin" ? adminNavigation : userNavigation;

  return (
    <BrowserRouter>
      <AppLayout navigation={navigation} user={user}>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Routes>
          <Route
            path="/admin/*"
            element={
              <ProtectedRoute
                userRole={user.role}
                allowed={["admin"]}
                element={<AdminRoutes />}
              />
            }
          />

          <Route
            path="/user/*"
            element={
              <ProtectedRoute
                userRole={user.role}
                allowed={["member", "librarian"]}
                element={<MemberRoutes />}
              />
            }
          />

          <Route
            path="/"
            element={
              user.role === "admin" ? (
                <Navigate to="/admin" />
              ) : (
                <Navigate to="/user/home" />
              )
            }
          />

          <Route path="/unauthorized" element={<h1>Unauthorized</h1>} />
        </Routes>
      </AppLayout>
    </BrowserRouter>
  );
};

export default AppRouter;
