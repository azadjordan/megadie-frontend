import { useGetMyOrdersQuery } from "../../slices/ordersApiSlice";

const UserOrders = () => {
  const { data: orders = [], isLoading, error } = useGetMyOrdersQuery();

  return (
    <div className="p-6 w-full pb-28">
      {isLoading ? (
        <p className="text-gray-500">Loading your orders...</p>
      ) : error ? (
        <p className="text-red-500">Failed to load your orders.</p>
      ) : orders.length === 0 ? (
        <div className="text-center py-10 bg-white rounded-xl shadow-sm border border-gray-200">
          <p className="text-gray-600 text-sm mb-4">You have no orders yet.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {orders.map((order) => (
            <div
              key={order._id}
              className="bg-white rounded-xl border border-gray-200 shadow-sm p-4 sm:p-6"
            >
              {/* Header: Order Number + Status */}
              <div className="flex justify-between items-center mb-2 text-sm">
                <span className="font-medium text-gray-700">
                  Order #{order.orderNumber}
                </span>
                <span
                  className={`px-2 py-1 rounded text-xs font-semibold ${
                    order.status === "Delivered"
                      ? "bg-green-100 text-green-700"
                      : order.status === "Returned"
                      ? "bg-yellow-100 text-yellow-900"
                      : order.status === "Cancelled"
                      ? "bg-red-100 text-red-700"
                      : "bg-gray-100 text-gray-700"
                  }`}
                >
                  {order.status}
                </span>
              </div>

              {/* Order Date */}
              <div className="text-xs text-gray-500 mb-3">
                {new Date(order.createdAt).toLocaleDateString()}
              </div>

              {/* Items */}
              <div className="text-sm text-gray-800 space-y-1 mb-3">
                {order.orderItems.map((item, idx) => (
                  <div key={idx}>
                    • {item.productName || "Unnamed Product"} × {item.qty}
                  </div>
                ))}
              </div>

              {/* Invoice Reference */}
              <div className="text-xs text-gray-600 mt-3">
                <span className="font-medium">Invoice:</span>{" "}
                {order.invoice?.invoiceNumber ? (
                  <span>{order.invoice.invoiceNumber}</span>
                ) : (
                  <span className="text-gray-500 italic">Not yet generated</span>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default UserOrders;
