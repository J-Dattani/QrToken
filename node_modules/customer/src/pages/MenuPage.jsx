import MenuSection from "../components/menu/MenuSection";
import { useParams } from "react-router-dom";
// import products from "../constants/mockMenu";
import MerchantHeader from "../components/layout/MerchantHeader";
import SearchBar from "../components/menu/SearchBar";
import CategoryTabs from "../components/menu/CategoryTabs";
import { useSelector } from "react-redux";
import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import api from "../config/api";

const MenuPage = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [activeCategory, setActiveCategory] = useState("All");
  const [items, setItems] = useState([]);
  const [merchant, setMerchant] = useState(null);
  const [categories, setCategories] = useState([]);
  const cartItems = useSelector((state) => state.cart.items);
  const { merchantId } = useParams();

useEffect(() => {
  const fetchMenu = async () => {
    const response = await api.get(`/menu/public/${merchantId}`);
    setMerchant(response.data.merchant);
    setItems(response.data.items);
    setCategories(["All", ...new Set(response.data.items.map((item) => item.category))]);
console.log(response.data.items);

  };

  

  fetchMenu();  
}, [merchantId]);

const filteredProducts = items.filter((product) => {
  const matchesSearch = product.name
    .toLowerCase()
    .includes(searchQuery.toLowerCase());

  const matchesCategory =
    activeCategory === "All" ||
    product.category === activeCategory;

  return matchesSearch && matchesCategory;
});

if (!merchant) {
  return <p>Loading...</p>;
}
  return (
    <>

 <div className="menu-page max-w-3xl mx-auto px-4 py-4">
    <MerchantHeader
  name={merchant.name}
  location={merchant.city}
  isOpen={merchant.isOpen}
  rating={merchant.rating}
/>

<h1>Menu</h1>
{/* 
<p>Cart Items: {cartItems.length}</p> */}

<Link to="/cart" className="space-y-3">View Cart</Link>

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