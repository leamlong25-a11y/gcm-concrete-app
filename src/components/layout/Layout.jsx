import React from "react";
import Header from "./Header";

export default function Layout({ children, onLogout }) {
  return (
    <div className="bg-gray-100 min-h-screen flex flex-col">
      <Header onLogout={onLogout} />
      <main className="flex-grow max-w-7xl w-full mx-auto px-2 sm:px-4 py-6 mb-10">
        {children}
      </main>
    </div>
  );
}
