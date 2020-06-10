import React, { useEffect } from "react";
import netlifyIdentity from "netlify-identity-widget";
import {} from "gatsby";
export default function() {
  useEffect(() => {
    netlifyIdentity.open();
  }, []);
  return <div></div>;
}
