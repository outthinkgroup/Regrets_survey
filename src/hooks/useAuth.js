import { useEffect } from "react";
import netlifyIdentity from "netlify-identity-widget";
import { navigate } from "gatsby";
import { useLocalStorage } from "./useLocalStorage";

export function useAuth() {
  const [auth, setAuth] = useLocalStorage("gotrue.user");
  const login = () => {
    netlifyIdentity.open("login");
  };
  useEffect(() => {
    netlifyIdentity.on("login", (user) => {
      setAuth(user);
      netlifyIdentity.close();
      navigate("/admin");
    });
    netlifyIdentity.on("close", () => {
      if (auth) {
        navigate("/admin");
      } else {
        navigate("/");
      }
    });
  }, []);
  return { user: auth, login };
}
