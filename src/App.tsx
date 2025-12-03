import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { TransactionProvider } from './contexts/TransactionContext';
import Header from './components/Layout/Header';
import Navigation from './components/Layout/Navigation';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import Transactions from './pages/Transactions';
import Review from './pages/Review';
import Approval from './pages/Approval';
import TransactionDetails from './pages/TransactionDetails';

function PrivateRoute({ children }: { children: React.ReactNode }) {
  const { isAuthenticated } = useAuth();
  return isAuthenticated ? <>{children}</> : <Navigate to="/login" />;
}

function AppLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <Navigation />
      <main>{children}</main>
    </div>
  );
}

function AppRoutes() {
  const { isAuthenticated } = useAuth();

  return (
    <Routes>
      <Route
        path="/login"
        element={isAuthenticated ? <Navigate to="/dashboard" /> : <Login />}
      />
      <Route
        path="/dashboard"
        element={
          <PrivateRoute>
            <AppLayout>
              <Dashboard />
            </AppLayout>
          </PrivateRoute>
        }
      />
      <Route
        path="/transactions"
        element={
          <PrivateRoute>
            <AppLayout>
              <Transactions />
            </AppLayout>
          </PrivateRoute>
        }
      />
      <Route
        path="/transactions/:id"
        element={
          <PrivateRoute>
            <AppLayout>
              <TransactionDetails />
            </AppLayout>
          </PrivateRoute>
        }
      />
      <Route
        path="/review"
        element={
          <PrivateRoute>
            <AppLayout>
              <Review />
            </AppLayout>
          </PrivateRoute>
        }
      />
      <Route
        path="/approval"
        element={
          <PrivateRoute>
            <AppLayout>
              <Approval />
            </AppLayout>
          </PrivateRoute>
        }
      />
      <Route path="/" element={<Navigate to="/dashboard" />} />
      <Route path="*" element={<Navigate to="/dashboard" />} />
    </Routes>
  );
}

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <TransactionProvider>
          <AppRoutes />
        </TransactionProvider>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;
