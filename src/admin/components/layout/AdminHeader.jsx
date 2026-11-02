
import { useEffect, useState } from "react";

import {
  AccessTimeRounded,
  CalendarMonthRounded,
  NotificationsNoneRounded,
  KeyboardArrowDownRounded,
} from "@mui/icons-material";

import {
  AppBar,
  Avatar,
  Box,
  Divider,
  IconButton,
  Toolbar,
  Tooltip,
  Typography,
} from "@mui/material";

const C = {
  background: "#F7F3ED",
  surface: "#FFFFFF",
  text: "#241F1A",
  brown: "#765239",
  muted: "#88796B",
  border: "#E8DCCF",
  green: "#16856B",
  greenBg: "#E6F3ED",
};

const PAGE_CONTEXT = {
  Overview: {
    group: "COMMAND CENTRE",
    section: "PLATFORM",
  },
  Merchants: {
    group: "ECOSYSTEM",
    section: "MERCHANT MANAGEMENT",
  },
  Verification: {
    group: "TRUST & SAFETY",
    section: "VERIFICATION CENTRE",
  },
  Transactions: {
    group: "FINANCIAL OPERATIONS",
    section: "TRANSACTION MANAGEMENT",
  },
  Subscriptions: {
    group: "REVENUE OPERATIONS",
    section: "BILLING & PLANS",
  },
  Support: {
    group: "OPERATIONS",
    section: "SERVICE DESK",
  },
  Compliance: {
    group: "GOVERNANCE",
    section: "RISK & COMPLIANCE",
  },
  Settings: {
    group: "CONTROL CENTRE",
    section: "PLATFORM CONFIGURATION",
  },
};

const getCurrentDateTime = () => new Date();

export default function AdminHeader({ title, subtitle }) {
  const [now, setNow] = useState(getCurrentDateTime);

  useEffect(() => {
    const timer = window.setInterval(() => {
      setNow(getCurrentDateTime());
    }, 1000);

    return () => window.clearInterval(timer);
  }, []);

  const context = PAGE_CONTEXT[title] || {
    group: "ADMINISTRATION",
    section: "PLATFORM MANAGEMENT",
  };

  const date = new Intl.DateTimeFormat("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  }).format(now);

  const weekday = new Intl.DateTimeFormat("en-IN", {
    weekday: "long",
  }).format(now);

  const time = new Intl.DateTimeFormat("en-IN", {
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hour12: true,
  }).format(now);

  return (
    <AppBar
      position="static"
      elevation={0}
      sx={{
        flexShrink: 0,
        bgcolor: C.background,
        color: C.text,
        borderBottom: `1px solid ${C.border}`,
        position: "relative",
        zIndex: 5,
        "&::after": {
          content: '""',
          position: "absolute",
          bottom: 0,
          left: 0,
          width: "100%",
          height: "2px",
          background:
            "linear-gradient(90deg, #E6A23C 0%, #E6A23C 12%, #E8DCCF 42%, transparent 85%)",
        },
      }}
    >
      <Toolbar
        disableGutters
        sx={{
          minHeight: "84px !important",
          px: { xs: 1.5, sm: 2.5, lg: 3 },
          py: 1.2,
          gap: { xs: 1, sm: 1.5, lg: 2 },
        }}
      >
        {/* PAGE IDENTITY */}
        <Box sx={{ flex: 1, minWidth: 0 }}>
          {/* Dynamic breadcrumb */}
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              gap: 0.8,
              mb: 0.65,
              minWidth: 0,
            }}
          >
            <Typography
              sx={{
                fontSize: 9,
                fontWeight: 850,
                letterSpacing: "1.15px",
                color: C.muted,
                whiteSpace: "nowrap",
              }}
            >
              {context.group}
            </Typography>

            <Box
              sx={{
                width: 4,
                height: 4,
                borderRadius: "50%",
                bgcolor: C.gold,
                flexShrink: 0,
              }}
            />

            <Typography
              sx={{
                fontSize: 9,
                fontWeight: 850,
                letterSpacing: "1.05px",
                color: C.brown,
                whiteSpace: "nowrap",
                overflow: "hidden",
                textOverflow: "ellipsis",
              }}
            >
              {context.section}
            </Typography>
          </Box>

          {/* Main page heading */}
          <Typography
            noWrap
            sx={{
              fontSize: { xs: 18, sm: 21, lg: 23 },
              fontWeight: 850,
              letterSpacing: "-0.85px",
              lineHeight: 1.15,
              color: C.text,
            }}
          >
            {title || "Platform Overview"}
          </Typography>

          {/* Page purpose */}
          {subtitle && (
            <Typography
              noWrap
              sx={{
                mt: 0.5,
                fontSize: 11,
                color: C.muted,
                lineHeight: 1.4,
                display: { xs: "none", sm: "block" },
              }}
            >
              {subtitle}
            </Typography>
          )}
        </Box>

        {/* LIVE DATE AND CLOCK */}
        <Box
          sx={{
            display: { xs: "none", md: "flex" },
            alignItems: "center",
            gap: 1.1,
            px: 1.3,
            py: 0.85,
            bgcolor: C.surface,
            border: `1px solid ${C.border}`,
            borderRadius: "14px",
            boxShadow: "0 3px 12px rgba(45,31,24,0.035)",
            transition: "all 180ms ease",
            "&:hover": {
              borderColor: "#D8C3AC",
              boxShadow: "0 5px 15px rgba(45,31,24,0.06)",
            },
          }}
        >
          <Box
            sx={{
              width: 35,
              height: 35,
              display: "grid",
              placeItems: "center",
              borderRadius: "11px",
              bgcolor: "#F5EDE3",
              color: C.brown,
              flexShrink: 0,
            }}
          >
            <CalendarMonthRounded sx={{ fontSize: 18 }} />
          </Box>

          <Box sx={{ minWidth: 105 }}>
            <Typography
              sx={{
                fontSize: 10.5,
                fontWeight: 800,
                color: C.text,
                whiteSpace: "nowrap",
              }}
            >
              {date}
            </Typography>

            <Typography
              sx={{
                mt: 0.2,
                fontSize: 9,
                color: C.muted,
              }}
            >
              {weekday}
            </Typography>
          </Box>

          <Divider
            orientation="vertical"
            flexItem
            sx={{ borderColor: C.border, mx: 0.3 }}
          />

          <Box
            sx={{
              width: 35,
              height: 35,
              display: "grid",
              placeItems: "center",
              borderRadius: "11px",
              bgcolor: "#F5EDE3",
              color: C.brown,
              flexShrink: 0,
            }}
          >
            <AccessTimeRounded sx={{ fontSize: 18 }} />
          </Box>

          <Box sx={{ minWidth: 90 }}>
            <Typography
              sx={{
                fontSize: 11.5,
                fontWeight: 850,
                color: C.text,
                fontFamily: "monospace",
                fontVariantNumeric: "tabular-nums",
                whiteSpace: "nowrap",
              }}
            >
              {time}
            </Typography>

            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                gap: 0.45,
                mt: 0.25,
              }}
            >
              <Box
                sx={{
                  width: 5,
                  height: 5,
                  borderRadius: "50%",
                  bgcolor: C.green,
                }}
              />
              <Typography
                sx={{
                  fontSize: 8.5,
                  color: C.muted,
                  letterSpacing: "0.3px",
                }}
              >
                LOCAL TIME
              </Typography>
            </Box>
          </Box>
        </Box>

        {/* COMPACT CLOCK FOR MOBILE */}
        <Box
          sx={{
            display: { xs: "flex", md: "none" },
            alignItems: "center",
            gap: 0.6,
            px: 1,
            py: 0.8,
            bgcolor: C.surface,
            border: `1px solid ${C.border}`,
            borderRadius: "10px",
          }}
        >
          <AccessTimeRounded sx={{ fontSize: 15, color: C.brown }} />

          <Typography
            sx={{
              fontSize: 10,
              fontWeight: 800,
              fontFamily: "monospace",
              fontVariantNumeric: "tabular-nums",
              whiteSpace: "nowrap",
            }}
          >
            {time}
          </Typography>
        </Box>

        {/* NOTIFICATIONS */}
        <Tooltip title="Notifications" arrow>
          <IconButton
            aria-label="Notifications"
            sx={{
              width: 42,
              height: 42,
              flexShrink: 0,
              bgcolor: C.surface,
              border: `1px solid ${C.border}`,
              borderRadius: "12px",
              color: C.brown,
              boxShadow: "0 2px 8px rgba(45,31,24,0.035)",
              transition: "all 180ms ease",
              "&:hover": {
                bgcolor: "#F1E8DE",
                borderColor: "#D9C5B0",
                transform: "translateY(-2px)",
              },
            }}
          >
            <NotificationsNoneRounded sx={{ fontSize: 20 }} />
          </IconButton>
        </Tooltip>

        {/* ADMIN ACCOUNT */}
        <Tooltip title="Administrator account" arrow>
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              gap: 0.9,
              pl: 0.8,
              pr: { xs: 0.8, sm: 1.15 },
              py: 0.65,
              flexShrink: 0,
              bgcolor: C.surface,
              border: `1px solid ${C.border}`,
              borderRadius: "13px",
              boxShadow: "0 2px 8px rgba(45,31,24,0.035)",
              transition: "all 180ms ease",
              "&:hover": {
                borderColor: "#D9C5B0",
                boxShadow: "0 5px 12px rgba(45,31,24,0.06)",
              },
            }}
          >
            <Avatar
              sx={{
                width: 34,
                height: 34,
                bgcolor: C.brown,
                color: "#FFFFFF",
                fontSize: 11,
                fontWeight: 850,
                border: "2px solid #F1E6DA",
                boxShadow: "0 0 0 1px #DCC9B7",
              }}
            >
              SA
            </Avatar>

            <Box sx={{ display: { xs: "none", sm: "block" } }}>
              <Typography
                sx={{
                  fontSize: 10.5,
                  fontWeight: 800,
                  color: C.text,
                  lineHeight: 1.3,
                }}
              >
                Administrator
              </Typography>

              <Typography
                sx={{
                  mt: 0.2,
                  fontSize: 8.5,
                  color: C.muted,
                }}
              >
                Account
              </Typography>
            </Box>

            <KeyboardArrowDownRounded
              sx={{
                display: { xs: "none", sm: "block" },
                fontSize: 17,
                color: C.muted,
              }}
            />
          </Box>
        </Tooltip>
      </Toolbar>
    </AppBar>
  );
}
