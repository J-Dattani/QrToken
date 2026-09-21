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

    const receiptHTML = receipt.outerHTML;

    const styles = Array.from(
      document.querySelectorAll(
        "style, link[rel='stylesheet']"
      )
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
        overflow-hidden
        bg-black/50
        backdrop-blur-sm
      "
    >
      {/* ======================================================
          MODAL CENTER
      ====================================================== */}

      <div
        className="
          flex
          h-full
          w-full
          items-center
          justify-center
          px-4
          py-4
          sm:px-6
          sm:py-6
        "
      >

        {/* ====================================================
            MODAL
        ==================================================== */}

        <div
          className="
            flex
            h-full
            max-h-[calc(100vh-32px)]
            w-full
            max-w-[560px]
            flex-col
            overflow-hidden
            rounded-2xl
            shadow-2xl
          "
        >

          {/* ==================================================
              MODAL HEADER
              
              THIS STAYS FIXED.
          ================================================== */}

          <div
            className="
              flex
              shrink-0
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

              {/* PRINT */}

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


              {/* CLOSE */}

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


          {/* ==================================================
              SCROLLABLE RECEIPT AREA
              
              ONLY THIS PART SCROLLS.
          ================================================== */}

          <div
            className="
              min-h-0
              flex-1
              overflow-y-auto
              overscroll-contain
              bg-[#F8F3ED]
              p-4
              sm:p-5

              scrollbar-thin
              scrollbar-track-[#EEE7DE]
              scrollbar-thumb-[#B8AA9A]
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