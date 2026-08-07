function CouponSection() {
  return (
    <div>
      <div className="flex justify-between items-center mb-5">
        <h3 className="text-xl font-bold text-[#4B2E1F]">
          Coupon
        </h3>

        <span className="text-xs font-semibold bg-[#FFF4E6] text-[#C88A13] px-3 py-1 rounded-full">
          Coming Soon
        </span>
      </div>

      <div className="flex gap-3">

        <input
          type="text"
          placeholder="Enter coupon code"
          disabled
          className="
            flex-1
            rounded-xl
            border
            border-[#E7D8C7]
            bg-[#F8F5F1]
            px-4
            py-3
            text-gray-400
            cursor-not-allowed
            outline-none
          "
        />

        <button
          disabled
          className="
            rounded-xl
            bg-gray-300
            px-5
            py-3
            font-semibold
            text-white
            cursor-not-allowed
          "
        >
          Apply
        </button>

      </div>

      <p className="mt-3 text-sm text-gray-500">
        Coupons will be available in a future update.
      </p>
    </div>
  );
}

export default CouponSection;