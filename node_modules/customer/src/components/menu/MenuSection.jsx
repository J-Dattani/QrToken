import MenuItem from "./MenuItem";

function MenuSection({ title, items }) {
  return (
    <section className="menu-section">
      {title && <h2>{title}</h2>}

      {items.length === 0 ? (
        <div className="py-14 text-center">

  <div className="text-6xl mb-5">
    🍵
  </div>

  <h3 className="text-2xl font-bold text-[#4B2E1F]">
    No Items Found
  </h3>

  <p className="text-gray-500 mt-3">
    No items matched your search.
  </p>

</div>
      ) : (
        <div className="menu-items-list">
          {items.map((item) => (
            <MenuItem
  key={item._id}
  product={item}
/>
          ))}
        </div>
      )}
    </section>
  );
}

export default MenuSection;