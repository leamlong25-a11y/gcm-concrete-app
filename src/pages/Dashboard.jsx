import React, { useState, useEffect } from "react";

export default function Dashboard() {
  const [stats, setStats] = useState({
    totalInv: 0,
    totalRev: 0,
    totalProfit: 0,
  });
  const [recentInvoices, setRecentInvoices] = useState([]);

  useEffect(() => {
    const data = JSON.parse(localStorage.getItem("gcm_data") || "[]");
    let rev = 0,
      prof = 0;
    const recent = [];

    data.forEach((inv, i) => {
      rev += inv.revenue || 0;
      prof += inv.profit || 0;
      if (i < 5) recent.push(inv); // เอา 5 វិក្កយបត្រចុងក្រោយ
    });

    setStats({ totalInv: data.length, totalRev: rev, totalProfit: prof });
    setRecentInvoices(recent);
  }, []);

  return (
    <div className="space-y-6 fade-in pb-10">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center bg-white p-6 rounded-2xl shadow-sm border border-gray-100 gap-2">
        <div>
          <h1 className="text-2xl font-bold text-gray-800 khmer-font">
            ទំព័រដើម (Dashboard)
          </h1>
          <p className="text-sm text-gray-500 mt-0.5 khmer-font">
            សូមស្វាគមន៍មកកាន់ប្រព័ន្ធគ្រប់គ្រងការលក់បេតុង GCM
          </p>
        </div>
        <div className="text-xs bg-blue-50 text-blue-700 font-semibold px-3 py-1.5 rounded-full border border-blue-100">
          🟢 System Active & Synced
        </div>
      </div>

      {/* Stats Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        {/* Total Invoices */}
        <div className="bg-gradient-to-br from-white to-blue-50/50 p-6 rounded-2xl shadow-sm border border-blue-100/80 flex items-center justify-between transition hover:shadow-md">
          <div className="space-y-1">
            <p className="text-xs font-bold uppercase tracking-wider text-blue-600 khmer-font">
              វិក្កយបត្រសរុប
            </p>
            <h2 className="text-3xl font-extrabold text-gray-900">
              {stats.totalInv}
            </h2>
            <p className="text-xs text-gray-400 khmer-font">
              ចំនួនវិក្កយបត្រសរុបក្នុងប្រព័ន្ធ
            </p>
          </div>
          <div className="w-14 h-14 bg-blue-600 text-white rounded-2xl flex items-center justify-center text-2xl shadow-lg shadow-blue-500/30">
            📄
          </div>
        </div>

        {/* Total Revenue */}
        <div className="bg-gradient-to-br from-white to-indigo-50/50 p-6 rounded-2xl shadow-sm border border-indigo-100/80 flex items-center justify-between transition hover:shadow-md">
          <div className="space-y-1">
            <p className="text-xs font-bold uppercase tracking-wider text-indigo-600 khmer-font">
              ចំណូលសរុប
            </p>
            <h2 className="text-3xl font-extrabold text-indigo-900">
              ${stats.totalRev.toFixed(2)}
            </h2>
            <p className="text-xs text-gray-400 khmer-font">
              ទឹកប្រាក់លក់បានសរុប
            </p>
          </div>
          <div className="w-14 h-14 bg-indigo-600 text-white rounded-2xl flex items-center justify-center text-2xl shadow-lg shadow-indigo-500/30">
            💰
          </div>
        </div>

        {/* Total Profit */}
        <div className="bg-gradient-to-br from-white to-emerald-50/50 p-6 rounded-2xl shadow-sm border border-emerald-100/80 flex items-center justify-between transition hover:shadow-md">
          <div className="space-y-1">
            <p className="text-xs font-bold uppercase tracking-wider text-emerald-600 khmer-font">
              ប្រាក់ចំណេញសរុប
            </p>
            <h2 className="text-3xl font-extrabold text-emerald-600">
              ${stats.totalProfit.toFixed(2)}
            </h2>
            <p className="text-xs text-gray-400 khmer-font">
              ប្រាក់ចំណេញសុទ្ធសរុប
            </p>
          </div>
          <div className="w-14 h-14 bg-emerald-600 text-white rounded-2xl flex items-center justify-center text-2xl shadow-lg shadow-emerald-500/30">
            📈
          </div>
        </div>
      </div>

      {/* Recent Invoices Table Section */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="p-6 border-b border-gray-100 flex justify-between items-center">
          <h2 className="text-base font-bold text-gray-800 khmer-font flex items-center gap-2">
            🕒 វិក្កយបត្រថ្មីៗ (Recent Invoices)
          </h2>
          <span className="text-xs text-gray-400">បង្ហាញ ៥ ចុងក្រោយ</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm whitespace-nowrap">
            <thead>
              <tr className="bg-gray-50/70 text-gray-500 font-semibold text-xs uppercase tracking-wider border-b border-gray-100">
                <th className="py-4 px-6">កាលបរិច្ឆេទ (Date)</th>
                <th className="py-4 px-6">អតិថិជន (Customer)</th>
                <th className="py-4 px-6">ទីតាំង (Location)</th>
                <th className="py-4 px-6">បរិមាណ (Qty)</th>
                <th className="py-4 px-6 text-right">ទឹកប្រាក់ (Amount)</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 text-gray-700">
              {recentInvoices.length > 0 ? (
                recentInvoices.map((inv, index) => (
                  <tr key={index} className="hover:bg-blue-50/40 transition">
                    <td className="py-4 px-6 font-medium text-gray-600">
                      {inv.displayDate}
                    </td>
                    <td className="py-4 px-6 font-bold text-blue-900">
                      {inv.customer}
                    </td>
                    <td className="py-4 px-6 text-gray-500">
                      {inv.location || "-"}
                    </td>
                    <td className="py-4 px-6">
                      <span className="bg-gray-100 text-gray-700 px-2.5 py-1 rounded-full text-xs font-semibold">
                        {inv.totalQty} m³
                      </span>
                    </td>
                    <td className="py-4 px-6 text-right font-extrabold text-red-600">
                      ${inv.revenue?.toFixed(2)}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td
                    colSpan="5"
                    className="py-8 text-center text-gray-400 khmer-font"
                  >
                    មិនទាន់មានទិន្នន័យវិក្កយបត្រនៅឡើយទេ
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
