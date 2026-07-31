function OrdersModal({ isOpen, onClose, orders, onTrack }) {
  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 bg-black/50 z-50 flex justify-center items-center"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-2xl w-[500px] max-w-[95%] max-h-[80vh] overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex justify-between items-center border-b p-5">
          <h2 className="text-2xl font-bold">
            📜 Your Orders
          </h2>

          <button
            onClick={onClose}
            className="text-2xl cursor-pointer"
          >
            ×
          </button>
        </div>

        {/* Body */}
        <div className="p-5 overflow-y-auto max-h-[60vh]">

          {orders.length === 0 ? (
            <div className="text-center py-12 text-gray-500">
              📦
              <p className="mt-3">
                No past orders placed on this browser yet.
              </p>
            </div>
          ) : (

            <div className="space-y-4">

              {orders.map((order) => (
                <div
                  key={order.orderId}
                  className="border rounded-xl p-4 flex justify-between items-center"
                >
                  <div>

                    <h3 className="font-bold">
                      #{order.tokenNumber}
                    </h3>

                    <p className="text-gray-500 text-sm">
                      {order.status}
                    </p>

                  </div>

                  <button
                    onClick={() => onTrack(order)}
                    className="bg-green-600 text-white px-4 py-2 rounded-lg cursor-pointer"
                  >
                    Track
                  </button>

                </div>
              ))}

            </div>

          )}

        </div>
      </div>
    </div>
  );
}

export default OrdersModal;