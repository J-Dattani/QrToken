import { Ticket } from "lucide-react";

function TokenCard({ tokenNumber }) {
  return (
    <div
      className="
        relative
        overflow-hidden
        rounded-3xl
        bg-gradient-to-r
        from-[#6F4E37]
        via-[#8B5E3C]
        to-[#C88A13]
        p-8
        text-center
        shadow-xl
      "
    >
      {/* Background Decoration */}
      <div
        className="
          absolute
          -right-10
          -top-10
          h-32
          w-32
          rounded-full
          bg-white/10
        "
      />

      <div
        className="
          absolute
          -bottom-12
          -left-12
          h-40
          w-40
          rounded-full
          bg-black/10
        "
      />

      {/* Subtle Glow */}
      <div
        className="
          absolute
          left-1/2
          top-1/2
          h-40
          w-40
          -translate-x-1/2
          -translate-y-1/2
          rounded-full
          bg-white/5
          blur-3xl
        "
      />

      {/* Icon */}
      <div
        className="
          relative
          z-10
          mx-auto
          mb-5
          flex
          h-16
          w-16
          items-center
          justify-center
          rounded-2xl
          border
          border-white/10
          bg-white/15
          shadow-sm
          backdrop-blur
        "
      >
        <Ticket
          size={30}
          strokeWidth={2}
          className="text-white"
        />
      </div>

      {/* Title */}
      <p
        className="
          relative
          z-10
          text-sm
          font-semibold
          uppercase
          tracking-[0.25em]
          text-white/80
        "
      >
        Your Token
      </p>

      {/* Token */}
      <h1
        className="
          relative
          z-10
          mt-3
          text-6xl
          font-extrabold
          tracking-wide
          text-white
          sm:text-7xl
        "
      >
        #{tokenNumber}
      </h1>

      {/* Message */}
      <p
        className="
          relative
          z-10
          mx-auto
          mt-5
          max-w-md
          text-sm
          leading-6
          text-white/90
          sm:text-base
        "
      >
        Please wait while your order is being prepared.
      </p>

      {/* Status Badge */}
      <div
        className="
          relative
          z-10
          mt-6
          inline-flex
          items-center
          gap-2
          rounded-full
          border
          border-white/10
          bg-white/20
          px-4
          py-2
          text-sm
          font-medium
          text-white
          shadow-sm
          backdrop-blur
        "
      >
        <span className="h-2 w-2 rounded-full bg-green-300 animate-pulse" />

        <span>
          Freshly preparing your order
        </span>
      </div>
    </div>
  );
}

export default TokenCard;