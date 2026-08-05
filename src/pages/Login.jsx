import React, { useState } from "react";

export default function Login({ onLoginSuccess }) {
  const [email, setEmail] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    if (email.trim()) {
      onLoginSuccess(email); // បញ្ជូន Email ទៅកាន់ App.jsx ដើម្បី Login
    } else {
      alert("សូមបញ្ចូលគណនី (Email) របស់អ្នក!");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 khmer-font px-4">
      <div className="bg-white p-6 sm:p-8 rounded-3xl shadow-xl w-full max-w-md border border-gray-100">
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-blue-900 rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg">
            <span className="text-2xl text-white font-bold">GCM</span>
          </div>
          <h1 className="text-2xl font-bold text-blue-900 mb-2">
            ជី.ស៊ី.អឹម បេតុង
          </h1>
          <p className="text-sm text-gray-500">ប្រព័ន្ធគ្រប់គ្រងវិក្កយបត្រ</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1.5">
              គណនី (Email)
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="ឧទាហរណ៍: user@gmail.com"
              className="w-full border border-gray-200 rounded-xl p-3.5 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition bg-gray-50 focus:bg-white"
              required
            />
          </div>

          <button
            type="submit"
            className="w-full bg-blue-700 text-white font-bold rounded-xl p-3.5 hover:bg-blue-800 transition shadow-md flex items-center justify-center gap-2"
          >
            <svg
              className="w-5 h-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1"
              />
            </svg>
            ចូលប្រើប្រាស់ប្រព័ន្ធ
          </button>
        </form>
      </div>
    </div>
  );
}
