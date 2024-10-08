import "./App.css";
import {
  createBrowserRouter,
  Navigate,
  RouterProvider,
} from "react-router-dom";
import AuthGuard from "./utils/route-guard/AuthGuard";

import { ThemeProvider, createTheme } from "@mui/material/styles";

import { ToasterProvider } from "./context/ToasterContext";
import SignIn from "./components/auth/SignIn";
import AuthLayout from "./layout/authHeader/authLayout";
import { DashboardLayout } from "./layout/dashboardLayout/dashboardLayout";
import Profile from "./components/authenticated/Profile";
import AllEvents from "./components/authenticated/AllEvents";
import { EventLayout } from "./layout/eventLayout/eventLayout";
import EventMain from "./components/authenticated/EventMain";
import EventParticipants from "./components/authenticated/EventParticipants";
import EventBilling from "./components/authenticated/Billings/EventBilling";
import BIBExpo from "./components/authenticated/BIBExpo";
import Discount from "./components/authenticated/Discount";
import Polls from "./components/authenticated/Polls";
import Reviews from "./components/authenticated/Reviews";
import Reports from "./components/authenticated/Reports";

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
          <RouterProvider router={appLayout} />
        </ToasterProvider>
      </ThemeProvider>
    </>
  );
}

export default App;
