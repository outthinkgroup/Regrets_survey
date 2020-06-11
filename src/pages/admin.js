import React from "react";
import { Redirect } from "@reach/router";
import styled from "styled-components";
import { useAuth } from "../hooks";
import AdminLayout from "../components/AdminLayout";

export default function Admin() {
  const { user } = useAuth();
  if (!user) {
    return <Redirect noThrow to={"/"} />;
  }
  function refreshRegrets() {
    console.log("this will refresh the regrets eventually");
  }
  return (
    <AdminLayout>
      <h1>Hello, {user.user_metadata.full_name}</h1>
      <AdminSection>
        <h2>Links</h2>
        <p>Links to assets that make this site run.</p>
        <ul>
          <li>
            <a href="https://github.com/outthinkgroup/Regrets_survey">Github</a>
          </li>
          <li>
            <a href="https://github.com/outthinkgroup/Regrets_survey/tree/master/content">
              Edit Content in Github
            </a>
          </li>
          <li>
            <a href="https://app.netlify.com/sites/world-regrets-survey/overview">
              Netlify
            </a>
          </li>
          <li>
            <a href="https://worldregretsurvey.co1.qualtrics.com/Q/MyProjectsSection">
              Qualtrics
            </a>
          </li>
        </ul>
      </AdminSection>
      <AdminSection>
        <h2>Refresh the Regrets</h2>
        <p>click the button to refresh the regrets being shown on the map.</p>
        <button onClick={refreshRegrets} type="button">
          Refresh
        </button>
      </AdminSection>
    </AdminLayout>
  );
}
const AdminSection = styled.section`
  padding: 30px 0;
  margin-bottom: 30px;
`;