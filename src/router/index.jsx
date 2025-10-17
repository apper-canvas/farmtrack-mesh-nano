import { createBrowserRouter } from "react-router-dom";
import { lazy, Suspense } from "react";
import Layout from "@/components/organisms/Layout";

// Lazy load all page components
const Dashboard = lazy(() => import("@/components/pages/Dashboard"));
const Farms = lazy(() => import("@/components/pages/Farms"));
const Crops = lazy(() => import("@/components/pages/Crops"));
const Tasks = lazy(() => import("@/components/pages/Tasks"));
const Weather = lazy(() => import("@/components/pages/Weather"));
const Finances = lazy(() => import("@/components/pages/Finances"));
const NotFound = lazy(() => import("@/components/pages/NotFound"));

// Define main routes
const mainRoutes = [
  {
    path: "",
    index: true,
    element: (
      <Suspense fallback={<div>Loading.....</div>}>
        <Dashboard />
      </Suspense>
    )
  },
  {
    path: "farms",
    element: (
      <Suspense fallback={<div>Loading.....</div>}>
        <Farms />
      </Suspense>
    )
  },
  {
    path: "crops",
    element: (
      <Suspense fallback={<div>Loading.....</div>}>
        <Crops />
      </Suspense>
    )
  },
  {
    path: "tasks",
    element: (
      <Suspense fallback={<div>Loading.....</div>}>
        <Tasks />
      </Suspense>
    )
  },
  {
    path: "weather",
    element: (
      <Suspense fallback={<div>Loading.....</div>}>
        <Weather />
      </Suspense>
    )
  },
  {
    path: "finances",
    element: (
      <Suspense fallback={<div>Loading.....</div>}>
        <Finances />
      </Suspense>
    )
  },
  {
    path: "*",
    element: (
      <Suspense fallback={<div>Loading.....</div>}>
        <NotFound />
      </Suspense>
    )
  }
];

// Create routes array
const routes = [
  {
    path: "/",
    element: <Layout />,
    children: [...mainRoutes]
  }
];

export const router = createBrowserRouter(routes);