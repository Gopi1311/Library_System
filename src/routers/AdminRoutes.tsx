import { Routes, Route } from "react-router-dom";

import Dashboard from "../pages/admin/Dashboard";
import Books from "../pages/admin/Books";
import Users from "../pages/admin/Users";
import Borrow from "../pages/admin/Borrow";
import Reservations from "../pages/admin/Reservations";
import Reviews from "../pages/admin/Reviews";
import Fines from "../pages/admin/Fines";

const AdminRoutes = () => {
  return (
    <Routes>
      <Route path="/" element={<Dashboard />} />
      <Route path="/books" element={<Books />} />
      <Route path="/users" element={<Users />} />
      <Route path="/borrow" element={<Borrow />} />
      <Route path="/reservations" element={<Reservations />} />
      <Route path="/reviews" element={<Reviews />} />
      <Route path="/fines" element={<Fines />} />
    </Routes>
  );
};

export default AdminRoutes;
