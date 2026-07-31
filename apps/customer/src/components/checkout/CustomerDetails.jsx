

function CustomerDetails({  customerName,
  setCustomerName,
  customerPhone,
  setCustomerPhone,
  notes,
  setNotes}) {


  return (
    <div>
      <h3>Customer Details</h3>
      <label>Name</label>
<input
  type="text"  className="border border-gray-300 rounded px-2 py-1 w-full"
  value={customerName}
  onChange={(e) => setCustomerName(e.target.value)}
/>
<br />
<label>Phone</label>
    <input
  type="tel" className="border border-gray-300 rounded px-2 py-1 w-full"
  value={customerPhone}
  onChange={(e) => setCustomerPhone(e.target.value)}
/>
<br />
<label>Notes</label>
<textarea
  value={notes} className="border border-gray-300 rounded px-2 py-1 w-full"
  onChange={(e) => setNotes(e.target.value)}
/>
    </div>
  );
}

export default CustomerDetails;