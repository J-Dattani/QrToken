function MerchantHeader({ name, location, isOpen, rating }) {
  return (
    <div className="merchant-header">
      <h1>{name}</h1>

      <p>📍 {location}</p>

      <p>
        Status:
        <strong style={{ color: isOpen ? "green" : "red" }}>
          {" "}
          {isOpen ? "Open" : "Closed"}
        </strong>
      </p>

      <p>⭐ {rating} / 5</p>

      <hr />
    </div>
  );
}

export default MerchantHeader;