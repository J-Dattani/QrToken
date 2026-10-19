import { Banknote, Smartphone, Check } from "lucide-react";

function PaymentMethod({ payMode, setPayMode }) {
  return (
    <div>
      <h3 className="mb-5 text-xl font-bold text-[#4B2E1F]">
        Payment Method
      </h3>

      <div className="space-y-3">

        {/* Cash */}
        <button
          type="button"
          onClick={() => setPayMode("cash")}
          aria-pressed={payMode === "cash"}
          className={`
            flex
            w-full
            items-center
            justify-between
            rounded-2xl
            border
            p-4
            text-left
            transition-all
            duration-200
            cursor-pointer
            ${
              payMode === "cash"
                ? `
                  border-[#6F4E37]
                  bg-[#FFF4E8]
                  shadow-sm
                `
                : `
                  border-[#E7D8C7]
                  bg-white
                  hover:border-[#D8B89A]
                  hover:bg-[#FFFDFC]
                  hover:shadow-sm
                `
            }
            active:scale-[0.99]
          `}
        >
          <div className="flex items-center gap-3">

            <div
              className={`
                flex
                h-11
                w-11
                shrink-0
                items-center
                justify-center
                rounded-xl
                transition-colors
                ${
                  payMode === "cash"
                    ? "bg-[#F6E9DB]"
                    : "bg-[#EEE6DD]"
                }
              `}
            >
              <Banknote
                size={22}
                className={
                  payMode === "cash"
                    ? "text-[#6F4E37]"
                    : "text-gray-500"
                }
              />
            </div>

            <div>
              <p className="font-semibold text-[#4B2E1F]">
                Cash
              </p>

              <p className="text-sm text-gray-500">
                Pay at the counter
              </p>
            </div>

          </div>

          <SelectionIndicator selected={payMode === "cash"} />
        </button>

        {/* Digital */}
        <button
          type="button"
          onClick={() => setPayMode("digital")}
          aria-pressed={payMode === "digital"}
          className={`
            flex
            w-full
            items-center
            justify-between
            rounded-2xl
            border
            p-4
            text-left
            transition-all
            duration-200
            cursor-pointer
            ${
              payMode === "digital"
                ? `
                  border-[#6F4E37]
                  bg-[#FFF4E8]
                  shadow-sm
                `
                : `
                  border-[#E7D8C7]
                  bg-white
                  hover:border-[#D8B89A]
                  hover:bg-[#FFFDFC]
                  hover:shadow-sm
                `
            }
            active:scale-[0.99]
          `}
        >
          <div className="flex items-center gap-3">

            <div
              className={`
                flex
                h-11
                w-11
                shrink-0
                items-center
                justify-center
                rounded-xl
                ${
                  payMode === "digital"
                    ? "bg-[#F6E9DB]"
                    : "bg-[#EEE6DD]"
                }
              `}
            >
              <Smartphone
                size={22}
                className={
                  payMode === "digital"
                    ? "text-[#6F4E37]"
                    : "text-gray-500"
                }
              />
            </div>

            <div>
              <p
                className={`
                  font-semibold
                  ${
                    payMode === "digital"
                      ? "text-[#4B2E1F]"
                      : "text-gray-600"
                  }
                `}
              >
                Online Payment
              </p>

              <p
                className={`
                  text-sm
                  ${
                    payMode === "digital"
                      ? "text-[#6F4E37]"
                      : "text-gray-500"
                  }
                `}
              >
                Pay securely with Razorpay
              </p>
            </div>

          </div>

          <SelectionIndicator
            selected={payMode === "digital"}
          />
        </button>

      </div>
    </div>
  );
}

function SelectionIndicator({ selected }) {
  return (
    <div className="flex h-6 w-6 shrink-0 items-center justify-center">

      {selected ? (
        <div
          className="
            flex
            h-6
            w-6
            items-center
            justify-center
            rounded-full
            bg-[#6F4E37]
            shadow-sm
          "
        >
          <Check
            size={15}
            strokeWidth={3}
            className="text-white"
          />
        </div>
      ) : (
        <div
          className="
            h-6
            w-6
            rounded-full
            border-2
            border-[#D7C2AD]
            bg-white
          "
        />
      )}

    </div>
  );
}

export default PaymentMethod;