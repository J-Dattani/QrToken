function GSTReceipt({ order, merchant }) {
  // -----------------------------------------
  // Merchant
  // -----------------------------------------

  const merchantName =
    merchant?.name ||
    merchant?.businessName ||
    merchant?.merchantName ||
    "Merchant";

  const merchantAddress =
    merchant?.address ||
    merchant?.location ||
    "Rajkot, Gujarat";

  const merchantPhone =
    merchant?.phone ||
    merchant?.contactNumber ||
    "";

  const merchantGstin =
    merchant?.gstin ||
    merchant?.GSTIN ||
    "Not registered";

  // -----------------------------------------
  // Order
  // -----------------------------------------

  const items = order?.items || [];

  const subtotal =
    Number(order?.subtotal || 0);

  const total =
    Number(order?.total || 0);

  const cgst =
    Number((total - subtotal) / 2 || 0);

  const sgst =
    Number((total - subtotal) / 2 || 0);

  // -----------------------------------------
  // Payment
  // -----------------------------------------

  const paymentMethod = String(
    order?.payMode || ""
  )
    .trim()
    .toLowerCase();

  const isCashPayment =
    paymentMethod === "cash";

  const paymentLabel = isCashPayment
    ? "💵 CASH AT COUNTER"
    : "💳 ONLINE PAYMENT";

  const paymentStatus =
    order?.paymentStatus || "Pending";

  // -----------------------------------------
  // Invoice
  // -----------------------------------------

  const invoiceNumber =
    `QRT-${order?.tokenNumber || "ORDER"}-${String(
      order?._id || ""
    ).slice(-6).toUpperCase()}`;

  const orderDate = order?.createdAt
    ? new Date(order.createdAt).toLocaleDateString("en-IN")
    : new Date().toLocaleDateString("en-IN");

  const orderType =
    order?.orderType ||
    order?.type ||
    "Counter Pickup";

  // -----------------------------------------
  // Print
  // -----------------------------------------

//   const handlePrint = () => {
//     window.print();
//   };

  return (
    <>
      {/* Print Button */}
      {/* <div className="flex justify-end mb-3 print:hidden">
        <button
          onClick={handlePrint}
          className="
            rounded-lg
            bg-[#1C1A17]
            px-4
            py-2
            text-sm
            font-semibold
            text-white
            transition
            hover:bg-[#2A2723]
            cursor-pointer
          "
        >
          🖨 Print
        </button>
      </div> */}

      {/* Receipt */}
      <div
        className="
          gst-receipt-print
          w-full
          rounded-2xl
          bg-white
          p-5
          shadow-xl
          text-[#292621]
        "
      >

        {/* Merchant Header */}
        <div className="text-center">

          <h1 className="text-2xl font-bold">
            {merchantName}
          </h1>

          <p className="mt-1 text-gray-500">
            {merchantAddress}
          </p>

          {merchantPhone && (
            <p className="text-gray-500">
              Ph: {merchantPhone}
            </p>
          )}

          <p className="text-gray-500">
            GSTIN: {merchantGstin}
          </p>

        </div>

        <div className="my-5 border-t border-dashed border-gray-400" />

        {/* Invoice Title */}
        <div className="text-center">

          <h2 className="text-lg font-bold tracking-[0.3em]">
            TAX INVOICE / CASH MEMO
          </h2>

        </div>

        {/* Invoice Details */}
        <div className="mt-6 space-y-2 text-sm">

          <div className="flex justify-between gap-4">
            <span className="text-gray-500">
              Invoice No.
            </span>

            <span className="font-semibold">
              {invoiceNumber}
            </span>
          </div>

          <div className="flex justify-between gap-4">
            <span className="text-gray-500">
              Date
            </span>

            <span className="font-semibold">
              {orderDate}
            </span>
          </div>

          <div className="flex justify-between gap-4">
            <span className="text-gray-500">
              Type
            </span>

            <span className="font-semibold">
              {orderType}
            </span>
          </div>

          {order?.customerName && (
            <div className="flex justify-between gap-4">
              <span className="text-gray-500">
                Customer
              </span>

              <span className="font-semibold text-right">
                {order.customerName}
              </span>
            </div>
          )}

          {order?.customerPhone && (
            <div className="flex justify-between gap-4">
              <span className="text-gray-500">
                Phone
              </span>

              <span className="font-semibold">
                {order.customerPhone}
              </span>
            </div>
          )}

        </div>

        {/* Token */}
        <div
          className="
            mt-6
            rounded-2xl
            border-2
            border-[#292621]
            bg-[#F8F3ED]
            px-4
            py-5
            text-center
          "
        >

          <p
            className="
              text-xs
              font-bold
              uppercase
              tracking-[0.25em]
              text-gray-500
            "
          >
            Kitchen Order Token
          </p>

          <p className="mt-2 text-4xl font-black">
            TOKEN #{order?.tokenNumber || "-"}
          </p>

        </div>

        {/* Items */}
        <div className="mt-7">

          <div
            className="
              grid
              grid-cols-[1fr_60px_80px_90px]
              gap-2
              border-b
              border-black
              pb-2
              text-xs
              font-bold
            "
          >
            <span>Item</span>
            <span className="text-center">Qty</span>
            <span className="text-right">Price</span>
            <span className="text-right">Amount</span>
          </div>

          {items.map((item, index) => {

            const price =
              Number(item?.price || 0);

            const quantity =
              Number(item?.quantity || 0);

            const amount =
              price * quantity;

            return (
              <div
                key={item?._id || index}
                className="
                  grid
                  grid-cols-[1fr_60px_80px_90px]
                  gap-2
                  border-b
                  border-dashed
                  border-gray-300
                  py-3
                  text-sm
                "
              >

                <span className="font-medium">
                  {item?.name}
                </span>

                <span className="text-center">
                  {quantity}
                </span>

                <span className="text-right">
                  ₹{price.toFixed(2)}
                </span>

                <span className="text-right font-semibold">
                  ₹{amount.toFixed(2)}
                </span>

              </div>
            );
          })}

        </div>

        {/* Amounts */}
        <div className="mt-5 border-t border-dashed border-gray-400 pt-4">

          <div className="flex justify-between text-sm">
            <span>
              Subtotal (Pre-tax)
            </span>

            <span className="font-semibold">
              ₹{(total - cgst - sgst).toFixed(2)}
            </span>
          </div>

          <div className="mt-2 flex justify-between text-sm text-gray-500">
            <span>
              CGST @ 2.5%
            </span>

            <span>
              ₹{cgst.toFixed(2)}
            </span>
          </div>

          <div className="mt-2 flex justify-between text-sm text-gray-500">
            <span>
              SGST @ 2.5%
            </span>

            <span>
              ₹{sgst.toFixed(2)}
            </span>
          </div>

        </div>

        {/* Grand Total */}
        <div
          className="
            mt-4
            border-t-2
            border-black
            pt-4
            flex
            justify-between
            text-lg
            font-black
          "
        >
          <span>
            GRAND TOTAL
          </span>

          <span>
            ₹{total.toFixed(2)}
          </span>
        </div>

        {/* Payment */}
        <div
          className="
            mt-6
            rounded-xl
            border
            border-[#D99A00]
            bg-[#FFFCF5]
            px-4
            py-3
            text-center
          "
        >

          <p
            className="
              text-sm
              font-bold
              uppercase
              tracking-wider
              text-[#9A6A00]
            "
          >
            {paymentLabel}
          </p>

          <p className="mt-1 text-xs text-gray-500">
            Payment: {paymentStatus}
          </p>

        </div>

        {/* Footer */}
        <div
          className="
            mt-6
            border-t
            border-dashed
            border-gray-400
            pt-4
            text-center
          "
        >

          <p className="text-sm font-medium">
            Thank you for dining with us!
          </p>

          <p className="mt-1 text-xs text-gray-400">
            Powered by QRToken.in
          </p>

        </div>

      </div>

      {/* Print CSS */}
      <style>
        {`
          @media print {

            @page {
              size: A4;
              margin: 10mm;
            }

            body {
              margin: 0 !important;
              padding: 0 !important;
              background: white !important;
            }

            body * {
              visibility: hidden !important;
            }

            .gst-receipt-print,
            .gst-receipt-print * {
              visibility: visible !important;
            }

            .gst-receipt-print {
              position: absolute !important;
              left: 0 !important;
              top: 0 !important;
              width: 100% !important;
              max-width: 100% !important;
              margin: 0 !important;
              padding: 10mm !important;
              box-shadow: none !important;
              border-radius: 0 !important;
              background: white !important;
            }

            .print\\:hidden {
              display: none !important;
            }

            html,
            body {
              width: 100% !important;
              min-height: 100% !important;
              overflow: visible !important;
            }
          }
        `}
      </style>
    </>
  );
}

export default GSTReceipt;