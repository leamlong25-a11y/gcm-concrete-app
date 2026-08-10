import React, { useState, useEffect } from "react";
import InvoicePreview from "../components/invoice/InvoicePreview";

export default function Reports() {
  const [invoices, setInvoices] = useState([]);

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

      // តម្រៀបទិន្នន័យពីថ្មីទៅចាស់
      const sortedData = safeData.sort(
        (a, b) => new Date(b.dateIssue || 0) - new Date(a.dateIssue || 0),
      );
      setInvoices(sortedData);
    } catch (err) {
      console.error("Error loading data:", err);
      setInvoices([]);
    }
  };

  return (
    <div className="space-y-6 fade-in pb-10 khmer-font">
      <div className="bg-white p-4 sm:p-6 rounded-2xl shadow-sm border border-gray-100">
        {/* Header របស់របាយការណ៍ */}
        <div className="bg-blue-900 text-white p-4 rounded-t-xl">
          <h2 className="text-lg font-bold flex items-center gap-2">
            <span>📑</span> ១. របាយការណ៍វិក្កយបត្រសម្រាប់អតិថិជន (Customer
            Invoice Report)
          </h2>
        </div>

        {/* តារាងទិន្នន័យរបាយការណ៍ */}
        <div className="overflow-x-auto border-x border-b border-gray-200 rounded-b-xl">
          <table className="w-full text-left text-sm whitespace-nowrap">
            <thead>
              <tr className="bg-gray-50 text-gray-700 font-bold text-xs uppercase border-b border-gray-200">
                <th className="p-3 text-center">ល.រ</th>
                <th className="p-3">ថ្ងៃទីខែ</th>
                <th className="p-3">អតិថិជន & ទីតាំង</th>
                <th className="p-3">ឈ្មោះទីផ្សារ</th>
                <th className="p-3">កម្លាំង & បរិមាណ</th>
                <th className="p-3">តម្លៃលក់រាយ</th>
                <th className="p-3">សេវាបូម/ដឹក</th>
                <th className="p-3 text-right">ទឹកប្រាក់សរុប</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 text-xs">
              {invoices.length > 0 ? (
                invoices.map((inv, index) => {
                  // ទាញយកព័ត៌មានពី Item ដំបូង (បើមាន) ដើម្បីបង្ហាញក្នុងតារាងរបាយការណ៍
                  const firstItem =
                    inv.items && inv.items.length > 0 ? inv.items[0] : {};
                  const strength = firstItem.strength || "-";
                  const qty = inv.totalQty || 0;
                  const price = parseFloat(firstItem.customerPrice) || 0;

                  // គណនាសេវាកម្មសរុប (បូម + ដឹក) សម្រាប់វិក្កយបត្រនោះ
                  const totalServiceFee = inv.items
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
                      onClick={() => setSelectedInvoice(inv)} // ចុចលើជួរនេះនឹងបង្ហាញ Modal Preview
                      className="hover:bg-blue-50/60 cursor-pointer transition text-gray-700"
                    >
                      <td className="p-3 text-center font-medium">
                        {index + 1}
                      </td>
                      <td className="p-3 text-gray-600">
                        {inv.displayDate || inv.dateIssue}
                      </td>
                      <td className="p-3">
                        <div className="font-bold text-blue-900">
                          {inv.customer}
                        </div>
                        <div className="text-[11px] text-gray-400 mt-0.5">
                          {inv.location}
                        </div>
                      </td>
                      <td className="p-3">
                        <span className="bg-purple-50 text-purple-700 px-2 py-1 rounded font-semibold text-[11px]">
                          {inv.marketing || "-"}
                        </span>
                      </td>
                      <td className="p-3 text-gray-600">
                        {strength} ( {qty.toFixed(1)} m³ )
                      </td>
                      <td className="p-3 text-gray-600">${price.toFixed(2)}</td>
                      <td className="p-3 text-gray-600">
                        ${totalServiceFee.toFixed(2)}
                      </td>
                      <td className="p-3 text-right font-extrabold text-blue-900">
                        ${inv.revenue?.toFixed(2)}
                      </td>
                    </tr>
                  );
                })
              ) : (
                <tr>
                  <td colSpan="8" className="p-8 text-center text-gray-400">
                    មិនមានទិន្នន័យរបាយការណ៍ទេ
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
            {/* របារខាងលើនៃ Modal (Header) */}
            <div className="bg-white border-b border-gray-200 px-6 py-4 flex justify-between items-center sticky top-0 z-10">
              <h3 className="font-bold text-gray-800 text-lg">
                ព័ត៌មានលម្អិតវិក្កយបត្រ (Preview)
              </h3>
              <button
                onClick={() => setSelectedInvoice(null)} // បិទ Modal
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

            {/* តួនៃ Modal (បង្ហាញ InvoicePreview) */}
            <div className="overflow-y-auto p-4 sm:p-6 pb-20">
              <InvoicePreview data={selectedInvoice} />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
