import React, { useState, useContext } from "react";

export const NotificationContext = React.createContext();
export const NotificationConsumer = NotificationContext.Consumer;
export const NotificationProvider = NotificationContext.Provider;

export const NotificationWrapper = ({ children }) => {
  const [notifications, setNotifications] = useState([]);
  return (
    <NotificationProvider value={{ notifications, setNotifications }}>
      {children}
    </NotificationProvider>
  );
};

export function useNotification() {
  const { notifications, setNotifications } = useContext(NotificationContext);

  function create({ type, message }) {
    const id = new Date().getTime();
    setNotifications((prevNotifications) => [
      ...prevNotifications,
      { type, message, id },
    ]);
    return id;
  }
  function dismiss(id) {
    console.log("ran");
    setNotifications((prevNotifications) =>
      prevNotifications.filter((notification) => notification.id !== id)
    );
  }
  function dismissAfter(id, time) {
    return setTimeout(() => dismiss(id), time);
  }
  function createWarning(warning) {
    let id;
    switch (warning) {
      case "NOT_EXIST":
        id = create({
          type: "WARNING",
          message:
            "Oops, that location couldn't be found, try searching a state or country instead.",
        });
        break;
      case "NO_RESULTS":
        id = create({
          type: "WARNING",
          message: "Oops, No entries yet from this location.",
        });
        break;
      default:
        id = create({
          type: "INTERNAL_ERROR",
          message: "no warning exists for that error",
        });
    }
    dismissAfter(id, 3000);
  }
  return { create, dismiss, dismissAfter, notifications, createWarning };
}
