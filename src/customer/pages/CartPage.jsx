import { useSelector, useDispatch } from "react-redux";
import {
  Box,
  Typography,
  Paper,
  Divider,
  Stack,
} from "@mui/material";

import QuantityStepper from "../components/menu/QuantityStepper";

import {
  increaseItemQuantity,
  decreaseItemQuantity,
} from "../redux/slices/cartSlice";

function CartPage() {
  const cartItems = useSelector((state) => state.cart.items);
  const dispatch = useDispatch();

  const subtotal = cartItems.reduce(
    (total, item) => total + item.price * item.quantity,
    0
  );

  if (cartItems.length === 0) {
    return (
      <Box
        sx={{
          minHeight: "100vh",
          bgcolor: "#F8F3ED",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          px: 3,
        }}
      >
        <Paper
          elevation={2}
          sx={{
            width: "100%",
            maxWidth: 480,
            p: 5,
            textAlign: "center",
            borderRadius: 4,
            border: "1px solid #E7D8C7",
            bgcolor: "#fff",
          }}
        >
          <Typography
            sx={{
              fontSize: "3rem",
              mb: 2,
            }}
          >
            🛒
          </Typography>

          <Typography
            variant="h5"
            sx={{
              fontWeight: 700,
              color: "#4B2E1F",
            }}
          >
            Your cart is empty
          </Typography>

          <Typography
            sx={{
              mt: 1,
              color: "#6B5A4A",
            }}
          >
            Add some items from the menu.
          </Typography>
        </Paper>
      </Box>
    );
  }

  return (
    <Box
      sx={{
        minHeight: "100vh",
        bgcolor: "#F8F3ED",
        py: 4,
        px: { xs: 2, sm: 3 },
      }}
    >
      <Box
        sx={{
          maxWidth: 900,
          mx: "auto",
        }}
      >
        {/* Header */}
        <Box sx={{ mb: 3 }}>
          <Typography
            variant="h4"
            sx={{
              fontWeight: 800,
              color: "#4B2E1F",
            }}
          >
            Your Cart
          </Typography>

          <Typography
            sx={{
              mt: 0.5,
              color: "#6B5A4A",
            }}
          >
            Review your items before checkout.
          </Typography>
        </Box>

        {/* Cart Items */}
        <Paper
          elevation={1}
          sx={{
            borderRadius: 4,
            border: "1px solid #E7D8C7",
            overflow: "hidden",
            bgcolor: "#fff",
          }}
        >
          {cartItems.map((item, index) => (
            <Box key={item._id}>
              <Box
                sx={{
                  p: { xs: 2.5, sm: 3 },
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  gap: 2,
                  flexWrap: { xs: "wrap", sm: "nowrap" },
                }}
              >
                {/* Product */}
                <Stack
                  direction="row"
                  spacing={2}
                  alignItems="center"
                  sx={{
                    minWidth: 0,
                    flex: 1,
                  }}
                >
                  {/* Image */}
                  <Box
                    sx={{
                      width: 64,
                      height: 64,
                      flexShrink: 0,
                      borderRadius: 3,
                      overflow: "hidden",
                      bgcolor: "#F8F3ED",
                      border: "1px solid #E7D8C7",
                    }}
                  >
                    {item.image ? (
                      <Box
                        component="img"
                        src={item.image}
                        alt={item.name}
                        sx={{
                          width: "100%",
                          height: "100%",
                          objectFit: "cover",
                        }}
                      />
                    ) : (
                      <Box
                        sx={{
                          width: "100%",
                          height: "100%",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          color: "#B49A87",
                          fontSize: 12,
                        }}
                      >
                        No Image
                      </Box>
                    )}
                  </Box>

                  {/* Details */}
                  <Box sx={{ minWidth: 0 }}>
                    <Typography
                      sx={{
                        fontWeight: 700,
                        color: "#4B2E1F",
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                        whiteSpace: "nowrap",
                      }}
                    >
                      {item.name}
                    </Typography>

                    <Typography
                      sx={{
                        mt: 0.5,
                        fontSize: "0.9rem",
                        color: "#6B5A4A",
                      }}
                    >
                      ₹{item.price} × {item.quantity}
                    </Typography>
                  </Box>
                </Stack>

                {/* Quantity + Total */}
                <Stack
                  direction="row"
                  spacing={2}
                  alignItems="center"
                  sx={{
                    flexShrink: 0,
                  }}
                >
                  <QuantityStepper
                    quantity={item.quantity}
                    onIncrease={() =>
                      dispatch(increaseItemQuantity(item._id))
                    }
                    onDecrease={() =>
                      dispatch(decreaseItemQuantity(item._id))
                    }
                  />

                  <Typography
                    sx={{
                      minWidth: 70,
                      textAlign: "right",
                      fontWeight: 800,
                      color: "#6F4E37",
                    }}
                  >
                    ₹{(item.price * item.quantity).toFixed(2)}
                  </Typography>
                </Stack>
              </Box>

              {index !== cartItems.length - 1 && (
                <Divider sx={{ borderColor: "#F2E7DA" }} />
              )}
            </Box>
          ))}
        </Paper>

        {/* Subtotal */}
        <Paper
          elevation={1}
          sx={{
            mt: 3,
            p: 3,
            borderRadius: 4,
            border: "1px solid #E7D8C7",
            bgcolor: "#FFF4E8",
          }}
        >
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
            }}
          >
            <Box>
              <Typography
                sx={{
                  fontSize: "0.9rem",
                  color: "#6B5A4A",
                }}
              >
                Subtotal
              </Typography>

              <Typography
                sx={{
                  mt: 0.3,
                  fontSize: "0.8rem",
                  color: "#8A7565",
                }}
              >
                {cartItems.reduce(
                  (total, item) => total + item.quantity,
                  0
                )}{" "}
                items
              </Typography>
            </Box>

            <Typography
              sx={{
                fontSize: "1.7rem",
                fontWeight: 800,
                color: "#6F4E37",
              }}
            >
              ₹{subtotal.toFixed(2)}
            </Typography>
          </Box>
        </Paper>
      </Box>
    </Box>
  );
}

export default CartPage;