import React, { useState, useEffect } from "react";
import {
  HashRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import Header from "./components/layout/Header";
import Dashboard from "./pages/Dashboard";
import NewInvoice from "./pages/NewInvoice";
import InvoiceList from "./pages/InvoiceList";
import Reports from "./pages/Reports";
import Settings from "./pages/Settings";
import Login from "./pages/Login";
import { db } from "./services/firebase";
import { ref, get, child } from "firebase/database";

export default function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loggedUser = localStorage.getItem("gcm_logged_user");
    if (loggedUser) {
      setIsLoggedIn(true);
      fetchUserData(loggedUser);
    } else {
      setLoading(false);
    }
  }, []);

  const fetchUserData = async (email) => {
    const safeKey = email.replace(/[.#$[\]]/g, "_");
    try {
      const snapshot = await get(child(ref(db), `invoices/${safeKey}`));
      if (snapshot.exists()) {
        const val = snapshot.val();
        const dataArr = val ? Object.values(val) : [];
        localStorage.setItem("gcm_data", JSON.stringify(dataArr));
      } else {
        localStorage.setItem("gcm_data", JSON.stringify([]));
      }
    } catch (err) {
      console.error("Firebase fetch error:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleLoginSuccess = (email) => {
    localStorage.setItem("gcm_logged_user", email);
    setIsLoggedIn(true);
    setLoading(true);
    fetchUserData(email);
  };

  const handleLogout = () => {
    localStorage.removeItem("gcm_logged_user");
    localStorage.removeItem("gcm_data");
    setIsLoggedIn(false);
  };

  if (loading && isLoggedIn) {
    return (
      <div className="flex h-screen items-center justify-center bg-gray-50 khmer-font">
        <div className="text-center space-y-3">
          <div className="w-10 h-10 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto"></div>
          <p className="text-sm font-semibold text-gray-600">
            កំពុងទាញយកទិន្នន័យ...
          </p>
        </div>
      </div>
    );
  }

  return (
    <Router>
      {!isLoggedIn ? (
        <Login onLoginSuccess={handleLoginSuccess} />
      ) : (
        <div className="min-h-screen bg-gray-50 flex flex-col">
          <Header onLogout={handleLogout} />
          <main className="flex-1 max-w-7xl w-full mx-auto p-4 sm:p-6">
            <Routes>
              <Route path="/" element={<Navigate to="/dashboard" replace />} />
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/new-invoice" element={<NewInvoice />} />
              <Route path="/invoices" element={<InvoiceList />} />
              <Route path="/reports" element={<Reports />} />
              <Route path="/settings" element={<Settings />} />
              <Route path="*" element={<Navigate to="/dashboard" replace />} />
            </Routes>
          </main>
        </div>
      )}
    </Router>
  );
}
