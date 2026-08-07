import MenuSection from "../components/menu/MenuSection";
import { useParams } from "react-router-dom";
// import products from "../constants/mockMenu";
import MerchantHeader from "../components/layout/MerchantHeader";
import SearchBar from "../components/menu/SearchBar";
import CategoryTabs from "../components/menu/CategoryTabs";
import { useState, useEffect } from "react";
// import { Link } from "react-router-dom";
import CheckoutModal from "../components/checkout/CheckoutModal";
import api from "../config/api";
import BottomCart from "../components/checkout/BottomCart";
import { useNavigate } from "react-router-dom";
import OrdersModal from "../components/orders/OrdersModal";
import { COLORS } from "../constants/theme";
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
    return <div className="min-h-screen bg-[#F8F3ED] flex flex-col items-center justify-center">
  <div className="h-12 w-12 rounded-full border-4 border-[#D7C2AD] border-t-[#6F4E37] animate-spin"></div>

  <p className="mt-5 text-[#6F4E37] font-medium">
    Loading your order...
  </p>
</div>;
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
  <div className="mb-6 rounded-3xl bg-gradient-to-r from-[#6F4E37] to-[#A56A2A] p-5 shadow-lg flex items-center justify-between">

    <div>
      <p className="text-sm text-[#FDE8C8] font-medium">
        🔥 ACTIVE ORDER
      </p>

      <h3 className="text-2xl font-bold text-white mt-1">
        #{activeOrder.tokenNumber}
      </h3>

      <p className="text-[#F6E9DB] text-sm mt-1">
        Your order is being prepared
      </p>
    </div>

    <button
      onClick={() => navigate(`/track/${activeOrder.orderId}`)}
      className="
        bg-white
        text-[#6F4E37]
        font-semibold
        px-6
        py-3
        rounded-2xl
        shadow-md
        hover:bg-[#FFF4E8]
        transition
        cursor-pointer
      "
    >
      Track →
    </button>

  </div>
)}  

<div className="menu-page max-w-5xl mx-auto">

  <button
    onClick={() => setIsOrdersOpen(true)}
    className="mb-4 px-5 py-2 rounded-full font-medium transition hover:opacity-90"
    style={{
      backgroundColor: COLORS.primary,
      color: "#fff",
      cursor: "pointer",
    }}
  >
    📜 Orders ({orders.length})
  </button>

  <MerchantHeader
    name={merchant.name}
    location={merchant.city}
    isOpen={merchant.isOpen}
    rating={merchant.rating}
    openingHours={merchant.openingHours}
    tagline={merchant.tagline}
  />

</div>
{/*
<p>Cart Items: {cartItems.length}</p> */}

{/* <Link to="/cart" className="space-y-3">View Cart</Link> */}
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