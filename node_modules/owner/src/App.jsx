import { ThemeProvider } from "@mui/material/styles";
import theme from "./styles/theme";
import OwnerRoutes from "./routes/OwnerRoutes";

function App() {
  return (
    <ThemeProvider theme={theme}>
      <OwnerRoutes />
    </ThemeProvider>
  );
}

export default App;