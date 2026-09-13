import React, { useEffect, useState } from "react";
import Dashboard from "./Dashboard";
import TopBar from "./TopBar";
import { isAuthenticated, setSession, LOGIN_URL } from "../utils/auth";

const Home = () => {
  const [ready, setReady] = useState(false);

  useEffect(() => {
    // The frontend's Login/Signup pages redirect here with the token and
    // username as query params (dashboard runs on a different port, so it
    // has its own localStorage and can't read the frontend's directly).
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
      window.location.href = LOGIN_URL;
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
