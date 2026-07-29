import MenuItem from "./MenuItem";

function MenuSection({ title, items }) {
  return (
    <section className="menu-section">
      {title && <h2>{title}</h2>}

      {items.length === 0 ? (
        <p>No items found.</p>
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