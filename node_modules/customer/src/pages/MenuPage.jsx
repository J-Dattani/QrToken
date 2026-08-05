import MenuSection from "../components/menu/MenuSection";
import { useParams } from "react-router-dom";
// import products from "../constants/mockMenu";
import MerchantHeader from "../components/layout/MerchantHeader";
import SearchBar from "../components/menu/SearchBar";
import CategoryTabs from "../components/menu/CategoryTabs";
import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import CheckoutModal from "../components/checkout/CheckoutModal";
import api from "../config/api";
import BottomCart from "../components/checkout/BottomCart";
import { useNavigate } from "react-router-dom";
import OrdersModal from "../components/orders/OrdersModal";
import {
  getActiveOrder,
  getOrderHistory,
} from "../services/sessionStorage";

const MenuPage = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [activeCategory, setActiveCategory] = useState("All");
  const [items, setItems] = useState([]);
  const [isOrdersOpen, setIsOrdersOpen] = useState(false);
  const navigate = useNavigate();
  const [merchant, setMerchant] = useState(null);
const [activeOrder, setActiveOrder] = useState(getActiveOrder());
  const [categories, setCategories] = useState([]);
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  const [taxConfig, setTaxConfig] = useState(null);
  const { merchantId } = useParams();
  const orders = getOrderHistory();
  useEffect(() => {
    const fetchMenu = async () => {
      const response = await api.get(`/menu/public/${merchantId}`);
      setMerchant(response.data.merchant);
      setItems(response.data.items || []);
      setTaxConfig(response.data.taxConfig);

      setCategories([
        "All",
        ...Array.from(new Set((response.data.items || []).map((item) => item.category)))
      ]);
      console.log(response.data.items);
      console.log(response.data.merchant);
console.log(response.data.merchant.taxConfig);
    };

    fetchMenu();
  }, [merchantId]);

  useEffect(() => {
  const interval = setInterval(() => {
    setActiveOrder(getActiveOrder());
  }, 1000);

  return () => clearInterval(interval);
}, []);

  const filteredProducts = items.filter((product) => {
    const matchesSearch = product.name
      .toLowerCase()
      .includes(searchQuery.toLowerCase());

    const matchesCategory =
      activeCategory === "All" || product.category === activeCategory;

    return matchesSearch && matchesCategory;
  });

  if (!merchant) {
    return <p>Loading...</p>;
  }
 

const handleOpenCheckout = () => {
  setIsCheckoutOpen(true);
};

const handleCloseCheckout = () => {
  setIsCheckoutOpen(false);
};

return (
    <>

<div className="menu-page max-w-3xl mx-auto px-4 py-4">
  {activeOrder && (
  <div className="bg-green-700 text-white p-3 rounded-lg flex justify-between items-center mb-4">
    <span>
      🔥 Active Order #{activeOrder.tokenNumber}
    </span>

  <button
  onClick={() => navigate(`/track/${activeOrder.orderId}`)}
  className="bg-yellow-500 hover:bg-yellow-600 text-white px-4 py-2 rounded-lg cursor-pointer transition"
>
  Track →
</button>
  </div>
)}
<button
  onClick={() => setIsOrdersOpen(true)}
  className="border rounded-full px-4 py-2 cursor-pointer"
>
  📜 Orders ({orders.length})
</button>
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
      <SearchBar value={searchQuery} onChange={setSearchQuery} />
<CategoryTabs
  categories={categories}
  activeCategory={activeCategory}
  onCategoryChange={setActiveCategory}
/>
      <MenuSection title="All Items" items={filteredProducts} />

<BottomCart onProceed={handleOpenCheckout} />
    </div>

<CheckoutModal
  merchantId={merchant._id}
  merchantSlug={merchantId} 
  isOpen={isCheckoutOpen}
    taxConfig={taxConfig}
  onClose={handleCloseCheckout}
/>

<OrdersModal
  isOpen={isOrdersOpen}
  onClose={() => setIsOrdersOpen(false)}
  orders={orders}
  onTrack={(order) => {
    navigate(`/track/${order.orderId}`);
  }}
/>
  </>
  );
};

export default MenuPage;