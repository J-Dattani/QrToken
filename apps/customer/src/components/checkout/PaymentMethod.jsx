import { Banknote, Smartphone, Check } from "lucide-react";

function PaymentMethod({ payMode, setPayMode }) {
  return (
    <div>
      <h3 className="text-xl font-bold text-[#4B2E1F] mb-5">
        Payment Method
      </h3>

      <div className="space-y-3">

        {/* Cash */}
        <div
          onClick={() => setPayMode("cash")}
          className={`
            flex items-center justify-between
            rounded-2xl
            border
            p-4
            cursor-pointer
            transition-all
            ${
              payMode === "cash"
                ? "border-[#6F4E37] bg-[#FFF4E8]"
                : "border-[#E7D8C7] bg-white hover:border-[#D8B89A]"
            }
          `}
        >
          <div className="flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-[#F6E9DB]">
              <Banknote size={22} className="text-[#6F4E37]" />
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

          <div className="flex items-center justify-center w-6 h-6">
            {payMode === "cash" ? (
              <div className="w-6 h-6 rounded-full bg-[#6F4E37] flex items-center justify-center">
                <Check size={15} className="text-white stroke-3" />
              </div>
            ) : (
              <div className="w-6 h-6 rounded-full border-2 border-[#D7C2AD]" />
            )}
          </div>
        </div>

        {/* Digital */}
        <div
          onClick={() => setPayMode("digital")}
          className={`
            flex items-center justify-between
            rounded-2xl
            border
            p-4
            cursor-pointer
            transition-all
            ${
              payMode === "digital"
                ? "border-[#6F4E37] bg-[#FFF4E8]"
                : "border-[#E7D8C7] bg-white hover:border-[#D8B89A]"
            }
          `}
        >
          <div className="flex items-center gap-3">

            <div
              className={`flex h-11 w-11 items-center justify-center rounded-xl ${
                payMode === "digital"
                  ? "bg-[#F6E9DB]"
                  : "bg-[#EEE6DD]"
              }`}
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
                className={`font-semibold ${
                  payMode === "digital"
                    ? "text-[#4B2E1F]"
                    : "text-gray-600"
                }`}
              >
                Online Payment
              </p>

              <p
                className={`text-sm ${
                  payMode === "digital"
                    ? "text-[#6F4E37]"
                    : "text-gray-500"
                }`}
              >
                Pay securely with Razorpay
              </p>
            </div>

          </div>

          <div className="flex items-center justify-center w-6 h-6">
            {payMode === "digital" ? (
              <div className="w-6 h-6 rounded-full bg-[#6F4E37] flex items-center justify-center">
                <Check size={15} className="text-white stroke-3" />
              </div>
            ) : (
              <div className="w-6 h-6 rounded-full border-2 border-[#D7C2AD]" />
            )}
          </div>

        </div>

      </div>
    </div>
  );
}

export default PaymentMethod;