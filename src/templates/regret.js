import React from "react";
import { colors, elevation } from "../styles";
import styled from "styled-components";
import { PageHeading } from "../styles/StyledComponents";
import Layout from "../components/layout.js";
import { Link } from "gatsby";
import { Button } from "../components/SurveyButton";
import About from "../components/About";
import SEO from "../components/seo";

export default function RegretTemplate({ pageContext }) {
  const { regret, id, gender, age, location } = pageContext;
  const { country, state } = location;
  return (
    <Layout>
      <SEO
        shareImage={createShareImage({
          regret,
          id,
          gender,
          country,
          state,
          age,
        })}
        title={`${gender}, Age ${age}`}
      />
      <PageHeading
        style={{
          marginBlock: `60px`,
          textAlign: "center",
          marginBottom: `45px`,
        }}
      >
        A Regret from the World Regret Survey
      </PageHeading>
      <Regret className="regret">
        <h2>
          {gender}, Age {age}
        </h2>
        <p className="location">
          From {state ? `${state}, ${country}` : country}
        </p>
        <p>
          <blockquote>{regret}</blockquote>
        </p>
      </Regret>
      <Navigation className="navigation">
        <h2>What to do next</h2>
        <div className="links">
          <Button to="/">Explore the Regrets Map</Button>
          <Button
            as="a"
            href="https://worldregretsurvey.iad1.qualtrics.com/jfe/form/SV_3CRcRbjb7pIenxr"
          >
            Take the survey
          </Button>
        </div>
      </Navigation>
      <About />
    </Layout>
  );
}

function createShareImage({ age, id, gender, country, state, regret }) {
  const url = "https://worldregretsurvey.com";
  const imageFn = "shareImage";
  return `${url}/api/${imageFn}/${id}/${gender}/${age}/${encodeURIComponent(
    regret
  )}/${country}/${state ? state : ""}.png`;
}
const Navigation = styled.div`
  display: flex;
  margin: 0 30px;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 65px;
  .links {
    display: flex;
    gap: 10px;
    flex-wrap: wrap;
  }
  h2 {
    text-align: center;
    margin: 0;
  }
  a {
    height: auto;
    &:hover {
    }
  }
  @media (max-width: 762px) {
    display: block;
    text-align: center;
    h2 {
      margin-bottom: 20px;
    }
    .links {
      justify-content: center;
    }
  }
`;
const Regret = styled.div`
  background: white;
  border: 2px solid black;
  ${elevation[3]};
  border-radius: 10px;
  padding: 30px 30px;
  margin-bottom: 45px;
  h2 {
    font-weight: 400;
    margin-bottom: 10px;
  }
  .location {
    font-size: 18px;
    font-weight: 900;
    margin-top: 10px;
  }

  blockquote {
    font-size: 26px;
    font-style: italic;
    margin-inline: 0;
    &:before {
      content: open-quote;
    }
    &:after {
      content: close-quote;
    }
  }
`;
