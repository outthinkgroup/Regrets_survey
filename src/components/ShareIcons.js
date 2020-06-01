import React from "react";
import Icon from "./Icon";
import { useStaticQuery, graphql } from "gatsby";
import { colors, fonts, elevation } from "../styles";
import styled from "styled-components";
export default function ShareIcons() {
  return (
    <div>
      <TwitterButton />
      <FacebookButton />
      <LinkedInButton />
      <EmailButton />
    </div>
  );
}
export const TwitterButton = () => {
  const link = "$";
  return <ShareButton link={link} color={`#1C95E0`} icon="twitter" />;
};
export const FacebookButton = () => {
  const link = "$";
  return <ShareButton link={link} color={`#1777F2`} icon="facebook" />;
};
export const LinkedInButton = () => {
  const link = "$";
  return <ShareButton link={link} color={`#0173B1`} icon="linkedin" />;
};
export const EmailButton = () => {
  const link = "$";
  return (
    <ShareButton
      link={link}
      color={colors.grey[3]}
      text="email"
      icon="mail"
      textColor={colors.grey[4]}
    />
  );
};

export const ShareButton = ({
  icon,
  text = "Share",
  link = "#",
  color,
  textColor = "white",
}) => {
  return (
    <ShareLink bgColor={color} href={link} textColor={textColor}>
      <ButtonIcon>
        <Icon name={icon} color="currentColor" />
      </ButtonIcon>
      <span>{text}</span>
    </ShareLink>
  );
};

const ButtonIcon = styled.span`
  width: 1em;
  margin-right: 0.5em;
  display: flex;
  height: auto;
`;
const ShareLink = styled.a`
  display: inline-flex;
  justify-content: center;
  align-items: center;
  color: ${(props) => props.textColor};
  padding: 1px 13px;
  font-size: 14px;
  font-weight: ${fonts.weights[2]};
  text-decoration: none;
  background: ${(props) => props.bgColor};
  margin: 0 10px;
  &:hover {
    ${elevation[1]};
  }
`;
