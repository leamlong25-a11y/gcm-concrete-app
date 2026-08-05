import React from "react";

export default function InvoicePreview({ data }) {
  const { customer, location, dateIssue, items } = data;

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
      className="bg-white p-4 sm:p-8 rounded-2xl shadow-sm border border-gray-200 w-full max-w-3xl mx-auto khmer-font text-xs sm:text-sm"
    >
      {/* Company Header */}
      <div className="text-center space-y-1 mb-8">
        <h2 className="font-bold text-sm sm:text-base text-gray-900">
          ក្រុមហ៊ុនបេតុង ជី.ស៊ី.អឹម ខនគ្រីត
        </h2>
        <h3 className="font-bold text-xs sm:text-sm tracking-wide text-gray-900">
          GCM CONCRETE MIXING CO.,LTD
        </h3>
        <div className="pt-3 pb-1">
          <h1 className="text-base sm:text-lg font-bold tracking-widest inline-block border-b-2 border-gray-900 pb-0.5 uppercase">
            Invoice
          </h1>
        </div>
      </div>

      {/* Meta Info */}
      <div className="flex justify-between items-end mb-3 text-xs sm:text-sm font-semibold text-gray-900">
        <div className="space-y-2">
          <div className="flex items-center">
            <span className="w-16">To</span>
            <span>: {customer || ""}</span>
          </div>
          <div className="flex items-center">
            <span className="w-16">Location</span>
            <span>: {location || ""}</span>
          </div>
        </div>
        <div className="text-right">
          <div>
            <span>Date Issue : </span>
            <span>{formatDate(dateIssue)}</span>
          </div>
        </div>
      </div>

      {/* Table Section */}
      <div className="w-full overflow-x-auto mb-10">
        <table className="min-w-[750px] w-full text-center text-xs whitespace-nowrap border-collapse border border-gray-900">
          <thead>
            <tr className="text-gray-900 font-bold border border-gray-900 bg-white">
              <th className="p-2 border border-gray-900 w-10">No</th>
              <th className="p-2 border border-gray-900">Date</th>
              <th className="p-2 border border-gray-900">Strength</th>
              <th className="p-2 border border-gray-900">Quantity</th>
              <th className="p-2 border border-gray-900">Unite Price</th>
              <th className="p-2 border border-gray-900">Pump fee</th>
              <th className="p-2 border border-gray-900">Delivery fee</th>
              <th className="p-2 border border-gray-900">Amount</th>
              <th className="p-2 border border-gray-900">Note</th>
            </tr>
          </thead>
          <tbody>
            {items && items.length > 0 ? (
              items.map((it, idx) => {
                const q = parseFloat(it.qty) || 0;
                const p = parseFloat(it.customerPrice) || 0;
                const pump = parseFloat(it.pumpFee) || 0;
                const deliv = parseFloat(it.deliveryFee) || 0;
                const amount = q * p + pump + deliv;

                return (
                  <tr key={idx} className="text-gray-900 font-medium">
                    <td className="p-2 border border-gray-900">{idx + 1}</td>
                    <td className="p-2 border border-gray-900">
                      {formatDate(it.date)}
                    </td>
                    <td className="p-2 border border-gray-900">
                      {it.strength}
                    </td>
                    <td className="p-2 border border-gray-900">
                      {q.toFixed(1)} m³
                    </td>
                    <td className="p-2 border border-gray-900">
                      $ {p.toFixed(2)}
                    </td>
                    <td className="p-2 border border-gray-900">
                      $ {pump.toFixed(2)}
                    </td>
                    <td className="p-2 border border-gray-900">
                      $ {deliv.toFixed(2)}
                    </td>
                    <td className="p-2 border border-gray-900 font-bold">
                      $ {amount.toFixed(2)}
                    </td>
                    <td className="p-2 border border-gray-900">
                      {it.note || ""}
                    </td>
                  </tr>
                );
              })
            ) : (
              <tr>
                <td
                  colSpan="9"
                  className="p-4 text-center text-gray-400 border border-gray-900"
                >
                  មិនមានទិន្នន័យ
                </td>
              </tr>
            )}

            {/* Total Row */}
            <tr className="font-bold text-gray-900 bg-white">
              <td
                colSpan="3"
                className="p-2 border border-gray-900 text-center"
              >
                Total
              </td>
              <td className="p-2 border border-gray-900">
                {totalQty.toFixed(1)} m³
              </td>
              <td
                colSpan="3"
                className="p-2 border border-gray-900 bg-gray-50/20"
              ></td>
              <td className="p-2 border border-gray-900 text-red-600">
                $ {totalAmount.toFixed(2)}
              </td>
              <td className="p-2 border border-gray-900 bg-gray-50/20"></td>
            </tr>
          </tbody>
        </table>
      </div>

      {/* Signature Section */}
      <div className="flex justify-between items-end text-center text-xs font-bold text-gray-900 mt-4 px-2 sm:px-8">
        <div className="w-56 flex flex-col items-center">
          {/* ទុកចន្លោះសម្រាប់ស៊ីញ៉េ ឬដាក់រូប */}
          <div className="h-16 w-full flex items-center justify-center">
            {/* អ្នកអាចដាក់ <img src="..." className="h-full" /> ត្រង់នេះប្រសិនបើចង់ឱ្យលោតរូបហត្ថលេខាស្វ័យប្រវត្តិ */}
          </div>
          <div className="w-full border-t border-gray-900 pt-2">
            <p className="uppercase">Marketing Signature</p>
            <p className="mt-1 text-[11px] font-bold uppercase">
              ABA: 500 208 793: Leam Seakngeng
            </p>
          </div>
        </div>

        <div className="w-48 flex flex-col items-center">
          <div className="h-16 w-full"></div>
          <div className="w-full border-t border-gray-900 pt-2">
            <p className="uppercase">Check / Finance</p>
          </div>
        </div>
      </div>
    </div>
  );
}
