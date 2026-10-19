import { Search } from "lucide-react";

function SearchBar({ value, onChange }) {
  return (
    <div className="relative my-6">

      <Search
        size={20}
        strokeWidth={2}
        className="
          pointer-events-none
          absolute
          left-4
          top-1/2
          -translate-y-1/2
          text-[#A47148]
        "
      />

      <input
        type="text"
        placeholder="Search tea, snacks, coffee..."
        value={value}
        onChange={(e) => onChange(e.target.value)}
        aria-label="Search menu"
        className="
          w-full
          rounded-2xl
          border
          border-[#E5D3C3]
          bg-[#FFF9F4]
          py-3
          pl-12
          pr-12
          text-[#2D1F18]
          placeholder:text-[#A68A78]
          shadow-sm
          outline-none
          transition-all
          duration-200

          hover:border-[#D8B89A]
          hover:shadow-md

          focus:border-[#C68E17]
          focus:bg-white
          focus:ring-2
          focus:ring-[#F8DFA5]
        "
      />

      {/* Clear search */}
      {value && (
        <button
          type="button"
          onClick={() => onChange("")}
          aria-label="Clear search"
          className="
            absolute
            right-3
            top-1/2
            flex
            h-8
            w-8
            -translate-y-1/2
            items-center
            justify-center
            rounded-full
            text-lg
            text-[#A47148]
            transition
            hover:bg-[#F8EDE3]
            hover:text-[#6F4E37]
            active:scale-95
            cursor-pointer
          "
        >
          ×
        </button>
      )}
    </div>
  );
}

export default SearchBar;