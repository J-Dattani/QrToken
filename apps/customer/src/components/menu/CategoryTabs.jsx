function CategoryTabs({
  categories,
  activeCategory,
  onCategoryChange,
}) {
  return (
  <div className="flex gap-2 overflow-x-auto py-2 scrollbar-hide">

      {categories.map((category) => (
        <button
          key={category}
  className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition ${
  category === activeCategory
    ? "bg-green-600 text-white"
    : "bg-gray-100 text-gray-700 hover:bg-gray-200"
}`}
          onClick={() => onCategoryChange(category)}
        >
          {category}
        </button>
      ))}

    </div>
  );
}

export default CategoryTabs;