import { useState } from "react";
import { useSelector } from "react-redux";

import {
  Box,
  Paper,
  Typography,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Button,
  Divider,
  Stack,
} from "@mui/material";

function CheckoutPage() {
  const cartItems = useSelector((state) => state.cart.items);

  const [customerName, setCustomerName] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [specialInstructions, setSpecialInstructions] = useState("");
  const [paymentMethod, setPaymentMethod] = useState("");

  const subtotal = cartItems.reduce(
    (total, item) => total + item.price * item.quantity,
    0
  );

  const gst = subtotal * 0.05;
  const grandTotal = subtotal + gst;

  const handlePlaceOrder = () => {
    if (customerName.trim() === "") {
      alert("Customer Name is required");
      return;
    }

    if (phoneNumber.trim() === "") {
      alert("Phone Number is required");
      return;
    }

    if (
      phoneNumber.trim().length !== 10 ||
      !/^\d+$/.test(phoneNumber.trim())
    ) {
      alert("Phone Number must be exactly 10 digits");
      return;
    }

    if (paymentMethod.trim() === "") {
      alert("Payment Method is required");
      return;
    }

    const order = {
      cartItems,
      subtotal,
      gst,
      grandTotal,
      customerName,
      phoneNumber,
      specialInstructions,
      paymentMethod,
    };

    console.log(order);
  };

  return (
    <Box
      sx={{
        minHeight: "100vh",
        bgcolor: "#F8F3ED",
        py: 5,
        px: { xs: 2, sm: 3 },
      }}
    >
      <Box
        sx={{
          maxWidth: 950,
          mx: "auto",
        }}
      >
        {/* Page Header */}
        <Box sx={{ mb: 4 }}>
          <Typography
            variant="h4"
            sx={{
              fontWeight: 800,
              color: "#4B2E1F",
            }}
          >
            Checkout
          </Typography>

          <Typography
            sx={{
              mt: 0.7,
              color: "#6B5A4A",
            }}
          >
            Review your order and complete your details.
          </Typography>
        </Box>

        {cartItems.length === 0 ? (
          <Paper
            elevation={1}
            sx={{
              p: 6,
              textAlign: "center",
              borderRadius: 4,
              border: "1px solid #E7D8C7",
            }}
          >
            <Typography sx={{ fontSize: "3rem", mb: 2 }}>
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

            <Typography sx={{ mt: 1, color: "#6B5A4A" }}>
              Add some items from the menu.
            </Typography>
          </Paper>
        ) : (
          <Stack spacing={3}>

            {/* Order Summary */}
            <Paper
              elevation={1}
              sx={{
                p: { xs: 2.5, sm: 3 },
                borderRadius: 4,
                border: "1px solid #E7D8C7",
              }}
            >
              <Typography
                variant="h6"
                sx={{
                  fontWeight: 700,
                  color: "#4B2E1F",
                  mb: 3,
                }}
              >
                Order Summary
              </Typography>

              <Stack spacing={2.5}>
                {cartItems.map((item, index) => (
                  <Box key={item._id}>
                    <Box
                      sx={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "space-between",
                        gap: 2,
                      }}
                    >
                      {/* Product */}
                      <Box
                        sx={{
                          display: "flex",
                          alignItems: "center",
                          gap: 2,
                          minWidth: 0,
                        }}
                      >
                        {/* Image */}
                        <Box
                          sx={{
                            width: 58,
                            height: 58,
                            flexShrink: 0,
                            borderRadius: 2.5,
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
                                height: "100%",
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                                fontSize: 11,
                                color: "#B49A87",
                              }}
                            >
                              No Image
                            </Box>
                          )}
                        </Box>

                        <Box sx={{ minWidth: 0 }}>
                          <Typography
                            sx={{
                              fontWeight: 700,
                              color: "#4B2E1F",
                            }}
                          >
                            {item.name}
                          </Typography>

                          <Typography
                            sx={{
                              fontSize: "0.9rem",
                              color: "#6B5A4A",
                              mt: 0.3,
                            }}
                          >
                            ₹{item.price} × {item.quantity}
                          </Typography>
                        </Box>
                      </Box>

                      {/* Item Total */}
                      <Typography
                        sx={{
                          fontWeight: 700,
                          color: "#6F4E37",
                          flexShrink: 0,
                        }}
                      >
                        ₹{(item.price * item.quantity).toFixed(2)}
                      </Typography>
                    </Box>

                    {index !== cartItems.length - 1 && (
                      <Divider
                        sx={{
                          mt: 2.5,
                          borderColor: "#F2E7DA",
                        }}
                      />
                    )}
                  </Box>
                ))}
              </Stack>
            </Paper>

            {/* Billing */}
            <Paper
              elevation={1}
              sx={{
                p: { xs: 2.5, sm: 3 },
                borderRadius: 4,
                border: "1px solid #E7D8C7",
              }}
            >
              <Typography
                variant="h6"
                sx={{
                  fontWeight: 700,
                  color: "#4B2E1F",
                  mb: 3,
                }}
              >
                Billing Summary
              </Typography>

              <Stack spacing={1.8}>
                <Box
                  sx={{
                    display: "flex",
                    justifyContent: "space-between",
                  }}
                >
                  <Typography sx={{ color: "#6B5A4A" }}>
                    Subtotal
                  </Typography>

                  <Typography fontWeight={600}>
                    ₹{subtotal.toFixed(2)}
                  </Typography>
                </Box>

                <Box
                  sx={{
                    display: "flex",
                    justifyContent: "space-between",
                  }}
                >
                  <Typography sx={{ color: "#6B5A4A" }}>
                    GST (5%)
                  </Typography>

                  <Typography fontWeight={600}>
                    ₹{gst.toFixed(2)}
                  </Typography>
                </Box>

                <Divider sx={{ borderColor: "#E7D8C7" }} />

                <Box
                  sx={{
                    mt: 1,
                    p: 2,
                    borderRadius: 3,
                    bgcolor: "#FFF4E8",
                    border: "1px solid #E7D8C7",
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                  }}
                >
                  <Typography
                    sx={{
                      fontWeight: 700,
                      color: "#4B2E1F",
                    }}
                  >
                    Grand Total
                  </Typography>

                  <Typography
                    sx={{
                      fontSize: "1.5rem",
                      fontWeight: 800,
                      color: "#6F4E37",
                    }}
                  >
                    ₹{grandTotal.toFixed(2)}
                  </Typography>
                </Box>
              </Stack>
            </Paper>

            {/* Customer Details */}
            <Paper
              elevation={1}
              sx={{
                p: { xs: 2.5, sm: 3 },
                borderRadius: 4,
                border: "1px solid #E7D8C7",
              }}
            >
              <Typography
                variant="h6"
                sx={{
                  fontWeight: 700,
                  color: "#4B2E1F",
                  mb: 3,
                }}
              >
                Customer Details
              </Typography>

              <Stack spacing={2.5}>
                <TextField
                  fullWidth
                  label="Customer Name"
                  placeholder="Enter your name"
                  value={customerName}
                  onChange={(e) =>
                    setCustomerName(e.target.value)
                  }
                />

                <TextField
                  fullWidth
                  label="Phone Number"
                  placeholder="Enter your phone number"
                  value={phoneNumber}
                  onChange={(e) =>
                    setPhoneNumber(
                      e.target.value.replace(/\D/g, "")
                    )
                  }
                  inputProps={{
                    maxLength: 10,
                  }}
                />

                <TextField
                  fullWidth
                  multiline
                  rows={3}
                  label="Special Instructions"
                  placeholder="Any special instructions..."
                  value={specialInstructions}
                  onChange={(e) =>
                    setSpecialInstructions(e.target.value)
                  }
                />
              </Stack>
            </Paper>

            {/* Payment */}
            <Paper
              elevation={1}
              sx={{
                p: { xs: 2.5, sm: 3 },
                borderRadius: 4,
                border: "1px solid #E7D8C7",
              }}
            >
              <Typography
                variant="h6"
                sx={{
                  fontWeight: 700,
                  color: "#4B2E1F",
                  mb: 3,
                }}
              >
                Payment Method
              </Typography>

              <FormControl fullWidth>
                <InputLabel>Payment Method</InputLabel>

                <Select
                  value={paymentMethod}
                  label="Payment Method"
                  onChange={(e) =>
                    setPaymentMethod(e.target.value)
                  }
                >
                  <MenuItem value="">
                    Select Payment Method
                  </MenuItem>

                  <MenuItem value="cash">
                    Cash
                  </MenuItem>

                  <MenuItem value="card">
                    Card
                  </MenuItem>

                  <MenuItem value="upi">
                    UPI
                  </MenuItem>
                </Select>
              </FormControl>
            </Paper>

            {/* Place Order */}
            <Button
              fullWidth
              variant="contained"
              onClick={handlePlaceOrder}
              sx={{
                py: 1.7,
                borderRadius: 3,
                bgcolor: "#6F4E37",
                fontSize: "1rem",
                fontWeight: 700,
                textTransform: "none",
                boxShadow: "0 8px 20px rgba(111,78,55,0.2)",
                "&:hover": {
                  bgcolor: "#5A3E2B",
                  boxShadow: "0 10px 24px rgba(111,78,55,0.25)",
                },
              }}
            >
              Place Order
            </Button>
          </Stack>
        )}
      </Box>
    </Box>
  );
}

export default CheckoutPage;