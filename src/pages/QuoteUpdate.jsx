import { useParams, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import {
  useGetQuoteByIdQuery,
  useUpdateQuoteMutation,
} from "../slices/quotesApiSlice";
import { useGetUsersQuery } from "../slices/usersApiSlice";
import Message from "../components/Message";
import { toast } from "react-toastify";

const QuoteUpdate = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { data: quote, isLoading, error } = useGetQuoteByIdQuery(id);
  const { data: users = [] } = useGetUsersQuery();
  const [updateQuote, { isLoading: isUpdating }] = useUpdateQuoteMutation();

  const [form, setForm] = useState({
    user: "",
    status: "",
    deliveryCharge: 0,
    extraFee: 0,
    totalPrice: 0,
    adminToAdminNote: "",
    AdminToClientNote: "",
    requestedItems: [],
  });

  useEffect(() => {
    if (quote) {
      setForm({
        user: quote.user?._id || "",
        status: quote.status || "",
        deliveryCharge: quote.deliveryCharge || 0,
        extraFee: quote.extraFee || 0,
        adminToAdminNote: quote.adminToAdminNote || "",
        AdminToClientNote: quote.adminToClientNote || "",
        requestedItems: quote.requestedItems.map((item) => ({
          product: item.product,
          qty: item.qty,
          unitPrice: item.unitPrice,
          qtyPrice: item.unitPrice * item.qty,
        })),
        totalPrice: quote.totalPrice || 0,
      });
    }
  }, [quote]);

  useEffect(() => {
    const itemsTotal = form.requestedItems.reduce(
      (sum, item) => sum + item.qtyPrice,
      0
    );
    setForm((prev) => ({
      ...prev,
      totalPrice:
        itemsTotal + Number(prev.deliveryCharge) + Number(prev.extraFee),
    }));
  }, [form.requestedItems, form.deliveryCharge, form.extraFee]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]:
        name === "deliveryCharge" || name === "extraFee"
          ? Number(value)
          : value,
    }));
  };

  const handlePriceChange = (index, newPrice) => {
    const updatedItems = [...form.requestedItems];
    const unitPrice = parseFloat(newPrice) || 0;
    const qty = updatedItems[index].qty;
    updatedItems[index].unitPrice = unitPrice;
    updatedItems[index].qtyPrice = unitPrice * qty;

    setForm((prev) => ({
      ...prev,
      requestedItems: updatedItems,
    }));
  };

  const handleQtyChange = (index, newQty) => {
    const updatedItems = [...form.requestedItems];
    const qty = parseInt(newQty) || 0;
    const unitPrice = updatedItems[index].unitPrice;
    updatedItems[index].qty = qty;
    updatedItems[index].qtyPrice = unitPrice * qty;

    setForm((prev) => ({
      ...prev,
      requestedItems: updatedItems,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await updateQuote({ id, ...form }).unwrap();
      toast.success("Quote updated successfully!");
      navigate("/admin/quotes", { state: { refetch: true } });
    } catch (err) {
      console.error(err);
      toast.error("Failed to update quote.");
    }
  };

  if (isLoading)
    return <p className="p-4 text-sm text-gray-500">Loading quote...</p>;
  if (error) return <Message type="error">Failed to load quote.</Message>;

  return (
    <div className="p-6 max-w-5xl mx-auto text-sm text-gray-800">
      <h2 className="text-xl font-semibold text-gray-800 mb-6">Update Quote</h2>

      <form onSubmit={handleSubmit} className="space-y-6">

        {/* User */}
        <div>
          <label className="block mb-1 font-medium">User</label>
          <select
            name="user"
            value={form.user}
            onChange={handleChange}
            className="w-full border rounded px-3 py-2"
          >
            <option value="">Select user</option>
            {users.map((u) => (
              <option key={u._id} value={u._id}>
                {u.name}
              </option>
            ))}
          </select>
        </div>

        {/* Order Info */}
        <div className="bg-gray-50 border rounded p-3">
          <div><strong>Order Created:</strong> {quote.isOrderCreated ? "Yes" : "No"}</div>
          {quote.createdOrderId && (
            <div><strong>Order ID:</strong> {quote.createdOrderId}</div>
          )}
        </div>

        {/* Requested Items Table */}
        <div className="overflow-x-auto border rounded">
          <table className="min-w-full text-left">
            <thead className="bg-gray-100">
              <tr>
                <th className="px-3 py-2">Product</th>
                <th className="px-3 py-2">Code</th>
                <th className="px-3 py-2">Size</th>
                <th className="px-3 py-2">Qty</th>
                <th className="px-3 py-2">Unit Price</th>
                <th className="px-3 py-2">Qty Price</th>
              </tr>
            </thead>
            <tbody>
              {form.requestedItems.map((item, idx) => (
                <tr key={idx} className="border-t">
                  <td className="px-3 py-1">{item.product?.name}</td>
                  <td className="px-3 py-1">{item.product?.code || "-"}</td>
                  <td className="px-3 py-1">{item.product?.size}</td>
                  <td className="px-3 py-1">
                    <input
                      type="number"
                      min="1"
                      value={item.qty}
                      onChange={(e) => handleQtyChange(idx, e.target.value)}
                      className="w-16 border rounded px-2 py-1"
                    />
                  </td>
                  <td className="px-3 py-1">
                    <input
                      type="number"
                      step="0.01"
                      value={item.unitPrice}
                      onChange={(e) => handlePriceChange(idx, e.target.value)}
                      className="w-24 border rounded px-2 py-1"
                    />
                  </td>
                  <td className="px-3 py-1">{item.qtyPrice.toFixed(2)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>


        {/* Price Section */}
        <div className="grid md:grid-cols-3 gap-4">
          <div>
            <label className="block mb-1 font-medium">Delivery Charge</label>
            <input
              name="deliveryCharge"
              type="number"
              step="0.01"
              value={form.deliveryCharge}
              onChange={handleChange}
              className="w-full border rounded px-3 py-2"
            />
          </div>
          <div>
            <label className="block mb-1 font-medium">Extra Fee</label>
            <input
              name="extraFee"
              type="number"
              step="0.01"
              value={form.extraFee}
              onChange={handleChange}
              className="w-full border rounded px-3 py-2"
            />
          </div>
          <div>
            <label className="block mb-1 font-medium">Total Price</label>
            <input
              type="number"
              value={form.totalPrice.toFixed(2)}
              disabled
              className="w-full border rounded px-3 py-2 bg-gray-100"
            />
          </div>
        </div>

        {/* Notes */}
        <div className="grid md:grid-cols-3 gap-4">
          <div>
            <label className="block mb-1 font-medium">Admin-to-Admin Note</label>
            <textarea
              name="adminToAdminNote"
              value={form.adminToAdminNote}
              onChange={handleChange}
              className="w-full border rounded px-3 py-2"
              rows={3}
            />
          </div>
          <div>
            <label className="block mb-1 font-medium">Admin-to-Client Note</label>
            <textarea
              name="AdminToClientNote"
              value={form.AdminToClientNote}
              onChange={handleChange}
              className="w-full border rounded px-3 py-2"
              rows={3}
            />
          </div>
          <div>
            <label className="block mb-1 font-medium">Client-to-Admin Note</label>
            <textarea
              value={quote.clientToAdminNote || ""}
              readOnly
              className="w-full border rounded px-3 py-2 bg-gray-100 text-gray-600"
              rows={3}
            />
          </div>
        </div>

        {/* Status as buttons */}
        <div>
          <label className="block mb-2 font-medium">Status</label>
          <div className="flex flex-wrap gap-2">
            {["Requested", "Quoted", "Confirmed", "Rejected"].map((status) => (
              <button
                key={status}
                type="button"
                onClick={() => setForm((prev) => ({ ...prev, status }))}
                className={`px-4 py-2 rounded border transition ${
                  form.status === status
                    ? "bg-purple-600 text-white border-purple-600"
                    : "bg-white text-gray-700 border-gray-300 hover:bg-gray-100"
                }`}
              >
                {status}
              </button>
            ))}
          </div>
        </div>

        <div>
          <button
            type="submit"
            disabled={isUpdating}
            className="mt-4 bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700 disabled:opacity-50"
          >
            {isUpdating ? "Updating..." : "Update Quote"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default QuoteUpdate;
