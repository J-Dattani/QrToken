function QuantityStepper({ quantity, onDecrease, onIncrease }) {
  return (
    <div
      className="
        flex
        items-center
        overflow-hidden
        rounded-full
        border
        border-[#D7B899]
        bg-white
        shadow-sm
        transition-shadow
        duration-200
        hover:shadow-md
        select-none
      "
    >
      {/* Decrease */}
      <button
        type="button"
        onClick={onDecrease}
        aria-label="Decrease quantity"
        className="
          flex
          h-10
          w-10
          items-center
          justify-center
          bg-[#6F4E37]
          text-xl
          font-bold
          leading-none
          text-white
          transition-all
          duration-150
          hover:bg-[#5A3E2B]
          active:scale-95
          cursor-pointer
        "
      >
        −
      </button>

      {/* Quantity */}
      <span
        className="
          flex
          h-10
          w-12
          items-center
          justify-center
          text-base
          font-bold
          text-[#2D1F18]
        "
        aria-label={`Quantity ${quantity}`}
      >
        {quantity}
      </span>

      {/* Increase */}
      <button
        type="button"
        onClick={onIncrease}
        aria-label="Increase quantity"
        className="
          flex
          h-10
          w-10
          items-center
          justify-center
          bg-[#6F4E37]
          text-xl
          font-bold
          leading-none
          text-white
          transition-all
          duration-150
          hover:bg-[#5A3E2B]
          active:scale-95
          cursor-pointer
        "
      >
        +
      </button>
    </div>
  );
}

export default QuantityStepper;