import React, { useState, useEffect } from "react";

export default function Settings() {
  const [strengths, setStrengths] = useState([]);
  const [newStrength, setNewStrength] = useState("");

  // State សម្រាប់ឈ្មោះទីផ្សារ (Marketings)
  const [marketings, setMarketings] = useState([]);
  const [newMarketing, setNewMarketing] = useState("");

  const [signatures, setSignatures] = useState({
    sig_marketing: "",
    sig_finance: "",
  });

  useEffect(() => {
    loadSettings();
  }, []);

  const loadSettings = () => {
    const settings = JSON.parse(localStorage.getItem("gcm_settings")) || {
      strengths: ["C15", "C20", "C25", "C30", "C35"],
      marketings: ["ទីផ្សារ A", "ទីផ្សារ B"],
      signatures: {},
    };
    setStrengths(settings.strengths || []);
    setMarketings(settings.marketings || []);
    setSignatures(settings.signatures || {});
  };

  const saveSettingsToStorage = (newStrengths, newMarketings) => {
    const settings = JSON.parse(localStorage.getItem("gcm_settings")) || {
      strengths: [],
      marketings: [],
      signatures: {},
    };
    if (newStrengths) settings.strengths = newStrengths;
    if (newMarketings) settings.marketings = newMarketings;
    localStorage.setItem("gcm_settings", JSON.stringify(settings));
  };

  const addStrength = () => {
    if (!newStrength) return;
    const updated = [...strengths, newStrength];
    saveSettingsToStorage(updated, null);
    setStrengths(updated);
    setNewStrength("");
  };

  const removeStrength = (idx) => {
    const updated = strengths.filter((_, i) => i !== idx);
    saveSettingsToStorage(updated, null);
    setStrengths(updated);
  };

  // មុខងារបន្ថែម និងលុបឈ្មោះទីផ្សារ
  const addMarketing = () => {
    if (!newMarketing) return;
    const updated = [...marketings, newMarketing];
    saveSettingsToStorage(null, updated);
    setMarketings(updated);
    setNewMarketing("");
  };

  const removeMarketing = (idx) => {
    const updated = marketings.filter((_, i) => i !== idx);
    saveSettingsToStorage(null, updated);
    setMarketings(updated);
  };

  const handleFileUpload = (event, key) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const settings = JSON.parse(localStorage.getItem("gcm_settings")) || {
          strengths: [],
          marketings: [],
          signatures: {},
        };
        if (!settings.signatures) settings.signatures = {};
        settings.signatures[key] = e.target.result;
        localStorage.setItem("gcm_settings", JSON.stringify(settings));
        setSignatures({ ...settings.signatures });
        alert("រក្សាទុករូបភាពហត្ថលេខាជោគជ័យ!");
      };
      reader.readAsDataURL(file);
    }
  };

  const handleRemoveSignature = (key) => {
    if (window.confirm("តើអ្នកពិតជាចង់លុបហត្ថលេខានេះមែនទេ?")) {
      const settings = JSON.parse(localStorage.getItem("gcm_settings")) || {
        strengths: [],
        marketings: [],
        signatures: {},
      };
      if (settings.signatures) {
        delete settings.signatures[key];
      }
      localStorage.setItem("gcm_settings", JSON.stringify(settings));
      setSignatures({ ...settings.signatures });
      alert("លុបហត្ថលេខាបានជោគជ័យ!");
    }
  };

  return (
    <div className="space-y-6 fade-in khmer-font pb-10">
      <div className="bg-white p-4 sm:p-6 rounded-2xl shadow-sm border border-gray-100">
        <h1 className="text-xl font-bold text-gray-800">ការកំណត់ (Settings)</h1>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* ប្រភេទកម្លាំងបេតុង */}
        <div className="bg-white p-5 rounded-2xl shadow-sm border border-gray-100">
          <h2 className="text-md font-bold text-gray-800 border-b pb-2 mb-4">
            ប្រភេទកម្លាំងបេតុង
          </h2>
          <div className="flex gap-2 mb-4 text-xs">
            <input
              type="text"
              value={newStrength}
              onChange={(e) => setNewStrength(e.target.value)}
              placeholder="ឧទាហរណ៍: C40..."
              className="flex-1 border border-gray-200 rounded-xl p-3 outline-none"
            />
            <button
              type="button"
              onClick={addStrength}
              className="bg-blue-600 text-white px-4 py-2 rounded-xl font-semibold"
            >
              បន្ថែម
            </button>
          </div>
          <div className="space-y-2 max-h-60 overflow-y-auto pr-1 text-xs">
            {strengths.map((s, idx) => (
              <div
                key={idx}
                className="flex justify-between items-center bg-gray-50 p-3 rounded-xl border border-gray-100"
              >
                <span className="font-semibold">{s}</span>
                <button
                  type="button"
                  onClick={() => removeStrength(idx)}
                  className="text-red-500 hover:underline"
                >
                  លុប
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* ឈ្មោះទីផ្សារ (Marketing Names) */}
        <div className="bg-white p-5 rounded-2xl shadow-sm border border-gray-100">
          <h2 className="text-md font-bold text-gray-800 border-b pb-2 mb-4">
            ឈ្មោះទីផ្សារ (Marketing Names)
          </h2>
          <div className="flex gap-2 mb-4 text-xs">
            <input
              type="text"
              value={newMarketing}
              onChange={(e) => setNewMarketing(e.target.value)}
              placeholder="បញ្ចូលឈ្មោះទីផ្សារ..."
              className="flex-1 border border-gray-200 rounded-xl p-3 outline-none"
            />
            <button
              type="button"
              onClick={addMarketing}
              className="bg-emerald-600 text-white px-4 py-2 rounded-xl font-semibold"
            >
              បន្ថែម
            </button>
          </div>
          <div className="space-y-2 max-h-60 overflow-y-auto pr-1 text-xs">
            {marketings.map((m, idx) => (
              <div
                key={idx}
                className="flex justify-between items-center bg-gray-50 p-3 rounded-xl border border-gray-100"
              >
                <span className="font-semibold">{m}</span>
                <button
                  type="button"
                  onClick={() => removeMarketing(idx)}
                  className="text-red-500 hover:underline"
                >
                  លុប
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* ផ្នែកហត្ថលេខា */}
        <div className="bg-white p-5 rounded-2xl shadow-sm border border-gray-100 md:col-span-2">
          <h2 className="text-md font-bold text-gray-800 border-b pb-2 mb-4">
            ការគ្រប់គ្រងហត្ថលេខា
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
            <div className="border border-gray-200 p-4 rounded-xl bg-gray-50 space-y-3">
              <label className="block font-semibold">MARKETING SIGNATURE</label>
              {signatures.sig_marketing ? (
                <div className="flex items-center justify-between bg-white p-2 rounded-lg border">
                  <img
                    src={signatures.sig_marketing}
                    alt="Marketing Sign"
                    className="h-12 object-contain"
                  />
                  <button
                    type="button"
                    onClick={() => handleRemoveSignature("sig_marketing")}
                    className="px-3 py-1 bg-red-50 text-red-600 rounded-lg font-semibold hover:bg-red-100 transition"
                  >
                    លុបចេញ
                  </button>
                </div>
              ) : (
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => handleFileUpload(e, "sig_marketing")}
                  className="w-full text-xs"
                />
              )}
            </div>

            <div className="border border-gray-200 p-4 rounded-xl bg-gray-50 space-y-3">
              <label className="block font-semibold">
                CHECK / FINANCE SIGNATURE
              </label>
              {signatures.sig_finance ? (
                <div className="flex items-center justify-between bg-white p-2 rounded-lg border">
                  <img
                    src={signatures.sig_finance}
                    alt="Finance Sign"
                    className="h-12 object-contain"
                  />
                  <button
                    type="button"
                    onClick={() => handleRemoveSignature("sig_finance")}
                    className="px-3 py-1 bg-red-50 text-red-600 rounded-lg font-semibold hover:bg-red-100 transition"
                  >
                    លុបចេញ
                  </button>
                </div>
              ) : (
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => handleFileUpload(e, "sig_finance")}
                  className="w-full text-xs"
                />
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
