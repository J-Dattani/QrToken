
import { useState } from "react";

import {
  AccessTimeRounded,
  ArrowForwardRounded,
  CardMembershipRounded,
  CurrencyRupeeRounded,
  DescriptionRounded,
  MoreVertRounded,
  SupportAgentRounded,
  StorefrontRounded,
  TrendingUpRounded,
  VerifiedUserRounded,
} from "@mui/icons-material";

import {
  Box,
  Button,
  // Chip,
  Divider,
  IconButton,
  Paper,
  Typography,
} from "@mui/material";

// Shared admin layout
import AdminSidebar from "./components/layout/AdminSidebar.jsx";
import AdminHeader from "./components/layout/AdminHeader.jsx";

// Admin section pages
import MerchantsPage from "./pages/merchants/MerchantsPage.jsx";
import VerificationPage from "./pages/verification/VerificationPage.jsx";
import TransactionsPage from "./pages/transactions/TransactionsPage.jsx";
import SubscriptionsPage from "./pages/subscriptions/SubscriptionsPage.jsx";
import SupportPage from "./pages/support/SupportPage.jsx";
import CompliancePage from "./pages/compliance/CompliancePage.jsx";
import SettingsPage from "./pages/settings/SettingsPage.jsx";

// --------------------------------------------------
// SECTION CONFIGURATION
// --------------------------------------------------

const sectionDescriptions = {
  Overview: "Monitor and manage your QRToken operations.",
  Merchants: "View and manage registered merchants.",
  Verification: "Review merchant verification requests.",
  Transactions: "Monitor platform transactions.",
  Subscriptions: "Manage plans and merchant subscriptions.",
  Support: "Review and manage support requests.",
  Compliance: "Review merchant KYC, GSTIN and FSSAI compliance.",
  Settings: "Configure platform preferences and administration.",
};

// --------------------------------------------------
// OVERVIEW METRICS
// --------------------------------------------------

const metrics = [
  {
    label: "Total Merchants",
    value: "—",
    note: "Awaiting API integration",
    icon: StorefrontRounded,
    color: "#765239",
    bg: "#F4E8DC",
  },
  {
    label: "Platform Revenue",
    value: "—",
    note: "Awaiting API integration",
    icon: CurrencyRupeeRounded,
    color: "#B17A0B",
    bg: "#FFF1D4",
  },
  {
    label: "Pending Verification",
    value: "—",
    note: "Awaiting API integration",
    icon: VerifiedUserRounded,
    color: "#C66B22",
    bg: "#FCEBDD",
  },
  {
    label: "Platform Growth",
    value: "—",
    note: "Awaiting API integration",
    icon: TrendingUpRounded,
    color: "#27805E",
    bg: "#E2F3EA",
  },
];

// --------------------------------------------------
// QUICK ACTIONS
// --------------------------------------------------

const quickActions = [
  {
    label: "View All Merchants",
    section: "Merchants",
    icon: StorefrontRounded,
  },
  {
    label: "Review Verifications",
    section: "Verification",
    icon: VerifiedUserRounded,
  },
  {
    label: "Manage Subscriptions",
    section: "Subscriptions",
    icon: CardMembershipRounded,
  },
  {
    label: "View Transactions",
    section: "Transactions",
    icon: DescriptionRounded,
  },
  {
    label: "Support Tickets",
    section: "Support",
    icon: SupportAgentRounded,
  },
  {
    label: "Compliance & Audit",
    section: "Compliance",
    icon: VerifiedUserRounded,
  },
];

// --------------------------------------------------
// EMPTY TABLE CONFIGURATION
// --------------------------------------------------

// --------------------------------------------------
// METRIC CARD
// --------------------------------------------------

function MetricCard({ metric }) {
  const Icon = metric.icon;

  return (
    <Paper
      elevation={0}
      sx={{
        p: 1.4,
        minWidth: 0,
        border: "1px solid #E5D8C8",
        borderRadius: "12px",
        bgcolor: "#FFFFFF",
      }}
    >
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          gap: 0.9,
        }}
      >
        <Box
          sx={{
            width: 32,
            height: 32,
            borderRadius: "9px",
            bgcolor: metric.bg,
            color: metric.color,
            display: "grid",
            placeItems: "center",
            flexShrink: 0,
          }}
        >
          <Icon sx={{ fontSize: 18 }} />
        </Box>

        <Typography
          sx={{
            flex: 1,
            minWidth: 0,
            color: "#796858",
            fontSize: 11.5,
            fontWeight: 600,
            lineHeight: 1.35,
          }}
        >
          {metric.label}
        </Typography>

        <IconButton
          size="small"
          aria-label={`${metric.label} options`}
          sx={{
            p: 0.2,
            color: "#998777",
          }}
        >
          <MoreVertRounded sx={{ fontSize: 16 }} />
        </IconButton>
      </Box>

      <Typography
        sx={{
          mt: 0.8,
          fontSize: 22,
          fontWeight: 700,
          lineHeight: 1.2,
          color: "#2D1F18",
        }}
      >
        {metric.value}
      </Typography>

      <Typography
        sx={{
          mt: 0.45,
          color: "#927E6C",
          fontSize: 10.5,
        }}
      >
        {metric.note}
      </Typography>
    </Paper>
  );
}

// --------------------------------------------------
// EMPTY TABLE
// --------------------------------------------------

function EmptyTable({ columns, section }) {
  return (
    <Box sx={{ overflowX: "auto" }}>
      <Box sx={{ minWidth: 0 }}>
        <Box
          sx={{
            display: "grid",
            gridTemplateColumns: `repeat(${columns.length}, minmax(0, 1fr))`,
            px: 1.4,
            py: 1,
            gap: 1,
            bgcolor: "#F8F4EF",
            borderTop: "1px solid #EFE5DB",
            borderBottom: "1px solid #EFE5DB",
          }}
        >
          {columns.map((column) => (
            <Typography
              key={column}
              sx={{
                fontSize: 10.5,
                fontWeight: 700,
                color: "#806D5C",
                overflow: "hidden",
                textOverflow: "ellipsis",
                whiteSpace: "nowrap",
              }}
            >
              {column}
            </Typography>
          ))}
        </Box>

        <Box
          sx={{
            minHeight: 88,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            gap: 0.5,
            px: 1.5,
            py: 1.5,
            textAlign: "center",
          }}
        >
          <DescriptionRounded
            sx={{
              color: "#B7A594",
              fontSize: 21,
            }}
          />

          <Typography sx={{ fontSize: 12, fontWeight: 700 }}>
            No {section.toLowerCase()} data available yet
          </Typography>

          <Typography
            sx={{
              fontSize: 10.5,
              color: "#927E6C",
            }}
          >
            Records will appear when the relevant API is connected.
          </Typography>
        </Box>
      </Box>
    </Box>
  );
}

// --------------------------------------------------
// OVERVIEW DASHBOARD
// --------------------------------------------------

function OverviewPage({ setActiveSection }) {
  return (
    <Box sx={{ minWidth: 0 }}>
      {/* Metrics */}
      <Box
        sx={{
          display: "grid",
          gridTemplateColumns: {
            xs: "repeat(2, minmax(0, 1fr))",
            md: "repeat(4, minmax(0, 1fr))",
          },
          gap: 1.2,
          mb: 1.5,
        }}
      >
        {metrics.map((metric) => (
          <MetricCard key={metric.label} metric={metric} />
        ))}
      </Box>

      {/* Dashboard content */}
      <Box
        sx={{
          display: "grid",
          gridTemplateColumns: {
            xs: "minmax(0, 1fr)",
            lg: "minmax(0, 1.65fr) minmax(245px, 0.85fr)",
          },
          gap: 1.4,
          alignItems: "start",
        }}
      >
        {/* Recent activity */}
        <Paper
          elevation={0}
          sx={{
            minWidth: 0,
            border: "1px solid #E5D8C8",
            borderRadius: "12px",
            bgcolor: "#FFFFFF",
            overflow: "hidden",
          }}
        >
          <Box
            sx={{
              px: 1.5,
              py: 1.2,
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              gap: 1,
            }}
          >
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                gap: 0.9,
              }}
            >
              <AccessTimeRounded
                sx={{
                  color: "#8A6548",
                  fontSize: 19,
                }}
              />

              <Box>
                <Typography sx={{ fontSize: 13, fontWeight: 700 }}>
                  Recent platform activity
                </Typography>

                <Typography
                  sx={{
                    fontSize: 10.5,
                    color: "#927E6C",
                  }}
                >
                  Merchant updates and platform events
                </Typography>
              </Box>
            </Box>

            <Button
              size="small"
              endIcon={<ArrowForwardRounded />}
              onClick={() => setActiveSection("Merchants")}
              sx={{
                color: "#765239",
                fontSize: 10.5,
                minWidth: 0,
                whiteSpace: "nowrap",
                textTransform: "none",
              }}
            >
              View all
            </Button>
          </Box>

          <Divider sx={{ borderColor: "#EFE5DB" }} />

          <EmptyTable
            columns={["Merchant", "Activity", "Status", "Time"]}
            section="platform activity"
          />
        </Paper>

        {/* Right column */}
        <Box
          sx={{
            minWidth: 0,
            display: "flex",
            flexDirection: "column",
            gap: 1.4,
          }}
        >
          {/* Quick management */}
          <Paper
            elevation={0}
            sx={{
              p: 1.4,
              border: "1px solid #E5D8C8",
              borderRadius: "12px",
              bgcolor: "#FFFFFF",
            }}
          >
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                gap: 0.9,
              }}
            >
              <TrendingUpRounded
                sx={{
                  color: "#8A6548",
                  fontSize: 20,
                }}
              />

              <Box>
                <Typography sx={{ fontSize: 13, fontWeight: 700 }}>
                  Quick management
                </Typography>

                <Typography
                  sx={{
                    fontSize: 10.5,
                    color: "#927E6C",
                  }}
                >
                  Common platform actions
                </Typography>
              </Box>
            </Box>

            <Box
              sx={{
                mt: 1.1,
                display: "flex",
                flexDirection: "column",
                gap: 0.6,
              }}
            >
              {quickActions.map(({ label, section, icon: Icon }) => (
                <Button
                  key={section}
                  onClick={() => setActiveSection(section)}
                  fullWidth
                  endIcon={<ArrowForwardRounded sx={{ fontSize: 16 }} />}
                  sx={{
                    justifyContent: "flex-start",
                    gap: 0.7,
                    px: 1,
                    py: 0.6,
                    minHeight: 35,
                    border: "1px solid #EEE3D8",
                    borderRadius: "9px",
                    color: "#49382B",
                    bgcolor: "#FCFAF7",
                    fontSize: 10.5,
                    fontWeight: 600,
                    whiteSpace: "nowrap",
                    textTransform: "none",
                    "& .MuiButton-endIcon": {
                      ml: "auto",
                    },
                    "&:hover": {
                      bgcolor: "#F6EEE4",
                    },
                  }}
                >
                  <Icon
                    sx={{
                      fontSize: 17,
                      color: "#8A6548",
                    }}
                  />

                  {label}
                </Button>
              ))}
            </Box>
          </Paper>

          {/* Platform insights */}
          <Paper
            elevation={0}
            sx={{
              p: 1.4,
              border: "1px solid #E5D8C8",
              borderRadius: "12px",
              bgcolor: "#FFFFFF",
            }}
          >
            <Typography sx={{ fontSize: 13, fontWeight: 700 }}>
              Platform insights
            </Typography>

            <Typography
              sx={{
                mt: 0.3,
                fontSize: 10.5,
                color: "#927E6C",
              }}
            >
              Available after analytics integration.
            </Typography>

            <Box
              sx={{
                mt: 1,
                display: "grid",
                gridTemplateColumns: "repeat(2, minmax(0, 1fr))",
                gap: 0.8,
              }}
            >
              {[
                "New merchants",
                "Total orders",
                "Revenue",
                "Active merchants",
              ].map((label) => (
                <Box
                  key={label}
                  sx={{
                    p: 0.9,
                    bgcolor: "#F8F4EF",
                    borderRadius: "8px",
                  }}
                >
                  <Typography
                    sx={{
                      fontSize: 10,
                      color: "#806D5C",
                    }}
                  >
                    {label}
                  </Typography>

                  <Typography
                    sx={{
                      mt: 0.2,
                      fontSize: 17,
                      fontWeight: 700,
                    }}
                  >
                    —
                  </Typography>
                </Box>
              ))}
            </Box>
          </Paper>
        </Box>
      </Box>
    </Box>
  );
}

// --------------------------------------------------
// ADMIN PAGE
// --------------------------------------------------

export default function AdminPage() {
  const [activeSection, setActiveSection] = useState("Overview");

  const isOverview = activeSection === "Overview";
  const title = isOverview ? "Platform Overview" : activeSection;

  const ActivePages = {
    Merchants: MerchantsPage,
    Verification: VerificationPage,
    Transactions: TransactionsPage,
    Subscriptions: SubscriptionsPage,
    Support: SupportPage,
    Compliance: CompliancePage,
    Settings: SettingsPage,
  };

  const ActivePage = ActivePages[activeSection];

  return (
    <Box
      sx={{
        display: "flex",
        width: "100%",
        height: "100dvh",
        overflow: "hidden",
        bgcolor: "#F7F3ED",
        color: "#241F1A",
        fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
      }}
    >
      {/* Sidebar */}
      <AdminSidebar
        activeSection={activeSection}
        onSectionChange={setActiveSection}
      />

      {/* Main content */}
      <Box
        component="main"
        sx={{
          flex: "1 1 0",
          minWidth: 0,
          height: "100%",
          display: "flex",
          flexDirection: "column",
          overflow: "hidden",
        }}
      >
        {/* Header */}
        <AdminHeader
          title={title}
          subtitle={sectionDescriptions[activeSection]}
        />

        {/* Section content */}
        <Box
          sx={{
            flex: 1,
            minHeight: 0,
            minWidth: 0,
            overflowY: "auto",
            overflowX: "hidden",
            p: { xs: 1.5, md: 2 },
            bgcolor: "#F7F3ED",
          }}
        >
          {isOverview ? (
            <OverviewPage setActiveSection={setActiveSection} />
          ) : ActivePage ? (
            <ActivePage />
          ) : (
            <Paper
              elevation={0}
              sx={{
                p: 2,
                border: "1px solid #E5D8C8",
                borderRadius: "12px",
                bgcolor: "#FFFFFF",
              }}
            >
              <Typography sx={{ fontSize: 13, fontWeight: 700 }}>
                {activeSection}
              </Typography>

              <Typography
                sx={{
                  mt: 0.5,
                  fontSize: 11,
                  color: "#927E6C",
                }}
              >
                This section is not available.
              </Typography>
            </Paper>
          )}
        </Box>
      </Box>
    </Box>
  );
}
