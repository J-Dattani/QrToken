import {
  Avatar,
  Box,
  Divider,
  List,
  ListItemButton,
  ListItemIcon,
  ListItemText,
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
  LogoutRounded,
  FiberManualRecordRounded,
} from "@mui/icons-material";

import { NavLink } from "react-router-dom";

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

function OwnerSidebar() {
  return (
    <Box
      component="aside"
      sx={{
        width: 224,
        height: "100vh",
        flexShrink: 0,
        display: { xs: "none", lg: "flex" },
        flexDirection: "column",

        background:
          "linear-gradient(180deg, #201E1A 0%, #181714 100%)",

        color: "#fff",

        borderRight: "1px solid rgba(255,255,255,0.055)",
      }}
    >
      {/* =====================================================
          INDEPENDENT SIDEBAR SCROLL
          ===================================================== */}

      <Box
        sx={{
          height: "100%",
          minHeight: 0,
          overflowY: "auto",
          overflowX: "hidden",

          "&::-webkit-scrollbar": {
            width: 4,
          },

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
        {/* =====================================================
            BRAND
            ===================================================== */}

        <Box
          sx={{
            px: 1.75,
            pt: 1.75,
          }}
        >
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              gap: 1.15,
              px: 0.5,
              pb: 1.6,
            }}
          >
            {/* Brand mark */}
            <Box
              sx={{
                width: 36,
                height: 36,
                borderRadius: "10px",

                display: "grid",
                placeItems: "center",

                background:
                  "linear-gradient(145deg, #F0B04D, #D88D22)",

                color: "#211A11",

                fontSize: 16,
                fontWeight: 900,

                boxShadow:
                  "0 5px 18px rgba(230,162,60,0.16)",
              }}
            >
              Q
            </Box>

            <Box sx={{ minWidth: 0 }}>
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
                  sx={{
                    color: "#E6A23C",
                  }}
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
            }}
          />
        </Box>

        {/* =====================================================
            NAVIGATION
            ===================================================== */}

        <Box
          component="nav"
          sx={{
            px: 1.1,
            py: 1.5,
          }}
        >
          {navigation.map((group, groupIndex) => (
            <Box
              key={group.section}
              sx={{
                mb:
                  groupIndex === navigation.length - 1
                    ? 0
                    : 1.8,
              }}
            >
              {/* Section title */}
              <Typography
                sx={{
                  px: 1.15,
                  mb: 0.65,

                  fontSize: 9,
                  fontWeight: 750,
                  letterSpacing: "0.16em",

                  color:
                    "rgba(255,255,255,0.28)",
                }}
              >
                {group.section}
              </Typography>

              <List disablePadding>
                {group.items.map((item) => {
                  const Icon = item.icon;

                  return (
                    <NavLink
                      key={item.label}
                      to={item.path}
                      style={{
                        textDecoration: "none",
                        color: "inherit",
                        display: "block",
                      }}
                    >
                      {({ isActive }) => (
                        <ListItemButton
                          disableRipple
                          selected={isActive}
                          sx={{
                            position: "relative",

                            minHeight: 38,

                            px: 1.15,
                            py: 0.45,
                            mb: 0.3,

                            borderRadius: "8px",

                            color: isActive
                              ? "#F7F5F0"
                              : "rgba(255,255,255,0.58)",

                            backgroundColor:
                              isActive
                                ? "rgba(230,162,60,0.105)"
                                : "transparent",

                            transition:
                              "all 140ms ease",

                            "&:hover": {
                              backgroundColor:
                                isActive
                                  ? "rgba(230,162,60,0.13)"
                                  : "rgba(255,255,255,0.045)",

                              color: "#fff",
                            },

                            "&.Mui-selected": {
                              backgroundColor:
                                "rgba(230,162,60,0.105)",
                            },

                            "&.Mui-selected:hover": {
                              backgroundColor:
                                "rgba(230,162,60,0.14)",
                            },

                            // active indicator
                            "&::before": {
                              content: '""',

                              position: "absolute",
                              left: 0,
                              top: 8,
                              bottom: 8,

                              width: isActive ? 2 : 0,

                              backgroundColor:
                                "#E6A23C",

                              borderRadius:
                                "0 3px 3px 0",

                              transition:
                                "width 140ms ease",
                            },
                          }}
                        >
                          <ListItemIcon
                            sx={{
                              minWidth: 31,

                              color: isActive
                                ? "#E6A23C"
                                : "rgba(255,255,255,0.42)",

                              transition:
                                "color 140ms ease",
                            }}
                          >
                            <Icon
                              sx={{
                                fontSize: 18,
                              }}
                            />
                          </ListItemIcon>

                          <ListItemText
                            primary={item.label}
                            sx={{
                              my: 0,
                            }}
                            primaryTypographyProps={{
                              fontSize: 11.8,
                              fontWeight: isActive
                                ? 650
                                : 500,
                              letterSpacing:
                                "-0.005em",
                              noWrap: true,
                            }}
                          />

                          {item.badge && (
                            <Box
                              sx={{
                                display: "flex",
                                alignItems: "center",
                                gap: 0.35,

                                px: 0.7,
                                py: 0.25,

                                borderRadius: "5px",

                                backgroundColor:
                                  "rgba(230,162,60,0.14)",

                                border:
                                  "1px solid rgba(230,162,60,0.18)",
                              }}
                            >
                              <FiberManualRecordRounded
                                sx={{
                                  fontSize: 6,
                                  color: "#E6A23C",
                                }}
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
                      )}
                    </NavLink>
                  );
                })}
              </List>
            </Box>
          ))}

          {/* =================================================
              SETTINGS — separated from catalog
              ================================================= */}

          <Divider
            sx={{
              my: 1.25,
              mx: 0.75,
              borderColor:
                "rgba(255,255,255,0.065)",
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
            {({ isActive }) => (
              <ListItemButton
                disableRipple
                selected={isActive}
                sx={{
                  minHeight: 38,

                  px: 1.15,
                  py: 0.45,

                  borderRadius: "8px",

                  color: isActive
                    ? "#fff"
                    : "rgba(255,255,255,0.55)",

                  backgroundColor: isActive
                    ? "rgba(230,162,60,0.105)"
                    : "transparent",

                  "&:hover": {
                    backgroundColor:
                      "rgba(255,255,255,0.045)",
                    color: "#fff",
                  },

                  "&.Mui-selected": {
                    backgroundColor:
                      "rgba(230,162,60,0.105)",
                  },
                }}
              >
                <ListItemIcon
                  sx={{
                    minWidth: 31,
                    color: isActive
                      ? "#E6A23C"
                      : "rgba(255,255,255,0.42)",
                  }}
                >
                  <SettingsRounded
                    sx={{ fontSize: 18 }}
                  />
                </ListItemIcon>

                <ListItemText
                  primary="Settings"
                  sx={{ my: 0 }}
                  primaryTypographyProps={{
                    fontSize: 11.8,
                    fontWeight: isActive
                      ? 650
                      : 500,
                  }}
                />
              </ListItemButton>
            )}
          </NavLink>
        </Box>

        {/* =====================================================
            FLEX SPACE
            ===================================================== */}

        <Box sx={{ minHeight: 20 }} />

        {/* =====================================================
            MERCHANT CARD
            ===================================================== */}

        <Box
          sx={{
            mx: 1.1,
            mb: 0.8,
            p: 1.15,

            borderRadius: "11px",

            background:
              "linear-gradient(135deg, rgba(255,255,255,0.055), rgba(255,255,255,0.025))",

            border:
              "1px solid rgba(255,255,255,0.065)",
          }}
        >
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              gap: 1,
            }}
          >
            <Box sx={{ position: "relative" }}>
              <Avatar
                sx={{
                  width: 32,
                  height: 32,

                  bgcolor: "#E6A23C",
                  color: "#241B10",

                  fontSize: 10,
                  fontWeight: 850,
                }}
              >
                SK
              </Avatar>

              {/* Online dot */}
              <Box
                sx={{
                  position: "absolute",
                  right: -1,
                  bottom: -1,

                  width: 9,
                  height: 9,

                  borderRadius: "50%",

                  backgroundColor: "#46B980",

                  border:
                    "2px solid #201E1A",
                }}
              />
            </Box>

            <Box sx={{ minWidth: 0 }}>
              <Typography
                noWrap
                sx={{
                  fontSize: 10.8,
                  fontWeight: 650,
                  color: "#F4F2ED",
                  lineHeight: 1.25,
                }}
              >
                Shree Krishna Tea Stall
              </Typography>

              <Typography
                noWrap
                sx={{
                  mt: 0.25,
                  fontSize: 9.5,
                  color:
                    "rgba(255,255,255,0.35)",
                  lineHeight: 1.2,
                }}
              >
                Rajkot, Gujarat · Starter
              </Typography>
            </Box>
          </Box>
        </Box>

        {/* =====================================================
            LOGOUT
            ===================================================== */}

        <Box
          sx={{
            px: 1.1,
            pb: 1.5,
          }}
        >
          <ListItemButton
            disableRipple
            onClick={() => {
              // Logout logic later
            }}
            sx={{
              minHeight: 37,

              px: 1.15,

              borderRadius: "8px",

              color:
                "rgba(255,255,255,0.38)",

              "&:hover": {
                backgroundColor:
                  "rgba(255,255,255,0.045)",
                color: "#E6A23C",
              },
            }}
          >
            <ListItemIcon
              sx={{
                minWidth: 31,
                color: "inherit",
              }}
            >
              <LogoutRounded
                sx={{ fontSize: 18 }}
              />
            </ListItemIcon>

            <ListItemText
              primary="Logout"
              sx={{ my: 0 }}
              primaryTypographyProps={{
                fontSize: 11.8,
                fontWeight: 500,
              }}
            />
          </ListItemButton>
        </Box>
      </Box>
    </Box>
  );
}

export default OwnerSidebar;