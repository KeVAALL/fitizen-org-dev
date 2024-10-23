import "./App.css";
import {
  createBrowserRouter,
  Navigate,
  RouterProvider,
} from "react-router-dom";
import AuthGuard from "./utils/route-guard/AuthGuard";

import { ThemeProvider, createTheme } from "@mui/material/styles";
import { HTML5Backend } from "react-dnd-html5-backend";
import { DndProvider } from "react-dnd";

import { ToasterProvider } from "./context/ToasterContext";
import SignIn from "./components/auth/SignIn";
import AuthLayout from "./layout/authHeader/authLayout";
import { DashboardLayout } from "./layout/dashboardLayout/dashboardLayout";
import Profile from "./components/authenticated/Profile";
import AllEvents from "./components/authenticated/AllEvents";
import { EventLayout } from "./layout/eventLayout/eventLayout";
import EventMain from "./components/authenticated/EventMain";
import EventParticipants from "./components/authenticated/EventParticipants";
import EventBilling from "./components/authenticated/Billings/BillingMain";
import BIBExpo from "./components/authenticated/BIBExpo";
import Discount from "./components/authenticated/Discount";
import Polls from "./components/authenticated/Polls";
import Reviews from "./components/authenticated/Reviews";
import Reports from "./components/authenticated/Reports";
import Main from "./components/authenticated/EditEvent/Main";
import Support from "./components/authenticated/Support";

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
  components: {
    MuiCheckbox: {
      styleOverrides: {
        root: {
          color: "#bdbdbd", // Black for unselected state
          borderRadius: "4px",
          "&.Mui-checked": {
            color: "#f05736", // White for selected state
          },
          "&.Mui-disabled": {
            cursor: "not-allowed !important", // Show not-allowed cursor when disabled
            pointerEvents: "auto", // Allow pointer events to enable cursor change
            opacity: 0.5, // Optional: Adjust opacity to indicate disabled state
          },
        },
      },
    },
  },
  // You can add other theme customizations here
});
const appLayout = createBrowserRouter([
  {
    path: `/`,
    element: (
      // <AuthGuard>
      <AuthLayout />
      // </AuthGuard>
    ),
    children: [
      {
        path: "/",
        element: <Navigate to="/sign-in" />,
      },
      {
        path: "sign-in",
        element: <SignIn />,
      },
    ],
  },
  {
    path: "/dashboard",
    element: (
      <AuthGuard>
        <DashboardLayout />
      </AuthGuard>
    ),
    children: [
      {
        path: "profile",
        element: <Profile />,
      },
      {
        path: "all-events",
        element: <AllEvents />,
      },
      {
        path: "reports",
        element: <Reports />,
      },
      {
        path: "support",
        element: <Support />,
      },
    ],
  },
  {
    path: "/event",
    element: (
      <AuthGuard>
        <EventLayout />
      </AuthGuard>
    ),
    children: [
      {
        path: "dashboard/:event_id",
        element: <EventMain />,
      },
      {
        path: "participants/:event_id",
        element: <EventParticipants />,
      },
      {
        path: "edit-event/:event_id",
        element: <Main />,
      },
      {
        path: "billings/:event_id",
        element: <EventBilling />,
      },
      {
        path: "bib-expo/:event_id",
        element: <BIBExpo />,
      },
      {
        path: "discount/:event_id",
        element: <Discount />,
      },
      {
        path: "polls/:event_id",
        element: <Polls />,
      },
      {
        path: "reviews/:event_id",
        element: <Reviews />,
      },
    ],
  },
  {
    path: "*",
    element: <>No page found</>,
  },
]);

function App() {
  return (
    <>
      <ThemeProvider theme={theme}>
        <ToasterProvider>
          <DndProvider backend={HTML5Backend}>
            <RouterProvider router={appLayout} />
          </DndProvider>
        </ToasterProvider>
      </ThemeProvider>
    </>
  );
}

export default App;
