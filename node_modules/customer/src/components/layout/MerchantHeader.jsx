import { MapPin, Clock3, Star } from "lucide-react";

function MerchantHeader({
  name,
  location,
  isOpen,
  rating,
  openingHours,
  tagline,
}) {
  return (
    <div className="mb-8 overflow-hidden rounded-3xl shadow-[0_15px_35px_rgba(111,78,55,0.25)] ">

      {/* Hero */}
      <div className="bg-gradient-to-br from-[#6F4E37] via-[#8B5E3C] to-[#C68E17] p-6 text-white">

        <div className="flex justify-between items-start">

          {/* Left */}
          <div className="flex gap-4">

          <div className="w-16 h-16 rounded-2xl bg-white/20 flex items-center justify-center text-3xl font-bold">
  {name.charAt(0).toUpperCase()}
</div>

            <div>

              <h1 className="text-3xl font-extrabold tracking-tight">
                {name}
              </h1>

              <p className="text-white/80 mt-1">
                {tagline || "Fresh Tea • Snacks • Fast Service"}
              </p>

            </div>

          </div>

          {/* Rating */}
          <div className="flex items-center gap-1 rounded-full bg-white px-4 py-2 text-[#C68E17] font-bold shadow-md">
            <Star size={16} fill="currentColor" />
            {rating.toFixed(1)}
          </div>

        </div>

      </div>

      {/* Bottom Info */}
      <div className="bg-[#FFF8F2] p-5">

        <div className="flex flex-wrap gap-3 mb-4">

          <div
            className={`px-4 py-2 rounded-full text-sm font-semibold ${
              isOpen
                ? "bg-green-100 text-green-700"
                : "bg-red-100 text-red-700"
            }`}
          >
            {isOpen ? "🟢 Open Now" : "🔴 Closed"}
          </div>

        </div>

        <div className="space-y-3">

          <div className="flex items-center gap-3 text-[#5A463A]">

            <Clock3 size={18} className="text-[#C68E17]" />

            <div>

              <p className="text-xs text-gray-500 uppercase tracking-wide">
                Opening Hours
              </p>

              <p className="font-medium">
                {openingHours}
              </p>

            </div>

          </div>

          <div className="flex items-center gap-3 text-[#5A463A]">

            <MapPin size={18} className="text-[#C68E17]" />

            <div>

              <p className="text-xs text-gray-500 uppercase tracking-wide">
                Location
              </p>

              <p className="font-medium">
                {location}
              </p>

            </div>

          </div>

        </div>

      </div>

    </div>
  );
}

export default MerchantHeader;