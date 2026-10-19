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
    <div
      className="
        mb-8
        overflow-hidden
        rounded-3xl
        border
        border-[#E7D8C7]
        bg-white
        shadow-[0_15px_35px_rgba(111,78,55,0.18)]
      "
    >
      {/* Hero */}
      <div
        className="
          relative
          overflow-hidden
          bg-gradient-to-br
          from-[#6F4E37]
          via-[#8B5E3C]
          to-[#C68E17]
          p-6
          text-white
        "
      >
        {/* Decorative background */}
        <div
          className="
            pointer-events-none
            absolute
            -right-12
            -top-16
            h-40
            w-40
            rounded-full
            bg-white/10
            blur-2xl
          "
        />

        <div
          className="
            pointer-events-none
            absolute
            -bottom-20
            right-20
            h-32
            w-32
            rounded-full
            bg-white/5
            blur-xl
          "
        />

        <div className="relative flex items-start justify-between gap-4">

          {/* Left */}
          <div className="flex min-w-0 gap-4">

            {/* Merchant Avatar */}
            <div
              className="
                flex
                h-16
                w-16
                shrink-0
                items-center
                justify-center
                rounded-2xl
                border
                border-white/20
                bg-white/15
                text-3xl
                font-bold
                shadow-lg
                backdrop-blur-md
              "
            >
              {name.charAt(0).toUpperCase()}
            </div>

            <div className="min-w-0 pt-1">

              <h1
                className="
                  truncate
                  text-2xl
                  font-extrabold
                  tracking-tight
                  sm:text-3xl
                "
              >
                {name}
              </h1>

              <p className="mt-1 text-sm leading-5 text-white/80 sm:text-base">
                {tagline || "Fresh Tea • Snacks • Fast Service"}
              </p>

            </div>
          </div>

          {/* Rating */}
          <div
            className="
              flex
              shrink-0
              items-center
              gap-1.5
              rounded-full
              border
              border-white/30
              bg-white
              px-3
              py-2
              text-sm
              font-bold
              text-[#C68E17]
              shadow-md
              sm:px-4
            "
          >
            <Star
              size={16}
              fill="currentColor"
              strokeWidth={2.5}
            />

            {Number(rating || 0).toFixed(1)}
          </div>

        </div>
      </div>

      {/* Bottom Info */}
      <div className="bg-[#FFF8F2] p-5">

        {/* Status */}
        <div className="mb-5 flex">

          <div
            className={`
              inline-flex
              items-center
              gap-2
              rounded-full
              border
              px-4
              py-2
              text-sm
              font-semibold
              ${
                isOpen
                  ? "border-green-200 bg-green-50 text-green-700"
                  : "border-red-200 bg-red-50 text-red-700"
              }
            `}
          >
            <span
              className={`
                h-2
                w-2
                rounded-full
                ${
                  isOpen
                    ? "bg-green-500"
                    : "bg-red-500"
                }
              `}
            />

            {isOpen ? "Open Now" : "Closed"}
          </div>

        </div>

        {/* Information */}
        <div className="grid gap-4 sm:grid-cols-2">

          {/* Opening Hours */}
          <div
            className="
              flex
              items-center
              gap-3
              rounded-2xl
              border
              border-[#E7D8C7]
              bg-white
              p-4
            "
          >
            <div
              className="
                flex
                h-10
                w-10
                shrink-0
                items-center
                justify-center
                rounded-xl
                bg-[#FFF4E8]
              "
            >
              <Clock3
                size={18}
                className="text-[#C68E17]"
              />
            </div>

            <div className="min-w-0">

              <p
                className="
                  text-[11px]
                  font-semibold
                  uppercase
                  tracking-wider
                  text-gray-400
                "
              >
                Opening Hours
              </p>

              <p className="mt-1 truncate font-semibold text-[#5A463A]">
                {openingHours}
              </p>

            </div>
          </div>

          {/* Location */}
          <div
            className="
              flex
              items-center
              gap-3
              rounded-2xl
              border
              border-[#E7D8C7]
              bg-white
              p-4
            "
          >
            <div
              className="
                flex
                h-10
                w-10
                shrink-0
                items-center
                justify-center
                rounded-xl
                bg-[#FFF4E8]
              "
            >
              <MapPin
                size={18}
                className="text-[#C68E17]"
              />
            </div>

            <div className="min-w-0">

              <p
                className="
                  text-[11px]
                  font-semibold
                  uppercase
                  tracking-wider
                  text-gray-400
                "
              >
                Location
              </p>

              <p className="mt-1 truncate font-semibold text-[#5A463A]">
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