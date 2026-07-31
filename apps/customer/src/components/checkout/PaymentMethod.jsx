function PaymentMethod({ payMode, setPayMode }) {
  return (
    <div className="mt-6">
      <h3 className="text-lg font-semibold mb-3">
        Payment Method
      </h3>

      <label className="flex items-center gap-2">
        <input
          type="radio"
          value="cash"
          checked={payMode === "cash"}
          onChange={(e) => setPayMode(e.target.value)}
        />

        Cash
      </label>

      <label className="flex items-center gap-2 mt-2">
        <input
          type="radio"
          value="online"
          checked={payMode === "online"}
          onChange={(e) => setPayMode(e.target.value)}
        />

        Online
      </label>
    </div>
  );
}

export default PaymentMethod;