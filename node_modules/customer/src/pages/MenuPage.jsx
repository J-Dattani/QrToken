import MenuSection from "../components/menu/MenuSection";
import MerchantHeader from "../components/layout/MerchantHeader";
import SearchBar from "../components/menu/SearchBar";
import CategoryTabs from "../components/menu/CategoryTabs";
import CheckoutModal from "../components/checkout/CheckoutModal";
import BottomCart from "../components/checkout/BottomCart";
import OrdersModal from "../components/orders/OrdersModal";

import api from "../config/api";
import {
  getActiveOrder,
  removeActiveOrder,
  getOrderHistory,
} from "../services/sessionStorage";

import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

import {
  Box,
  Button,
  CircularProgress,
  Paper,
  Typography,
} from "@mui/material";

import {
  ReceiptLong,
  ArrowForward,
  LocalFireDepartment,
} from "@mui/icons-material";


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


  // Fetch merchant menu
  useEffect(() => {
    const fetchMenu = async () => {
      try {
        const response = await api.get(
          `/menu/public/${merchantId}`
        );

        setMerchant(response.data.merchant);
        setItems(response.data.items || []);
        setTaxConfig(response.data.taxConfig);

        setCategories([
          "All",
          ...Array.from(
            new Set(
              (response.data.items || []).map(
                (item) => item.category
              )
            )
          ),
        ]);

        console.log(response.data.items);
        console.log(response.data.merchant);
        console.log(response.data.merchant.taxConfig);

      } catch (error) {
        console.error("Failed to fetch menu:", error);
      }
    };

    fetchMenu();
  }, [merchantId]);


  // Check active order
  useEffect(() => {
    const checkActiveOrder = async () => {
      const storedOrder = getActiveOrder();

      if (!storedOrder) {
        setActiveOrder(null);
        return;
      }

      try {
        const response = await api.get(
          `/orders/${storedOrder.orderId}`
        );

        const order = response.data;

        const completedStatuses = [
          "completed",
          "collected",
          "cancelled",
          "canceled",
        ];

        if (
          completedStatuses.includes(
            order.status?.toLowerCase()
          )
        ) {
          removeActiveOrder();
          setActiveOrder(null);
          return;
        }

        const updatedOrder = {
          ...storedOrder,
          status: order.status,
          paymentStatus: order.paymentStatus,
          tokenNumber: order.tokenNumber,
          createdAt: order.createdAt,
        };

        sessionStorage.setItem(
          "activeOrder",
          JSON.stringify(updatedOrder)
        );

        setActiveOrder(updatedOrder);

      } catch (error) {
        console.error(
          "Failed to check active order:",
          error
        );

        setActiveOrder(storedOrder);
      }
    };


    checkActiveOrder();

    const interval = setInterval(() => {
      checkActiveOrder();
    }, 5000);

    return () => clearInterval(interval);

  }, []);


  // Search + category filtering
  const filteredProducts = items.filter((product) => {
    const matchesSearch = product.name
      .toLowerCase()
      .includes(searchQuery.toLowerCase());

    const matchesCategory =
      activeCategory === "All" ||
      product.category === activeCategory;

    return matchesSearch && matchesCategory;
  });


  // Loading
  if (!merchant) {
    return (
      <Box
        sx={{
          minHeight: "100vh",
          bgcolor: "#F8F3ED",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          px: 2,
        }}
      >
        <CircularProgress
          size={44}
          thickness={4}
          sx={{
            color: "#6F4E37",
          }}
        />

        <Typography
          sx={{
            mt: 2.5,
            color: "#6F4E37",
            fontWeight: 600,
          }}
        >
          Loading menu...
        </Typography>
      </Box>
    );
  }


  const handleOpenCheckout = () => {
    setIsCheckoutOpen(true);
  };


  const handleCloseCheckout = () => {
    setIsCheckoutOpen(false);
  };


  return (
    <>
      <Box
        sx={{
          minHeight: "100vh",
          bgcolor: "#F8F3ED",
          py: { xs: 2, sm: 3 },
          px: { xs: 1.5, sm: 2 },
        }}
      >

        <Box
          sx={{
            maxWidth: 900,
            mx: "auto",
          }}
        >

          {/* Merchant Header */}
          <MerchantHeader
            name={merchant.name}
            location={merchant.city}
            isOpen={merchant.isOpen}
            rating={merchant.rating}
            openingHours={merchant.openingHours}
            tagline={merchant.tagline}
          />


          {/* Orders + Active Order */}
          <Box
            sx={{
              mt: 1.5,
              display: "flex",
              alignItems: "stretch",
              gap: 1.5,
            }}
          >

            {/* Orders */}
            <Button
              variant="contained"
              startIcon={<ReceiptLong />}
              onClick={() => setIsOrdersOpen(true)}
              sx={{
                flexShrink: 0,
                borderRadius: 2.5,
                px: { xs: 1.5, sm: 2 },
                bgcolor: "#6F4E37",
                color: "#fff",
                fontWeight: 700,
                fontSize: { xs: "0.75rem", sm: "0.85rem" },
                textTransform: "none",
                boxShadow: "none",
                whiteSpace: "nowrap",

                "&:hover": {
                  bgcolor: "#5A3E2B",
                  boxShadow: "none",
                },
              }}
            >
              Orders ({orders.length})
            </Button>


            {/* Active Order */}
            {activeOrder && (
              <Paper
                elevation={0}
                sx={{
                  flex: 1,
                  minWidth: 0,
                  borderRadius: 2.5,
                  px: { xs: 1.5, sm: 2 },
                  py: 1,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  gap: 1,
                  background:
                    "linear-gradient(90deg, #6F4E37, #A56A2A)",
                  boxShadow:
                    "0 4px 14px rgba(111,78,55,0.18)",
                }}
              >

                {/* Active order info */}
                <Box
                  sx={{
                    minWidth: 0,
                    display: "flex",
                    alignItems: "center",
                    gap: { xs: 0.7, sm: 1 },
                  }}
                >

                  <LocalFireDepartment
                    sx={{
                      fontSize: 16,
                      color: "#FFD28A",
                      flexShrink: 0,
                    }}
                  />

                  <Typography
                    sx={{
                      color: "#FDE8C8",
                      fontSize: "0.7rem",
                      fontWeight: 700,
                      flexShrink: 0,
                    }}
                  >
                    ACTIVE
                  </Typography>

                  <Typography
                    sx={{
                      color: "#fff",
                      fontSize: "0.85rem",
                      fontWeight: 800,
                      flexShrink: 0,
                    }}
                  >
                    #{activeOrder.tokenNumber}
                  </Typography>

                  <Typography
                    sx={{
                      color: "#F6E9DB",
                      fontSize: "0.72rem",
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                      whiteSpace: "nowrap",
                      textTransform: "capitalize",
                    }}
                  >
                    {activeOrder.status || "Preparing"}
                  </Typography>

                </Box>


                {/* Track */}
                <Button
                  variant="contained"
                  endIcon={<ArrowForward />}
                  onClick={() =>
                    navigate(
                      `/track/${activeOrder.orderId}`
                    )
                  }
                  sx={{
                    flexShrink: 0,
                    minWidth: "auto",
                    borderRadius: 1.8,
                    px: { xs: 1.2, sm: 1.5 },
                    py: 0.6,
                    bgcolor: "#fff",
                    color: "#6F4E37",
                    fontSize: "0.72rem",
                    fontWeight: 700,
                    textTransform: "none",
                    boxShadow: "none",

                    "& .MuiButton-endIcon": {
                      marginLeft: 0.3,
                    },

                    "& svg": {
                      fontSize: "14px",
                    },

                    "&:hover": {
                      bgcolor: "#FFF4E8",
                      boxShadow: "none",
                    },
                  }}
                >
                  Track
                </Button>

              </Paper>
            )}

          </Box>


          {/* Search */}
          <SearchBar
            value={searchQuery}
            onChange={setSearchQuery}
          />


          {/* Categories */}
          <CategoryTabs
            categories={categories}
            activeCategory={activeCategory}
            onCategoryChange={setActiveCategory}
          />


          {/* Menu */}
          <MenuSection
            title="All Items"
            items={filteredProducts}
          />

        </Box>

      </Box>


      {/* Bottom Cart */}
      <BottomCart
        onProceed={handleOpenCheckout}
      />


      {/* Checkout */}
      <CheckoutModal
        merchantId={merchant._id}
        merchantSlug={merchantId}
        isOpen={isCheckoutOpen}
        taxConfig={taxConfig}
        onClose={handleCloseCheckout}
      />


      {/* Orders */}
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