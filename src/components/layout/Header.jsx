import React, { useState } from "react";
import { NavLink } from "react-router-dom";

export default function Header({ onLogout }) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [accountMenuOpen, setAccountMenuOpen] = useState(false);
  const email = localStorage.getItem("gcm_logged_user") || "user@gmail.com";

  const navClass = ({ isActive }) =>
    `px-3 py-2 rounded-xl text-xs sm:text-sm font-semibold transition khmer-font flex items-center gap-1.5 ${
      isActive
        ? "bg-blue-800 text-white shadow-sm"
        : "text-blue-100 hover:bg-blue-800/50"
    }`;

  return (
    <header className="bg-blue-900 text-white shadow-md sticky top-0 z-50 no-print">
      <div className="max-w-7xl mx-auto px-4 py-3 flex justify-between items-center relative">
        {/* Logo & Brand */}
        <div className="flex items-center space-x-2">
          <span className="text-base sm:text-xl font-bold khmer-font tracking-wide">
            ជី.ស៊ី.អឹម បេតុង
          </span>
          <span className="text-[9px] bg-emerald-600 px-1.5 py-0.5 rounded text-white font-bold">
            MOBILE
          </span>
        </div>

        {/* Desktop Nav */}
        <nav className="hidden md:flex space-x-2 text-sm font-medium">
          <NavLink to="/dashboard" className={navClass}>
            🏠 ទំព័រដើម
          </NavLink>
          <NavLink to="/new-invoice" className={navClass}>
            ➕ បង្កើតវិក្កយបត្រ
          </NavLink>
          <NavLink to="/invoices" className={navClass}>
            📋 ប្រវត្តិ
          </NavLink>
          <NavLink to="/reports" className={navClass}>
            📊 របាយការណ៍
          </NavLink>
          <NavLink to="/settings" className={navClass}>
            ⚙️ កំណត់
          </NavLink>
        </nav>

        {/* Right Section: Profile & Mobile Toggle */}
        <div className="flex items-center gap-2.5">
          <div className="relative">
            <button
              onClick={() => setAccountMenuOpen(!accountMenuOpen)}
              className="w-9 h-9 rounded-full bg-blue-700 border-2 border-white/80 flex items-center justify-center font-bold text-white shadow hover:bg-blue-600 transition focus:outline-none"
            >
              {email.substring(0, 2).toUpperCase()}
            </button>

            {accountMenuOpen && (
              <div className="absolute right-0 mt-2 w-64 bg-white text-gray-800 rounded-2xl shadow-2xl py-3 border border-gray-100 z-50 text-sm">
                <div className="px-4 py-2 border-b border-gray-100 mb-1">
                  <p className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">
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
                  className="w-full text-left px-4 py-3 text-red-600 hover:bg-red-50 flex items-center gap-3 khmer-font font-bold transition text-xs"
                >
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
                  ចាកចេញពីប្រព័ន្ធ (Logout)
                </button>
              </div>
            )}
          </div>

          {/* Hamburger Menu Button for Mobile */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden bg-blue-800 p-2 rounded-xl text-white focus:outline-none shadow-sm flex items-center gap-1.5 px-3"
          >
            <svg
              className="w-5 h-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              {mobileMenuOpen ? (
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2.5"
                  d="M6 18L18 6M6 6l12 12"
                ></path>
              ) : (
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2.5"
                  d="M4 6h16M4 12h16M4 18h16"
                ></path>
              )}
            </svg>
            <span className="text-xs font-bold khmer-font">ម៉ឺនុយ</span>
          </button>
        </div>
      </div>

      {/* Mobile Slide-down Menu as Cards Grid */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-blue-950 p-4 border-t border-blue-900 shadow-xl animate-fade-in">
          <p className="text-[11px] text-blue-300 font-semibold mb-3 khmer-font uppercase tracking-wider">
            📌 ជ្រើសរើសមុខងារ (Navigation Menu)
          </p>
          <div className="grid grid-cols-2 gap-2.5">
            <NavLink
              to="/dashboard"
              onClick={() => setMobileMenuOpen(false)}
              className={({ isActive }) =>
                `p-3 rounded-2xl flex flex-col items-center justify-center text-center transition khmer-font border ${isActive ? "bg-blue-600 border-blue-500 text-white shadow-lg" : "bg-blue-900/80 border-blue-800 text-blue-100 hover:bg-blue-800"}`
              }
            >
              <span className="text-2xl mb-1">🏠</span>
              <span className="text-xs font-bold">ទំព័រដើម</span>
            </NavLink>

            <NavLink
              to="/new-invoice"
              onClick={() => setMobileMenuOpen(false)}
              className={({ isActive }) =>
                `p-3 rounded-2xl flex flex-col items-center justify-center text-center transition khmer-font border ${isActive ? "bg-blue-600 border-blue-500 text-white shadow-lg" : "bg-blue-900/80 border-blue-800 text-blue-100 hover:bg-blue-800"}`
              }
            >
              <span className="text-2xl mb-1">➕</span>
              <span className="text-xs font-bold">បង្កើតវិក្កយបត្រ</span>
            </NavLink>

            <NavLink
              to="/invoices"
              onClick={() => setMobileMenuOpen(false)}
              className={({ isActive }) =>
                `p-3 rounded-2xl flex flex-col items-center justify-center text-center transition khmer-font border ${isActive ? "bg-blue-600 border-blue-500 text-white shadow-lg" : "bg-blue-900/80 border-blue-800 text-blue-100 hover:bg-blue-800"}`
              }
            >
              <span className="text-2xl mb-1">📋</span>
              <span className="text-xs font-bold">ប្រវត្តិវិក្កយបត្រ</span>
            </NavLink>

            <NavLink
              to="/reports"
              onClick={() => setMobileMenuOpen(false)}
              className={({ isActive }) =>
                `p-3 rounded-2xl flex flex-col items-center justify-center text-center transition khmer-font border ${isActive ? "bg-blue-600 border-blue-500 text-white shadow-lg" : "bg-blue-900/80 border-blue-800 text-blue-100 hover:bg-blue-800"}`
              }
            >
              <span className="text-2xl mb-1">📊</span>
              <span className="text-xs font-bold">របាយការណ៍</span>
            </NavLink>

            <NavLink
              to="/settings"
              onClick={() => setMobileMenuOpen(false)}
              className={({ isActive }) =>
                `col-span-2 p-3 rounded-2xl flex items-center justify-center gap-2 text-center transition khmer-font border ${isActive ? "bg-blue-600 border-blue-500 text-white shadow-lg" : "bg-blue-900/80 border-blue-800 text-blue-100 hover:bg-blue-800"}`
              }
            >
              <span className="text-xl">⚙️</span>
              <span className="text-xs font-bold">
                ការកំណត់ប្រព័ន្ធ (Settings)
              </span>
            </NavLink>
          </div>
        </div>
      )}
    </header>
  );
}
