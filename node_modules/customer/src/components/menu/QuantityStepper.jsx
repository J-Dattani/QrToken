function QuantityStepper({ quantity, onDecrease, onIncrease }) {
    return (
        <div className="quantity-stepper">
            <button onClick={onDecrease}>-</button>
            <span>{quantity}</span>
            <button onClick={onIncrease}>+</button>
        </div>
    );
}

export default QuantityStepper;