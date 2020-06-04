import React from "react";
import Icon from "./Icon";
import { useStaticQuery, graphql } from "gatsby";
import { colors, fonts, elevation } from "../styles";
import styled from "styled-components";

export default function ShareIcons({ alignment }) {
  const data = useStaticQuery(SOCIAL_QUERY);
  const { email, twitter, facebook, linkedIn } = data.site.siteMetadata.sharing;
  return (
    <ShareButtonGroup alignment={alignment}>
      <TwitterButton tweet={twitter.tweet} url={twitter.url} />
      <FacebookButton url={facebook.url} />
      <LinkedInButton url={linkedIn.url} />
      <EmailButton subject={email.subject} body={email.body} url={email.url} />
    </ShareButtonGroup>
  );
}

export const TwitterButton = ({ tweet, url }) => {
  const link = createTweet({ tweet, url });
  return <ShareButton link={link} color={`#1C95E0`} icon="twitter" />;
};
export const FacebookButton = ({ url }) => {
  const link = createFacebookLink({ url });
  return <ShareButton link={link} color={`#1777F2`} icon="facebook" />;
};
export const LinkedInButton = ({ url, title, summary }) => {
  const link = createLinkedInLink({ url, title, summary });
  return <ShareButton link={link} color={`#0173B1`} icon="linkedin" />;
};
export const EmailButton = ({ body, subject, url }) => {
  const link = createEmail({ body, subject, url });
  return (
    <ShareButton
      link={link}
      color={colors.grey[3]}
      text="Email"
      icon="mail"
      textColor={colors.grey[4]}
      newTab
    />
  );
};

export const ShareButton = ({
  icon,
  text = "Share",
  link = "#",
  color,
  textColor = "white",
  newTab,
}) => {
  return (
    <ShareLink
      bgColor={color}
      href={link}
      textColor={textColor}
      target={newTab ? `_blank` : ``}
    >
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
  svg {
    width: 100%;
    height: 100%;
  }
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
  &:hover {
    ${elevation[1]};
  }
`;
const ShareButtonGroup = styled.div`
  display: flex;
  max-width: 600px;
  margin: ${({ alignment }) =>
    alignment === `left`
      ? `0 auto 0 0`
      : alignment === `right`
      ? `0 0 0 auto`
      : `0 auto`};
  margin-top: 10px;
  justify-content: space-between;
  @media (max-width: 324px) {
    flex-wrap: wrap;
    a {
      margin-bottom: 10px;
    }
  }
`;

function createEmail({ recipient = "", subject = "", body = "", url = "" }) {
  const enCodedSubject = encodeURIComponent(subject);
  const enCodedBody = encodeURIComponent(body);
  const enCodedUrl = encodeURIComponent(url);
  const lineBreak = encodeURIComponent(`\u000A`);
  return `mailto:${recipient}?subject=${enCodedSubject}&body=${enCodedBody} ${lineBreak}${enCodedUrl}`;
}
function createTweet({ tweet, url }) {
  const enCodedTweet = encodeURIComponent(tweet);
  const enCodedUrl = encodeURIComponent(url);
  return `https://twitter.com/intent/tweet?text=${enCodedTweet}&url=${enCodedUrl}`;
}
function createFacebookLink({ url }) {
  const enCodedUrl = encodeURIComponent(url);
  return `https://www.facebook.com/sharer/sharer.php?u=${enCodedUrl}`;
}
function createLinkedInLink({ url, title = "", summary = "" }) {
  const enCodedUrl = encodeURIComponent(url);
  const enCodedTitle = encodeURIComponent(title);
  const enCodedSummary = encodeURIComponent(summary);
  return `https://www.linkedin.com/shareArticle?mini=true&url=${enCodedUrl}&title=${enCodedTitle}&summary=${enCodedSummary}&source=`;
}

const SOCIAL_QUERY = graphql`
  query SOCIAL_QUERY {
    site {
      siteMetadata {
        sharing {
          email {
            body
            subject
            url
          }
          facebook {
            url
          }
          linkedIn {
            url
          }
          twitter {
            tweet
            url
          }
        }
      }
    }
  }
`;
