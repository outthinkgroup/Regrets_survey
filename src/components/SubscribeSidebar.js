import React from "react";
import styled from "styled-components";
import EmailSignup from "./EmailSignUp";
import { colors } from "../styles";
function SubscribeSidebar({ className }) {
  return (
    <div className={className}>
      <h3>SUBSCRIBE</h3>
      <p>
        Lorem ipsum dolor sit amet consectetur adipisicing elit. Cupiditate
        error ullam ad dolorem sit ex blanditiis earum deserunt reprehenderit
        veniam obcaecati ipsam repellendus, soluta corporis porro quaerat
        tempora, modi cumque?
      </p>
      <EmailSignup />
    </div>
  );
}
export default styled(SubscribeSidebar)`
  padding: 20px;
  background: ${colors.grey[2]};
  h3 {
    font-size: 20px;
  }
`;
