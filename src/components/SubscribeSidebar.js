import React from "react";
import styled from "styled-components";
import EmailSignup from "./EmailSignUp";
import { SubscribeSidebarContent } from "./content";
import { colors } from "../styles";
function SubscribeSidebar({ className }) {
  return (
    <div className={className}>
      <SubscribeSidebarContent />
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
