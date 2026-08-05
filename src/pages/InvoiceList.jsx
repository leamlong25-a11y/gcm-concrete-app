import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { db } from "../services/firebase";
import { ref, remove } from "firebase/database";

export default function InvoiceList() {
  const navigate = useNavigate();
  const [invoices, setInvoices] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedYear, setSelectedYear] = useState("");
  const [selectedMonth, setSelectedMonth] = useState("");
  const [selectedCustomer, setSelectedCustomer] = useState("");
  const [selectedMarketing, setSelectedMarketing] = useState("");
  const [sortOption, setSortOption] = useState("newest");

  const [years, setYears] = useState([]);
  const [customers, setCustomers] = useState([]);
  const [marketings, setMarketings] = useState([]);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = () => {
    try {
      const rawData = localStorage.getItem("gcm_data");
      const data = rawData ? JSON.parse(rawData) : [];

      // ធានាថា data ជា Array ជានិច្ច ដើម្បីការពារការ Error
      const safeData = Array.isArray(data) ? data : [];
      setInvoices(safeData);

      let ySet = new Set(),
        cSet = new Set(),
        mSet = new Set();
      safeData.forEach((inv) => {
        if (inv && inv.dateIssue) ySet.add(inv.dateIssue.split("-")[0]);
        if (inv && inv.customer) cSet.add(inv.customer);
        if (inv && inv.marketing) mSet.add(inv.marketing);
      });
      setYears(Array.from(ySet).sort().reverse());
      setCustomers(Array.from(cSet).sort());
      setMarketings(Array.from(mSet).sort());
    } catch (err) {
      console.error("Error loading data:", err);
      setInvoices([]);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm("តើអ្នកពិតជាចង់លុបវិក្កយបត្រនេះមែនទេ?")) {
      const email = localStorage.getItem("gcm_logged_user");
      if (!email) return;
      const safeKey = email.replace(/[.#$[\]]/g, "_");
      try {
        await remove(ref(db, `invoices/${safeKey}/${id}`));
        const updated = invoices.filter((inv) => inv.id !== id);
        localStorage.setItem("gcm_data", JSON.stringify(updated));
        setInvoices(updated);
        loadData();
        alert("លុបបានជោគជ័យ!");
      } catch (error) {
        alert("កំហុស: " + error.message);
      }
    }
  };

  const handleEdit = (id) => {
    navigate("/new-invoice", { state: { editId: id } });
  };

  const filteredInvoices = invoices
    .filter((inv) => {
      if (!inv) return false;
      const term = searchTerm.toLowerCase();
      const matchTerm =
        inv.customer?.toLowerCase().includes(term) ||
        inv.location?.toLowerCase().includes(term);
      if (!matchTerm) return false;
      if (selectedYear && !inv.dateIssue?.startsWith(selectedYear))
        return false;
      if (selectedMonth && inv.dateIssue?.split("-")[1] !== selectedMonth)
        return false;
      if (selectedCustomer && inv.customer !== selectedCustomer) return false;
      if (selectedMarketing && inv.marketing !== selectedMarketing)
        return false;
      return true;
    })
    .sort((a, b) => {
      if (sortOption === "newest")
        return new Date(b.dateIssue || 0) - new Date(a.dateIssue || 0);
      if (sortOption === "oldest")
        return new Date(a.dateIssue || 0) - new Date(b.dateIssue || 0);
      if (sortOption === "amount-high")
        return (b.revenue || 0) - (a.revenue || 0);
      if (sortOption === "amount-low")
        return (a.revenue || 0) - (b.revenue || 0);
      if (sortOption === "qty-high")
        return (b.totalQty || 0) - (a.totalQty || 0);
      if (sortOption === "customer-az")
        return (a.customer || "").localeCompare(b.customer || "");
      return 0;
    });

  return (
    <div className="space-y-6 fade-in pb-10 khmer-font">
      <div className="bg-white p-4 sm:p-6 rounded-2xl shadow-sm border border-gray-100 space-y-4">
        <div className="flex flex-col sm:flex-row justify-between items-center gap-3">
          <div>
            <h1 className="text-xl font-bold text-gray-800">
              ប្រវត្តិវិក្កយបត្រ (Invoice List)
            </h1>
            <p className="text-xs text-gray-500 mt-0.5">
              បញ្ជីប្រវត្តិការចេញវិក្កយបត្រទាំងអស់
            </p>
          </div>
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="ស្វែងរកអតិថិជន ឬទីតាំង..."
            className="w-full sm:w-72 border border-gray-200 rounded-xl px-4 py-2.5 text-sm outline-none focus:border-blue-500"
          />
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 pt-3 border-t border-gray-100 text-xs">
          <div>
            <label className="block font-semibold text-gray-500 mb-1">
              តម្រៀបតាមឆ្នាំ
            </label>
            <select
              value={selectedYear}
              onChange={(e) => setSelectedYear(e.target.value)}
              className="w-full border border-gray-200 rounded-xl p-2.5 bg-gray-50 outline-none"
            >
              <option value="">ឆ្នាំទាំងអស់</option>
              {years.map((y, i) => (
                <option key={i} value={y}>
                  {y}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="block font-semibold text-gray-500 mb-1">
              តម្រៀបតាមខែ
            </label>
            <select
              value={selectedMonth}
              onChange={(e) => setSelectedMonth(e.target.value)}
              className="w-full border border-gray-200 rounded-xl p-2.5 bg-gray-50 outline-none"
            >
              <option value="">ខែទាំងអស់</option>
              <option value="01">មករា</option>
              <option value="02">កុម្ភៈ</option>
              <option value="03">មីនា</option>
              <option value="04">មេសា</option>
              <option value="05">ឧសភា</option>
              <option value="06">មិថុនា</option>
              <option value="07">កក្កដា</option>
              <option value="08">សីហា</option>
              <option value="09">កញ្ញា</option>
              <option value="10">តុលា</option>
              <option value="11">វិច្ឆិកា</option>
              <option value="12">ធ្នូ</option>
            </select>
          </div>
          <div>
            <label className="block font-semibold text-gray-500 mb-1">
              អតិថិជន
            </label>
            <select
              value={selectedCustomer}
              onChange={(e) => setSelectedCustomer(e.target.value)}
              className="w-full border border-gray-200 rounded-xl p-2.5 bg-gray-50 outline-none"
            >
              <option value="">អតិថិជនទាំងអស់</option>
              {customers.map((c, i) => (
                <option key={i} value={c}>
                  {c}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="block font-semibold text-gray-500 mb-1">
              ទីផ្សារ
            </label>
            <select
              value={selectedMarketing}
              onChange={(e) => setSelectedMarketing(e.target.value)}
              className="w-full border border-gray-200 rounded-xl p-2.5 bg-gray-50 outline-none"
            >
              <option value="">ទីផ្សារទាំងអស់</option>
              {marketings.map((m, i) => (
                <option key={i} value={m}>
                  {m}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="block font-semibold text-blue-700 mb-1">
              ⚡ ការតម្រៀប (Sort By)
            </label>
            <select
              value={sortOption}
              onChange={(e) => setSortOption(e.target.value)}
              className="w-full border border-blue-200 rounded-xl p-2.5 bg-blue-50/50 outline-none font-semibold"
            >
              <option value="newest">ថ្ងៃបរិច្ឆេទ: ថ្មីទៅចាស់</option>
              <option value="oldest">ថ្ងៃបរិច្ឆេទ: ចាស់ទៅថ្មី</option>
              <option value="amount-high">ទឹកប្រាក់: ខ្ពស់ទៅទាប</option>
              <option value="amount-low">ទឹកប្រាក់: ទាបទៅខ្ពស់</option>
              <option value="qty-high">បរិមាណ (m³): ច្រើនទៅតិច</option>
              <option value="customer-az">អតិថិជន: A-Z</option>
            </select>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm whitespace-nowrap">
            <thead>
              <tr className="bg-gray-50/70 text-gray-500 font-semibold text-xs uppercase tracking-wider border-b border-gray-100">
                <th className="p-4">កាលបរិច្ឆេទ</th>
                <th className="p-4">អតិថិជន</th>
                <th className="p-4">ទីផ្សារ</th>
                <th className="p-4">ទីតាំង</th>
                <th className="p-4">បរិមាណរួម</th>
                <th className="p-4">ទឹកប្រាក់សរុប</th>
                <th className="p-4 text-center">សកម្មភាព</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 text-gray-700 text-xs">
              {filteredInvoices.length > 0 ? (
                filteredInvoices.map((inv) => (
                  <tr key={inv.id} className="hover:bg-blue-50/40 transition">
                    <td className="p-4 font-medium text-gray-600">
                      {inv.displayDate}
                    </td>
                    <td className="p-4 font-bold text-blue-900">
                      {inv.customer}
                    </td>
                    <td className="p-4">
                      <span className="bg-purple-50 text-purple-700 px-2 py-1 rounded font-semibold text-[11px]">
                        {inv.marketing || "-"}
                      </span>
                    </td>
                    <td className="p-4 text-gray-500">{inv.location || "-"}</td>
                    <td className="p-4">
                      <span className="bg-gray-100 text-gray-700 px-2.5 py-1 rounded-full font-semibold">
                        {inv.totalQty?.toFixed(1)} m³
                      </span>
                    </td>
                    <td className="p-4 font-extrabold text-red-600">
                      ${inv.revenue?.toFixed(2)}
                    </td>
                    <td className="p-4 text-center space-x-2">
                      <button
                        onClick={() => handleEdit(inv.id)}
                        className="px-3 py-1.5 bg-amber-50 text-amber-700 border border-amber-200 rounded-xl text-xs font-semibold hover:bg-amber-100 transition"
                      >
                        កែប្រែ
                      </button>
                      <button
                        onClick={() => handleDelete(inv.id)}
                        className="px-3 py-1.5 bg-red-50 text-red-700 border border-red-200 rounded-xl text-xs font-semibold hover:bg-red-100 transition"
                      >
                        លុប
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="7" className="p-8 text-center text-gray-400">
                    មិនមានទិន្នន័យវិក្កយបត្រដែលបានរកឃើញទេ
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
