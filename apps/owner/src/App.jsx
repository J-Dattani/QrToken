import { ThemeProvider } from "@mui/material/styles";
import { Provider } from "react-redux";

import theme from "./styles/theme";
import OwnerRoutes from "./routes/OwnerRoutes";
import { store } from "./redux/store";

function App() {
  return (
    <Provider store={store}>
      <ThemeProvider theme={theme}>
        <OwnerRoutes />
      </ThemeProvider>
    </Provider>
  );
}

export default App;