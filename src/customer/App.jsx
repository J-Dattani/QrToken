import CustomerRoutes from "./routes/CustomerRoutes";
import { ThemeProvider } from "@mui/material/styles";
import theme from "./theme/theme";

function App() {
  return (
    <ThemeProvider theme={theme}>
      <CustomerRoutes />
    </ThemeProvider>
  );
}

export default App;