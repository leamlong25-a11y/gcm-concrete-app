import React, { useState } from "react";
import { NavLink } from "react-router-dom";

export default function Header({ onLogout }) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [accountMenuOpen, setAccountMenuOpen] = useState(false);
  const email = localStorage.getItem("gcm_logged_user") || "user@gmail.com";

  const navClass = ({ isActive }) =>
    `transition pb-1 border-b-2 khmer-font ${
      isActive
        ? "border-white text-white"
        : "border-transparent text-blue-200 hover:text-white"
    }`;

  return (
    <header className="bg-blue-900 text-white shadow-md sticky top-0 z-50 no-print">
      <div className="max-w-7xl mx-auto px-4 py-3 flex justify-between items-center relative">
        <div className="flex items-center space-x-2">
          <span className="text-xl font-bold khmer-font">ជី.ស៊ី.អឹម បេតុង</span>
          <span className="text-[10px] bg-emerald-600 px-2 py-0.5 rounded text-white font-bold">
            FIREBASE
          </span>
        </div>

        <nav className="hidden md:flex space-x-5 text-sm font-medium">
          <NavLink to="/dashboard" className={navClass}>
            ទំព័រដើម
          </NavLink>
          <NavLink to="/new-invoice" className={navClass}>
            បង្កើតវិក្កយបត្រ
          </NavLink>
          <NavLink to="/invoices" className={navClass}>
            ប្រវត្តិវិក្កយបត្រ
          </NavLink>
          <NavLink to="/reports" className={navClass}>
            របាយការណ៍
          </NavLink>
          <NavLink to="/settings" className={navClass}>
            ការកំណត់
          </NavLink>
        </nav>

        <div className="flex items-center gap-3">
          <div className="relative">
            <button
              onClick={() => setAccountMenuOpen(!accountMenuOpen)}
              className="w-10 h-10 rounded-full bg-blue-700 border-2 border-white/80 flex items-center justify-center font-bold text-white shadow hover:bg-blue-600 transition focus:outline-none"
            >
              {email.substring(0, 2).toUpperCase()}
            </button>

            {accountMenuOpen && (
              <div className="absolute right-0 mt-2 w-56 bg-white text-gray-800 rounded-2xl shadow-xl py-3 border border-gray-100 z-50 text-sm">
                <div className="px-4 py-2 border-b border-gray-100 mb-1">
                  <p className="text-[11px] text-gray-400 font-semibold uppercase tracking-wider">
                    Connected User
                  </p>
                  <p className="font-bold text-blue-900 truncate text-xs mt-0.5">
                    {email}
                  </p>
                </div>
                <button
                  onClick={() => {
                    setAccountMenuOpen(false);
                    onLogout();
                  }}
                  className="w-full text-left px-4 py-2.5 text-red-600 hover:bg-red-50 flex items-center gap-2.5 khmer-font font-semibold transition"
                >
                  {/* SVG Logout Icon ត្រឹមត្រូវតាមស្តង់ដារ */}
                  <svg
                    className="w-4 h-4 text-red-500"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
                    />
                  </svg>
                  ចាកចេញ (Logout)
                </button>
              </div>
            )}
          </div>

          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden text-white p-1"
          >
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M4 6h16M4 12h16m-7 6h7"
              ></path>
            </svg>
          </button>
        </div>
      </div>

      {mobileMenuOpen && (
        <div className="md:hidden bg-blue-800 px-4 pt-2 pb-4 space-y-2 border-t border-blue-700">
          <NavLink
            to="/dashboard"
            onClick={() => setMobileMenuOpen(false)}
            className="block w-full text-left py-2 px-3 rounded hover:bg-blue-700 khmer-font text-white"
          >
            ទំព័រដើម
          </NavLink>
          <NavLink
            to="/new-invoice"
            onClick={() => setMobileMenuOpen(false)}
            className="block w-full text-left py-2 px-3 rounded hover:bg-blue-700 khmer-font text-white"
          >
            បង្កើតវិក្កយបត្រ
          </NavLink>
          <NavLink
            to="/invoices"
            onClick={() => setMobileMenuOpen(false)}
            className="block w-full text-left py-2 px-3 rounded hover:bg-blue-700 khmer-font text-white"
          >
            ប្រវត្តិវិក្កយបត្រ
          </NavLink>
          <NavLink
            to="/reports"
            onClick={() => setMobileMenuOpen(false)}
            className="block w-full text-left py-2 px-3 rounded hover:bg-blue-700 khmer-font text-white"
          >
            របាយការណ៍
          </NavLink>
          <NavLink
            to="/settings"
            onClick={() => setMobileMenuOpen(false)}
            className="block w-full text-left py-2 px-3 rounded hover:bg-blue-700 khmer-font text-white"
          >
            ការកំណត់
          </NavLink>
        </div>
      )}
    </header>
  );
}
