function OrdersModal({ isOpen, onClose, orders, onTrack }) {
  if (!isOpen) return null;

  return (
    <div
      className="
        fixed
        inset-0
        z-50
        flex
        items-center
        justify-center
        bg-black/50
        p-4
        backdrop-blur-sm
      "
      onClick={onClose}
    >
      <div
        className="
          w-full
          max-w-xl
          overflow-hidden
          rounded-3xl
          border
          border-[#E7D8C7]
          bg-[#F8F3ED]
          shadow-2xl
          animate-in
          fade-in
          zoom-in-95
          duration-200
        "
        onClick={(e) => e.stopPropagation()}
      >

        {/* Header */}
        <div
          className="
            flex
            items-center
            justify-between
            bg-gradient-to-r
            from-[#6F4E37]
            to-[#A56A2A]
            px-6
            py-5
          "
        >
          <div>
            <h2 className="text-2xl font-bold text-white">
              📜 Order History
            </h2>

            <p className="mt-1 text-sm text-[#FDE8C8]">
              Your previous orders
            </p>
          </div>

          <button
            type="button"
            onClick={onClose}
            aria-label="Close order history"
            className="
              flex
              h-10
              w-10
              items-center
              justify-center
              rounded-full
              bg-white/15
              text-2xl
              leading-none
              text-white
              transition-all
              duration-150
              hover:bg-white/25
              active:scale-90
              cursor-pointer
            "
          >
            ×
          </button>
        </div>

        {/* Body */}
        <div className="max-h-[65vh] overflow-y-auto p-5 sm:p-6">

          {orders.length === 0 ? (
            /* Empty State */
            <div className="rounded-2xl border border-[#E7D8C7] bg-white px-6 py-14 text-center shadow-sm">

              <div
                className="
                  mx-auto
                  mb-5
                  flex
                  h-20
                  w-20
                  items-center
                  justify-center
                  rounded-3xl
                  bg-[#FFF4E8]
                  text-4xl
                "
              >
                📦
              </div>

              <h3 className="text-xl font-bold text-[#4B2E1F]">
                No Orders Yet
              </h3>

              <p className="mt-2 text-sm leading-6 text-gray-500">
                Your previous orders will appear here.
              </p>

            </div>
          ) : (

            /* Orders */
            <div className="space-y-3">

              {orders.map((order) => (

                <div
                  key={order.orderId}
                  className="
                    flex
                    items-center
                    justify-between
                    gap-4
                    rounded-2xl
                    border
                    border-[#E7D8C7]
                    bg-white
                    p-4
                    shadow-sm
                    transition-all
                    duration-200
                    hover:-translate-y-0.5
                    hover:shadow-md
                  "
                >

                  {/* Order Info */}
                  <div className="min-w-0">

                    <div className="flex items-center gap-2">

                      <h3 className="text-xl font-bold text-[#4B2E1F]">
                        #{order.tokenNumber}
                      </h3>

                    </div>

                    <span
                      className={`
                        mt-2
                        inline-flex
                        items-center
                        rounded-full
                        px-3
                        py-1
                        text-xs
                        font-semibold
                        capitalize
                        ${
                          order.status === "completed" ||
                          order.status === "collected"
                            ? "bg-green-100 text-green-700"
                            : order.status === "cancelled"
                            ? "bg-red-100 text-red-700"
                            : "bg-[#FFF4E8] text-[#6F4E37]"
                        }
                      `}
                    >
                      {order.status}
                    </span>

                  </div>

                  {/* Track */}
                  <button
                    type="button"
                    onClick={() => onTrack(order)}
                    className="
                      shrink-0
                      rounded-xl
                      bg-[#6F4E37]
                      px-4
                      py-2.5
                      text-sm
                      font-semibold
                      text-white
                      shadow-sm
                      transition-all
                      duration-150
                      hover:bg-[#5A3E2B]
                      hover:shadow-md
                      active:scale-95
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