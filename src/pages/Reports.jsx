import React, { useState, useEffect } from "react";
import InvoicePreview from "../components/invoice/InvoicePreview";

export default function Reports() {
  const [invoices, setInvoices] = useState([]);

  // States សម្រាប់ Filter និង Search ដូចក្នុងរូបភាព
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedYear, setSelectedYear] = useState("");
  const [selectedMonth, setSelectedMonth] = useState("");
  const [selectedCustomer, setSelectedCustomer] = useState("");
  const [selectedMarketing, setSelectedMarketing] = useState("");
  const [sortOption, setSortOption] = useState("newest");

  // States សម្រាប់ជម្រើសក្នុង Dropdown
  const [years, setYears] = useState([]);
  const [customers, setCustomers] = useState([]);
  const [marketings, setMarketings] = useState([]);

  // State សម្រាប់ផ្ទុកទិន្នន័យពេលចុចមើល Preview (Modal)
  const [selectedInvoice, setSelectedInvoice] = useState(null);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = () => {
    try {
      const rawData = localStorage.getItem("gcm_data");
      const data = rawData ? JSON.parse(rawData) : [];
      const safeData = Array.isArray(data) ? data : [];

      setInvoices(safeData);

      // ទាញយកឆ្នាំ អតិថិជន និងទីផ្សារ ដែលមានក្នុងទិន្នន័យ
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

  // មុខងារច្រោះទិន្នន័យ (Filter) និងតម្រៀប (Sort)
  const filteredInvoices = invoices
    .filter((inv) => {
      if (!inv) return false;

      // ស្វែងរកតាមឈ្មោះ ឬទីតាំង
      const term = searchTerm.toLowerCase();
      const matchTerm =
        inv.customer?.toLowerCase().includes(term) ||
        inv.location?.toLowerCase().includes(term);
      if (!matchTerm) return false;

      // ច្រោះតាម Dropdown នីមួយៗ
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

  // គណនាទិន្នន័យសរុបសម្រាប់ផ្ទាំង Summary ខាងលើ
  const totalQty = filteredInvoices.reduce(
    (acc, inv) => acc + (parseFloat(inv.totalQty) || 0),
    0,
  );
  const totalRevenue = filteredInvoices.reduce(
    (acc, inv) => acc + (parseFloat(inv.revenue) || 0),
    0,
  );
  const totalServiceFee = filteredInvoices.reduce((acc, inv) => {
    const serviceForInv = inv.items
      ? inv.items.reduce((sum, it) => {
          return (
            sum +
            (parseFloat(it.pumpFee) || 0) +
            (parseFloat(it.deliveryFee) || 0)
          );
        }, 0)
      : 0;
    return acc + serviceForInv;
  }, 0);
  const totalConcreteValue = totalRevenue - totalServiceFee;

  return (
    <div className="space-y-6 fade-in pb-10 khmer-font">
      {/* ផ្ទាំង Filter ថ្មី (ដូចក្នុងរូបភាព) */}
      <div className="bg-white p-4 sm:p-6 rounded-2xl shadow-sm border border-gray-100 space-y-4">
        <div className="flex flex-col sm:flex-row justify-between items-center gap-3">
          <div>
            <h1 className="text-xl font-bold text-gray-800">
              របាយការណ៍វិក្កយបត្រ (Invoice Report)
            </h1>
            <p className="text-xs text-gray-500 mt-0.5">
              បញ្ជីរបាយការណ៍សង្ខេប និងលម្អិតនៃការចេញវិក្កយបត្រ
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

      {/* ផ្ទាំងសង្ខេបរបាយការណ៍ (Summary Cards) */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="bg-blue-50 border border-blue-100 p-4 rounded-2xl">
          <p className="text-blue-600 font-semibold text-xs mb-1">
            បរិមាណបេតុងសរុប
          </p>
          <h3 className="text-xl sm:text-2xl font-bold text-blue-900">
            {totalQty.toFixed(2)} m³
          </h3>
        </div>
        <div className="bg-green-50 border border-green-100 p-4 rounded-2xl">
          <p className="text-green-600 font-semibold text-xs mb-1">
            ទឹកប្រាក់សរុបរួម
          </p>
          <h3 className="text-xl sm:text-2xl font-bold text-green-900">
            ${totalRevenue.toFixed(2)}
          </h3>
        </div>
        <div className="bg-amber-50 border border-amber-100 p-4 rounded-2xl">
          <p className="text-amber-600 font-semibold text-xs mb-1">
            ចំណូលថ្លៃបេតុង
          </p>
          <h3 className="text-xl sm:text-2xl font-bold text-amber-900">
            ${totalConcreteValue.toFixed(2)}
          </h3>
        </div>
        <div className="bg-purple-50 border border-purple-100 p-4 rounded-2xl">
          <p className="text-purple-600 font-semibold text-xs mb-1">
            ចំណូលសេវាបូម/ដឹក
          </p>
          <h3 className="text-xl sm:text-2xl font-bold text-purple-900">
            ${totalServiceFee.toFixed(2)}
          </h3>
        </div>
      </div>

      {/* តារាងទិន្នន័យរបាយការណ៍ */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100">
        <div className="bg-blue-900 text-white p-4 rounded-t-2xl">
          <h2 className="text-lg font-bold flex items-center gap-2">
            <span>📑</span> ១. តារាងលម្អិតនៃរបាយការណ៍អតិថិជន (Customer Invoice
            Details)
          </h2>
        </div>

        <div className="overflow-x-auto rounded-b-2xl">
          <table className="w-full text-left text-sm whitespace-nowrap">
            <thead>
              <tr className="bg-gray-50 text-gray-700 font-bold text-xs uppercase border-b border-gray-200">
                <th className="p-4 text-center">ល.រ</th>
                <th className="p-4">ថ្ងៃទីខែ</th>
                <th className="p-4">អតិថិជន & ទីតាំង</th>
                <th className="p-4">ឈ្មោះទីផ្សារ</th>
                <th className="p-4">កម្លាំង & បរិមាណ</th>
                <th className="p-4">តម្លៃលក់រាយ</th>
                <th className="p-4">សេវាបូម/ដឹក</th>
                <th className="p-4 text-right">ទឹកប្រាក់សរុប</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 text-xs">
              {filteredInvoices.length > 0 ? (
                filteredInvoices.map((inv, index) => {
                  const firstItem =
                    inv.items && inv.items.length > 0 ? inv.items[0] : {};
                  const strength = firstItem.strength || "-";
                  const qty = inv.totalQty || 0;
                  const price = parseFloat(firstItem.customerPrice) || 0;

                  const serviceFee = inv.items
                    ? inv.items.reduce((acc, it) => {
                        return (
                          acc +
                          (parseFloat(it.pumpFee) || 0) +
                          (parseFloat(it.deliveryFee) || 0)
                        );
                      }, 0)
                    : 0;

                  return (
                    <tr
                      key={inv.id}
                      onClick={() => setSelectedInvoice(inv)}
                      className="hover:bg-blue-50/60 cursor-pointer transition text-gray-700"
                    >
                      <td className="p-4 text-center font-medium">
                        {index + 1}
                      </td>
                      <td className="p-4 text-gray-600">
                        {inv.displayDate || inv.dateIssue}
                      </td>
                      <td className="p-4">
                        <div className="font-bold text-blue-900">
                          {inv.customer}
                        </div>
                        <div className="text-[11px] text-gray-400 mt-0.5">
                          {inv.location}
                        </div>
                      </td>
                      <td className="p-4">
                        <span className="bg-purple-50 text-purple-700 px-2 py-1 rounded font-semibold text-[11px]">
                          {inv.marketing || "-"}
                        </span>
                      </td>
                      <td className="p-4 text-gray-600">
                        {strength} ( {qty.toFixed(1)} m³ )
                      </td>
                      <td className="p-4 text-gray-600">${price.toFixed(2)}</td>
                      <td className="p-4 text-gray-600">
                        ${serviceFee.toFixed(2)}
                      </td>
                      <td className="p-4 text-right font-extrabold text-blue-900">
                        ${inv.revenue?.toFixed(2)}
                      </td>
                    </tr>
                  );
                })
              ) : (
                <tr>
                  <td
                    colSpan="8"
                    className="p-8 text-center text-gray-400 font-medium"
                  >
                    មិនមានទិន្នន័យរបាយការណ៍ដែលត្រូវនឹងការស្វែងរកទេ
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Popup Modal សម្រាប់បង្ហាញ Invoice Preview */}
      {selectedInvoice && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-in fade-in duration-200">
          <div className="bg-gray-100 w-full max-w-4xl max-h-[95vh] rounded-2xl shadow-2xl flex flex-col relative overflow-hidden">
            <div className="bg-white border-b border-gray-200 px-6 py-4 flex justify-between items-center sticky top-0 z-10">
              <h3 className="font-bold text-gray-800 text-lg">
                ព័ត៌មានលម្អិតវិក្កយបត្រ (Preview)
              </h3>
              <button
                onClick={() => setSelectedInvoice(null)}
                className="p-2 bg-red-50 text-red-600 rounded-full hover:bg-red-100 transition"
                title="បិទ"
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
                    d="M6 18L18 6M6 6l12 12"
                  ></path>
                </svg>
              </button>
            </div>

            <div className="overflow-y-auto p-4 sm:p-6 pb-20">
              <InvoicePreview data={selectedInvoice} />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
