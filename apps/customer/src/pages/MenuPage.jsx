import MenuSection from "../components/menu/MenuSection";
import products from "../constants/mockMenu";
import MerchantHeader from "../components/layout/MerchantHeader";
import SearchBar from "../components/menu/SearchBar";
import CategoryTabs from "../components/menu/CategoryTabs";
import { useSelector } from "react-redux";
import { useState } from "react";
import { Link } from "react-router-dom";

function MenuPage() {
  const categories = [
  "All",
  "Starters",
  "Fast Food",
  "Main Course",
  "Beverages",
  "Snacks",
];

  const [searchQuery, setSearchQuery] = useState("");
  const [activeCategory, setActiveCategory] = useState("All");

  const cartItems = useSelector((state) => state.cart.items);

const filteredProducts = products.filter((product) => {
  const matchesSearch = product.name
    .toLowerCase()
    .includes(searchQuery.toLowerCase());

  const matchesCategory =
    activeCategory === "All" ||
    product.category === activeCategory;

  return matchesSearch && matchesCategory;
});

  return (
    <>

    <div className="menu-page">
    <MerchantHeader
  name="The Spice House"
  location="Downtown, Cityville"
  isOpen={true}
/>

<h1>Menu</h1>

<p>Cart Items: {cartItems.length}</p>

<Link to="/cart" className="view-cart-link">View Cart</Link>

<SearchBar
  value={searchQuery}
  onChange={setSearchQuery}
/>
<CategoryTabs
  categories={categories}
  activeCategory={activeCategory}
  onCategoryChange={setActiveCategory}
/>
      <MenuSection title="All Items" items={filteredProducts} />
    </div>

  </>
  );
};

export default MenuPage;