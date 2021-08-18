import React, { useState } from "react";
import { Redirect } from "@reach/router";
import styled from "styled-components";
import { useAuth } from "./../../hooks";
import AdminLayout from "./../../components/AdminLayout";
import { colors, elevation } from "./../../styles";
import { useGetRegrets } from "./../../hooks";

const deployLinks = [
  {
    name: "Staging Site",
    href: "https://staging--world-regrets-survey.netlify.app/",
  },
  {
    name: "Staging JSON Data",
    href:
      "https://github.com/outthinkgroup/Regrets_survey/blob/staging/data/data.json",
  },
  {
    name: "Watch Staging Deploy",
    href: "https://app.netlify.com/sites/world-regrets-survey/deploys",
  },
];

export default function Admin() {
  const { user } = useAuth();
  const [isShowingStagingLinks, setIsShowingStagingLinks] = useState(false);
  const [isRefreshButtonLoading, setIsRefreshButtonLoading] = useState(false);
  const [isDeployButtonLoading, setIsDeployButtonLoading] = useState(false);
  const {
    locationCount,
    previousLocationCount,
    regretCount,
    previousRegretCount,
  } = useGetRegrets();

  if (!user) {
    return <Redirect noThrow to={"/"} />;
  }

  async function refreshRegrets() {
    setIsRefreshButtonLoading(true);
    const res = await fetch("/.netlify/functions/triggerRebuild", {
      method: "POST",
      body: JSON.stringify({ branch: "staging" }),
    }).then((res) => res.json());
    setIsRefreshButtonLoading(false);
    console.log(res);
    if (res.results.status === 200) {
      setIsShowingStagingLinks(true);
    }
  }
  async function deployToMaster() {
    setIsDeployButtonLoading(true);
    await fetch("/.netlify/functions/triggerRebuild", {
      method: "POST",
      body: JSON.stringify({ branch: "master" }),
    })
      .then((res) => res.json())
      .then((res) => console.log(res));
    setIsDeployButtonLoading(false);
  }

  return (
    <AdminLayout>
      <h1>Hello, {user.user_metadata.full_name}</h1>
      <AdminSection>
        <h2>Build Status</h2>
        <p>The status of the most recent build on Netlify</p>
        <img
          alt="site deploy status"
          style={{ marginBottom: `0px` }}
          src="https://api.netlify.com/api/v1/badges/7fdca82a-d896-474c-bb04-0fdf698caa7f/deploy-status"
        />
      </AdminSection>
      <AdminSection>
        <h2>Stats</h2>
        <div>
          <table>
            <thead>
              <tr>
                <th>number of</th>
                <th>current count</th>
                <th>previous count</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>Locations</td>
                <td>{locationCount}</td>
                <td>{previousLocationCount}</td>
              </tr>
              <tr>
                <td>Regrets</td>
                <td>{regretCount}</td>
                <td>{previousRegretCount}</td>
              </tr>
            </tbody>
          </table>
        </div>
      </AdminSection>
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
          Refresh{isRefreshButtonLoading && "ing..."} Staging
        </button>
        <button type="button" onClick={deployToMaster}>
          Deploy{isDeployButtonLoading && "ing..."} To Master
        </button>
        {isShowingStagingLinks && (
          <StagingLinks>
            <h4>Check to staging before merging to master</h4>
            <ul>
              {deployLinks.map((link) => {
                return (
                  <li key={link.href}>
                    <a href={link.href}>{link.name}</a>
                  </li>
                );
              })}
            </ul>
            <p>after checking deploy to master</p>
          </StagingLinks>
        )}
      </AdminSection>
    </AdminLayout>
  );
}
const AdminSection = styled.section`
  padding: 30px 20px;
  margin-bottom: 30px;
  background: ${colors.grey[2]};
  border-radius: 8px;
  ${elevation[1]};
`;
const StagingLinks = styled.div`
  margin-top: 20px;
  background: white;
  padding: 10px;
  border-radius: 8px;
  h4 {
    margin: 0;
    margin-bottom: 10px;
  }
  ul {
    padding: 0px;
    margin: 0;
    list-style: none;
  }
  li {
    font-weight: 700;
    font-size: 14px;
  }
`;
