import { useEffect, useState } from "react";

import {
  Avatar,
  Box,
  Divider,
  List,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Tooltip,
  Typography,
} from "@mui/material";

import {
  ShoppingBagRounded,
  RestaurantRounded,
  AssignmentRounded,
  TableRestaurantRounded,
  AccountBalanceWalletRounded,
  FactCheckRounded,
  ReplayRounded,
  LocalOfferRounded,
  BarChartRounded,
  SettingsRounded,
  HistoryRounded,
  LogoutRounded,
  FiberManualRecordRounded,
  ChevronLeftRounded,
  ChevronRightRounded,
} from "@mui/icons-material";

import { NavLink, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";

import { logout } from "../../redux/slices/authSlice";
import { clearAuthSession } from "../../utils/authStorage";

const navigation = [
  {
    section: "OPERATIONS",
    items: [
      {
        label: "Live Orders",
        icon: ShoppingBagRounded,
        path: "/owner/orders",
        badge: "Live",
      },
      {
        label: "Kitchen Queue",
        icon: RestaurantRounded,
        path: "/owner/kitchen",
      },
      {
        label: "Manual Entry",
        icon: AssignmentRounded,
        path: "/owner/manual",
      },
      {
        label: "Table Sessions",
        icon: TableRestaurantRounded,
        path: "/owner/tables",
      },
      {
        label: "Order History",
        icon: HistoryRounded,
        path: "/owner/history",
      },
    ],
  },
  {
    section: "FINANCE",
    items: [
      {
        label: "Cash Management",
        icon: AccountBalanceWalletRounded,
        path: "/owner/cash",
      },
      {
        label: "Cash Reconciliation",
        icon: FactCheckRounded,
        path: "/owner/reconciliation",
      },
      {
        label: "Refunds",
        icon: ReplayRounded,
        path: "/owner/refunds",
      },
    ],
  },
  {
    section: "CATALOG",
    items: [
      {
        label: "Menu Manager",
        icon: RestaurantRounded,
        path: "/owner/menu",
      },
      {
        label: "Coupons",
        icon: LocalOfferRounded,
        path: "/owner/coupons",
      },
      {
        label: "Analytics",
        icon: BarChartRounded,
        path: "/owner/analytics",
      },
    ],
  },
];

const SPRING = "420ms cubic-bezier(0.16, 1, 0.3, 1)";

function OwnerSidebar() {
  const merchant = useSelector(
    (state) => state.merchant?.merchant
  );

  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [collapsed, setCollapsed] = useState(false);

  // Collapsed mode never expands on hover.
  const expanded = !collapsed;

  /* CTRL + B */

  useEffect(() => {
    const handleKeyboard = (event) => {
      if (
        event.ctrlKey &&
        !event.shiftKey &&
        !event.altKey &&
        event.key.toLowerCase() === "b"
      ) {
        const target = event.target;

        const isTyping =
          target instanceof HTMLInputElement ||
          target instanceof HTMLTextAreaElement ||
          target?.isContentEditable;

        if (isTyping) return;

        event.preventDefault();
        setCollapsed((current) => !current);
      }
    };

    window.addEventListener("keydown", handleKeyboard);

    return () => {
      window.removeEventListener("keydown", handleKeyboard);
    };
  }, []);

  /* LOGOUT */

  const handleLogout = () => {
    clearAuthSession();
    dispatch(logout());

    navigate("/login", {
      replace: true,
    });
  };

  /* TOOLTIP: ONLY WHILE COLLAPSED */

  const withTooltip = (label, child) => {
    if (expanded) return child;

    return (
      <Tooltip
        title={label}
        placement="right"
        arrow
        enterDelay={180}
        leaveDelay={0}
      >
        {child}
      </Tooltip>
    );
  };

  /* REUSABLE NAVIGATION BUTTON */

  const renderNavigationButton = (item, isActive) => {
    const Icon = item.icon;

    return (
      <ListItemButton
        disableRipple
        selected={isActive}
        sx={{
          position: "relative",
          minHeight: expanded ? 38 : 34,
          px: expanded ? 1.15 : 0,
          py: expanded ? 0.45 : 0,
          mb: expanded ? 0.3 : 0.18,
          borderRadius: expanded ? "8px" : "10px",
          justifyContent: expanded ? "flex-start" : "center",

          color: isActive
            ? "#F7F5F0"
            : "rgba(255,255,255,0.58)",

          backgroundColor: isActive
            ? "rgba(230,162,60,0.105)"
            : "transparent",

          transition:
            "background-color 180ms ease, color 180ms ease",

          "&:hover": {
            backgroundColor: isActive
              ? "rgba(230,162,60,0.14)"
              : "rgba(255,255,255,0.045)",
            color: "#fff",
          },

          "&.Mui-selected": {
            backgroundColor: "rgba(230,162,60,0.105)",
          },

          "&::before": {
            content: '""',
            position: "absolute",
            left: 0,
            top: expanded ? 8 : 6,
            bottom: expanded ? 8 : 6,
            width: isActive ? 2 : 0,
            backgroundColor: "#E6A23C",
            borderRadius: "0 3px 3px 0",
          },
        }}
      >
        <ListItemIcon
          sx={{
            minWidth: expanded ? 31 : 0,
            width: expanded ? "auto" : "100%",
            justifyContent: expanded ? "flex-start" : "center",
            color: isActive
              ? "#E6A23C"
              : "rgba(255,255,255,0.42)",
            transition: "color 180ms ease",
          }}
        >
          <Icon sx={{ fontSize: expanded ? 18 : 17 }} />
        </ListItemIcon>

        <ListItemText
          primary={item.label}
          sx={{
            my: 0,
            minWidth: 0,
            overflow: "hidden",
            opacity: expanded ? 1 : 0,
            width: expanded ? "auto" : 0,
            transform: expanded
              ? "translate3d(0,0,0)"
              : "translate3d(-6px,0,0)",
            transition:
              `opacity 160ms ease, transform ${SPRING}, width ${SPRING}`,
          }}
          slotProps={{
            primary: {
              sx: {
                fontSize: 11.8,
                fontWeight: isActive ? 650 : 500,
                letterSpacing: "-0.005em",
                whiteSpace: "nowrap",
              },
            },
          }}
        />

        {item.badge && expanded && (
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              gap: 0.35,
              ml: "auto",
              px: 0.7,
              py: 0.25,
              borderRadius: "5px",
              backgroundColor: "rgba(230,162,60,0.14)",
              border: "1px solid rgba(230,162,60,0.18)",
            }}
          >
            <FiberManualRecordRounded
              sx={{ fontSize: 6, color: "#E6A23C" }}
            />
            <Typography
              sx={{
                fontSize: 9,
                fontWeight: 750,
                color: "#E6A23C",
                lineHeight: 1,
              }}
            >
              LIVE
            </Typography>
          </Box>
        )}
      </ListItemButton>
    );
  };

  return (
    <Box
      component="aside"
      sx={{
        width: expanded ? 224 : 76,
        height: "100vh",
        flexShrink: 0,
        display: { xs: "none", lg: "block" },
        position: "relative",
        zIndex: 1200,
        background: "transparent",
        transition: `width ${SPRING}`,
      }}
    >
      {/* SIDEBAR SHELL */}

      <Box
        sx={{
          position: "fixed",
          left: expanded ? 0 : 12,
          top: expanded ? 0 : "50%",
          width: expanded ? 224 : 64,
          height: expanded ? "100vh" : "fit-content",
          maxHeight: expanded ? "100vh" : "calc(100vh - 24px)",
          transform: expanded
            ? "translate3d(0,0,0)"
            : "translate3d(0,-50%,0)",
          transformOrigin: "left center",
          display: "flex",
          flexDirection: "column",
          overflow: "visible",
          borderRadius: expanded ? 0 : "20px",

          background:
            "linear-gradient(180deg, #201E1A 0%, #181714 100%)",

          color: "#fff",

          border: expanded
            ? "1px solid rgba(255,255,255,0.055)"
            : "1px solid rgba(255,255,255,0.08)",

          boxShadow: expanded
            ? "none"
            : "0 14px 40px rgba(0,0,0,0.30), 0 2px 8px rgba(0,0,0,0.18)",

          zIndex: 1200,
          backfaceVisibility: "hidden",
          transition:
            `left ${SPRING}, top ${SPRING}, transform ${SPRING}, width ${SPRING}, height ${SPRING}, border-radius ${SPRING}, box-shadow 300ms ease`,
        }}
      >
        {/* COLLAPSE / EXPAND BUTTON */}

        {withTooltip(
          expanded
            ? "Collapse sidebar · Ctrl+B"
            : "Expand sidebar · Ctrl+B",

          <Box
            component="button"
            type="button"
            onClick={() => setCollapsed((current) => !current)}
            aria-label={
              expanded ? "Collapse sidebar" : "Expand sidebar"
            }
            sx={{
              position: "absolute",
              right: -13,
              top: expanded ? 72 : "50%",
              transform: expanded
                ? "translate3d(0,0,0)"
                : "translate3d(0,-50%,0)",
              width: 27,
              height: 48,
              border: "1px solid rgba(255,255,255,0.10)",
              borderRadius: "999px",
              display: "grid",
              placeItems: "center",
              cursor: "pointer",
              color: "rgba(255,255,255,0.65)",
              background: "rgba(38,35,30,0.96)",
              backdropFilter: "blur(14px)",
              WebkitBackdropFilter: "blur(14px)",
              boxShadow:
                "0 7px 20px rgba(0,0,0,0.28), inset 0 1px 0 rgba(255,255,255,0.06)",
              zIndex: 1500,
              transition:
                `top ${SPRING}, transform ${SPRING}, color 180ms ease, background-color 180ms ease, box-shadow 180ms ease`,

              "&:hover": {
                color: "#E6A23C",
                background: "rgba(52,47,40,0.98)",
                boxShadow:
                  "0 9px 26px rgba(0,0,0,0.36), inset 0 1px 0 rgba(255,255,255,0.08)",
              },

              "&:active": {
                scale: "0.96",
              },
            }}
          >
            {expanded ? (
              <ChevronLeftRounded sx={{ fontSize: 19 }} />
            ) : (
              <ChevronRightRounded sx={{ fontSize: 19 }} />
            )}
          </Box>
        )}

        {/* SCROLL AREA */}

        <Box
          sx={{
            height: expanded ? "100%" : "auto",
            minHeight: expanded ? 0 : "auto",
            overflowY: expanded ? "auto" : "visible",
            overflowX: "hidden",
            px: 0,

            "&::-webkit-scrollbar": { width: 3 },
            "&::-webkit-scrollbar-track": {
              background: "transparent",
            },
            "&::-webkit-scrollbar-thumb": {
              background: "rgba(255,255,255,0.12)",
              borderRadius: 20,
            },

            scrollbarWidth: "thin",
            scrollbarColor:
              "rgba(255,255,255,0.12) transparent",
          }}
        >
          {/* BRAND */}

          <Box
            sx={{
              px: expanded ? 1.75 : 0,
              pt: expanded ? 1.75 : 0.9,
              transition: `padding ${SPRING}`,
            }}
          >
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                justifyContent: expanded ? "flex-start" : "center",
                gap: expanded ? 1.15 : 0,
                px: expanded ? 0.5 : 0,
                pb: expanded ? 1.6 : 0.8,
                transition: `all ${SPRING}`,
              }}
            >
              <Box
                sx={{
                  width: expanded ? 36 : 34,
                  height: expanded ? 36 : 34,
                  flexShrink: 0,
                  borderRadius: "10px",
                  display: "grid",
                  placeItems: "center",
                  background:
                    "linear-gradient(145deg, #F0B04D, #D88D22)",
                  color: "#211A11",
                  fontSize: expanded ? 16 : 15,
                  fontWeight: 900,
                  boxShadow:
                    "0 5px 18px rgba(230,162,60,0.16)",
                  transition: `width ${SPRING}, height ${SPRING}, font-size 220ms ease`,
                }}
              >
                Q
              </Box>

              <Box
                sx={{
                  minWidth: 0,
                  overflow: "hidden",
                  whiteSpace: "nowrap",
                  opacity: expanded ? 1 : 0,
                  transform: expanded
                    ? "translate3d(0,0,0)"
                    : "translate3d(-8px,0,0)",
                  width: expanded ? "auto" : 0,
                  transition:
                    `opacity 160ms ease, transform ${SPRING}, width ${SPRING}`,
                }}
              >
                <Typography
                  sx={{
                    fontSize: 13.5,
                    fontWeight: 800,
                    letterSpacing: "-0.02em",
                    lineHeight: 1.1,
                  }}
                >
                  QRToken
                  <Box
                    component="span"
                    sx={{ color: "#E6A23C" }}
                  >
                    .in
                  </Box>
                </Typography>

                <Typography
                  sx={{
                    mt: 0.35,
                    fontSize: 9,
                    fontWeight: 600,
                    letterSpacing: "0.105em",
                    textTransform: "uppercase",
                    color: "rgba(255,255,255,0.36)",
                  }}
                >
                  Merchant Console
                </Typography>
              </Box>
            </Box>

            <Divider
              sx={{
                borderColor: "rgba(255,255,255,0.07)",
                opacity: expanded ? 1 : 0,
                transition: "opacity 180ms ease",
              }}
            />
          </Box>

          {/* NAVIGATION */}

          <Box
            component="nav"
            sx={{
              px: expanded ? 1.1 : 0.45,
              py: expanded ? 1.5 : 0.75,
              transition: `padding ${SPRING}`,
            }}
          >
            {navigation.map((group, groupIndex) => (
              <Box
                key={group.section}
                sx={{
                  mb: expanded
                    ? groupIndex === navigation.length - 1
                      ? 0
                      : 1.8
                    : 0.5,
                  transition: `margin ${SPRING}`,
                }}
              >
                <Typography
                  sx={{
                    height: expanded ? "auto" : 0,
                    overflow: "hidden",
                    px: 1.15,
                    mb: expanded ? 0.65 : 0,
                    fontSize: 9,
                    fontWeight: 750,
                    letterSpacing: "0.16em",
                    color: "rgba(255,255,255,0.28)",
                    opacity: expanded ? 1 : 0,
                    transition: "opacity 150ms ease",
                  }}
                >
                  {group.section}
                </Typography>

                <List disablePadding>
                  {group.items.map((item) => (
                    <NavLink
                      key={item.label}
                      to={item.path}
                      style={{
                        textDecoration: "none",
                        color: "inherit",
                        display: "block",
                      }}
                    >
                      {({ isActive }) =>
                        withTooltip(
                          item.label,
                          renderNavigationButton(item, isActive)
                        )
                      }
                    </NavLink>
                  ))}
                </List>
              </Box>
            ))}

            {/* SETTINGS */}

            <Divider
              sx={{
                my: expanded ? 1.25 : 0.65,
                mx: expanded ? 0.75 : 0.25,
                borderColor: "rgba(255,255,255,0.065)",
                opacity: expanded ? 1 : 0.8,
                transition: `margin ${SPRING}, opacity 180ms ease`,
              }}
            />

            <NavLink
              to="/owner/settings"
              style={{
                textDecoration: "none",
                color: "inherit",
                display: "block",
              }}
            >
              {({ isActive }) =>
                withTooltip(
                  "Settings",
                  <ListItemButton
                    disableRipple
                    selected={isActive}
                    sx={{
                      minHeight: expanded ? 38 : 34,
                      px: expanded ? 1.15 : 0,
                      py: expanded ? 0.45 : 0,
                      borderRadius: expanded ? "8px" : "10px",
                      justifyContent: expanded
                        ? "flex-start"
                        : "center",
                      color: isActive
                        ? "#fff"
                        : "rgba(255,255,255,0.55)",
                      backgroundColor: isActive
                        ? "rgba(230,162,60,0.105)"
                        : "transparent",
                      transition:
                        "background-color 180ms ease, color 180ms ease",

                      "&:hover": {
                        backgroundColor:
                          "rgba(255,255,255,0.045)",
                        color: "#fff",
                      },
                    }}
                  >
                    <ListItemIcon
                      sx={{
                        minWidth: expanded ? 31 : 0,
                        width: expanded ? "auto" : "100%",
                        justifyContent: expanded
                          ? "flex-start"
                          : "center",
                        color: isActive
                          ? "#E6A23C"
                          : "rgba(255,255,255,0.42)",
                      }}
                    >
                      <SettingsRounded
                        sx={{ fontSize: expanded ? 18 : 17 }}
                      />
                    </ListItemIcon>

                    <ListItemText
                      primary="Settings"
                      sx={{
                        my: 0,
                        overflow: "hidden",
                        opacity: expanded ? 1 : 0,
                        width: expanded ? "auto" : 0,
                        transform: expanded
                          ? "translate3d(0,0,0)"
                          : "translate3d(-6px,0,0)",
                        transition:
                          `opacity 160ms ease, transform ${SPRING}, width ${SPRING}`,
                      }}
                      slotProps={{
                        primary: {
                          sx: {
                            fontSize: 11.8,
                            fontWeight: isActive ? 650 : 500,
                            whiteSpace: "nowrap",
                          },
                        },
                      }}
                    />
                  </ListItemButton>
                )
              }
            </NavLink>
          </Box>

          {/* FLEX SPACE */}

          {expanded && (
            <Box sx={{ minHeight: 20, flex: 1 }} />
          )}

          {/* MERCHANT CARD */}

          <Box
            sx={{
              mx: expanded ? 1.1 : 0.45,
              mb: expanded ? 0.8 : 0.45,
              p: expanded ? 1.15 : 0.5,
              borderRadius: expanded ? "11px" : "10px",
              background:
                "linear-gradient(135deg, rgba(255,255,255,0.055), rgba(255,255,255,0.025))",
              border: "1px solid rgba(255,255,255,0.065)",
              transition: `all ${SPRING}`,
            }}
          >
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                justifyContent: expanded ? "flex-start" : "center",
                gap: expanded ? 1 : 0,
              }}
            >
              <Box sx={{ position: "relative", flexShrink: 0 }}>
                <Avatar
                  sx={{
                    width: expanded ? 32 : 30,
                    height: expanded ? 32 : 30,
                    bgcolor: "#E6A23C",
                    color: "#241B10",
                    fontSize: 10,
                    fontWeight: 850,
                    transition: `width ${SPRING}, height ${SPRING}`,
                  }}
                >
                  SK
                </Avatar>

                <Box
                  sx={{
                    position: "absolute",
                    right: -1,
                    bottom: -1,
                    width: 9,
                    height: 9,
                    borderRadius: "50%",
                    backgroundColor: "#46B980",
                    border: "2px solid #201E1A",
                  }}
                />
              </Box>

              <Box
                sx={{
                  minWidth: 0,
                  overflow: "hidden",
                  opacity: expanded ? 1 : 0,
                  width: expanded ? "auto" : 0,
                  transform: expanded
                    ? "translate3d(0,0,0)"
                    : "translate3d(-6px,0,0)",
                  transition:
                    `opacity 160ms ease, transform ${SPRING}, width ${SPRING}`,
                }}
              >
                <Typography
                  noWrap
                  sx={{
                    fontSize: 10.8,
                    fontWeight: 650,
                    color: "#F4F2ED",
                    lineHeight: 1.25,
                  }}
                >
                  {merchant?.name}
                </Typography>

                <Typography
                  noWrap
                  sx={{
                    mt: 0.25,
                    fontSize: 9.5,
                    color: "rgba(255,255,255,0.35)",
                    lineHeight: 1.2,
                  }}
                >
                  {merchant?.city} · {merchant?.plan}
                </Typography>
              </Box>
            </Box>
          </Box>

          {/* LOGOUT */}

          <Box
            sx={{
              px: expanded ? 1.1 : 0.45,
              pb: expanded ? 1.5 : 0,
            }}
          >
            {withTooltip(
              "Logout",
              <ListItemButton
                disableRipple
                onClick={handleLogout}
                sx={{
                  minHeight: expanded ? 37 : 34,
                  px: expanded ? 1.15 : 0,
                  borderRadius: expanded ? "8px" : "10px",
                  justifyContent: expanded
                    ? "flex-start"
                    : "center",
                  color: "rgba(255,255,255,0.38)",
                  transition:
                    "background-color 180ms ease, color 180ms ease",

                  "&:hover": {
                    backgroundColor:
                      "rgba(255,255,255,0.045)",
                    color: "#E6A23C",
                  },
                }}
              >
                <ListItemIcon
                  sx={{
                    minWidth: expanded ? 31 : 0,
                    width: expanded ? "auto" : "100%",
                    justifyContent: expanded
                      ? "flex-start"
                      : "center",
                    color: "inherit",
                  }}
                >
                  <LogoutRounded
                    sx={{ fontSize: expanded ? 18 : 17 }}
                  />
                </ListItemIcon>

                <ListItemText
                  primary="Logout"
                  sx={{
                    my: 0,
                    overflow: "hidden",
                    opacity: expanded ? 1 : 0,
                    width: expanded ? "auto" : 0,
                    transform: expanded
                      ? "translate3d(0,0,0)"
                      : "translate3d(-6px,0,0)",
                    transition:
                      `opacity 160ms ease, transform ${SPRING}, width ${SPRING}`,
                  }}
                  slotProps={{
                    primary: {
                      sx: {
                        fontSize: 11.8,
                        fontWeight: 500,
                        whiteSpace: "nowrap",
                      },
                    },
                  }}
                />
              </ListItemButton>
            )}
          </Box>
        </Box>
      </Box>
    </Box>
  );
}

export default OwnerSidebar;
