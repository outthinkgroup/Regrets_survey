import React, { useState } from "react";
import styled from "styled-components";
import { Button } from "./SurveyButton";
const SIGNUP_URL = `/.netlify/functions/signup`;
function EmailSignUp({ className }) {
  const [email, setEmail] = useState("");
  return (
    <div className={className}>
      Sign up for updates
      <form
        onSubmit={async (e) => {
          e.preventDefault();
          const res = await fetch(SIGNUP_URL, {
            method: `POST`,
            body: JSON.stringify({ email }),
          });
          const data = await res.json();
          console.log(data);
        }}
      >
        <input
          type="email"
          name=""
          id=""
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <Button as="button">Submit</Button>
      </form>
    </div>
  );
}
export default styled(EmailSignUp)`
  form {
    display: flex;
  }

  button {
    margin-left: 10px;
    border: none;
    padding: 0 10px;
  }
`;
