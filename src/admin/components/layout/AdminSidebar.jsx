
import { useCallback, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import {
  DashboardRounded,
  StorefrontRounded,
  VerifiedUserRounded,
  ReceiptLongRounded,
  CardMembershipRounded,
  SupportAgentRounded,
  GppGoodRounded,
  SettingsRounded,
  LogoutRounded,
  ChevronLeftRounded,
  ChevronRightRounded,
} from "@mui/icons-material";

import {
  Box,
  Divider,
  IconButton,
  Tooltip,
  Typography,
} from "@mui/material";

const NAV_ITEMS = [
  { label: "Overview", icon: DashboardRounded },
  { label: "Merchants", icon: StorefrontRounded },
  { label: "Verification", icon: VerifiedUserRounded },
  { label: "Transactions", icon: ReceiptLongRounded },
  { label: "Subscriptions", icon: CardMembershipRounded },
  { label: "Support", icon: SupportAgentRounded },
  { label: "Compliance", icon: GppGoodRounded },
  { label: "Settings", icon: SettingsRounded },
];

export default function AdminSidebar({
  activeSection,
  onSectionChange,
  onLogout,
}) {
  const navigate = useNavigate();
  const [collapsed, setCollapsed] = useState(false);

  const sidebarWidth = collapsed ? 58 : 224;

  const toggleSidebar = useCallback(() => {
    setCollapsed((previous) => !previous);
  }, []);

  const handleLogout = () => {
    if (onLogout) {
      onLogout();
    } else {
      navigate("/admin/login");
    }
  };

  // Ctrl + B collapse / expand shortcut
  useEffect(() => {
    const handleKeyDown = (event) => {
      const target = event.target;

      const isTyping =
        target instanceof HTMLElement &&
        (target.isContentEditable ||
          ["INPUT", "TEXTAREA", "SELECT"].includes(target.tagName));

      if (
        event.ctrlKey &&
        event.key.toLowerCase() === "b" &&
        !event.repeat &&
        !isTyping
      ) {
        event.preventDefault();
        toggleSidebar();
      }
    };

    window.addEventListener("keydown", handleKeyDown);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [toggleSidebar]);

  return (
    <Box
      component="aside"
      sx={{
        position: "relative",
        width: `${sidebarWidth}px`,
        minWidth: `${sidebarWidth}px`,
        height: "100dvh",
        flexShrink: 0,
        display: "flex",
        flexDirection: "column",
        bgcolor: "#201E1A",
        color: "#FFFFFF",
        transition: "width 220ms ease, min-width 220ms ease",
        zIndex: 10,
        overflow: "visible",
      }}
    >
      {/* Branding */}
      <Box
        sx={{
          height: 70,
          minHeight: 70,
          px: collapsed ? 0 : 2,
          display: "flex",
          alignItems: "center",
          justifyContent: collapsed ? "center" : "flex-start",
          gap: 1.1,
          overflow: "hidden",
        }}
      >
        <Box
          sx={{
            width: 34,
            height: 34,
            minWidth: 34,
            display: "grid",
            placeItems: "center",
            borderRadius: "10px",
            bgcolor: "#E6A23C",
            color: "#201E1A",
            fontSize: 21,
            fontWeight: 900,
            fontFamily: "Roboto, sans-serif",
          }}
        >
          Q
        </Box>

        {!collapsed && (
          <Box sx={{ minWidth: 0 }}>
            <Typography
              sx={{
                fontSize: 16,
                fontWeight: 800,
                letterSpacing: "-0.5px",
                lineHeight: 1.1,
                whiteSpace: "nowrap",
              }}
            >
              QRToken<span style={{ color: "#E6A23C" }}>.in</span>
            </Typography>

            <Typography
              sx={{
                mt: 0.35,
                fontSize: 9,
                color: "#A99E91",
                letterSpacing: "1.3px",
                fontWeight: 600,
                whiteSpace: "nowrap",
              }}
            >
              SUPER ADMIN
            </Typography>
          </Box>
        )}
      </Box>

      <Divider sx={{ borderColor: "#39342E" }} />

      {/* Navigation */}
      <Box
        component="nav"
        aria-label="Admin navigation"
        sx={{
          flex: 1,
          minHeight: 0,
          overflowY: "auto",
          overflowX: "hidden",
          px: collapsed ? 0.7 : 1.2,
          py: 1.7,
          display: "flex",
          flexDirection: "column",
          gap: 0.55,
          scrollbarWidth: "none",
          "&::-webkit-scrollbar": { display: "none" },
        }}
      >
        {!collapsed && (
          <Typography
            sx={{
              px: 1.1,
              mb: 0.8,
              color: "#81776B",
              fontSize: 9,
              fontWeight: 800,
              letterSpacing: "1.2px",
            }}
          >
            WORKSPACE
          </Typography>
        )}

        {NAV_ITEMS.map(({ label, icon: Icon }) => {
          const selected = activeSection === label;

          return (
            <Tooltip
              key={label}
              title={collapsed ? label : ""}
              placement="right"
              arrow
            >
              <Box
                component="button"
                type="button"
                onClick={() => onSectionChange?.(label)}
                aria-label={label}
                aria-current={selected ? "page" : undefined}
                sx={{
                  width: "100%",
                  minHeight: 39,
                  px: collapsed ? 0 : 1.15,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: collapsed ? "center" : "flex-start",
                  gap: 1.15,
                  border: "none",
                  borderRadius: "9px",
                  cursor: "pointer",
                  bgcolor: selected ? "#E6A23C" : "transparent",
                  color: selected ? "#201E1A" : "#BDB3A8",
                  transition: "background 150ms ease, color 150ms ease",
                  "&:hover": {
                    bgcolor: selected ? "#E6A23C" : "#302C26",
                    color: selected ? "#201E1A" : "#FFFFFF",
                  },
                }}
              >
                <Icon sx={{ fontSize: 19, flexShrink: 0 }} />

                {!collapsed && (
                  <Typography
                    sx={{
                      fontSize: 11.5,
                      fontWeight: selected ? 800 : 550,
                      whiteSpace: "nowrap",
                      textAlign: "left",
                    }}
                  >
                    {label}
                  </Typography>
                )}
              </Box>
            </Tooltip>
          );
        })}
      </Box>

      {/* Footer */}
      <Divider sx={{ borderColor: "#39342E" }} />

      <Box sx={{ px: collapsed ? 0.7 : 1.2, py: 1.5 }}>
        <Tooltip
          title={collapsed ? "Logout" : ""}
          placement="right"
          arrow
        >
          <Box
            component="button"
            type="button"
            onClick={handleLogout}
            aria-label="Logout"
            sx={{
              width: "100%",
              minHeight: 38,
              px: collapsed ? 0 : 1.15,
              display: "flex",
              alignItems: "center",
              justifyContent: collapsed ? "center" : "flex-start",
              gap: 1.15,
              border: "1px solid #45372E",
              borderRadius: "9px",
              bgcolor: "#2A2520",
              color: "#D6A18A",
              cursor: "pointer",
              "&:hover": {
                bgcolor: "#3A2923",
                color: "#F0B49C",
              },
            }}
          >
            <LogoutRounded sx={{ fontSize: 18, flexShrink: 0 }} />

            {!collapsed && (
              <Typography sx={{ fontSize: 11.5, fontWeight: 650 }}>
                Logout
              </Typography>
            )}
          </Box>
        </Tooltip>
      </Box>

      {/* Floating collapse / expand pill */}
      <Tooltip
        title={
          collapsed
            ? "Expand sidebar (Ctrl + B)"
            : "Collapse sidebar (Ctrl + B)"
        }
        placement="right"
        arrow
      >
        <IconButton
          onClick={toggleSidebar}
          aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
          aria-pressed={collapsed}
          sx={{
            position: "absolute",
            top: "50%",
            right: -14,
            transform: "translateY(-50%)",
            width: 30,
            height: 54,
            minWidth: 30,
            p: 0,
            border: "1px solid #514437",
            borderRadius: "20px",
            bgcolor: "#302820",
            color: "#D8C9B8",
            zIndex: 30,
            boxShadow: "0 3px 10px #00000030",
            transition: "background 160ms ease, color 160ms ease",
            "&:hover": {
              bgcolor: "#493829",
              color: "#FFFFFF",
            },
          }}
        >
          {collapsed ? (
            <ChevronRightRounded sx={{ fontSize: 22 }} />
          ) : (
            <ChevronLeftRounded sx={{ fontSize: 22 }} />
          )}
        </IconButton>
      </Tooltip>
    </Box>
  );
}
