
import { useMemo, useState } from "react";

import {
  DownloadRounded,
  GppGoodRounded,
  VerifiedUserRounded,
  WarningAmberRounded,
  HistoryRounded,
  AccountBalanceRounded,
  SecurityRounded,

} from "@mui/icons-material";

import {
  Box,
  Button,
  Chip,
  Divider,
  Paper,
  Typography,
} from "@mui/material";

const colors = {
  ink: "#29231E",
  muted: "#887767",
  border: "#E9DCCF",
  gold: "#E6A23C",
  cream: "#F8F3ED",
  green: "#18794E",
  greenBg: "#E4F4EC",
  red: "#B93832",
  redBg: "#FCE8E6",
  amber: "#9A6509",
  amberBg: "#FFF1D6",
};

const initialMerchants = [
  {
    id: "COMP-001",
    name: "Starbucks",
    slug: "/starbucks-1793275552546",
    city: "Rajkot",
    kyc: "Pending",
    gstin: "Not Entered",
    fssai: "Not Entered",
    status: "Pending",
  },
  {
    id: "COMP-002",
    name: "tea culture",
    slug: "/tea-culture-1787745299124",
    city: "Vadodara",
    kyc: "Approved",
    gstin: "Not Entered",
    fssai: "Not Entered",
    status: "Active",
  },
  {
    id: "COMP-003",
    name: "zokia",
    slug: "/zokia-1787226028336",
    city: "Mumbai",
    kyc: "Approved",
    gstin: "Not Entered",
    fssai: "Not Entered",
    status: "Suspended",
  },
  {
    id: "COMP-004",
    name: "sss",
    slug: "/sss-1784904220827",
    city: "Rajkot",
    kyc: "Approved",
    gstin: "Not Entered",
    fssai: "Not Entered",
    status: "Suspended",
  },
  {
    id: "COMP-005",
    name: "Chai Point - GTU",
    slug: "/chai-point---gtu-1784897436705",
    city: "Ahmedabad",
    kyc: "Approved",
    gstin: "Not Entered",
    fssai: "Not Entered",
    status: "Active",
  },
  {
    id: "COMP-006",
    name: "Shree Krishna Tea Stall",
    slug: "/shree-krishna-tea-stall",
    city: "Rajkot, Gujarat",
    kyc: "Approved",
    gstin: "24AAAAA1234A1Z5",
    fssai: "10019021000123",
    status: "Active",
  },
];

// Frontend demonstration audit records.
// Replace these with actual audit API data when available.
const auditLogs = [
  {
    date: "28/10/2026",
    time: "5:08:27 pm",
    admin: "Super Admin",
    action: "KYC_APPROVED",
    target: "Merchant",
    description: "KYC set to approved, store status is suspended",
  },
  {
    date: "28/10/2026",
    time: "5:08:15 pm",
    admin: "Super Admin",
    action: "KYC_APPROVED",
    target: "Merchant",
    description: "KYC set to approved, store status is active",
  },
  {
    date: "28/10/2026",
    time: "5:07:39 pm",
    admin: "Super Admin",
    action: "PLAN_UPDATE",
    target: "Merchant",
    description: "Plan changed to free",
  },
  {
    date: "28/10/2026",
    time: "5:07:36 pm",
    admin: "Super Admin",
    action: "PLAN_UPDATE",
    target: "Merchant",
    description: "Plan changed to pro",
  },
  {
    date: "28/10/2026",
    time: "5:07:36 pm",
    admin: "Super Admin",
    action: "PLAN_UPDATE",
    target: "Merchant",
    description: "Plan changed to growth",
  },
  {
    date: "28/10/2026",
    time: "5:07:36 pm",
    admin: "Super Admin",
    action: "PLAN_UPDATE",
    target: "Merchant",
    description: "Plan changed to starter",
  },
  {
    date: "26/10/2026",
    time: "5:43:49 pm",
    admin: "Super Admin",
    action: "PLAN_UPDATE",
    target: "Merchant",
    description: "Plan changed to free",
  },
  {
    date: "26/10/2026",
    time: "5:43:34 pm",
    admin: "Super Admin",
    action: "PLAN_UPDATE",
    target: "Merchant",
    description: "Plan changed to growth",
  },
  {
    date: "26/10/2026",
    time: "5:43:23 pm",
    admin: "Super Admin",
    action: "KYC_APPROVED",
    target: "Merchant",
    description: "KYC set to approved, store status is active",
  },
  {
    date: "20/10/2026",
    time: "5:21:52 pm",
    admin: "Super Admin",
    action: "KYC_APPROVED",
    target: "Merchant",
    description: "KYC set to approved, store status is suspended",
  },
  {
    date: "20/10/2026",
    time: "5:16:46 pm",
    admin: "Super Admin",
    action: "PLAN_UPDATE",
    target: "Merchant",
    description: "Plan changed to growth",
  },
  {
    date: "20/10/2026",
    time: "5:12:24 pm",
    admin: "Super Admin",
    action: "KYC_APPROVED",
    target: "Merchant",
    description: "KYC set to approved, store status is active",
  },
];

// These are illustrative notices, not a live regulatory feed.
const regulatoryNotices = [
  {
    title: "NPCI Circular 2026-08: QR code standardization",
    date: "12 Jul 2026",
    category: "UPI",
  },
  {
    title: "RBI Master Direction — Payment Aggregators (Amendment)",
    date: "05 Jul 2026",
    category: "RBI",
  },
  {
    title: "DPDP Act implementation guidelines",
    date: "01 Jun 2026",
    category: "Privacy",
  },
];

function SectionHeading({ icon: Icon, title, subtitle, action }) {
  return (
    <Box
      sx={{
        px: 1.7,
        py: 1.4,
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        gap: 1,
        flexWrap: "wrap",
      }}
    >
      <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
        {Icon && (
          <Box
            sx={{
              width: 33,
              height: 33,
              display: "grid",
              placeItems: "center",
              borderRadius: "10px",
              bgcolor: "#F4E8DC",
              color: colors.ink,
              flexShrink: 0,
            }}
          >
            <Icon sx={{ fontSize: 18 }} />
          </Box>
        )}

        <Box>
          <Typography sx={{ fontSize: 13, fontWeight: 800 }}>
            {title}
          </Typography>
          {subtitle && (
            <Typography
              sx={{ mt: 0.25, fontSize: 10.5, color: colors.muted }}
            >
              {subtitle}
            </Typography>
          )}
        </Box>
      </Box>

      {action}
    </Box>
  );
}

function SummaryCard({ label, value, note, icon: Icon, color, bg }) {
  return (
    <Paper
      elevation={0}
      sx={{
        p: 1.5,
        minWidth: 0,
        border: `1px solid ${colors.border}`,
        borderRadius: "13px",
        bgcolor: "#FFFFFF",
        position: "relative",
        overflow: "hidden",
        "&::before": {
          content: '""',
          position: "absolute",
          top: 0,
          left: 0,
          width: "100%",
          height: "3px",
          bgcolor: color,
        },
      }}
    >
      <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
        <Box
          sx={{
            width: 34,
            height: 34,
            display: "grid",
            placeItems: "center",
            borderRadius: "10px",
            bgcolor: bg,
            color,
            flexShrink: 0,
          }}
        >
          <Icon sx={{ fontSize: 19 }} />
        </Box>

        <Typography
          sx={{
            fontSize: 10,
            fontWeight: 800,
            color: colors.muted,
            letterSpacing: "0.45px",
            textTransform: "uppercase",
          }}
        >
          {label}
        </Typography>
      </Box>

      <Typography
        sx={{
          mt: 0.9,
          fontSize: 23,
          lineHeight: 1.1,
          fontWeight: 850,
          color: colors.ink,
          fontVariantNumeric: "tabular-nums",
        }}
      >
        {value}
      </Typography>

      <Typography sx={{ mt: 0.5, fontSize: 10, color: colors.muted }}>
        {note}
      </Typography>
    </Paper>
  );
}

function StatusChip({ label }) {
  const styles = {
    Active: { bg: colors.greenBg, color: colors.green },
    Suspended: { bg: colors.redBg, color: colors.red },
    Approved: { bg: colors.greenBg, color: colors.green },
    Pending: { bg: colors.amberBg, color: colors.amber },
  };

  const style = styles[label] || styles.Pending;

  const displayLabel =
    label === "Approved"
      ? "✓ Approved"
      : label === "Pending"
        ? "⌛ Pending"
        : label.toUpperCase();

  return (
    <Chip
      label={displayLabel}
      size="small"
      sx={{
        height: 22,
        bgcolor: style.bg,
        color: style.color,
        fontSize: 9.5,
        fontWeight: 800,
        borderRadius: "7px",
        "& .MuiChip-label": { px: 1 },
      }}
    />
  );
}

function ActionChip({ action }) {
  const isKyc = action === "KYC_APPROVED";

  return (
    <Chip
      label={action}
      size="small"
      sx={{
        height: 21,
        bgcolor: isKyc ? "#E1F1EB" : "#FFF0D2",
        color: isKyc ? "#187D67" : "#B4770C",
        fontSize: 9,
        fontWeight: 800,
        borderRadius: "7px",
        "& .MuiChip-label": { px: 0.9 },
      }}
    />
  );
}

export default function CompliancePage() {
  const [merchants] = useState(initialMerchants);

  const summary = useMemo(() => {
    const verified = merchants.filter(
      (merchant) => merchant.kyc === "Approved"
    ).length;

    const needsAction = merchants.filter(
      (merchant) =>
        merchant.kyc === "Pending" ||
        merchant.gstin === "Not Entered" ||
        merchant.fssai === "Not Entered"
    ).length;

    return {
      total: merchants.length,
      verified,
      needsAction,
      rate: merchants.length
        ? Math.round((verified / merchants.length) * 100)
        : 0,
    };
  }, [merchants]);

  const exportAuditReport = () => {
    const headers = [
      "Record Type",
      "Merchant ID",
      "Merchant Outlet",
      "Storefront",
      "City",
      "KYC Verification",
      "GSTIN Tax ID",
      "FSSAI Food License",
      "Merchant Status",
      "Timestamp",
      "Administrator",
      "Action",
      "Target Type",
      "Log Description",
    ];

    const escapeCsv = (value) =>
      `"${String(value ?? "").replace(/"/g, '""')}"`;

    const merchantRows = merchants.map((merchant) => [
      "Merchant Compliance",
      merchant.id,
      merchant.name,
      merchant.slug,
      merchant.city,
      merchant.kyc,
      merchant.gstin,
      merchant.fssai,
      merchant.status,
      "",
      "",
      "",
      "",
      "",
    ]);

    const auditRows = auditLogs.map((log) => [
      "Platform Audit",
      "",
      "",
      "",
      "",
      "",
      "",
      "",
      "",
      `${log.date} ${log.time}`,
      log.admin,
      log.action,
      log.target,
      log.description,
    ]);

    const csv = [headers, ...merchantRows, ...auditRows]
      .map((row) => row.map(escapeCsv).join(","))
      .join("\r\n");

    const blob = new Blob(["\uFEFF" + csv], {
      type: "text/csv;charset=utf-8;",
    });

    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");

    link.href = url;
    link.download = "qrtoken-compliance-audit.csv";

    document.body.appendChild(link);
    link.click();
    link.remove();

    URL.revokeObjectURL(url);
  };

  return (
    <Box sx={{ minWidth: 0, color: colors.ink }}>
      {/* TOP ACTION BAR */}
      <Box
        sx={{
          display: "flex",
          justifyContent: "flex-end",
          alignItems: "center",
          mb: 1.5,
        }}
      >
        <Button
          variant="contained"
          startIcon={<DownloadRounded sx={{ fontSize: 16 }} />}
          onClick={exportAuditReport}
          sx={{
            bgcolor: "#292621",
            color: "#FFFFFF",
            borderRadius: "9px",
            px: 1.6,
            py: 0.8,
            fontSize: 10.5,
            fontWeight: 750,
            textTransform: "none",
            boxShadow: "0 3px 8px rgba(41,38,33,0.12)",
            "&:hover": {
              bgcolor: "#40382D",
              boxShadow: "0 4px 10px rgba(41,38,33,0.16)",
            },
          }}
        >
          Export Audit Report
        </Button>
      </Box>

      {/* COMPLIANCE SUMMARY */}
      <Box
        sx={{
          display: "grid",
          gridTemplateColumns: {
            xs: "repeat(2, minmax(0, 1fr))",
            lg: "repeat(3, minmax(0, 1fr))",
          },
          gap: 1.2,
          mb: 1.7,
        }}
      >
        <SummaryCard
          label="Merchants tracked"
          value={summary.total}
          note="Registered platform outlets"
          icon={GppGoodRounded}
          color="#B17A0B"
          bg="#FFF1D4"
        />

        <SummaryCard
          label="KYC verified"
          value={summary.verified}
          note={`${summary.rate}% compliance rate`}
          icon={VerifiedUserRounded}
          color={colors.green}
          bg={colors.greenBg}
        />

        <SummaryCard
          label="Needs action"
          value={summary.needsAction}
          note="Pending KYC or missing documents"
          icon={WarningAmberRounded}
          color={colors.red}
          bg={colors.redBg}
        />
      </Box>

      {/* MERCHANT REGULATORY LEDGER */}
      <Paper
        elevation={0}
        sx={{
          mb: 1.7,
          border: `1px solid ${colors.border}`,
          borderRadius: "13px",
          bgcolor: "#FFFFFF",
          overflow: "hidden",
        }}
      >
        <SectionHeading
          icon={SecurityRounded}
          title="Merchant Regulatory Ledger"
          subtitle="KYC verification, GSTIN and FSSAI document tracking"
        />

        <Divider sx={{ borderColor: "#F0E7DE" }} />

        <Box sx={{ width: "100%", overflowX: "auto" }}>
          <Box sx={{ minWidth: 800 }}>
            <Box
              sx={{
                display: "grid",
                gridTemplateColumns:
                  "minmax(220px, 1.7fr) minmax(125px, 1fr) minmax(125px, 1fr) minmax(145px, 1fr) 100px",
                gap: 1,
                px: 1.7,
                py: 1.1,
                bgcolor: "#F8F4EF",
                borderBottom: `1px solid ${colors.border}`,
              }}
            >
              {[
                "Merchant outlet",
                "KYC verification",
                "GSTIN tax ID",
                "FSSAI food license",
                "Status",
              ].map((heading) => (
                <Typography
                  key={heading}
                  sx={{
                    fontSize: 9.5,
                    fontWeight: 850,
                    color: colors.muted,
                    textTransform: "uppercase",
                    letterSpacing: "0.45px",
                  }}
                >
                  {heading}
                </Typography>
              ))}
            </Box>

            {merchants.map((merchant, index) => (
              <Box
                key={merchant.id}
                sx={{
                  display: "grid",
                  gridTemplateColumns:
                    "minmax(220px, 1.7fr) minmax(125px, 1fr) minmax(125px, 1fr) minmax(145px, 1fr) 100px",
                  gap: 1,
                  alignItems: "center",
                  px: 1.7,
                  py: 1.15,
                  borderBottom:
                    index === merchants.length - 1
                      ? 0
                      : "1px solid #F0E7DE",
                  "&:hover": { bgcolor: "#FCFAF7" },
                }}
              >
                <Box sx={{ minWidth: 0 }}>
                  <Typography
                    sx={{
                      fontSize: 11.5,
                      fontWeight: 800,
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                      whiteSpace: "nowrap",
                    }}
                  >
                    {merchant.name}
                  </Typography>

                  <Typography
                    sx={{
                      mt: 0.25,
                      fontSize: 9.5,
                      color: colors.muted,
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                      whiteSpace: "nowrap",
                    }}
                  >
                    {merchant.slug} · {merchant.city}
                  </Typography>
                </Box>

                <Box>
                  <StatusChip label={merchant.kyc} />
                </Box>

                <Typography
                  sx={{
                    fontSize: 10,
                    color:
                      merchant.gstin === "Not Entered"
                        ? colors.muted
                        : colors.ink,
                    fontFamily: "monospace",
                    whiteSpace: "nowrap",
                  }}
                >
                  {merchant.gstin}
                </Typography>

                <Typography
                  sx={{
                    fontSize: 10,
                    color:
                      merchant.fssai === "Not Entered"
                        ? colors.muted
                        : colors.ink,
                    fontFamily: "monospace",
                    whiteSpace: "nowrap",
                  }}
                >
                  {merchant.fssai}
                </Typography>

                <Box>
                  <StatusChip label={merchant.status} />
                </Box>
              </Box>
            ))}
          </Box>
        </Box>

        <Box
          sx={{
            px: 1.7,
            py: 1,
            borderTop: `1px solid ${colors.border}`,
            bgcolor: "#FCFAF7",
            display: "flex",
            justifyContent: "space-between",
            gap: 1,
            flexWrap: "wrap",
          }}
        >
          <Typography sx={{ fontSize: 10, color: colors.muted }}>
            Frontend preview · Sample merchant records
          </Typography>

          <Typography sx={{ fontSize: 10, color: colors.muted }}>
            Showing {merchants.length} records
          </Typography>
        </Box>
      </Paper>

      {/* PLATFORM AUDIT TRAIL */}
      <Paper
        elevation={0}
        sx={{
          mb: 1.7,
          border: `1px solid ${colors.border}`,
          borderRadius: "13px",
          bgcolor: "#FFFFFF",
          overflow: "hidden",
        }}
      >
        <SectionHeading
          icon={HistoryRounded}
          title="Platform Audit Trail"
          subtitle="Administrative activity and historical platform changes"
        />

        <Divider sx={{ borderColor: "#F0E7DE" }} />

        <Box sx={{ width: "100%", overflowX: "auto" }}>
          <Box sx={{ minWidth: 760 }}>
            <Box
              sx={{
                display: "grid",
                gridTemplateColumns:
                  "150px 105px 125px 95px minmax(250px, 1fr)",
                alignItems: "center",
                gap: 1,
                px: 1.7,
                py: 1,
                bgcolor: "#F8F4EF",
                borderBottom: `1px solid ${colors.border}`,
              }}
            >
              {[
                "Timestamp",
                "Administrator",
                "Action",
                "Target type",
                "Log description",
              ].map((heading) => (
                <Typography
                  key={heading}
                  sx={{
                    fontSize: 9,
                    fontWeight: 850,
                    color: colors.muted,
                    textTransform: "uppercase",
                    letterSpacing: "0.35px",
                  }}
                >
                  {heading}
                </Typography>
              ))}
            </Box>

            {auditLogs.map((log, index) => (
              <Box
                key={`${log.date}-${log.time}-${index}`}
                sx={{
                  display: "grid",
                  gridTemplateColumns:
                    "150px 105px 125px 95px minmax(250px, 1fr)",
                  alignItems: "center",
                  gap: 1,
                  px: 1.7,
                  py: 1,
                  borderBottom:
                    index === auditLogs.length - 1
                      ? 0
                      : "1px solid #F3ECE5",
                  "&:nth-of-type(even)": {
                    bgcolor: "#FEFDFC",
                  },
                  "&:hover": {
                    bgcolor: "#FCF8F3",
                  },
                }}
              >
                <Typography
                  sx={{
                    fontSize: 9.5,
                    color: colors.muted,
                    fontFamily: "monospace",
                    whiteSpace: "nowrap",
                  }}
                >
                  {log.date}, {log.time}
                </Typography>

                <Typography
                  sx={{
                    fontSize: 10,
                    fontWeight: 750,
                    whiteSpace: "nowrap",
                  }}
                >
                  {log.admin}
                </Typography>

                <Box>
                  <ActionChip action={log.action} />
                </Box>

                <Typography sx={{ fontSize: 10, color: colors.muted }}>
                  {log.target}
                </Typography>

                <Typography sx={{ fontSize: 10, color: colors.ink }}>
                  {log.description}
                </Typography>
              </Box>
            ))}
          </Box>
        </Box>

        <Box
          sx={{
            px: 1.7,
            py: 0.9,
            bgcolor: "#FCFAF7",
            borderTop: `1px solid ${colors.border}`,
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            gap: 1,
          }}
        >
          <Typography sx={{ fontSize: 10, color: colors.muted }}>
            Sample audit events · Not connected to live audit API
          </Typography>

          <Typography
            sx={{
              fontSize: 10,
              color: colors.muted,
              fontWeight: 700,
              whiteSpace: "nowrap",
            }}
          >
            {auditLogs.length} events
          </Typography>
        </Box>
      </Paper>

      {/* REGULATORY NOTICES */}
      <Paper
        elevation={0}
        sx={{
          border: `1px solid ${colors.border}`,
          borderRadius: "13px",
          bgcolor: "#FFFFFF",
          overflow: "hidden",
        }}
      >
        <SectionHeading
          icon={AccountBalanceRounded}
          title="Regulatory Notices"
          subtitle="Reference updates for platform compliance monitoring"
        />

        <Divider sx={{ borderColor: "#F0E7DE" }} />

        <Box sx={{ px: 1.7 }}>
          {regulatoryNotices.map((notice, index) => (
            <Box
              key={notice.title}
              sx={{
                py: 1.2,
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                gap: 1.5,
                borderBottom:
                  index === regulatoryNotices.length - 1
                    ? 0
                    : "1px solid #F2EAE2",
              }}
            >
              <Box sx={{ minWidth: 0 }}>
                <Typography
                  sx={{
                    fontSize: 10.5,
                    fontWeight: 750,
                    color: colors.ink,
                    lineHeight: 1.5,
                  }}
                >
                  {notice.title}
                </Typography>

                <Typography
                  sx={{
                    mt: 0.25,
                    fontSize: 9.5,
                    color: colors.muted,
                  }}
                >
                  {notice.date}
                </Typography>
              </Box>

              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  gap: 0.9,
                  flexShrink: 0,
                }}
              >
                <Chip
                  label={notice.category}
                  size="small"
                  sx={{
                    height: 19,
                    borderRadius: "5px",
                    bgcolor: "#F2ECE3",
                    color: colors.muted,
                    fontSize: 8.5,
                    fontWeight: 750,
                  }}
                />

                <Typography
                  sx={{
                    fontSize: 9.5,
                    color: "#B4770C",
                    fontWeight: 750,
                  }}
                >
                  Reference
                </Typography>
              </Box>
            </Box>
          ))}
        </Box>

        <Box
          sx={{
            px: 1.7,
            py: 0.9,
            bgcolor: "#FCFAF7",
            borderTop: `1px solid ${colors.border}`,
          }}
        >
          <Typography sx={{ fontSize: 9.5, color: colors.muted }}>
            Illustrative notices · Verify current circulars with their
            respective regulatory authorities.
          </Typography>
        </Box>
      </Paper>
    </Box>
  );
}
