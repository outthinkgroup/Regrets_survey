import React, { useEffect } from "react";
import { useAuth } from "../hooks";

export default function() {
  const { login } = useAuth();

  useEffect(() => {
    login();
  }, []);
  return <div></div>;
}
