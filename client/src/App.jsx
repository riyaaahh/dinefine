import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import Login from './pages/Login';
import AdminDashboard from './pages/AdminDashboard';
import ChefDashboard from './pages/ChefDashboard';
import SupplierDashboard from './pages/SupplierDashboard';
import CustomerMenu from './pages/CustomerMenu';
import OrderStatus from './pages/OrderStatus';

function App() {
  return (
    <Router>
      <div className="app">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/menu/:tableId" element={<CustomerMenu />} />
          <Route path="/order-status/:orderId" element={<OrderStatus />} />

          <Route path="/admin/*" element={<AdminDashboard />} />
          <Route path="/chef/*" element={<ChefDashboard />} />
          <Route path="/supplier/*" element={<SupplierDashboard />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
