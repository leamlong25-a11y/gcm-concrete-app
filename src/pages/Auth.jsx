import React, { useState } from "react";
import { db } from "../services/firebase";
import { ref, get, set, child } from "firebase/database";

export default function Auth({ onLogin }) {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email || !password) return;

    const safeKey = email.replace(/[.#$[\]]/g, "_");
    const dbRef = ref(db);

    try {
      if (isLogin) {
        // ដំណើរការ Login
        const snapshot = await get(child(dbRef, `users/${safeKey}`));
        if (snapshot.exists() && snapshot.val().pass === password) {
          localStorage.setItem("gcm_logged_user", email);
          onLogin(email);
        } else {
          alert("អ៊ីមែល ឬ ពាក្យសម្ងាត់មិនត្រឹមត្រូវទេ!");
        }
      } else {
        // ដំណើរការ Register
        await set(ref(db, `users/${safeKey}`), { pass: password });
        localStorage.setItem("gcm_logged_user", email);
        alert("ចុះឈ្មោះជោគជ័យ!");
        onLogin(email);
      }
    } catch (error) {
      alert("កំហុស: " + error.message);
    }
  };

  return (
    <div className="fixed inset-0 bg-blue-900 flex items-center justify-center z-[100] px-4">
      <div className="bg-white p-8 rounded-2xl shadow-2xl w-full max-w-sm text-center fade-in">
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-blue-900 khmer-font">
            ជី.ស៊ី.អឹម បេតុង
          </h1>
          <p className="text-sm text-gray-500 font-semibold mt-1">
            Firebase Cloud System
          </p>
        </div>

        <div className="flex rounded-lg bg-gray-100 p-1 mb-6 text-xs font-bold khmer-font">
          <button
            onClick={() => setIsLogin(true)}
            className={`flex-1 py-2 rounded-md transition ${isLogin ? "bg-white text-blue-900 shadow-sm" : "text-gray-500"}`}
          >
            ចូលគណនី
          </button>
          <button
            onClick={() => setIsLogin(false)}
            className={`flex-1 py-2 rounded-md transition ${!isLogin ? "bg-white text-emerald-700 shadow-sm" : "text-gray-500"}`}
          >
            បង្កើតថ្មី
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4 text-left">
          <div>
            <label className="block text-xs font-semibold text-gray-600 mb-1 khmer-font">
              អ៊ីមែល (Email)
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full border rounded-lg p-3 text-sm outline-none focus:border-blue-500"
              placeholder="user@gmail.com"
              required
            />
          </div>
          <div>
            <label className="block text-xs font-semibold text-gray-600 mb-1 khmer-font">
              ពាក្យសម្ងាត់ (Password)
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full border rounded-lg p-3 text-sm outline-none focus:border-blue-500"
              placeholder="••••••••"
              required
            />
          </div>
          <button
            type="submit"
            className={`w-full text-white font-bold py-3 rounded-lg transition mt-2 khmer-font ${isLogin ? "bg-blue-600 hover:bg-blue-700" : "bg-emerald-600 hover:bg-emerald-700"}`}
          >
            {isLogin ? "ចូលប្រព័ន្ធ (Login)" : "ចុះឈ្មោះ (Register)"}
          </button>
        </form>
      </div>
    </div>
  );
}
