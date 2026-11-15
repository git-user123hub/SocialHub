"use client";

import { useEffect } from "react";
import toast from "react-hot-toast";

function LogoutToastWrapper() {
  useEffect(() => {
    const hasLogout = localStorage.getItem("logout");
    if (hasLogout === "true") {
      toast.success("Logged out successfully!");
      localStorage.removeItem("logout");
    }
  }, []);

  return <div></div>;
}

export default LogoutToastWrapper;
