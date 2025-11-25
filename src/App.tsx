import { BrowserRouter, Routes, Route } from "react-router-dom";
import AppLayout from "./layout/AppLayout";

import { adminNavigation, userNavigation } from "./constants/navigation";

// Admin pages
import AdminDashboard from "./pages/admin/Dashboard";
import Books from "./pages/admin/Books";
import Users from "./pages/admin/Users";
import Borrows from "./pages/admin/Borrow";
import Reservations from "./pages/admin/Reservations";
import Reviews from "./pages/admin/Reviews";
import Fines from "./pages/admin/Fines";

// User pages
// import UserHome from "./pages/user/Home";
// import BookListPublic from "./pages/user/BookListPublic";
import BrowseBooks from "./pages/user/BrowseBooks";
import BookDetails from "./pages/user/BookDetails";
import MyBorrows from "./pages/user/MyBorrows";
import MyReservations from "./pages/user/MyReservations";
import MyFines from "./pages/user/MyFines";

const App = () => {
  const user = {
    id: "6923fdc88ec3f845a24f4a35",
    name: "Gopinath K",
    email: "gopinathk1311@gmail.com",
    role: "member",
  };

  const navigation = user.role === "admin" ? adminNavigation : userNavigation;

  return (
    <BrowserRouter>
      <AppLayout navigation={navigation} user={user}>
        <Routes>
          {user.role === "admin" && (
            <>
              <Route path="/" element={<AdminDashboard />} />
              <Route path="/books" element={<Books />} />
              <Route path="/users" element={<Users />} />
              <Route path="/borrow" element={<Borrows />} />
              <Route path="/reservations" element={<Reservations />} />
              <Route path="/reviews" element={<Reviews />} />
              <Route path="/fines" element={<Fines />} />
            </>
          )}

          {user.role !== "admin" && (
            <>
              <Route path="/" element={<BrowseBooks />} />
              <Route path="/user/books/:id" element={<BookDetails />} />
              <Route path="/user/myborrows" element={<MyBorrows />} />
              <Route path="/user/reservations" element={<MyReservations />} />
              <Route path="/user/fines" element={<MyFines />} />
            </>
          )}
        </Routes>
      </AppLayout>
    </BrowserRouter>
  );
};

export default App;
