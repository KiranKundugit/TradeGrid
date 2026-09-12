import React, { useEffect, useState } from "react";
import Dashboard from "./Dashboard";
import TopBar from "./TopBar";
import { isAuthenticated, setSession } from "../utils/auth";

const Home = () => {
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const token = params.get("token");
    const username = params.get("username");

    if (token) {
      setSession(token, username);
      // Clean the token out of the visible URL/history.
      window.history.replaceState(
        {},
        document.title,
        window.location.pathname
      );
    }

    if (!isAuthenticated()) {
      window.location.href = "http://localhost:3000/login";
      return;
    }

    setReady(true);
  }, []);

  if (!ready) {
    return null;
  }

  return (
    <>
      <TopBar />
      <Dashboard />
    </>
  );
};

export default Home;
