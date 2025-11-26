import { Routes, Route } from "react-router-dom";

import BrowseBooks from "../pages/user/BrowseBooks";
import BookDetails from "../pages/user/BookDetails";
import MyBorrows from "../pages/user/MyBorrows";
import MyReservations from "../pages/user/MyReservations";
import MyFines from "../pages/user/MyFines";
import MyProfile from "../pages/user/MyProfile";
import UserHome from "../pages/user/UserHome";

const MemberRoutes = () => {
  return (
    <Routes>
      <Route path="/home" element={<UserHome />} />
      <Route path="/browsebook" element={<BrowseBooks />} />
      <Route path="/books/:id" element={<BookDetails />} />
      <Route path="/myborrows" element={<MyBorrows />} />
      <Route path="/reservations" element={<MyReservations />} />
      <Route path="/fines" element={<MyFines />} />
      <Route path="/profile" element={<MyProfile />} />
    </Routes>
  );
};

export default MemberRoutes;
