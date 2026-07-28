function CategoryTabs({
  categories,
  activeCategory,
  onCategoryChange,
}) {
  return (
    <div className="category-tabs">

      {categories.map((category) => (
        <button
          key={category}
          className={category === activeCategory ? 'active' : ''}
          onClick={() => onCategoryChange(category)}
        >
          {category}
        </button>
      ))}

    </div>
  );
}

export default CategoryTabs;