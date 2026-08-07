import { COLORS } from "../../constants/theme";

function CategoryTabs({
  categories,
  activeCategory,
  onCategoryChange,
}) {
  return (
    <div className="flex gap-3 overflow-x-auto py-3 scrollbar-hide">
      {categories.map((category) => {
        const active = category === activeCategory;

        return (
          <button
            key={category}
            onClick={() => onCategoryChange(category)}
            className="px-5 py-2.5 rounded-full text-sm font-semibold whitespace-nowrap transition-all duration-200 shadow-sm cursor-pointer"
            style={{
              backgroundColor: active ? COLORS.primary : "#ffffff",
              color: active ? "#ffffff" : "#5B4636",
              border: active
                ? "1px solid transparent"
                : "1px solid #E8D9CB",
              boxShadow: active
                ? "0 6px 18px rgba(123,45,18,.22)"
                : "0 2px 8px rgba(0,0,0,.04)",
            }}
          >
            {category}
          </button>
        );
      })}
    </div>
  );
}

export default CategoryTabs;