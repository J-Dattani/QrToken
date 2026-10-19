import { useState } from "react";
import {
  TextField,
  Button,
  CircularProgress,
  Alert,
} from "@mui/material";

function CouponSection({
  merchantId,
  subtotal,
  onCouponApplied,
  onCouponRemoved,
}) {
  const [couponCode, setCouponCode] = useState("");
  const [applied, setApplied] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleApplyCoupon = async () => {
    const code = couponCode.trim().toUpperCase();

    if (!code) {
      setError("Please enter a coupon code.");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const response = await fetch(
        "https://qrcode-ac0d.onrender.com/api/orders/validate-coupon",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            merchantId,
            couponCode: code,
            subtotal,
          }),
        }
      );

      const data = await response.json();

      if (!response.ok || !data.valid) {
        setApplied(false);
        setError(data.message || "Invalid coupon code.");
        onCouponRemoved();
        return;
      }

      // Coupon successfully validated
      setCouponCode(code);
      setApplied(true);

      onCouponApplied({
        ...data.coupon,
        discountAmount: data.discountAmount,
      });
    } catch (error) {
      console.error("Coupon validation error:", error);

      setApplied(false);
      setError("Failed to validate coupon. Please try again.");

      onCouponRemoved();
    } finally {
      setLoading(false);
    }
  };

  const handleRemoveCoupon = () => {
    setCouponCode("");
    setApplied(false);
    setError("");

    onCouponRemoved();
  };

  const handleCouponChange = (e) => {
    const value = e.target.value.toUpperCase();

    setCouponCode(value);
    setError("");

    // Editing an applied coupon removes its applied state
    if (applied) {
      setApplied(false);
      onCouponRemoved();
    }
  };

  return (
    <div>

      {/* Header */}
      <div className="mb-5 flex items-center justify-between">

        <h3 className="text-xl font-bold text-[#4B2E1F]">
          Coupon
        </h3>

        <span
          className="
            rounded-full
            bg-[#FFF4E6]
            px-3
            py-1
            text-xs
            font-semibold
            text-[#C88A13]
          "
        >
          Save More
        </span>

      </div>

      {/* Input + Apply */}
      <div className="flex gap-3">

        <TextField
          fullWidth
          size="small"
          value={couponCode}
          onChange={handleCouponChange}
          placeholder="Enter coupon code"
          disabled={loading}
          error={Boolean(error)}
          onKeyDown={(e) => {
            if (e.key === "Enter" && couponCode.trim() && !loading) {
              handleApplyCoupon();
            }
          }}
          sx={{
            "& .MuiOutlinedInput-root": {
              borderRadius: "12px",
              backgroundColor: "#FFFFFF",

              "& fieldset": {
                borderColor: "#E7D8C7",
              },

              "&:hover fieldset": {
                borderColor: "#C8A98D",
              },

              "&.Mui-focused fieldset": {
                borderColor: "#6F4E37",
                borderWidth: "1.5px",
              },

              "&.Mui-error fieldset": {
                borderColor: "#DC2626",
              },
            },

            "& input": {
              color: "#4B2E1F",
              fontWeight: 500,
            },

            "& input::placeholder": {
              color: "#A68A78",
              opacity: 1,
            },
          }}
        />

        <Button
          type="button"
          variant="contained"
          disabled={loading || !couponCode.trim()}
          onClick={handleApplyCoupon}
          sx={{
            minWidth: "95px",
            borderRadius: "12px",
            backgroundColor: "#6F4E37",
            color: "#FFFFFF",
            fontWeight: 600,
            textTransform: "none",
            boxShadow: "none",

            "&:hover": {
              backgroundColor: "#5A3E2B",
              boxShadow: "none",
            },

            "&:active": {
              transform: "scale(0.97)",
            },

            "&.Mui-disabled": {
              backgroundColor: "#D6CEC7",
              color: "#FFFFFF",
            },
          }}
        >
          {loading ? (
            <CircularProgress
              size={20}
              thickness={4}
              sx={{ color: "#FFFFFF" }}
            />
          ) : (
            "Apply"
          )}
        </Button>

      </div>

      {/* Error */}
      {error && (
        <Alert
          severity="error"
          variant="outlined"
          sx={{
            mt: 2,
            borderRadius: "12px",
            backgroundColor: "#FFF7F7",
            fontSize: "0.875rem",
            alignItems: "center",
          }}
        >
          {error}
        </Alert>
      )}

      {/* Applied Coupon */}
      {applied && !error && (
        <div
          className="
            mt-3
            flex
            items-center
            justify-between
            rounded-xl
            border
            border-green-200
            bg-green-50
            px-4
            py-3
          "
        >
          <div className="flex items-center gap-2">

            <div
              className="
                flex
                h-6
                w-6
                items-center
                justify-center
                rounded-full
                bg-green-600
                text-xs
                font-bold
                text-white
              "
            >
              ✓
            </div>

            <p className="text-sm font-semibold text-green-700">
              Coupon {couponCode} applied
            </p>

          </div>

          <button
            type="button"
            onClick={handleRemoveCoupon}
            className="
              text-sm
              font-semibold
              text-red-600
              transition
              hover:text-red-700
              active:scale-95
              cursor-pointer
            "
          >
            Remove
          </button>
        </div>
      )}

    </div>
  );
}

export default CouponSection;