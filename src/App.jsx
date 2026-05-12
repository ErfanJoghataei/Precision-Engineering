import React from "react";
import { useEffect, useState } from "react";
import Home from "./pages/Home.jsx";
import Login from "./pages/Login.jsx";
import Dashboard from "./pages/Dashboard.jsx";

const getRoute = () => window.location.pathname.toLowerCase();

export default function App() {
  const [route, setRoute] = useState(getRoute());

  useEffect(() => {
    const updateRoute = () => setRoute(getRoute());
    window.addEventListener("popstate", updateRoute);
    window.addEventListener("precision:navigate", updateRoute);
    return () => {
      window.removeEventListener("popstate", updateRoute);
      window.removeEventListener("precision:navigate", updateRoute);
    };
  }, []);

  if (route.startsWith("/login")) return <Login />;
  if (route.startsWith("/dashboard") || route.startsWith("/admin")) return <Dashboard />;
  return <Home />;
}
