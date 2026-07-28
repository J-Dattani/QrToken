function MerchantHeader({ name, location, isOpen }) {
  return (
    <div className="merchant-header">
      <h2>{name}</h2>
      <p>{location}</p>
      <div>
        Status: <span>{isOpen ? "Open" : "Closed"}</span>
      </div>
    </div>
  );
}

export default MerchantHeader;