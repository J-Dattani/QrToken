function QuantityStepper({ quantity, onDecrease, onIncrease }) {
  return (
    <div className="flex items-center overflow-hidden rounded-full border border-[#D7B899] bg-white shadow-sm">

      <button
        onClick={onDecrease}
        className="flex h-10 w-10 items-center justify-center bg-[#6F4E37] text-lg font-bold text-white transition hover:bg-[#5A3E2B] cursor-pointer"
      >
        −
      </button>

      <span className="flex w-12 items-center justify-center text-base font-bold text-[#2D1F18]">
        {quantity}
      </span>

      <button
        onClick={onIncrease}
        className="flex h-10 w-10 items-center justify-center bg-[#6F4E37] text-lg font-bold text-white transition hover:bg-[#5A3E2B] cursor-pointer"
      >
        +
      </button>

    </div>
  );
}

export default QuantityStepper;