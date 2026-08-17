import { createTheme } from "@mui/material/styles";

const theme = createTheme({
  palette: {
    primary: {
      main: "#6F4E37",
      dark: "#5A3E2B",
      light: "#8B6246",
    },

    secondary: {
      main: "#C68E17",
      dark: "#A87510",
      light: "#E0A72F",
    },

    background: {
      default: "#F8F3ED",
      paper: "#FFFFFF",
    },

    text: {
      primary: "#2D1F18",
      secondary: "#6B5A4A",
    },

    success: {
      main: "#16A34A",
    },

    error: {
      main: "#DC2626",
    },

    warning: {
      main: "#D97706",
    },
  },

  typography: {
    fontFamily: '"Inter", "Roboto", "Helvetica", "Arial", sans-serif',

    button: {
      fontWeight: 600,
      textTransform: "none",
    },

    h1: {
      fontWeight: 800,
    },

    h2: {
      fontWeight: 700,
    },

    h3: {
      fontWeight: 700,
    },
  },

  shape: {
    borderRadius: 14,
  },

  components: {
    MuiButton: {
      defaultProps: {
        disableRipple: true,
      },

      styleOverrides: {
        root: {
          borderRadius: 12,
          textTransform: "none",
          fontWeight: 600,
        },
      },
    },

    MuiPaper: {
      styleOverrides: {
        root: {
          borderRadius: 16,
        },
      },
    },

    MuiChip: {
      styleOverrides: {
        root: {
          fontWeight: 600,
        },
      },
    },
  },
});

export default theme;