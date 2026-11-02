
import { useMemo, useState } from "react";
import {
  AccountBalanceWalletRounded,
  CheckCircleRounded,
  CreditCardRounded,
  DescriptionRounded,
  TrendingUpRounded,
} from "@mui/icons-material";
import {
//   Avatar,
  Box,
  Chip,
  FormControl,
  MenuItem,
  Select,
//   Stack,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
} from "@mui/material";

const COLORS = {
  background: "#F8F3ED",
  paper: "#FFFFFF",
  text: "#2D1F18",
  muted: "#887767",
  primary: "#6F4E37",
  gold: "#E6A23C",
  border: "#E9DCCF",
};

const plans = [
  {
    name: "Free",
    price: 0,
    description: "Up to 50 orders/day, no analytics",
    icon: <AccountBalanceWalletRounded />,
    color: "#9A6B2F",
  },
  {
    name: "Starter",
    price: 499,
    description: "Up to 200 orders/day, basic analytics",
    icon: <CreditCardRounded />,
    color: "#278477",
  },
  {
    name: "Growth",
    price: 1499,
    description: "Unlimited orders, full analytics, coupons",
    icon: <TrendingUpRounded />,
    color: "#5377B9",
  },
  {
    name: "Pro",
    price: 2999,
    description: "Everything + API access, priority support",
    icon: <CheckCircleRounded />,
    color: "#8458A6",
  },
];

const initialMerchants = [
  {
    id: "MER-001",
    name: "tea culture",
    slug: "/tea-culture-1787745299124",
    city: "Vadodara",
    joined: "26/8/2026",
    plan: "Free",
  },
  {
    id: "MER-002",
    name: "Chai Point - GTU",
    slug: "/chai-point---gtu-1784897436705",
    city: "Ahmedabad",
    joined: "24/7/2026",
    plan: "Free",
  },
  {
    id: "MER-003",
    name: "Shree Krishna Tea Stall",
    slug: "/shree-krishna-tea-stall",
    city: "Rajkot, Gujarat",
    joined: "19/7/2026",
    plan: "Starter",
  },
];

const planColors = {
  Free: { bg: "#EDE5D5", color: "#765A3D" },
  Starter: { bg: "#DDF0EA", color: "#167C70" },
  Growth: { bg: "#E6EDFC", color: "#4265A6" },
  Pro: { bg: "#F0E5F8", color: "#79509A" },
};

const formatPrice = (price) =>
  new Intl.NumberFormat("en-IN", {
    maximumFractionDigits: 0,
  }).format(price);

function PlanCard({ plan, count }) {
  return (
    <Box
      sx={{
        position: "relative",
        minWidth: 0,
        overflow: "hidden",
        border: `1px solid ${COLORS.border}`,
        borderRadius: "13px",
        bgcolor: COLORS.paper,
        p: 2.1,
        "&::before": {
          content: '""',
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          height: 4,
          bgcolor: COLORS.gold,
        },
      }}
    >
      <Typography
        sx={{
          fontSize: 12,
          fontWeight: 700,
          textTransform: "uppercase",
          letterSpacing: 0.35,
          color: COLORS.text,
        }}
      >
        {plan.name}
      </Typography>

      <Typography
        sx={{
          mt: 1.1,
          fontSize: 28,
          fontWeight: 800,
          color: COLORS.text,
          lineHeight: 1.2,
        }}
      >
        {count}
      </Typography>

      <Typography sx={{ mt: 1, fontSize: 12.5, color: COLORS.muted }}>
        ₹{formatPrice(plan.price)}/mo
      </Typography>

      <Typography
        sx={{
          mt: 1,
          fontSize: 12,
          lineHeight: 1.55,
          color: COLORS.muted,
        }}
      >
        {plan.description}
      </Typography>
    </Box>
  );
}

export default function SubscriptionsPage() {
  const [merchants, setMerchants] = useState(initialMerchants);

  const planCounts = useMemo(() => {
    return merchants.reduce(
      (counts, merchant) => {
        counts[merchant.plan] = (counts[merchant.plan] || 0) + 1;
        return counts;
      },
      { Free: 0, Starter: 0, Growth: 0, Pro: 0 }
    );
  }, [merchants]);

  const handlePlanChange = (merchantId, newPlan) => {
    setMerchants((currentMerchants) =>
      currentMerchants.map((merchant) =>
        merchant.id === merchantId
          ? { ...merchant, plan: newPlan }
          : merchant
      )
    );
  };

  return (
    <Box sx={{ width: "100%", minWidth: 0, color: COLORS.text }}>
      {/* Plan summary cards */}
      <Box
        sx={{
          display: "grid",
          gridTemplateColumns: {
            xs: "repeat(2, minmax(0, 1fr))",
            lg: "repeat(4, minmax(0, 1fr))",
          },
          gap: 1.5,
          mb: 2.2,
        }}
      >
        {plans.map((plan) => (
          <PlanCard
            key={plan.name}
            plan={plan}
            count={planCounts[plan.name] || 0}
          />
        ))}
      </Box>

      {/* Merchant plans table */}
      <Box
        sx={{
          border: `1px solid ${COLORS.border}`,
          borderRadius: "13px",
          backgroundColor: COLORS.paper,
          overflow: "hidden",
        }}
      >
        <Box sx={{ px: 2.8, pt: 2.5, pb: 1.2 }}>
          <Typography sx={{ fontSize: 16, fontWeight: 800 }}>
            Merchant Plans
          </Typography>

          <Typography
            sx={{ mt: 0.4, fontSize: 12, color: COLORS.muted }}
          >
            View subscriptions and change a merchant's current plan.
          </Typography>
        </Box>

        <TableContainer sx={{ overflowX: "auto" }}>
          <Table
            size="small"
            sx={{
              minWidth: 780,
              "& .MuiTableCell-root": {
                borderBottom: `1px solid #F0E5DB`,
                px: 2.5,
              },
            }}
          >
            <TableHead>
              <TableRow
                sx={{
                  "& .MuiTableCell-root": {
                    py: 1.5,
                    fontSize: 11.5,
                    fontWeight: 800,
                    color: COLORS.muted,
                    whiteSpace: "nowrap",
                    bgcolor: "#FFFFFF",
                  },
                }}
              >
                <TableCell sx={{ width: "32%" }}>MERCHANT</TableCell>
                <TableCell>CURRENT PLAN</TableCell>
                <TableCell>CITY</TableCell>
                <TableCell>JOINED</TableCell>
                <TableCell>CHANGE PLAN</TableCell>
              </TableRow>
            </TableHead>

            <TableBody>
              {merchants.map((merchant) => {
                const currentPlanStyle =
                  planColors[merchant.plan] || planColors.Free;

                return (
                  <TableRow
                    key={merchant.id}
                    hover
                    sx={{
                      "&:hover": { bgcolor: "#FCF8F3" },
                      "& .MuiTableCell-root": {
                        py: 1.8,
                        verticalAlign: "middle",
                      },
                    }}
                  >
                    {/* Merchant name and storefront slug */}
                    <TableCell>
                      <Typography
                        sx={{
                          fontSize: 13,
                          fontWeight: 700,
                          color: COLORS.text,
                        }}
                      >
                        {merchant.name}
                      </Typography>

                      <Typography
                        sx={{
                          mt: 0.45,
                          fontSize: 12,
                          color: COLORS.muted,
                          overflowWrap: "anywhere",
                        }}
                      >
                        {merchant.slug}
                      </Typography>
                    </TableCell>

                    {/* Current plan badge */}
                    <TableCell>
                      <Chip
                        label={merchant.plan}
                        size="small"
                        sx={{
                          height: 25,
                          borderRadius: "7px",
                          bgcolor: currentPlanStyle.bg,
                          color: currentPlanStyle.color,
                          fontSize: 12,
                          fontWeight: 700,
                          "& .MuiChip-label": { px: 1.3 },
                        }}
                      />
                    </TableCell>

                    {/* City */}
                    <TableCell>
                      <Typography
                        sx={{
                          fontSize: 12.5,
                          color: "#6F5543",
                          whiteSpace: "nowrap",
                        }}
                      >
                        {merchant.city}
                      </Typography>
                    </TableCell>

                    {/* Joined date */}
                    <TableCell>
                      <Typography
                        sx={{
                          fontSize: 12.5,
                          color: "#6F5543",
                          whiteSpace: "nowrap",
                        }}
                      >
                        {merchant.joined}
                      </Typography>
                    </TableCell>

                    {/* Change plan dropdown */}
                    <TableCell>
                      <FormControl size="small" sx={{ minWidth: 94 }}>
                        <Select
                          value={merchant.plan}
                          onChange={(event) =>
                            handlePlanChange(
                              merchant.id,
                              event.target.value
                            )
                          }
                          inputProps={{
                            "aria-label": `Change plan for ${merchant.name}`,
                          }}
                          sx={{
                            height: 35,
                            borderRadius: "8px",
                            bgcolor: "#FFFFFF",
                            fontSize: 12.5,
                            "& .MuiSelect-select": {
                              py: 0.7,
                              pl: 1.4,
                              pr: 3.5,
                            },
                            "& .MuiOutlinedInput-notchedOutline": {
                              borderColor: COLORS.border,
                            },
                            "&:hover .MuiOutlinedInput-notchedOutline": {
                              borderColor: "#CDB8A5",
                            },
                            "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
                              borderColor: COLORS.primary,
                            },
                          }}
                        >
                          {plans.map((plan) => (
                            <MenuItem
                              key={plan.name}
                              value={plan.name}
                              sx={{ fontSize: 13 }}
                            >
                              {plan.name}
                            </MenuItem>
                          ))}
                        </Select>
                      </FormControl>
                    </TableCell>
                  </TableRow>
                );
              })}

              {merchants.length === 0 && (
                <TableRow>
                  <TableCell colSpan={5} align="center" sx={{ py: 6 }}>
                    <DescriptionRounded
                      sx={{ fontSize: 36, color: "#B8A28E", mb: 1 }}
                    />
                    <Typography sx={{ fontSize: 14, fontWeight: 700 }}>
                      No merchant subscriptions available
                    </Typography>
                    <Typography
                      sx={{ mt: 0.5, fontSize: 12, color: COLORS.muted }}
                    >
                      Merchant subscription records will appear here.
                    </Typography>
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>

        <Box
          sx={{
            px: 2.8,
            py: 1.5,
            borderTop: `1px solid ${COLORS.border}`,
            bgcolor: "#FFFEFC",
          }}
        >
          <Typography sx={{ fontSize: 11.5, color: COLORS.muted }}>
            Showing {merchants.length} merchant
            {merchants.length === 1 ? "" : "s"} · Changes are currently
            local demo updates and are not saved to the server.
          </Typography>
        </Box>
      </Box>
    </Box>
  );
}
