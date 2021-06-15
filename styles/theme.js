import { createMuiTheme } from "@material-ui/core/styles";
import { red } from "@material-ui/core/colors";

// Create a theme instance.
const theme = createMuiTheme({
  palette: {
    primary: {
      main: "#ffcc66",
    },
    secondary: {
      main: "#19857b",
    },
    error: {
      main: red.A400,
    },
    background: {
      default: "#fff",
    },
  },
  typography: {
    "& h1": {
      fontFamily: "Abril Fatface",
    },
    "& h2": {
      fontFamily: "Roberto Mono",
    },
  },
});

export default theme;
