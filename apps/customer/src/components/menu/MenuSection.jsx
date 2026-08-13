import MenuItem from "./MenuItem";

function MenuSection({ title, items }) {
  return (
    <section className="menu-section">

      {/* Section Header */}
      {title && (
        <div className="mb-5 flex items-center justify-between">
          <h2 className="text-2xl font-bold tracking-tight text-[#4B2E1F]">
            {title}
          </h2>

          {items.length > 0 && (
            <span
              className="
                rounded-full
                border
                border-[#E7D8C7]
                bg-white
                px-3
                py-1
                text-xs
                font-semibold
                text-[#6F4E37]
                shadow-sm
              "
            >
              {items.length}{" "}
              {items.length === 1 ? "Item" : "Items"}
            </span>
          )}
        </div>
      )}

      {/* Empty State */}
      {items.length === 0 ? (
        <div
          className="
            rounded-3xl
            border
            border-[#E7D8C7]
            bg-white
            px-6
            py-14
            text-center
            shadow-sm
          "
        >
          <div
            className="
              mx-auto
              mb-5
              flex
              h-20
              w-20
              items-center
              justify-center
              rounded-3xl
              bg-[#FFF4E8]
              text-4xl
            "
          >
            🍵
          </div>

          <h3 className="text-2xl font-bold text-[#4B2E1F]">
            No Items Found
          </h3>

          <p className="mt-3 text-sm leading-6 text-gray-500">
            No items matched your search.
            <br />
            Try searching for something else.
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