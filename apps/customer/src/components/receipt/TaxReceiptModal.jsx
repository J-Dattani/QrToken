import GSTReceipt from "../tracking/GSTReceipt";

function TaxReceiptModal({
  isOpen,
  onClose,
  order,
  merchant,
}) {
  if (!isOpen) return null;

  const handlePrint = () => {
    const receipt = document.querySelector(".gst-receipt-print");

    if (!receipt) {
      console.error("GST receipt not found.");
      return;
    }

    const printWindow = window.open(
      "",
      "_blank",
      "width=900,height=900"
    );

    if (!printWindow) {
      alert("Please allow pop-ups to print the receipt.");
      return;
    }

    // Copy the receipt HTML only
    const receiptHTML = receipt.outerHTML;

    // Copy existing stylesheets
    const styles = Array.from(
      document.querySelectorAll("style, link[rel='stylesheet']")
    )
      .map((style) => style.outerHTML)
      .join("\n");

    printWindow.document.open();

    printWindow.document.write(`
      <!DOCTYPE html>
      <html>
        <head>
          <title>GST Tax Receipt</title>

          ${styles}

          <style>
            @page {
              size: A4;
              margin: 8mm;
            }

            html,
            body {
              margin: 0;
              padding: 0;
              background: white;
            }

            body {
              display: flex;
              justify-content: center;
              align-items: flex-start;
              font-family: Arial, sans-serif;
            }

            .gst-receipt-print {
              width: 100% !important;
              max-width: 190mm !important;
              margin: 0 auto !important;
              background: white !important;
              box-shadow: none !important;
              border: 1px solid #222 !important;
              border-radius: 0 !important;
              overflow: visible !important;
            }

            * {
              box-sizing: border-box;
            }
          </style>
        </head>

        <body>
          ${receiptHTML}
        </body>
      </html>
    `);

    printWindow.document.close();

    // Wait for styles/images/layout to finish
    printWindow.onload = () => {
      setTimeout(() => {
        printWindow.focus();
        printWindow.print();

        setTimeout(() => {
          printWindow.close();
        }, 500);
      }, 500);
    };
  };

  return (
    <div
      className="
        fixed
        inset-0
        z-50
        overflow-y-auto
        bg-black/50
        backdrop-blur-sm
      "
    >
      <div
        className="
          flex
          min-h-full
          items-start
          justify-center
          px-4
          py-6
          sm:py-10
        "
      >
        <div className="w-full max-w-[560px]">

          {/* Modal Header */}
          <div
            className="
              flex
              items-center
              justify-between
              rounded-t-2xl
              bg-[#1C1A17]
              px-4
              py-3
              text-white
              shadow-lg
            "
          >
            <h2 className="text-sm font-bold sm:text-base">
              📄 GST Tax Invoice / Receipt
            </h2>

            <div className="flex items-center gap-2">

              {/* Print */}
              <button
                type="button"
                onClick={handlePrint}
                className="
                  rounded-lg
                  bg-white/10
                  px-4
                  py-2
                  text-xs
                  font-semibold
                  transition
                  hover:bg-white/20
                  cursor-pointer
                "
              >
                🖨️ Print Receipt
              </button>

              {/* Close */}
              <button
                type="button"
                onClick={onClose}
                className="
                  flex
                  h-9
                  w-9
                  items-center
                  justify-center
                  rounded-full
                  bg-white/10
                  text-xl
                  transition
                  hover:bg-white/20
                  cursor-pointer
                "
              >
                ×
              </button>

            </div>
          </div>

          {/* Receipt */}
          <div
            className="
              rounded-b-2xl
              bg-[#F8F3ED]
              p-4
              shadow-2xl
              sm:p-5
            "
          >
            <GSTReceipt
              order={order}
              merchant={merchant}
            />
          </div>

        </div>
      </div>
    </div>
  );
}

export default TaxReceiptModal;