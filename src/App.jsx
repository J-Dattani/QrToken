import { ThemeProvider } from "@mui/material/styles";
import theme from "./theme/theme";
import AuthInitializer from "./owner/components/AuthInitializer";
import AppRoutes from "./routes/AppRoutes";

function App() {
  return (
    <ThemeProvider theme={theme}>
      <AuthInitializer />
      <AppRoutes />
    </ThemeProvider>
  );
}

export default App;
