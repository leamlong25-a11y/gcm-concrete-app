import React from "react";

export default function InvoiceItem({
  index,
  item,
  strengths,
  onChange,
  onRemove,
}) {
  return (
    <div className="bg-gray-50/80 p-4 rounded-xl border border-gray-200/80 relative space-y-3">
      {index > 0 && (
        <button
          type="button"
          onClick={() => onRemove(index)}
          className="absolute -top-2 -right-2 bg-red-100 text-red-600 rounded-full w-6 h-6 flex items-center justify-center font-bold shadow-sm hover:bg-red-200 transition"
        >
          ×
        </button>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        <div>
          <label className="block text-[11px] font-semibold text-gray-600 mb-1 khmer-font">
            ថ្ងៃដឹក
          </label>
          <input
            type="date"
            value={item.date}
            onChange={(e) => onChange(index, "date", e.target.value)}
            className="w-full border border-gray-200 rounded-lg p-2 text-sm bg-white"
          />
        </div>
        <div>
          <label className="block text-[11px] font-semibold text-gray-600 mb-1 khmer-font">
            កម្លាំងបេតុង
          </label>
          <select
            value={item.strength}
            onChange={(e) => onChange(index, "strength", e.target.value)}
            className="w-full border border-gray-200 rounded-lg p-2 text-sm bg-white"
          >
            {strengths.map((s, i) => (
              <option key={i} value={s}>
                {s}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label className="block text-[11px] font-semibold text-gray-600 mb-1 khmer-font">
            បរិមាណ (m³)
          </label>
          <input
            type="number"
            step="0.1"
            value={item.qty}
            onChange={(e) => onChange(index, "qty", e.target.value)}
            className="w-full border border-gray-200 rounded-lg p-2 text-sm bg-white"
          />
        </div>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
        <div>
          <label className="block text-[10px] text-blue-700 font-semibold khmer-font">
            តម្លៃអតិថិជន ($)
          </label>
          <input
            type="number"
            step="0.01"
            value={item.customerPrice}
            onChange={(e) => onChange(index, "customerPrice", e.target.value)}
            className="w-full border border-gray-200 rounded-lg p-2 text-sm bg-white"
          />
        </div>
        <div>
          <label className="block text-[10px] text-red-600 font-semibold khmer-font">
            តម្លៃក្រុមហ៊ុន ($)
          </label>
          <input
            type="number"
            step="0.01"
            value={item.companyPrice}
            onChange={(e) => onChange(index, "companyPrice", e.target.value)}
            className="w-full border border-gray-200 rounded-lg p-2 text-sm bg-white"
          />
        </div>
        <div>
          <label className="block text-[10px] text-gray-600 font-semibold khmer-font">
            តម្លៃបូម ($)
          </label>
          <input
            type="number"
            step="0.01"
            value={item.pumpFee}
            onChange={(e) => onChange(index, "pumpFee", e.target.value)}
            className="w-full border border-gray-200 rounded-lg p-2 text-sm bg-white"
          />
        </div>
        <div>
          <label className="block text-[10px] text-gray-600 font-semibold khmer-font">
            តម្លៃដឹក ($)
          </label>
          <input
            type="number"
            step="0.01"
            value={item.deliveryFee}
            onChange={(e) => onChange(index, "deliveryFee", e.target.value)}
            className="w-full border border-gray-200 rounded-lg p-2 text-sm bg-white"
          />
        </div>
      </div>

      <div>
        <label className="block text-[10px] text-gray-600 font-semibold khmer-font">
          ចំណាំ (Note)
        </label>
        <input
          type="text"
          value={item.note}
          onChange={(e) => onChange(index, "note", e.target.value)}
          placeholder="ចំណាំបន្ថែម..."
          className="w-full border border-gray-200 rounded-lg p-2 text-sm bg-white"
        />
      </div>
    </div>
  );
}
