// CSS import
import "./App.css";

// React imports
import { lazy, Suspense } from "react";

// React Router imports
import {
  createBrowserRouter,
  Navigate,
  RouterProvider,
} from "react-router-dom";

// Project-specific imports
import { ToasterProvider } from "./context/ToasterContext";
import Loader from "./utils/BackdropLoader";

// MUI imports
import { ThemeProvider, createTheme } from "@mui/material/styles";

// React Drag n Drop imports
import { HTML5Backend } from "react-dnd-html5-backend";
import { DndProvider } from "react-dnd";

// Layout
const AuthLayout = lazy(() => import("./layout/AuthHeader/AuthLayout"));
const DashboardLayout = lazy(() =>
  import("./layout/DashboardLayout/DashLayout")
);
const EventLayout = lazy(() => import("./layout/eventLayout/eventLayout"));
// Lazy-loaded components
const SignIn = lazy(() => import("./components/auth/SignIn"));
// Auth Guard
const AuthGuard = lazy(() => import("./utils/route-guard/AuthGuard"));
// User Dashboard
const AllEvents = lazy(() => import("./components/authenticated/AllEvents"));
const Reports = lazy(() => import("./components/authenticated/Reports"));
const Profile = lazy(() => import("./components/authenticated/Profile"));
const Support = lazy(() => import("./components/authenticated/Support"));
const AddEventMain = lazy(() =>
  import("./components/authenticated/AddEvent/Main")
);
// Event Dashboard
const EventMain = lazy(() => import("./components/authenticated/EventMain"));
const Main = lazy(() => import("./components/authenticated/EditEvent/Main"));
const BillingMain = lazy(() =>
  import("./components/authenticated/Billings/BillingMain")
);
const EventParticipants = lazy(() =>
  import("./components/authenticated/EventParticipants")
);
const BIBExpo = lazy(() => import("./components/authenticated/BIBExpo"));
const Discount = lazy(() => import("./components/authenticated/Discount"));
const Polls = lazy(() => import("./components/authenticated/Polls"));
const Reviews = lazy(() => import("./components/authenticated/Reviews"));

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
    element: <AuthLayout />,
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
      {
        path: "add-event",
        element: <AddEventMain />,
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
        element: <BillingMain />,
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
            <Suspense fallback={<Loader fetching={true} />}>
              <RouterProvider router={appLayout} />
            </Suspense>
          </DndProvider>
        </ToasterProvider>
      </ThemeProvider>
    </>
  );
}

export default App;
