import React from "react";
import { useAuth } from "../hooks";

export default function ProtectedComponent({ children }) {
  const { user } = useAuth();
  if (!typeof window === "undefined" || !user) return null;
  return children;
}
