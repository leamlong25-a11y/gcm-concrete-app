import React, { useState, useEffect } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import Layout from "./components/layout/Layout";
import Auth from "./pages/Auth";
import Dashboard from "./pages/Dashboard";
import NewInvoice from "./pages/NewInvoice";
import InvoiceList from "./pages/InvoiceList";
import Reports from "./pages/Reports";
import Settings from "./pages/Settings";
import { db } from "./services/firebase";
import { ref, onValue } from "firebase/database";

function App() {
  const [user, setUser] = useState(localStorage.getItem("gcm_logged_user"));

  // ទាញយកទិន្នន័យពី Firebase Realtime Database មក Sync ទុកក្នុង LocalStorage ស្វ័យប្រវត្តិ
  useEffect(() => {
    if (user) {
      const safeKey = user.replace(/[.#$[\]]/g, "_");
      const invoicesRef = ref(db, `invoices/${safeKey}`);

      onValue(invoicesRef, (snapshot) => {
        const val = snapshot.val();
        let invoices = [];
        if (val) {
          invoices = Object.values(val);
        }
        localStorage.setItem("gcm_data", JSON.stringify(invoices));
        window.dispatchEvent(new Event("storage")); // ជូនដំណឹងឱ្យ Components ដឹងថាទិន្នន័យបាន Update
      });
    }
  }, [user]);

  if (!user) {
    return <Auth onLogin={setUser} />;
  }

  return (
    <Router>
      <Layout
        onLogout={() => {
          localStorage.removeItem("gcm_logged_user");
          setUser(null);
        }}
      >
        <Routes>
          <Route path="/" element={<Navigate to="/dashboard" />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/new-invoice" element={<NewInvoice />} />
          <Route path="/invoices" element={<InvoiceList />} />
          <Route path="/reports" element={<Reports />} />
          <Route path="/settings" element={<Settings />} />
        </Routes>
      </Layout>
    </Router>
  );
}

export default App;
