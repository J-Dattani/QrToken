import { useEffect, useState } from "react";
import { Activity, Power } from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import { toggleMerchantStatus } from "../../redux/thunks/merchantThunks";

function OwnerHeader({
  title = "Owner Dashboard",
  subtitle = "Manage your store operations",
}) {
const dispatch = useDispatch();


  const merchant = useSelector(
  (state) => state.merchant.merchant
);

const isStoreOpen = merchant?.isOpen ?? false;

  const [currentDateTime, setCurrentDateTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentDateTime(new Date());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  
  const formattedDate = new Intl.DateTimeFormat("en-IN", {
    timeZone: "Asia/Kolkata",
    weekday: "short",
    day: "2-digit",
    month: "short",
    year: "numeric",
  }).format(currentDateTime);

  const formattedTime = new Intl.DateTimeFormat("en-IN", {
    timeZone: "Asia/Kolkata",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hour12: true,
  }).format(currentDateTime);

  return (
    <header className="shrink-0 border-b border-[#E5D8C8] bg-[#F7F3ED] px-5 py-2.5 lg:px-7">
      <div className="flex min-h-[52px] items-center justify-between gap-5">
        <div className="min-w-0">
         <div className="flex items-center gap-2.5">
  <h1 className="truncate text-[18px] font-bold tracking-[-0.02em] text-[#241F1A] lg:text-[19px]">
    {merchant?.name}
  </h1>
  
  {/* Dot separator */}
  <span className="hidden h-1 w-1 shrink-0 rounded-full bg-[#C8BDAF] sm:block" />

  {/* Changed sm:block to sm:inline-block to prevent line jumping */}
  <span className="hidden shrink-0 text-[10px] font-semibold uppercase tracking-[0.08em] text-[#8A8074] sm:inline-block">
    {merchant?.tagline}
  </span>
</div>


          <div className="mt-0.5 flex min-w-0 items-center gap-2">
            <h2 className="truncate text-[13px] font-semibold text-[#3B342D]">
              {title}
            </h2>

            {subtitle && (
              <>
                <span className="hidden text-[#C8BDAF] sm:block">/</span>
                <p className="hidden truncate text-[11px] text-[#82776B] sm:block">
                  {subtitle}
                </p>
              </>
            )}
          </div>
        </div>

        <div className="flex shrink-0 items-center gap-2">
          <div className="hidden text-right leading-tight md:block">
            <p className="text-[10px] font-medium text-[#81766A]">
              {formattedDate}
            </p>

            <p className="mt-0.5 font-mono text-[12px] font-semibold tracking-[0.02em] text-[#29231E]">
              {formattedTime}
            </p>
          </div>

          <div className="hidden h-7 w-px bg-[#DED5C9] md:block" />

          <button
            type="button"
            onClick={() => dispatch(toggleMerchantStatus())}
            title={
              isStoreOpen
                ? "Pause store and stop accepting new orders"
                : "Open store and start accepting new orders"
            }
            className={`group flex h-9 items-center gap-1.5 rounded-lg border px-3 text-[11px] font-semibold transition-all duration-150 active:scale-[0.98] ${
              isStoreOpen
                ? "border-[#A8D9CC] bg-[#E8F5F1] text-[#087B66] hover:border-[#82C9B8] hover:bg-[#DFF1EC]"
                : "border-[#E9B7B3] bg-[#FFF0EF] text-[#C23B35] hover:border-[#DFA09B] hover:bg-[#FFE8E6]"
            }`}
          >
            <span
              className={`h-2 w-2 shrink-0 rounded-full ${
                isStoreOpen ? "bg-[#35A982]" : "bg-[#D94B45]"
              }`}
            />

            <span className="hidden sm:inline">
              {isStoreOpen ? "Store Open" : "Store Closed"}
            </span>

            <span className="sm:hidden">
              {isStoreOpen ? "Open" : "Closed"}
            </span>

            <span
              className={`hidden font-normal lg:inline ${
                isStoreOpen ? "text-[#589A8B]" : "text-[#C87872]"
              }`}
            >
              {isStoreOpen ? "(Pause)" : "(Open)"}
            </span>

            <Power
              size={13}
              strokeWidth={2}
              className="ml-0.5 transition-transform duration-150 group-hover:scale-110"
            />
          </button>

          <div className="hidden h-9 items-center gap-1.5 rounded-lg border border-[#E5D8C8] bg-white px-3 text-[11px] font-semibold text-[#62594F] sm:flex">
            <span className="relative flex h-2 w-2">
              <span className="absolute h-full w-full animate-ping rounded-full bg-[#E6A23C] opacity-40" />
              <span className="relative h-2 w-2 rounded-full bg-[#E6A23C]" />
            </span>

            <Activity
              size={13}
              strokeWidth={2}
              className="text-[#C47B1C]"
            />

            <span>Live</span>
          </div>
        </div>
      </div>
    </header>
  );
}

export default OwnerHeader;
