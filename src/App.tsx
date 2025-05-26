import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';
import Dashboard from './pages/Dashboard';
import Invoices from './pages/Invoices';
import Clients from './pages/Clients';
import Login from './pages/Login';
import Register from './pages/Register';
import InvoiceDetail from './pages/InvoiceDetail';
import ClientDetail from './pages/ClientDetail';
import UploadInvoice from './pages/UploadInvoice';
import { InvoiceProvider } from './context/InvoiceContext';
import { AuthProvider } from './context/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';

function App() {
  return (
    <AuthProvider>
      <InvoiceProvider>
        <Router>
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route element={<ProtectedRoute><Layout /></ProtectedRoute>}>
              <Route path="/" element={<Dashboard />} />
              <Route path="/invoices" element={<Invoices />} />
              <Route path="/invoices/:id" element={<InvoiceDetail />} />
              <Route path="/upload" element={<UploadInvoice />} />
              <Route path="/clients" element={<Clients />} />
              <Route path="/clients/:id" element={<ClientDetail />} />
            </Route>
          </Routes>
        </Router>
      </InvoiceProvider>
    </AuthProvider>
  );
}

export default App;