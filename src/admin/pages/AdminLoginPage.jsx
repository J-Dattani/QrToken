
import { useState } from "react";
import { useNavigate } from "react-router-dom";

import {
  ArrowForwardRounded,
  VisibilityRounded,
  VisibilityOffRounded,
  ShieldRounded,
  SecurityRounded,
} from "@mui/icons-material";

import {
//   Alert,
  Box,
  Button,
  IconButton,
  InputAdornment,
  Paper,
  TextField,
  Typography,
} from "@mui/material";

const COLORS = {
  background: "#F7F3ED",
  paper: "#FFFFFF",
  ink: "#29231E",
  brown: "#765239",
  muted: "#887767",
  border: "#E9DCCF",
  gold: "#E6A23C",
  dark: "#201E1A",
};

const fieldStyles = {
  "& .MuiOutlinedInput-root": {
    height: 48,
    borderRadius: "10px",
    bgcolor: "#FCFAF7",
    fontSize: 13,
    "& fieldset": {
      borderColor: COLORS.border,
    },
    "&:hover fieldset": {
      borderColor: "#C6A989",
    },
    "&.Mui-focused fieldset": {
      borderColor: COLORS.brown,
      borderWidth: "1.5px",
    },
  },
};

export default function AdminLoginPage() {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const handleSubmit = (event) => {
    event.preventDefault();

    // Temporary frontend-only login.
    // Real authentication will be connected through the Admin API later.
    navigate("/admin");
  };

  return (
    <Box
      sx={{
        minHeight: "100dvh",
        width: "100%",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        position: "relative",
        overflow: "hidden",
        bgcolor: COLORS.background,
        px: 2,
        py: 4,
        fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
      }}
    >
      {/* Background details */}
      <Box
        sx={{
          position: "absolute",
          width: 420,
          height: 420,
          borderRadius: "50%",
          top: -230,
          right: -130,
          background:
            "radial-gradient(circle, rgba(230,162,60,0.15), transparent 70%)",
          pointerEvents: "none",
        }}
      />

      <Box
        sx={{
          position: "absolute",
          width: 400,
          height: 400,
          borderRadius: "50%",
          bottom: -250,
          left: -160,
          background:
            "radial-gradient(circle, rgba(118,82,57,0.10), transparent 70%)",
          pointerEvents: "none",
        }}
      />

      <Paper
        elevation={0}
        sx={{
          width: "100%",
          maxWidth: 440,
          position: "relative",
          zIndex: 1,
          border: `1px solid ${COLORS.border}`,
          borderRadius: "20px",
          bgcolor: COLORS.paper,
          p: { xs: 3, sm: 4 },
          boxShadow: "0 24px 70px rgba(55,39,25,0.09)",
        }}
      >
        {/* Brand */}
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            gap: 1.3,
            mb: 4,
          }}
        >
          <Box
            sx={{
              width: 44,
              height: 44,
              display: "grid",
              placeItems: "center",
              borderRadius: "12px",
              bgcolor: COLORS.gold,
              color: COLORS.dark,
              fontSize: 25,
              fontWeight: 950,
              boxShadow: "0 5px 14px rgba(230,162,60,0.22)",
            }}
          >
            Q
          </Box>

          <Box>
            <Typography
              sx={{
                fontSize: 17,
                fontWeight: 900,
                letterSpacing: "-0.5px",
                color: COLORS.ink,
                lineHeight: 1.2,
              }}
            >
              QRToken<span style={{ color: COLORS.gold }}>.in</span>
            </Typography>

            <Typography
              sx={{
                mt: 0.3,
                fontSize: 9,
                fontWeight: 800,
                letterSpacing: "1.5px",
                color: COLORS.muted,
              }}
            >
              SUPER ADMIN CONSOLE
            </Typography>
          </Box>
        </Box>

        {/* Heading */}
        <Box sx={{ mb: 3 }}>
          <Box
            sx={{
              width: 40,
              height: 40,
              display: "grid",
              placeItems: "center",
              borderRadius: "11px",
              bgcolor: "#F4E8DC",
              color: COLORS.brown,
              mb: 1.8,
            }}
          >
            <ShieldRounded sx={{ fontSize: 21 }} />
          </Box>

          <Typography
            sx={{
              fontSize: 25,
              fontWeight: 850,
              letterSpacing: "-0.7px",
              color: COLORS.ink,
            }}
          >
            Admin access
          </Typography>

          <Typography
            sx={{
              mt: 0.7,
              fontSize: 12.5,
              lineHeight: 1.7,
              color: COLORS.muted,
            }}
          >
            Sign in to manage your platform, merchants and operations.
            Authorized administrators only.
          </Typography>
        </Box>

        {/* Login form */}
        <Box component="form" onSubmit={handleSubmit}>
          <Box sx={{ mb: 2 }}>
            <Typography
              sx={{
                mb: 0.8,
                fontSize: 11.5,
                fontWeight: 750,
                color: COLORS.ink,
              }}
            >
              Admin email
            </Typography>

            <TextField
              fullWidth
              type="email"
              placeholder="admin@qrtoken.in"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              autoComplete="username"
              sx={fieldStyles}
            />
          </Box>

          <Box sx={{ mb: 2.5 }}>
            <Typography
              sx={{
                mb: 0.8,
                fontSize: 11.5,
                fontWeight: 750,
                color: COLORS.ink,
              }}
            >
              Password
            </Typography>

            <TextField
              fullWidth
              type={showPassword ? "text" : "password"}
              placeholder="Enter your password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              autoComplete="current-password"
              sx={fieldStyles}
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                      size="small"
                      onClick={() =>
                        setShowPassword((previous) => !previous)
                      }
                      aria-label={
                        showPassword ? "Hide password" : "Show password"
                      }
                      edge="end"
                      sx={{ color: COLORS.muted }}
                    >
                      {showPassword ? (
                        <VisibilityOffRounded sx={{ fontSize: 19 }} />
                      ) : (
                        <VisibilityRounded sx={{ fontSize: 19 }} />
                      )}
                    </IconButton>
                  </InputAdornment>
                ),
              }}
            />
          </Box>

          <Button
            type="submit"
            fullWidth
            variant="contained"
            endIcon={<ArrowForwardRounded sx={{ fontSize: 18 }} />}
            sx={{
              minHeight: 47,
              borderRadius: "10px",
              bgcolor: COLORS.dark,
              color: "#FFFFFF",
              fontSize: 12.5,
              fontWeight: 800,
              textTransform: "none",
              boxShadow: "0 5px 14px rgba(32,30,26,0.14)",
              "&:hover": {
                bgcolor: "#3A3027",
                boxShadow: "0 7px 18px rgba(32,30,26,0.19)",
              },
            }}
          >
            Sign in to console
          </Button>
        </Box>

        {/* Security information */}
        <Box
          sx={{
            mt: 3,
            p: 1.4,
            display: "flex",
            alignItems: "flex-start",
            gap: 1,
            bgcolor: "#F8F4EF",
            border: "1px solid #F0E7DE",
            borderRadius: "10px",
          }}
        >
          <SecurityRounded
            sx={{
              fontSize: 17,
              color: COLORS.brown,
              mt: 0.1,
              flexShrink: 0,
            }}
          />

          <Box>
            <Typography
              sx={{
                fontSize: 10.5,
                fontWeight: 800,
                color: COLORS.ink,
              }}
            >
              Administrator workspace
            </Typography>

            <Typography
              sx={{
                mt: 0.35,
                fontSize: 9.5,
                lineHeight: 1.6,
                color: COLORS.muted,
              }}
            >
              Temporary frontend access. Secure authentication will be
              enabled when the Admin API is integrated.
            </Typography>
          </Box>
        </Box>

        {/* Footer */}
        <Box
          sx={{
            mt: 3,
            pt: 2,
            borderTop: `1px solid ${COLORS.border}`,
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            gap: 1,
          }}
        >
          <Typography sx={{ fontSize: 9.5, color: COLORS.muted }}>
            QRToken.in · Administration
          </Typography>

          <Typography
            sx={{
              fontSize: 9.5,
              color: COLORS.muted,
              fontWeight: 650,
            }}
          >
            Admin console
          </Typography>
        </Box>
      </Paper>
    </Box>
  );
}
