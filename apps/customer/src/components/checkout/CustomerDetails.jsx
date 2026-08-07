function CustomerDetails({
  customerName,
  setCustomerName,
  customerPhone,
  setCustomerPhone,
  notes,
  setNotes,
}) {
  return (
    <div>
      <h3 className="text-xl font-bold text-[#4B2E1F] mb-5">
        Customer Details
      </h3>

      {/* Name */}
      <div className="mb-5">
        <label className="block mb-2 text-sm font-medium text-[#5E4632]">
          Full Name
        </label>

        <input
          type="text"
          placeholder="Enter your name"
          value={customerName}
          onChange={(e) => setCustomerName(e.target.value)}
          className="
            w-full
            rounded-xl
            border
            border-[#E7D8C7]
            bg-[#FFFDFC]
            px-4
            py-3
            outline-none
            transition
            focus:border-[#8B5E3C]
            focus:ring-2
            focus:ring-[#E8D3BF]
          "
        />
      </div>

      {/* Phone */}
      <div className="mb-5">
        <label className="block mb-2 text-sm font-medium text-[#5E4632]">
          Phone Number
        </label>

        <input
          type="tel"
          maxLength={10}
          placeholder="9876543210"
          value={customerPhone}
          onChange={(e) => setCustomerPhone(e.target.value)}
          className="
            w-full
            rounded-xl
            border
            border-[#E7D8C7]
            bg-[#FFFDFC]
            px-4
            py-3
            outline-none
            transition
            focus:border-[#8B5E3C]
            focus:ring-2
            focus:ring-[#E8D3BF]
          "
        />
      </div>

      {/* Notes */}
      <div>
        <label className="block mb-2 text-sm font-medium text-[#5E4632]">
          Notes (Optional)
        </label>

        <textarea
          rows={3}
          placeholder="Any special instructions..."
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          className="
            w-full
            rounded-xl
            border
            border-[#E7D8C7]
            bg-[#FFFDFC]
            px-4
            py-3
            outline-none
            resize-none
            transition
            focus:border-[#8B5E3C]
            focus:ring-2
            focus:ring-[#E8D3BF]
          "
        />
      </div>
    </div>
  );
}

export default CustomerDetails;