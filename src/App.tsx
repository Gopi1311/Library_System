import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';
import Dashboard from './pages/Dashboard';
import Books from './pages/Books';
import Users from './pages/Users';
import Borrow from './pages/Borrow';
import Reservations from './pages/Reservations';
import Reviews from './pages/Reviews';
import Fines from './pages/Fines';

const App: React.FC = () => {
  return (
    <Router>
      <Layout>
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/books" element={<Books />} />
          <Route path="/users" element={<Users />} />
          <Route path="/borrow" element={<Borrow />} />
          <Route path="/reservations" element={<Reservations />} />
          <Route path="/reviews" element={<Reviews />} />
          <Route path="/fines" element={<Fines />} />
        </Routes>
      </Layout>
    </Router>
  );
};

export default App;