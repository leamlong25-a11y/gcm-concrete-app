import React from "react";

export default function InvoicePreview({ data }) {
  const { customer, location, dateIssue, items } = data;

  let totalQty = 0;
  let totalAmount = 0;

  const formattedDate = dateIssue
    ? dateIssue.split("-").reverse().join("/")
    : "";
  const signatures =
    JSON.parse(localStorage.getItem("gcm_settings"))?.signatures || {};

  return (
    <div
      id="printable-invoice"
      className="w-full max-w-2xl bg-white p-6 border border-gray-300 text-black text-sm relative mx-auto"
    >
      <div className="text-center mb-6">
        <h2 className="font-bold text-base khmer-font">
          ក្រុមហ៊ុនបេតុង ជី.ស៊ី.អឹម ខនក្រេត
        </h2>
        <p className="font-bold text-sm uppercase">
          GCM CONCRETE MIXING CO.,LTD
        </p>
      </div>
      <div className="mb-4 text-center">
        <span className="font-bold tracking-widest uppercase text-base border-b-2 border-black pb-0.5">
          INVOICE
        </span>
      </div>
      <div className="mb-4 space-y-1 text-xs sm:text-sm">
        <div className="flex items-center">
          <span className="w-20 font-medium">To</span>
          <span className="mr-2">:</span>
          <span className="font-semibold">{customer}</span>
        </div>
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <span className="w-20 font-medium">Location</span>
            <span className="mr-2">:</span>
            <span className="font-semibold">{location}</span>
          </div>
          <div>
            <span className="font-medium">Date Issue</span> :{" "}
            <span className="font-semibold">{formattedDate}</span>
          </div>
        </div>
      </div>

      <table className="w-full border-collapse border border-black text-center text-xs mb-4">
        <thead>
          <tr className="bg-gray-50">
            <th className="border border-black p-1.5 w-8">No</th>
            <th className="border border-black p-1.5">Date</th>
            <th className="border border-black p-1.5">Strength</th>
            <th className="border border-black p-1.5">Quantity</th>
            <th className="border border-black p-1.5">Unit Price</th>
            <th className="border border-black p-1.5">Pump fee</th>
            <th className="border border-black p-1.5">Delivery</th>
            <th className="border border-black p-1.5">Amount</th>
            <th className="border border-black p-1.5">Note</th>
          </tr>
        </thead>
        <tbody>
          {items.map((item, i) => {
            const q = parseFloat(item.qty) || 0;
            const price = parseFloat(item.customerPrice) || 0;
            const pump = parseFloat(item.pumpFee) || 0;
            const deliv = parseFloat(item.deliveryFee) || 0;
            const amount = q * price + pump + deliv;

            totalQty += q;
            totalAmount += amount;

            return (
              <tr key={i}>
                <td className="border border-black p-1.5">{i + 1}</td>
                <td className="border border-black p-1.5">
                  {item.date ? item.date.split("-").reverse().join("/") : ""}
                </td>
                <td className="border border-black p-1.5">{item.strength}</td>
                <td className="border border-black p-1.5 whitespace-nowrap">
                  {q > 0 ? q.toFixed(1) + " m³" : "0.0 m³"}
                </td>
                <td className="border border-black p-1.5 whitespace-nowrap">
                  $ {price.toFixed(2)}
                </td>
                <td className="border border-black p-1.5 whitespace-nowrap">
                  $ {pump.toFixed(2)}
                </td>
                <td className="border border-black p-1.5 whitespace-nowrap">
                  $ {deliv.toFixed(2)}
                </td>
                <td className="border border-black p-1.5 font-semibold whitespace-nowrap">
                  $ {amount.toFixed(2)}
                </td>
                <td className="border border-black p-1.5 text-left px-2">
                  {item.note || ""}
                </td>
              </tr>
            );
          })}
        </tbody>
        <tfoot>
          <tr className="font-bold">
            <td colSpan="3" className="border border-black p-1.5 text-center">
              Total
            </td>
            <td className="border border-black p-1.5 whitespace-nowrap">
              {totalQty.toFixed(1)} m³
            </td>
            <td className="border border-black p-1.5"></td>
            <td className="border border-black p-1.5"></td>
            <td className="border border-black p-1.5"></td>
            <td className="border border-black p-1.5 text-red-600 whitespace-nowrap">
              $ {totalAmount.toFixed(2)}
            </td>
            <td className="border border-black p-1.5"></td>
          </tr>
        </tfoot>
      </table>

      <div className="flex justify-between items-end mt-12 pt-4">
        <div className="w-48 text-center relative flex flex-col items-center min-h-[60px]">
          {signatures?.sig_marketing && (
            <div className="absolute bottom-full mb-1 w-full flex justify-center">
              <img
                src={signatures.sig_marketing}
                className="max-h-[45px] object-contain"
                alt="Signature"
              />
            </div>
          )}
          <div className="w-full border-t border-black pt-1 mb-1 text-[11px] font-bold text-center">
            MARKETING SIGNATURE
          </div>
          <div className="w-full text-[10px] text-black font-extrabold text-center tracking-wide leading-tight space-y-0.5">
            <div>ABA: 500 208 793</div>
            <div>LEAM SEAKNGENG</div>
          </div>
        </div>
        <div className="w-48 text-center relative flex flex-col items-center min-h-[60px]">
          {signatures?.sig_finance && (
            <div className="absolute bottom-full mb-1 w-full flex justify-center">
              <img
                src={signatures.sig_finance}
                className="max-h-[45px] object-contain"
                alt="Signature"
              />
            </div>
          )}
          <div className="w-full border-t border-black pt-1 mb-1 text-[11px] font-bold text-center">
            CHECK / FINANCE
          </div>
        </div>
      </div>
    </div>
  );
}
