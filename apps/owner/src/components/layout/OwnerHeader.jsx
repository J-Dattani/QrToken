import { Activity } from "lucide-react";

function OwnerHeader({
  title = "Shree Krishna Tea Stall",
  subtitle = "Fresh Tea • Snacks • Fast Service",
}) {
  return (
    <header className="border-b border-[#E5D8C8] bg-[#F7F3ED] px-6 py-6 lg:px-8">
      <div className="flex items-center justify-between gap-4">

        {/* Page Title */}

        <div>
          <h1 className="text-2xl font-bold text-[#241F1A]">
            {title}
          </h1>

          <p className="mt-1 text-sm text-[#766A5D]">
            {subtitle}
          </p>
        </div>

        {/* Live Status */}

        <div className="flex items-center gap-2 rounded-lg bg-[#E6A23C] px-4 py-2 text-sm font-semibold text-[#241B14]">
          <Activity size={15} />

          <span>
            Live
          </span>
        </div>

      </div>
    </header>
  );
}

export default OwnerHeader;