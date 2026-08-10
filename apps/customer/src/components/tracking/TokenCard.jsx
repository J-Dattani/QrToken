import { Ticket } from "lucide-react";

function TokenCard({ tokenNumber }) {
  return (
    <div className="relative overflow-hidden rounded-3xl bg-linear-to-r from-[#6F4E37] via-[#8B5E3C] to-[#C88A13] p-8 text-center shadow-xl">

      {/* Background Decoration */}
      <div className="absolute -top-10 -right-10 h-32 w-32 rounded-full bg-white/10"></div>
      <div className="absolute -bottom-12 -left-12 h-40 w-40 rounded-full bg-black/10"></div>

      {/* Icon */}
      <div className="relative z-10 mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-2xl bg-white/15 backdrop-blur">
        <Ticket size={30} className="text-white" />
      </div>

      {/* Title */}
      <p className="relative z-10 text-sm font-medium uppercase tracking-[0.25em] text-white/80">
        Your Token
      </p>

      {/* Token */}
      <h1 className="relative z-10 mt-4 text-7xl font-extrabold tracking-wide text-white">
        #{tokenNumber}
      </h1>

      {/* Message */}
      <p className="relative z-10 mt-5 text-white/90">
        Please wait while your order is being prepared.
      </p>

      {/* Badge */}
      <div className="relative z-10 mt-6 inline-flex items-center rounded-full bg-white/20 px-4 py-2 text-sm font-medium text-white backdrop-blur">
        🍵 Freshly preparing your order
      </div>

    </div>
  );
}

export default TokenCard;