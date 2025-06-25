import { useGetMyInvoicesQuery } from "../../slices/invoicesApiSlice";

const UserInvoices = () => {
  const { data: invoices = [], isLoading, error } = useGetMyInvoicesQuery();

  return (
    <div className="p-6 w-full pb-28">
      {isLoading ? (
        <p className="text-gray-500">Loading your invoices...</p>
      ) : error ? (
        <p className="text-red-600">Failed to load invoices.</p>
      ) : invoices.length === 0 ? (
        <p className="text-gray-600 text-center">You have no invoices yet.</p>
      ) : (
        <div className="space-y-4">
          {invoices.map((invoice) => {
            const remaining = invoice.amountDue - invoice.amountPaid;

            return (
              <div
                key={invoice._id}
                className="bg-white rounded-xl border border-gray-200 shadow-sm p-4 sm:p-6"
              >
                {/* Header: Invoice Number + Status */}
                <div className="flex justify-between items-center mb-2 text-sm">
                  <span className="font-medium text-gray-700">
                    Invoice #{invoice.invoiceNumber}
                  </span>
                  <span
                    className={`px-2 py-1 rounded text-xs font-semibold ${
                      invoice.status === "Paid"
                        ? "bg-green-100 text-green-700"
                        : invoice.status === "Partially Paid"
                        ? "bg-yellow-100 text-yellow-800"
                        : invoice.status === "Overdue"
                        ? "bg-red-100 text-red-700"
                        : "bg-gray-100 text-gray-600"
                    }`}
                  >
                    {invoice.status}
                  </span>
                </div>

                {/* Date */}
                <div className="text-xs text-gray-500 mb-3">
                  {new Date(invoice.createdAt).toLocaleDateString()}
                </div>

                {/* Amounts */}
                <div className="text-sm text-gray-700 space-y-1 mb-4">
                  <div>
                    <span className="font-medium">Amount Due:</span>{" "}
                    {invoice.amountDue.toFixed(2)} AED
                  </div>
                  <div>
                    <span className="font-medium">Amount Paid:</span>{" "}
                    {invoice.amountPaid.toFixed(2)} AED
                  </div>
                  <div>
                    <span className="font-medium">Remaining Due:</span>{" "}
                    {remaining > 0 ? (
                      <span className="text-red-600 font-semibold">
                        {remaining.toFixed(2)} AED
                      </span>
                    ) : (
                      <span className="text-green-700 font-semibold">0.00 AED</span>
                    )}
                  </div>
                </div>

                {/* Payment List */}
                <div className="text-xs text-gray-600 space-y-2">
                  {invoice.payments?.length > 0 ? (
                    <>
                      <div className="text-gray-500 font-medium mb-1">Payments:</div>
                      {invoice.payments.map((p) => (
                        <div
                          key={p._id}
                          className="bg-green-50 border border-green-200 text-green-800 rounded px-3 py-2"
                        >
                          <div className="text-sm font-medium">
                            {p.amount.toFixed(2)} AED – {p.paymentMethod}
                          </div>
                          <div className="text-[10px] text-gray-500">
                            {new Date(p.paymentDate).toLocaleDateString()}
                          </div>
                        </div>
                      ))}
                    </>
                  ) : (
                    <span className="italic text-gray-400">No payments yet</span>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default UserInvoices;
