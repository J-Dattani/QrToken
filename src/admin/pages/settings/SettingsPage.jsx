
import { useState } from "react";

import {
  CloudDoneRounded,
  StorageRounded,
  SaveRounded,
  SettingsEthernetRounded,
  SecurityRounded,
  SpeedRounded,
  SyncRounded,
} from "@mui/icons-material";
import {
  Alert,
  Box,
  Button,
  Paper,
  Snackbar,
  Switch,
  TextField,
  Typography,
} from "@mui/material";

const COLORS = {
  paper: "#FFFFFF",
  background: "#F7F3ED",
  text: "#2D1F18",
  muted: "#887767",
  border: "#E9DCCF",
  gold: "#E6A23C",
  brown: "#765239",
  green: "#087F70",
};

const initialSettings = {
  transactionFee: "0",
  freeOrderCap: "100",
  starterOrderCap: "500",
  growthOrderCap: "2000",
  orderReadySla: "8",
  cashCollectSla: "15",
  supportEmail: "support@qrtoken.in",
  maintenanceMode: false,
  broadcast: "",
};

const infrastructure = [
  {
    label: "RAZORPAY ENV",
    value: "Connected",
    icon: CloudDoneRounded,
  },
  {
    label: "DATABASE",
    value: "MongoDB Atlas",
icon: StorageRounded,
  },
  {
    label: "REAL-TIME",
    value: "Socket.IO Active",
    icon: SyncRounded,
  },
  {
    label: "SYSTEM SLA",
    value: "99.99% uptime target",
    icon: SpeedRounded,
  },
  {
    label: "AUTH",
    value: "JWT RS256",
    icon: SecurityRounded,
  },
  {
    label: "QR ENGINE",
    value: "qrcode package",
    icon: SettingsEthernetRounded,
  },
];

function SettingsField({
  label,
  value,
  onChange,
  helperText,
  type = "text",
  placeholder,
}) {
  return (
    <Box sx={{ mb: 2.8 }}>
      <Typography
        sx={{
          mb: 0.8,
          fontSize: 12,
          fontWeight: 600,
          color: COLORS.text,
        }}
      >
        {label}
      </Typography>

      <TextField
        fullWidth
        size="small"
        type={type}
        value={value}
        placeholder={placeholder}
        onChange={(event) => onChange(event.target.value)}
        slotProps={{
          htmlInput: {
            min: type === "number" ? 0 : undefined,
          },
        }}
        sx={{
          "& .MuiOutlinedInput-root": {
            height: 43,
            bgcolor: "#FFFFFF",
            borderRadius: "11px",
            fontSize: 13,
            "& fieldset": {
              borderColor: COLORS.border,
            },
            "&:hover fieldset": {
              borderColor: "#C8B49E",
            },
            "&.Mui-focused fieldset": {
              borderColor: COLORS.brown,
            },
          },
        }}
      />

      {helperText && (
        <Typography
          sx={{
            mt: 0.7,
            fontSize: 10.5,
            color: COLORS.muted,
            lineHeight: 1.5,
          }}
        >
          {helperText}
        </Typography>
      )}
    </Box>
  );
}

function SettingsCard({ title, children }) {
  return (
    <Paper
      elevation={0}
      sx={{
        p: { xs: 1.8, md: 2.5 },
        border: `1px solid ${COLORS.border}`,
        borderRadius: "13px",
        bgcolor: COLORS.paper,
        minWidth: 0,
      }}
    >
      <Typography
        sx={{
          mb: 2.4,
          fontSize: 15,
          fontWeight: 800,
          color: COLORS.text,
        }}
      >
        {title}
      </Typography>

      {children}
    </Paper>
  );
}

export default function SettingsPage() {
  const [settings, setSettings] = useState(initialSettings);
  const [savedSettings, setSavedSettings] = useState(initialSettings);
  const [lastSaved, setLastSaved] = useState(null);
  const [notification, setNotification] = useState(false);

  const updateSetting = (key, value) => {
    setSettings((previous) => ({
      ...previous,
      [key]: value,
    }));
  };

  const hasChanges =
    JSON.stringify(settings) !== JSON.stringify(savedSettings);

  const handleSave = () => {
    // Frontend preview only. Connect this to the settings API
    // before treating changes as permanently saved.
    setSavedSettings({ ...settings });
    setLastSaved(new Date().toLocaleString("en-IN"));
    setNotification(true);
  };

  return (
    <Box
      sx={{
        width: "100%",
        minWidth: 0,
        color: COLORS.text,
      }}
    >
      {/* Page heading and save action */}
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: { xs: "flex-start", sm: "center" },
          flexWrap: "wrap",
          gap: 1.5,
          mb: 2.5,
        }}
      >
        <Box>
          <Typography
            sx={{
              fontSize: { xs: 19, md: 22 },
              fontWeight: 800,
              color: COLORS.text,
              letterSpacing: "-0.5px",
            }}
          >
            Platform Settings
          </Typography>

          <Typography
            sx={{
              mt: 0.4,
              fontSize: 12,
              color: COLORS.muted,
            }}
          >
            Global configuration for QRToken.in
          </Typography>
        </Box>

        <Button
          variant="contained"
          onClick={handleSave}
          disabled={!hasChanges}
          startIcon={<SaveRounded sx={{ fontSize: 17 }} />}
          sx={{
            minHeight: 39,
            px: 2,
            borderRadius: "10px",
            bgcolor: "#211D19",
            color: "#FFFFFF",
            fontSize: 11.5,
            fontWeight: 700,
            textTransform: "none",
            boxShadow: "0 3px 8px #00000012",
            "&:hover": {
              bgcolor: "#3B3027",
            },
            "&.Mui-disabled": {
              bgcolor: "#A69B90",
              color: "#FFFFFF",
            },
          }}
        >
          Save Changes
        </Button>
      </Box>

      {/* Billing and SLA sections */}
      <Box
        sx={{
          display: "grid",
          gridTemplateColumns: {
            xs: "minmax(0, 1fr)",
            lg: "repeat(2, minmax(0, 1fr))",
          },
          gap: 1.8,
          alignItems: "stretch",
        }}
      >
        {/* Billing and plan caps */}
        <SettingsCard title="Billing & Plan Caps">
          <SettingsField
            label="Platform Transaction Fee (Digital %)"
            type="number"
            value={settings.transactionFee}
            onChange={(value) =>
              updateSetting("transactionFee", value)
            }
            helperText="0 = subscription-only model (current). Applied on digital payments."
          />

          <SettingsField
            label="Free Plan — Monthly Order Cap"
            type="number"
            value={settings.freeOrderCap}
            onChange={(value) =>
              updateSetting("freeOrderCap", value)
            }
          />

          <SettingsField
            label="Starter Plan — Monthly Order Cap"
            type="number"
            value={settings.starterOrderCap}
            onChange={(value) =>
              updateSetting("starterOrderCap", value)
            }
          />

          <SettingsField
            label="Growth Plan — Monthly Order Cap"
            type="number"
            value={settings.growthOrderCap}
            onChange={(value) =>
              updateSetting("growthOrderCap", value)
            }
          />
        </SettingsCard>

        {/* SLA and operations */}
        <SettingsCard title="SLA & Operations">
          <SettingsField
            label="Order Ready SLA (minutes)"
            type="number"
            value={settings.orderReadySla}
            onChange={(value) =>
              updateSetting("orderReadySla", value)
            }
            helperText="Target time from order received → marked Ready."
          />

          <SettingsField
            label="Cash Collect SLA (minutes)"
            type="number"
            value={settings.cashCollectSla}
            onChange={(value) =>
              updateSetting("cashCollectSla", value)
            }
          />

          <SettingsField
            label="Support Email"
            type="email"
            value={settings.supportEmail}
            onChange={(value) =>
              updateSetting("supportEmail", value)
            }
          />

          {/* Maintenance mode */}
          <Box sx={{ mb: 2.5 }}>
            <Typography
              sx={{
                mb: 0.7,
                fontSize: 12,
                fontWeight: 600,
              }}
            >
              Maintenance Mode
            </Typography>

            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                gap: 1,
              }}
            >
              <Switch
                checked={settings.maintenanceMode}
                onChange={(event) =>
                  updateSetting(
                    "maintenanceMode",
                    event.target.checked
                  )
                }
                sx={{
                  ml: -0.7,
                  "& .MuiSwitch-switchBase.Mui-checked": {
                    color: COLORS.gold,
                  },
                  "& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track": {
                    bgcolor: COLORS.gold,
                  },
                }}
              />

              <Typography
                sx={{
                  fontSize: 12,
                  fontWeight: 700,
                  color: settings.maintenanceMode
                    ? "#C62828"
                    : COLORS.green,
                }}
              >
                {settings.maintenanceMode
                  ? "Maintenance mode enabled"
                  : "Platform is live ✓"}
              </Typography>
            </Box>
          </Box>

          {/* System broadcast */}
          <Box>
            <Typography
              sx={{
                mb: 0.8,
                fontSize: 12,
                fontWeight: 600,
              }}
            >
              📢 System Broadcast Announcement
            </Typography>

            <TextField
              fullWidth
              size="small"
              value={settings.broadcast}
              onChange={(event) =>
                updateSetting("broadcast", event.target.value)
              }
              placeholder="e.g. ⚠️ Scheduled UPI maintenance tonight 2 AM - 3 AM"
              sx={{
                "& .MuiOutlinedInput-root": {
                  borderRadius: "11px",
                  fontSize: 12,
                  "& fieldset": {
                    borderColor: COLORS.border,
                  },
                  "&.Mui-focused fieldset": {
                    borderColor: COLORS.brown,
                  },
                },
              }}
            />

            <Typography
              sx={{
                mt: 0.7,
                fontSize: 10.5,
                color: COLORS.muted,
                lineHeight: 1.5,
              }}
            >
              Intended to broadcast a notification to all store owner dashboards
              once the broadcast API is connected.
            </Typography>
          </Box>
        </SettingsCard>
      </Box>

      {/* Gateway and infrastructure */}
      <Paper
        elevation={0}
        sx={{
          mt: 1.8,
          p: { xs: 1.8, md: 2.5 },
          border: `1px solid ${COLORS.border}`,
          borderRadius: "13px",
          bgcolor: COLORS.paper,
        }}
      >
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            flexWrap: "wrap",
            gap: 1,
            mb: 2,
          }}
        >
          <Typography
            sx={{
              fontSize: 15,
              fontWeight: 800,
            }}
          >
            Gateway & Infrastructure
          </Typography>

          <Typography
            sx={{
              fontSize: 10.5,
              color: COLORS.muted,
            }}
          >
            Set in .env — not editable in UI for security
          </Typography>
        </Box>

        <Box
          sx={{
            display: "grid",
            gridTemplateColumns: {
              xs: "repeat(1, minmax(0, 1fr))",
              sm: "repeat(2, minmax(0, 1fr))",
              lg: "repeat(3, minmax(0, 1fr))",
            },
            columnGap: 2,
            rowGap: 1.5,
          }}
        >
          {infrastructure.map((item) => {
            const Icon = item.icon;

            return (
              <Box
                key={item.label}
                sx={{
                  minWidth: 0,
                  py: 1.6,
                  px: 0.8,
                  textAlign: "center",
                  borderBottom: `1px solid ${COLORS.border}`,
                }}
              >
                <Typography
                  sx={{
                    fontSize: 10,
                    color: COLORS.muted,
                    letterSpacing: "0.5px",
                  }}
                >
                  {item.label}
                </Typography>

                <Box
                  sx={{
                    mt: 0.7,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    gap: 0.6,
                    flexWrap: "wrap",
                  }}
                >
                  <Icon
                    sx={{
                      fontSize: 16,
                      color: COLORS.green,
                    }}
                  />

                  <Typography
                    sx={{
                      fontSize: 12,
                      fontWeight: 700,
                      color: COLORS.green,
                      fontFamily: "monospace",
                    }}
                  >
                    {item.value} ✓
                  </Typography>
                </Box>
              </Box>
            );
          })}
        </Box>
      </Paper>

      {/* Last saved */}
      <Box
        sx={{
          mt: 1.5,
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          flexWrap: "wrap",
          gap: 1,
        }}
      >
        <Typography
          sx={{
            fontSize: 10.5,
            color: COLORS.muted,
          }}
        >
          {lastSaved
            ? `Last saved: ${lastSaved} · Local preview`
            : "Changes have not been saved."}
        </Typography>

        <Typography
          sx={{
            fontSize: 10,
            color: hasChanges ? "#B17A0B" : COLORS.green,
          }}
        >
          {hasChanges ? "Unsaved changes" : "All changes saved locally"}
        </Typography>
      </Box>

      {/* Save notification */}
      <Snackbar
        open={notification}
        autoHideDuration={3000}
        onClose={() => setNotification(false)}
        anchorOrigin={{
          vertical: "bottom",
          horizontal: "right",
        }}
      >
        <Alert
          onClose={() => setNotification(false)}
          severity="success"
          variant="filled"
          sx={{ fontSize: 12 }}
        >
          Settings saved in this preview.
        </Alert>
      </Snackbar>
    </Box>
  );
}
