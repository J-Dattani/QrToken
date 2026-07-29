function QuantityStepper({ quantity, onDecrease, onIncrease }) {
    return (
<div className="flex items-center gap-2">
            <button className="w-8 h-8 rounded-md border border-gray-300 flex items-center justify-center hover:bg-gray-100 transition" onClick={onDecrease}>-</button>
            <span className="w-6 text-center font-medium">{quantity}</span>
            <button className="w-8 h-8 rounded-md border border-gray-300 flex items-center justify-center hover:bg-gray-100 transition" onClick={onIncrease}>+</button>
        </div>
    );
}

export default QuantityStepper;