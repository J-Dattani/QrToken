import { Search } from "lucide-react";

function SearchBar({ value, onChange }) {
  return (
    <div className="relative my-6">

      <Search
        size={20}
        className="absolute left-4 top-1/2 -translate-y-1/2 text-[#A47148]"
      />

      <input
        type="text"
        placeholder="Search tea, snacks, coffee..."
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="
          w-full
          rounded-2xl
          border
          border-[#E5D3C3]
          bg-[#FFF9F4]
          py-3
          pl-12
          pr-4
          text-[#2D1F18]
          placeholder:text-[#A68A78]
          shadow-sm
          outline-none
          transition
          duration-200
          focus:border-[#C68E17]
          focus:ring-2
          focus:ring-[#F8DFA5]
        "
      />

    </div>
  );
}

export default SearchBar;