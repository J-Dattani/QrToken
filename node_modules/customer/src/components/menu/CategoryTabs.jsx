import { COLORS } from "../../constants/theme";

function CategoryTabs({
  categories,
  activeCategory,
  onCategoryChange,
}) {
  return (
    <div
      className="
        flex
        gap-3
        overflow-x-auto
        py-3
        scrollbar-hide
        scroll-smooth
      "
    >
      {categories.map((category) => {
        const active = category === activeCategory;

        return (
          <button
            key={category}
            type="button"
            onClick={() => onCategoryChange(category)}
            aria-pressed={active}
            className={`
              shrink-0
              whitespace-nowrap
              rounded-full
              px-5
              py-2.5
              text-sm
              font-semibold
              transition-all
              duration-200
              cursor-pointer
              select-none

              ${
                active
                  ? `
                    text-white
                    shadow-[0_6px_18px_rgba(123,45,18,0.22)]
                    hover:brightness-105
                    active:scale-95
                  `
                  : `
                    border
                    border-[#E8D9CB]
                    bg-white
                    text-[#5B4636]
                    shadow-[0_2px_8px_rgba(0,0,0,0.04)]
                    hover:border-[#D8B89A]
                    hover:bg-[#FFF9F4]
                    hover:shadow-sm
                    active:scale-95
                  `
              }
            `}
            style={
              active
                ? {
                    backgroundColor: COLORS.primary,
                  }
                : undefined
            }
          >
            {category}
          </button>
        );
      })}
    </div>
  );
}

export default CategoryTabs;