import React, { useState } from "react";
import styled from "styled-components";
import { Button } from "./SurveyButton";
import { colors, fonts } from "../styles";
import { trackCustomEvent } from "gatsby-plugin-google-analytics";
const SIGNUP_URL = `/.netlify/functions/signup`;
function EmailSignUp({ className, includeLabel }) {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);
  const [success, setSuccess] = useState(false);

  const trackSignUps = (message) =>
    trackCustomEvent({
      category: "general",
      action: "newsletter signup",
      label: message,
    });
  return (
    <div className={className}>
      <form
        onSubmit={async (e) => {
          e.preventDefault();
          setLoading(true);
          setError(false);
          setSuccess(false);
          const res = await fetch(SIGNUP_URL, {
            method: `POST`,
            body: JSON.stringify({ email }),
          });
          const data = await res.json();
          setLoading(false);
          if (data.message !== "subscribed") {
            setError(`Oops there has been and error: ${data.message}`);
            trackSignUps(data.message);
          } else {
            setEmail("");
            setSuccess("You will be notified of any updates, thank you.");
            trackSignUps("success");
          }
        }}
      >
        {includeLabel && <label>Sign up for updates</label>}
        <input
          type="email"
          name=""
          id=""
          placeholder="Email Address"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <Button as="button">{!loading ? `Sign up` : `loading...`}</Button>
      </form>
      {error && <p class="error">{error}</p>}
      {success && <p class="success">{success}</p>}
    </div>
  );
}
export default styled(EmailSignUp)`
  margin-top: 10px;
  margin-bottom: 20px;
  font-family: ${fonts.family};
  form {
    display: flex;
    margin-bottom: 10px;
  }
  input {
    border: 1px solid black;
    border-radius: 2px;
  }
  button {
    margin-left: 10px;
    border: none;
    padding: 0 10px;
  }
  .error {
    padding: 5px;
    font-size: 14px;
    display: inline-block;
    color: ${colors.error.dark};
    font-weight: 900;
    background: ${colors.error.light};
  }
  .success {
    padding: 5px;
    display: inline-block;
    font-size: 14px;
    color: ${colors.success.dark};
    font-weight: 900;
    background: ${colors.success.light};
  }
`;
