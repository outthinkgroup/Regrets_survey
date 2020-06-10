import React from "react";
import { NotificationProvider, NotificationWrapper } from "./noticationContext";
export * from "./noticationContext";

export const wrapRootElement = ({ element }) => (
  <NotificationWrapper>{element}</NotificationWrapper>
);
