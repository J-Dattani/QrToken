function CouponSection() {
  return (
    <div className="mt-6">
      <h3 className="text-lg font-semibold mb-3">
        Coupon
      </h3>

      <div className="flex gap-2">
        <input
          type="text"
          placeholder="Enter coupon code"
          className="flex-1 border rounded-lg px-3 py-2"
        />

        <button className="bg-green-600 text-white px-4 rounded-lg">
          Apply
        </button>
      </div>
    </div>
  );
}

export default CouponSection;