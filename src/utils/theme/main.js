import PropTypes from "prop-types";
import { useMemo } from "react";

// material-ui
import { CssBaseline, StyledEngineProvider, colors } from "@mui/material";
import { createTheme, ThemeProvider } from "@mui/material/styles";

// ==============================|| DEFAULT THEME - MAIN  ||============================== //

export default function ThemeCustomization({ children }) {
  const theme = createTheme({
    breakpoints: {
      values: {
        xs: 0,
        sm: 600,
        md: 960,
        lg: 1280,
        xl: 1920,
      },
    },
    palette: {},
    components: {
      MuiCheckbox: {
        styleOverrides: {
          root: {
            color: "#bdbdbd", // Black for unselected state
            "&.Mui-checked": {
              color: "#eb6400", // White for selected state
            },
          },
        },
      },
    },

    // You can add other theme customizations here
  });

  return (
    <StyledEngineProvider injectFirst>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        {children}
      </ThemeProvider>
    </StyledEngineProvider>
  );
}
ThemeCustomization.propTypes = {
  children: PropTypes.node,
};
