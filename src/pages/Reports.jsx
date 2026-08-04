import React, { useState, useEffect } from "react";
import * as XLSX from "xlsx";

export default function Reports() {
  const [invoices, setInvoices] = useState([]);
  const [selectedCustomer, setSelectedCustomer] = useState("");
  const [selectedMarketing, setSelectedMarketing] = useState("");
  const [selectedMonth, setSelectedMonth] = useState("");
  const [selectedYear, setSelectedYear] = useState("");
  const [selectedLocation, setSelectedLocation] = useState("");
  const [sortOption, setSortOption] = useState("newest");

  // State សម្រាប់គ្រប់គ្រង Modal Preview និង Tab ខាងក្នុង Preview (Customer ឬ Company)
  const [showPreviewModal, setShowPreviewModal] = useState(false);
  const [previewTab, setPreviewTab] = useState("customer"); // 'customer' ឬ 'company'

  const [customers, setCustomers] = useState([]);
  const [marketings, setMarketings] = useState([]);
  const [years, setYears] = useState([]);
  const [locations, setLocations] = useState([]);

  useEffect(() => {
    const data = JSON.parse(localStorage.getItem("gcm_data") || "[]");
    setInvoices(data);

    let cSet = new Set(),
      mSet = new Set(),
      ySet = new Set(),
      lSet = new Set();
    data.forEach((inv) => {
      if (inv.customer) cSet.add(inv.customer);
      if (inv.marketing) mSet.add(inv.marketing);
      if (inv.location) lSet.add(inv.location);
      if (inv.dateIssue) ySet.add(inv.dateIssue.split("-")[0]);
      if (inv.items) {
        inv.items.forEach((it) => {
          if (it.date) ySet.add(it.date.split("-")[0]);
        });
      }
    });

    setCustomers(Array.from(cSet).sort());
    setMarketings(Array.from(mSet).sort());
    setYears(Array.from(ySet).sort().reverse());
    setLocations(Array.from(lSet).sort());
  }, []);

  const filteredRows = [];
  invoices.forEach((inv) => {
    if (selectedCustomer && inv.customer !== selectedCustomer) return;
    if (selectedMarketing && inv.marketing !== selectedMarketing) return;
    if (selectedLocation && inv.location !== selectedLocation) return;

    if (inv.items && inv.items.length > 0) {
      inv.items.forEach((it) => {
        let itemDate = it.date || inv.dateIssue || "";
        if (selectedYear && !itemDate.startsWith(selectedYear)) return;
        if (selectedMonth && itemDate.split("-")[1] !== selectedMonth) return;

        let q = parseFloat(it.qty) || 0;
        let cPrice = parseFloat(it.customerPrice) || 0;
        let compPrice = parseFloat(it.companyPrice) || 0;
        let pump = parseFloat(it.pumpFee) || 0;
        let deliv = parseFloat(it.deliveryFee) || 0;

        let customerAmount = q * cPrice + pump + deliv;
        let companyTotalAmount = q * compPrice + pump + deliv;
        let netProfit = (cPrice - compPrice) * q;

        filteredRows.push({
          rawDate: itemDate,
          date: itemDate ? itemDate.split("-").reverse().join("/") : "",
          customer: inv.customer || "",
          marketing: inv.marketing || "-",
          location: inv.location || "",
          strength: it.strength || "",
          qty: q,
          customerPrice: cPrice,
          companyPrice: compPrice,
          pump,
          delivery: deliv,
          customerAmount,
          companyTotalAmount,
          netProfit,
          note: it.note || "",
        });
      });
    }
  });

  filteredRows.sort((a, b) => {
    if (sortOption === "newest")
      return new Date(b.rawDate || 0) - new Date(a.rawDate || 0);
    if (sortOption === "oldest")
      return new Date(a.rawDate || 0) - new Date(b.rawDate || 0);
    if (sortOption === "amount-high")
      return b.customerAmount - a.customerAmount;
    if (sortOption === "amount-low") return a.customerAmount - b.customerAmount;
    if (sortOption === "profit-high") return b.netProfit - a.netProfit;
    if (sortOption === "qty-high") return b.qty - a.qty;
    return 0;
  });

  let sumQty = filteredRows.reduce((acc, r) => acc + r.qty, 0);
  let sumCustomerRev = filteredRows.reduce(
    (acc, r) => acc + r.customerAmount,
    0,
  );
  let sumCompanyCost = filteredRows.reduce(
    (acc, r) => acc + r.companyTotalAmount,
    0,
  );
  let sumProfit = filteredRows.reduce((acc, r) => acc + r.netProfit, 0);

  // មុខងារ Download Excel ជាផ្លូវការ (រួមបញ្ចូលទាំង ២ Sheet ដាច់ដោយឡែក)
  const confirmAndExportExcel = () => {
    if (filteredRows.length === 0) {
      alert("មិនមានទិន្នន័យសម្រាប់ Export ទេ!");
      return;
    }

    const customerData = filteredRows.map((r, index) => ({
      "ល.រ": index + 1,
      ថ្ងៃដឹក: r.date,
      អតិថិជន: r.customer,
      ទីតាំង: r.location,
      ទីផ្សារ: r.marketing,
      កម្លាំងបេតុង: r.strength,
      "បរិមាណ (m3)": r.qty,
      "តម្លៃលក់រាយ ($)": r.customerPrice,
      "សេវាបូម/ដឹក ($)": r.pump + r.delivery,
      "ទឹកប្រាក់សរុប ($)": r.customerAmount,
      ចំណាំ: r.note,
    }));

    const companyData = filteredRows.map((r, index) => ({
      "ល.រ": index + 1,
      ថ្ងៃដឹក: r.date,
      អតិថិជន: r.customer,
      ទីផ្សារ: r.marketing,
      "បរិមាណ (m3)": r.qty,
      "តម្លៃដើមក្រុមហ៊ុន ($)": r.companyPrice,
      "តម្លៃលក់អតិថិជន ($)": r.customerPrice,
      "សរុបថ្លៃក្រុមហ៊ុន ($)": r.companyTotalAmount,
      "ប្រាក់ចំណេញសុទ្ធ ($)": r.netProfit,
    }));

    const wb = XLSX.utils.book_new();
    const wsCustomer = XLSX.utils.json_to_sheet(customerData);
    const wsCompany = XLSX.utils.json_to_sheet(companyData);

    XLSX.utils.book_append_sheet(wb, wsCustomer, "Customer Invoices");
    XLSX.utils.book_append_sheet(wb, wsCompany, "Company & Profit");

    XLSX.writeFile(
      wb,
      `GCM_Report_${new Date().toISOString().split("T")[0]}.xlsx`,
    );
    setShowPreviewModal(false);
  };

  return (
    <div className="space-y-8 fade-in pb-12 khmer-font relative">
      <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex flex-col sm:flex-row justify-between items-center gap-4">
        <div>
          <h1 className="text-xl font-bold text-gray-800">
            របាយការណ៍ និងការផ្ទៀងផ្ទាត់ (Reports)
          </h1>
          <p className="text-xs text-gray-500 mt-1">
            បែងចែកជា ២ ទម្រង់៖ របាយការណ៍សម្រាប់អតិថិជន
            និងរបាយការណ៍ជាមួយក្រុមហ៊ុន
          </p>
        </div>
        <button
          onClick={() => {
            if (filteredRows.length === 0) {
              alert("មិនមានទិន្នន័យសម្រាប់ Preview ទេ!");
              return;
            }
            setShowPreviewModal(true);
          }}
          className="px-5 py-2.5 bg-emerald-600 text-white rounded-xl text-xs font-bold hover:bg-emerald-700 shadow-md shadow-emerald-500/20 transition flex items-center gap-2"
        >
          👁️ Preview & Export Excel
        </button>
      </div>

      <div className="bg-white p-5 rounded-2xl shadow-sm border border-gray-100 space-y-4">
        <h2 className="text-sm font-bold text-gray-800 flex items-center gap-2">
          🔍 តម្រៀប និងត្រងទិន្នន័យ (Filters & Sorting)
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-6 gap-3 text-xs">
          <div>
            <label className="block font-semibold text-gray-600 mb-1">
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
            <label className="block font-semibold text-gray-600 mb-1">
              ឈ្មោះទីផ្សារ
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
            <label className="block font-semibold text-gray-600 mb-1">ខែ</label>
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
            <label className="block font-semibold text-gray-600 mb-1">
              ឆ្នាំ
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
            <label className="block font-semibold text-gray-600 mb-1">
              ទីតាំង
            </label>
            <select
              value={selectedLocation}
              onChange={(e) => setSelectedLocation(e.target.value)}
              className="w-full border border-gray-200 rounded-xl p-2.5 bg-gray-50 outline-none"
            >
              <option value="">ទីតាំងទាំងអស់</option>
              {locations.map((l, i) => (
                <option key={i} value={l}>
                  {l}
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
              <option value="newest">ថ្ងៃដឹក: ថ្មីទៅចាស់</option>
              <option value="oldest">ថ្ងៃដឹក: ចាស់ទៅថ្មី</option>
              <option value="amount-high">ទឹកប្រាក់: ខ្ពស់ទៅទាប</option>
              <option value="profit-high">ប្រាក់ចំណេញ: ខ្ពស់ទៅទាប</option>
              <option value="qty-high">បរិមាណ (m³): ច្រើនទៅតិច</option>
            </select>
          </div>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-3 border-t border-gray-100">
          <div className="bg-blue-50 p-4 rounded-xl border border-blue-100">
            <span className="text-[11px] text-blue-600 font-semibold uppercase">
              Total Quantity
            </span>
            <h3 className="text-lg font-bold text-blue-900 mt-1">
              {sumQty.toFixed(2)} m³
            </h3>
          </div>
          <div className="bg-indigo-50 p-4 rounded-xl border border-indigo-100">
            <span className="text-[11px] text-indigo-600 font-semibold uppercase">
              Customer Revenue
            </span>
            <h3 className="text-lg font-bold text-indigo-900 mt-1">
              ${sumCustomerRev.toFixed(2)}
            </h3>
          </div>
          <div className="bg-amber-50 p-4 rounded-xl border border-amber-100">
            <span className="text-[11px] text-amber-700 font-semibold uppercase">
              Company Total Cost
            </span>
            <h3 className="text-lg font-bold text-amber-900 mt-1">
              ${sumCompanyCost.toFixed(2)}
            </h3>
          </div>
          <div className="bg-emerald-50 p-4 rounded-xl border border-emerald-100">
            <span className="text-[11px] text-emerald-600 font-semibold uppercase">
              Net Profit
            </span>
            <h3 className="text-lg font-bold text-emerald-700 mt-1">
              ${sumProfit.toFixed(2)}
            </h3>
          </div>
        </div>
      </div>

      {/* របាយការណ៍ទី ១ */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="p-5 bg-blue-900 text-white">
          <h3 className="font-bold text-sm">
            📋 ១. របាយការណ៍វិក្កយបត្រសម្រាប់អតិថិជន (Customer Invoice Report)
          </h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm whitespace-nowrap">
            <thead>
              <tr className="bg-gray-50 text-gray-600 text-xs uppercase border-b">
                <th className="p-3.5">ល.រ</th>
                <th className="p-3.5">ថ្ងៃដឹក</th>
                <th className="p-3.5">អតិថិជន & ទីតាំង</th>
                <th className="p-3.5">ឈ្មោះទីផ្សារ</th>
                <th className="p-3.5">កម្លាំង & បរិមាណ</th>
                <th className="p-3.5">តម្លៃលក់រាយ</th>
                <th className="p-3.5">សេវាបូម/ដឹក</th>
                <th className="p-3.5 text-right font-bold text-blue-900">
                  ទឹកប្រាក់សរុប
                </th>
                <th className="p-3.5">ចំណាំ</th>
              </tr>
            </thead>
            <tbody className="divide-y text-gray-700 text-xs">
              {filteredRows.length > 0 ? (
                filteredRows.map((r, i) => (
                  <tr key={i} className="hover:bg-gray-50">
                    <td className="p-3.5">{i + 1}</td>
                    <td className="p-3.5">{r.date}</td>
                    <td className="p-3.5">
                      <div className="font-bold text-blue-900">
                        {r.customer}
                      </div>
                      <div className="text-gray-400 text-[11px]">
                        {r.location}
                      </div>
                    </td>
                    <td className="p-3.5">
                      <span className="bg-purple-50 text-purple-700 font-semibold px-2 py-1 rounded-md text-[11px]">
                        {r.marketing}
                      </span>
                    </td>
                    <td className="p-3.5">
                      {r.strength} ({r.qty.toFixed(1)} m³)
                    </td>
                    <td className="p-3.5">${r.customerPrice.toFixed(2)}</td>
                    <td className="p-3.5">
                      ${(r.pump + r.delivery).toFixed(2)}
                    </td>
                    <td className="p-3.5 text-right font-extrabold text-blue-900">
                      ${r.customerAmount.toFixed(2)}
                    </td>
                    <td className="p-3.5 text-gray-500">{r.note || "-"}</td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="9" className="p-6 text-center text-gray-400">
                    មិនមានទិន្នន័យសម្រាប់បង្ហាញទេ
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* របាយការណ៍ទី ២ */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="p-5 bg-emerald-800 text-white">
          <h3 className="font-bold text-sm">
            💰 ២. របាយការណ៍ប្រៀបធៀប និងប្រាក់ចំណេញជាមួយក្រុមហ៊ុន (Company &
            Profit Report)
          </h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm whitespace-nowrap">
            <thead>
              <tr className="bg-gray-50 text-gray-600 text-xs uppercase border-b">
                <th className="p-3.5">ល.រ</th>
                <th className="p-3.5">ថ្ងៃដឹក</th>
                <th className="p-3.5">អតិថិជន</th>
                <th className="p-3.5">ឈ្មោះទីផ្សារ</th>
                <th className="p-3.5">បរិមាណ</th>
                <th className="p-3.5 text-red-600">តម្លៃដើមក្រុមហ៊ុន</th>
                <th className="p-3.5 text-indigo-700">តម្លៃលក់អតិថិជន</th>
                <th className="p-3.5 text-amber-800">សរុបថ្លៃក្រុមហ៊ុន</th>
                <th className="p-3.5 text-emerald-700 font-bold">
                  ប្រាក់ចំណេញសុទ្ធ
                </th>
              </tr>
            </thead>
            <tbody className="divide-y text-gray-700 text-xs">
              {filteredRows.length > 0 ? (
                filteredRows.map((r, i) => (
                  <tr key={i} className="hover:bg-gray-50">
                    <td className="p-3.5">{i + 1}</td>
                    <td className="p-3.5">{r.date}</td>
                    <td className="p-3.5 font-bold text-gray-800">
                      {r.customer}
                    </td>
                    <td className="p-3.5">
                      <span className="bg-purple-50 text-purple-700 font-semibold px-2 py-1 rounded-md text-[11px]">
                        {r.marketing}
                      </span>
                    </td>
                    <td className="p-3.5">{r.qty.toFixed(1)} m³</td>
                    <td className="p-3.5 text-red-600 font-medium">
                      ${r.companyPrice.toFixed(2)}
                    </td>
                    <td className="p-3.5 text-indigo-700 font-medium">
                      ${r.customerPrice.toFixed(2)}
                    </td>
                    <td className="p-3.5 text-amber-800 font-bold">
                      ${r.companyTotalAmount.toFixed(2)}
                    </td>
                    <td className="p-3.5 text-emerald-600 font-extrabold">
                      ${r.netProfit.toFixed(2)}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="9" className="p-6 text-center text-gray-400">
                    មិនមានទិន្នន័យសម្រាប់បង្ហាញទេ
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* --- EXCEL PREVIEW MODAL WITH TABS --- */}
      {showPreviewModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white w-full max-w-6xl rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[92vh] animate-fade-in">
            {/* Modal Header */}
            <div className="p-5 bg-gray-900 text-white flex justify-between items-center">
              <div>
                <h2 className="text-base font-bold">
                  👀 Preview Export Data ({filteredRows.length} ជួរ)
                </h2>
                <p className="text-xs text-gray-400">
                  ទិន្នន័យត្រូវបាន Filter និង Sort រួចជាស្រេច មុនពេល Download ជា
                  Excel
                </p>
              </div>
              <button
                onClick={() => setShowPreviewModal(false)}
                className="text-gray-400 hover:text-white text-xl font-bold px-2"
              >
                ✕
              </button>
            </div>

            {/* Modal Tabs Switching (Customer vs Company) */}
            <div className="bg-gray-100 px-6 pt-3 flex gap-2 border-b">
              <button
                onClick={() => setPreviewTab("customer")}
                className={`px-4 py-2.5 rounded-t-xl text-xs font-bold transition ${previewTab === "customer" ? "bg-white text-blue-900 border-t-2 border-blue-900 shadow-sm" : "text-gray-500 hover:text-gray-800"}`}
              >
                📋 1. Customer Invoices Preview
              </button>
              <button
                onClick={() => setPreviewTab("company")}
                className={`px-4 py-2.5 rounded-t-xl text-xs font-bold transition ${previewTab === "company" ? "bg-white text-emerald-800 border-t-2 border-emerald-800 shadow-sm" : "text-gray-500 hover:text-gray-800"}`}
              >
                💰 2. Company & Profit Preview
              </button>
            </div>

            {/* Modal Body Table */}
            <div className="p-6 overflow-y-auto flex-1 space-y-4">
              <div className="overflow-x-auto border border-gray-200 rounded-xl">
                {previewTab === "customer" ? (
                  <table className="w-full text-left text-xs whitespace-nowrap">
                    <thead>
                      <tr className="bg-blue-50 text-blue-900 uppercase border-b">
                        <th className="p-3">ល.រ</th>
                        <th className="p-3">ថ្ងៃដឹក</th>
                        <th className="p-3">អតិថិជន</th>
                        <th className="p-3">ទីតាំង</th>
                        <th className="p-3">ទីផ្សារ</th>
                        <th className="p-3">កម្លាំងបេតុង</th>
                        <th className="p-3">បរិមាណ</th>
                        <th className="p-3">តម្លៃលក់រាយ</th>
                        <th className="p-3">សេវាបូម/ដឹក</th>
                        <th className="p-3 text-right">ទឹកប្រាក់សរុប</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y text-gray-700">
                      {filteredRows.map((r, i) => (
                        <tr key={i} className="hover:bg-gray-50">
                          <td className="p-3">{i + 1}</td>
                          <td className="p-3">{r.date}</td>
                          <td className="p-3 font-bold text-blue-900">
                            {r.customer}
                          </td>
                          <td className="p-3 text-gray-500">{r.location}</td>
                          <td className="p-3">
                            <span className="bg-purple-50 text-purple-700 px-2 py-0.5 rounded">
                              {r.marketing}
                            </span>
                          </td>
                          <td className="p-3">{r.strength}</td>
                          <td className="p-3">{r.qty.toFixed(1)} m³</td>
                          <td className="p-3">${r.customerPrice.toFixed(2)}</td>
                          <td className="p-3">
                            ${(r.pump + r.delivery).toFixed(2)}
                          </td>
                          <td className="p-3 text-right font-bold text-blue-900">
                            ${r.customerAmount.toFixed(2)}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                ) : (
                  <table className="w-full text-left text-xs whitespace-nowrap">
                    <thead>
                      <tr className="bg-emerald-50 text-emerald-900 uppercase border-b">
                        <th className="p-3">ល.រ</th>
                        <th className="p-3">ថ្ងៃដឹក</th>
                        <th className="p-3">អតិថិជន</th>
                        <th className="p-3">ទីផ្សារ</th>
                        <th className="p-3">បរិមាណ</th>
                        <th className="p-3 text-red-600">តម្លៃដើមក្រុមហ៊ុន</th>
                        <th className="p-3 text-indigo-700">តម្លៃលក់អតិថិជន</th>
                        <th className="p-3 text-amber-800">
                          សរុបថ្លៃក្រុមហ៊ុន
                        </th>
                        <th className="p-3 text-emerald-700 font-bold">
                          ប្រាក់ចំណេញសុទ្ធ
                        </th>
                      </tr>
                    </thead>
                    <tbody className="divide-y text-gray-700">
                      {filteredRows.map((r, i) => (
                        <tr key={i} className="hover:bg-gray-50">
                          <td className="p-3">{i + 1}</td>
                          <td className="p-3">{r.date}</td>
                          <td className="p-3 font-bold text-gray-800">
                            {r.customer}
                          </td>
                          <td className="p-3">
                            <span className="bg-purple-50 text-purple-700 px-2 py-0.5 rounded">
                              {r.marketing}
                            </span>
                          </td>
                          <td className="p-3">{r.qty.toFixed(1)} m³</td>
                          <td className="p-3 text-red-600 font-medium">
                            ${r.companyPrice.toFixed(2)}
                          </td>
                          <td className="p-3 text-indigo-700 font-medium">
                            ${r.customerPrice.toFixed(2)}
                          </td>
                          <td className="p-3 text-amber-800 font-bold">
                            ${r.companyTotalAmount.toFixed(2)}
                          </td>
                          <td className="p-3 text-emerald-600 font-extrabold">
                            ${r.netProfit.toFixed(2)}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                )}
              </div>
            </div>

            {/* Modal Footer */}
            <div className="p-4 bg-gray-50 border-t flex justify-between items-center">
              <span className="text-xs text-gray-500 font-medium">
                💡 ទិន្នន័យខាងលើត្រូវបាន Filter និង Sort
                តាមលក្ខខណ្ឌដែលបានកំណត់រួចរាល់
              </span>
              <div className="flex gap-3">
                <button
                  onClick={() => setShowPreviewModal(false)}
                  className="px-4 py-2 border border-gray-300 text-gray-700 rounded-xl text-xs font-semibold hover:bg-gray-100 transition"
                >
                  បោះបង់ (Cancel)
                </button>
                <button
                  onClick={confirmAndExportExcel}
                  className="px-5 py-2 bg-emerald-600 text-white rounded-xl text-xs font-bold hover:bg-emerald-700 shadow-md transition flex items-center gap-2"
                >
                  📥 Download Excel Now
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
