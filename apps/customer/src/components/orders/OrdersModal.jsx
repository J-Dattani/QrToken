function OrdersModal({ isOpen, onClose, orders, onTrack }) {
  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex justify-center items-center p-4"
      onClick={onClose}
    >
      <div
        className="w-full max-w-xl overflow-hidden rounded-3xl bg-[#F8F3ED] shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}

        <div className="bg-gradient-to-r from-[#6F4E37] to-[#A56A2A] px-6 py-5 flex items-center justify-between">

          <div>

            <h2 className="text-2xl font-bold text-white">
              📜 Order History
            </h2>

            <p className="text-[#FDE8C8] text-sm mt-1">
              Your previous orders
            </p>

          </div>

          <button
            onClick={onClose}
            className="
              w-10
              h-10
              rounded-full
              bg-white/20
              text-white
              text-2xl
              hover:bg-white/30
              transition
              cursor-pointer
            "
          >
            ×
          </button>

        </div>

        {/* Body */}

        <div className="max-h-[65vh] overflow-y-auto p-6">

          {orders.length === 0 ? (

            <div className="py-16 text-center">

              <div className="text-6xl mb-5">
                📦
              </div>

              <h3 className="text-xl font-semibold text-[#4B2E1F]">
                No Orders Yet
              </h3>

              <p className="text-gray-500 mt-2">
                Your previous orders will appear here.
              </p>

            </div>

          ) : (

            <div className="space-y-4">

              {orders.map((order) => (

                <div
                  key={order.orderId}
                  className="
                    rounded-2xl
                    border
                    border-[#E7D8C7]
                    bg-white
                    p-5
                    shadow-sm
                    hover:shadow-md
                    transition
                    flex
                    justify-between
                    items-center
                  "
                >

                  <div>

                    <h3 className="text-xl font-bold text-[#4B2E1F]">
                      #{order.tokenNumber}
                    </h3>

                    <span className="
                      inline-block
                      mt-2
                      rounded-full
                      bg-[#FFF4E8]
                      px-3
                      py-1
                      text-sm
                      font-medium
                      text-[#6F4E37]
                    ">
                      {order.status}
                    </span>

                  </div>

                  <button
                    onClick={() => onTrack(order)}
                    className="
                      rounded-xl
                      bg-[#6F4E37]
                      px-5
                      py-3
                      font-semibold
                      text-white
                      hover:bg-[#5A3E2B]
                      transition
                      cursor-pointer
                    "
                  >
                    Track →
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