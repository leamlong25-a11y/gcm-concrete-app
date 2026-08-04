import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { db } from "../services/firebase";
import { ref, set, get, child } from "firebase/database";
import InvoiceItem from "../components/invoice/InvoiceItem";
import InvoicePreview from "../components/invoice/InvoicePreview";

export default function NewInvoice() {
  const navigate = useNavigate();
  const locationState = useLocation().state;
  const editId = locationState?.editId; // ពិនិត្យមើលថាតើកំពុងស្ថិតក្នុងរបៀប Edit ឬអត់

  const [customer, setCustomer] = useState("");
  const [location, setLocation] = useState("");
  const [marketing, setMarketing] = useState("");
  const [dateIssue, setDateIssue] = useState(
    new Date().toISOString().split("T")[0],
  );

  const settings = JSON.parse(localStorage.getItem("gcm_settings")) || {};
  const strengthsList = settings.strengths || [
    "C15",
    "C20",
    "C25",
    "C30",
    "C35",
  ];
  const marketingsList = settings.marketings || [];

  const [items, setItems] = useState([
    {
      date: "",
      strength: strengthsList[0] || "C20",
      qty: "",
      customerPrice: "",
      companyPrice: "",
      pumpFee: "",
      deliveryFee: "",
      note: "",
    },
  ]);

  // បើមាន editId គឺទាញយកទិន្នន័យចាស់មកបំពេញក្នុង Form ស្រាប់
  useEffect(() => {
    if (editId) {
      const data = JSON.parse(localStorage.getItem("gcm_data") || "[]");
      const found = data.find((inv) => inv.id === editId);
      if (found) {
        setCustomer(found.customer || "");
        setLocation(found.location || "");
        setMarketing(found.marketing || "");
        setDateIssue(found.dateIssue || new Date().toISOString().split("T")[0]);
        setItems(
          found.items && found.items.length > 0
            ? found.items
            : [
                {
                  date: "",
                  strength: strengthsList[0] || "C20",
                  qty: "",
                  customerPrice: "",
                  companyPrice: "",
                  pumpFee: "",
                  deliveryFee: "",
                  note: "",
                },
              ],
        );
      }
    }
  }, [editId]);

  const handleItemChange = (index, field, value) => {
    const newItems = [...items];
    newItems[index][field] = value;
    setItems(newItems);
  };

  const addInvoiceItem = () => {
    setItems([
      ...items,
      {
        date: "",
        strength: strengthsList[0] || "C20",
        qty: "",
        customerPrice: "",
        companyPrice: "",
        pumpFee: "",
        deliveryFee: "",
        note: "",
      },
    ]);
  };

  const removeInvoiceItem = (index) => {
    if (items.length === 1) return;
    setItems(items.filter((_, i) => i !== index));
  };

  const resetForm = () => {
    setCustomer("");
    setLocation("");
    setMarketing(marketingsList[0] || "");
    setDateIssue(new Date().toISOString().split("T")[0]);
    setItems([
      {
        date: "",
        strength: strengthsList[0] || "C20",
        qty: "",
        customerPrice: "",
        companyPrice: "",
        pumpFee: "",
        deliveryFee: "",
        note: "",
      },
    ]);
  };

  const saveInvoice = async () => {
    if (!customer) {
      alert("សូមបញ្ចូលឈ្មោះអតិថិជន!");
      return;
    }

    const email = localStorage.getItem("gcm_logged_user");
    if (!email) return;

    let totalQty = 0,
      revenue = 0,
      profit = 0;
    const processedItems = items.map((it) => {
      const q = parseFloat(it.qty) || 0;
      const price = parseFloat(it.customerPrice) || 0;
      const compPrice = parseFloat(it.companyPrice) || 0;
      const pump = parseFloat(it.pumpFee) || 0;
      const deliv = parseFloat(it.deliveryFee) || 0;
      const amount = q * price + pump + deliv;

      totalQty += q;
      revenue += amount;
      profit += (price - compPrice) * q;

      return {
        ...it,
        qty: q,
        customerPrice: price,
        companyPrice: compPrice,
        pumpFee: pump,
        deliveryFee: deliv,
        amount,
      };
    });

    // បើមាន editId ប្រើ ID ចាស់ បើអត់ទេបង្កើត ID ថ្មី
    const invoiceId = editId || "inv_" + Date.now();
    const invData = {
      id: invoiceId,
      userEmail: email,
      dateIssue,
      displayDate: dateIssue ? dateIssue.split("-").reverse().join("/") : "",
      customer,
      location,
      marketing,
      items: processedItems,
      totalQty,
      revenue,
      profit,
    };

    const safeKey = email.replace(/[.#$[\]]/g, "_");
    try {
      await set(ref(db, `invoices/${safeKey}/${invoiceId}`), invData);
      alert(
        editId
          ? "កែប្រែ និងរក្សាទុកទិន្នន័យជោគជ័យ!"
          : "រក្សាទុកក្នុង Firebase ជោគជ័យ!",
      );
      navigate("/invoices");
    } catch (error) {
      alert("Error: " + error.message);
    }
  };

  return (
    <div className="space-y-6 fade-in pb-10 khmer-font">
      <div className="flex flex-col sm:flex-row justify-between sm:items-center bg-white p-4 sm:p-6 rounded-2xl shadow-sm border border-gray-100 gap-3">
        <div>
          <h1 className="text-xl font-bold text-gray-800">
            {editId
              ? "កែប្រែវិក្កយបត្រ (Edit Invoice)"
              : "បង្កើតវិក្កយបត្រ (New Invoice)"}
          </h1>
          <p className="text-xs text-gray-500 mt-0.5">
            កត់ត្រា និងគ្រប់គ្រងការដឹកជញ្ជូនបេតុងជូនអតិថិជន
          </p>
        </div>
        <div className="flex gap-2 w-full sm:w-auto">
          {!editId && (
            <button
              type="button"
              onClick={resetForm}
              className="flex-1 sm:flex-none px-4 py-2.5 border border-gray-200 text-gray-700 rounded-xl text-sm font-medium hover:bg-gray-50 transition"
            >
              សម្អាត
            </button>
          )}
          <button
            type="button"
            onClick={saveInvoice}
            className="flex-1 sm:flex-none px-5 py-2.5 bg-blue-600 text-white rounded-xl text-sm font-semibold hover:bg-blue-700 shadow-md transition"
          >
            {editId ? "ធ្វើបច្ចុប្បន្នភាព (Update)" : "រក្សាទុក (Save)"}
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <div className="lg:col-span-5 bg-white p-5 sm:p-6 rounded-2xl shadow-sm border border-gray-100 flex flex-col gap-4">
          <div className="grid grid-cols-1 gap-4 text-xs">
            <div>
              <label className="block font-semibold text-gray-600 mb-1">
                អតិថិជន (Customer Name)
              </label>
              <input
                type="text"
                value={customer}
                onChange={(e) => setCustomer(e.target.value)}
                placeholder="បញ្ចូលឈ្មោះអតិថិជន..."
                className="w-full border border-gray-200 rounded-xl p-3 text-sm outline-none focus:border-blue-500"
              />
            </div>
            <div>
              <label className="block font-semibold text-gray-600 mb-1">
                ទីតាំង (Work Location)
              </label>
              <input
                type="text"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                placeholder="បញ្ចូលទីតាំងការដ្ឋាន..."
                className="w-full border border-gray-200 rounded-xl p-3 text-sm outline-none focus:border-blue-500"
              />
            </div>
            <div>
              <label className="block font-semibold text-gray-600 mb-1">
                ឈ្មោះទីផ្សារ (Marketing)
              </label>
              <select
                value={marketing}
                onChange={(e) => setMarketing(e.target.value)}
                className="w-full border border-gray-200 rounded-xl p-3 text-sm bg-white outline-none focus:border-blue-500"
              >
                <option value="">-- ជ្រើសរើសទីផ្សារ --</option>
                {marketingsList.map((m, idx) => (
                  <option key={idx} value={m}>
                    {m}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block font-semibold text-blue-700 mb-1">
                កាលបរិច្ឆេទចេញវិក្កយបត្រ (Date Issue)
              </label>
              <input
                type="date"
                value={dateIssue}
                onChange={(e) => setDateIssue(e.target.value)}
                className="w-full border border-blue-200 rounded-xl p-3 text-sm outline-none focus:border-blue-500 bg-blue-50/50"
              />
            </div>
          </div>

          <div className="border-t border-gray-100 pt-4 mt-2">
            <div className="flex justify-between items-center mb-3">
              <h2 className="text-sm font-bold text-gray-800">
                ព័ត៌មានការដឹកជញ្ជូន (Deliveries)
              </h2>
              <button
                type="button"
                onClick={addInvoiceItem}
                className="px-3 py-1.5 bg-indigo-50 text-indigo-700 border border-indigo-100 rounded-lg text-xs font-bold hover:bg-indigo-100 transition"
              >
                + បន្ថែមការដឹក
              </button>
            </div>
            <div className="space-y-4 max-h-[500px] overflow-y-auto pr-1">
              {items.map((item, index) => (
                <InvoiceItem
                  key={index}
                  index={index}
                  item={item}
                  strengths={strengthsList}
                  onChange={handleItemChange}
                  onRemove={removeInvoiceItem}
                />
              ))}
            </div>
          </div>
        </div>

        <div className="lg:col-span-7 bg-white p-4 sm:p-8 rounded-2xl shadow-sm border border-gray-100 flex flex-col items-center overflow-hidden">
          <div className="w-full flex justify-between items-center mb-4 no-print">
            <span className="text-xs font-semibold text-gray-500 uppercase">
              ទម្រង់វិក្កយបត្រ (Preview)
            </span>
            <button
              onClick={() => window.print()}
              className="px-4 py-2 bg-gray-800 text-white rounded-xl text-xs font-bold hover:bg-gray-700 shadow"
            >
              🖨️ Print / PDF
            </button>
          </div>
          <InvoicePreview
            data={{ customer, location, marketing, dateIssue, items }}
          />
        </div>
      </div>
    </div>
  );
}
