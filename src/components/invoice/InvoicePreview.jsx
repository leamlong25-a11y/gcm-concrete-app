import React from "react";

export default function InvoicePreview({ data }) {
  const { customer, location, marketing, dateIssue, items } = data;

  const totalQty = items
    ? items.reduce((acc, it) => acc + (parseFloat(it.qty) || 0), 0)
    : 0;
  const totalAmount = items
    ? items.reduce((acc, it) => {
        const q = parseFloat(it.qty) || 0;
        const p = parseFloat(it.customerPrice) || 0;
        const pump = parseFloat(it.pumpFee) || 0;
        const deliv = parseFloat(it.deliveryFee) || 0;
        return acc + (q * p + pump + deliv);
      }, 0)
    : 0;

  const formatDate = (d) => {
    if (!d) return "";
    return d.split("-").reverse().join("/");
  };

  return (
    <div
      id="printable-invoice"
      className="bg-white p-4 sm:p-8 rounded-2xl shadow-sm border border-gray-200 w-full max-w-2xl mx-auto khmer-font text-xs sm:text-sm"
    >
      {/* Company Header */}
      <div className="text-center space-y-1 mb-6">
        <h2 className="font-bold text-sm sm:text-base text-gray-900">
          ក្រុមហ៊ុនបេតុង ជី.ស៊ី.អឹម ខនគ្រីត
        </h2>
        <h3 className="font-bold text-xs sm:text-sm tracking-wide text-gray-800">
          GCM CONCRETE MIXING CO.,LTD
        </h3>
        <div className="py-2">
          <h1 className="text-base sm:text-lg font-extrabold tracking-widest inline-block border-b-2 border-gray-900 pb-0.5">
            INVOICE
          </h1>
        </div>
      </div>

      {/* Meta Info */}
      <div className="grid grid-cols-2 gap-4 mb-4 text-xs">
        <div className="space-y-1">
          <div className="flex">
            <span className="w-20 font-semibold text-gray-600">To</span>:{" "}
            <span className="font-bold text-blue-900 flex-1 truncate">
              {customer || "-"}
            </span>
          </div>
          <div className="flex">
            <span className="w-20 font-semibold text-gray-600">Location</span>:{" "}
            <span className="text-gray-700 flex-1 truncate">
              {location || "-"}
            </span>
          </div>
        </div>
        <div className="text-right space-y-1">
          <div>
            <span className="font-semibold text-gray-600">Date Issue:</span>{" "}
            <span className="font-bold">{formatDate(dateIssue)}</span>
          </div>
          {marketing && (
            <div>
              <span className="font-semibold text-gray-600">Marketing:</span>{" "}
              <span className="text-purple-700 font-semibold">{marketing}</span>
            </div>
          )}
        </div>
      </div>

      {/* Table with Horizontal Scroll for Mobile */}
      <div className="overflow-x-auto border border-gray-300 rounded-lg mb-6">
        <table className="w-full text-left text-xs whitespace-nowrap">
          <thead>
            <tr className="bg-gray-100 text-gray-700 border-b border-gray-300 text-[11px]">
              <th className="p-2.5 text-center w-10">No</th>
              <th className="p-2.5">Date</th>
              <th className="p-2.5">Strength</th>
              <th className="p-2.5">Quantity</th>
              <th className="p-2.5">Unit Price</th>
              <th className="p-2.5">Pump fee</th>
              <th className="p-2.5">Delivery</th>
              <th className="p-2.5 text-right">Amount</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {items && items.length > 0 ? (
              items.map((it, idx) => {
                const q = parseFloat(it.qty) || 0;
                const p = parseFloat(it.customerPrice) || 0;
                const pump = parseFloat(it.pumpFee) || 0;
                const deliv = parseFloat(it.deliveryFee) || 0;
                const amount = q * p + pump + deliv;

                return (
                  <tr key={idx} className="hover:bg-gray-50">
                    <td className="p-2.5 text-center">{idx + 1}</td>
                    <td className="p-2.5">{formatDate(it.date)}</td>
                    <td className="p-2.5 font-semibold">{it.strength}</td>
                    <td className="p-2.5">{q.toFixed(1)} m³</td>
                    <td className="p-2.5">${p.toFixed(2)}</td>
                    <td className="p-2.5">${pump.toFixed(2)}</td>
                    <td className="p-2.5">${deliv.toFixed(2)}</td>
                    <td className="p-2.5 text-right font-bold text-blue-900">
                      ${amount.toFixed(2)}
                    </td>
                  </tr>
                );
              })
            ) : (
              <tr>
                <td colSpan="8" className="p-4 text-center text-gray-400">
                  មិនមានទិន្នន័យ
                </td>
              </tr>
            )}
            {/* Total Row */}
            <tr className="bg-gray-50 font-bold border-t border-gray-300">
              <td colSpan="3" className="p-2.5 text-right">
                Total
              </td>
              <td className="p-2.5">{totalQty.toFixed(1)} m³</td>
              <td colSpan="3"></td>
              <td className="p-2.5 text-right text-red-600">
                ${totalAmount.toFixed(2)}
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      {/* Signature Section */}
      <div className="grid grid-cols-2 gap-8 pt-8 text-center text-xs">
        <div className="space-y-12">
          <div>
            <p className="font-bold text-gray-800">MARKETING SIGNATURE</p>
            <p className="text-[11px] text-gray-500 mt-1">ABA: 500 208 793</p>
            <p className="text-[11px] font-bold text-gray-700">
              LEAM SEAKNGENG
            </p>
          </div>
        </div>
        <div className="space-y-12">
          <p className="font-bold text-gray-800">CHECK / FINANCE</p>
        </div>
      </div>
    </div>
  );
}
