import React, { useState, useMemo, useEffect, useRef } from "react";
import { useAuth, GET_REGRETS } from "../hooks";
import AdminLayout from "./AdminLayout";
import { colors, elevation, fonts } from "../styles";
import { Redirect } from "@reach/router";
import styled from "styled-components";
import { useStaticQuery, graphql } from "gatsby";

const REGRET_LIST = graphql`
  query REGRET_LIST {
    allQualtricsData {
      nodes {
        results {
          regretList {
            date
            gender
            id
            age
            location {
              country
              state
            }
            regret
          }
        }
      }
    }
  }
`;

export default function RegretImageCreator() {
  const { user } = useAuth();
  const { allQualtricsData } = useStaticQuery(REGRET_LIST);
  const { regretList } = allQualtricsData.nodes[0].results;
  const [activePreviewRegretIndex, setActivePreviewRegretIndex] = useState(0);

  const previewRegret = regretList[activePreviewRegretIndex];

  const [settings, setSettings] = useState(() => ({
    ...previewRegret,
    state: previewRegret.location.state,
    country: previewRegret.location.country,
  }));

  function updateSettings(e) {
    const { name, value } = e.target;
    setSettings((state) => ({ ...state, [name]: value }));
  }
  async function saveImage(e, checkToGit = false) {
    console.log(process.env.NODE_ENV);
    e.preventDefault();
    const url = `/.netlify/functions/${
      process.env.NODE_ENV == "development" ? "shareImage-dev" : "shareImage"
    }/${123}/${settings.gender}/${settings.age}/${encodeURIComponent(
      settings.regret
    )}/${settings.country}/${settings.state ? settings.state : ""}`;

    const imageBlob = await fetch(url).then((res) => res.blob());
    const imageObjectURL = URL.createObjectURL(imageBlob);
    const a = document.createElement("a");
    a.href = imageObjectURL;
    a.download = `regret-${settings.gender}-${settings.country}.png`;
    a.click();
  }

  function seeAnotherRegret() {
    setActivePreviewRegretIndex(() =>
      Math.floor(Math.random() * regretList.length)
    );
  }

  useEffect(() => {
    if (regretList) {
      setActivePreviewRegretIndex(
        Math.floor(Math.random() * regretList.length)
      );
    }
  }, [regretList]);

  useEffect(() => {
    setSettings({
      ...previewRegret,
      state: previewRegret.location.state ? previewRegret.location.state : "",
      country: previewRegret.location.country,
    });
  }, [setSettings, previewRegret]);

  const [iframeRatioToFit, setIframeRatioToFit] = useState(1);
  const iframeRef = useRef();
  useEffect(() => {
    if (iframeRef && iframeRef.current) {
      const containerWidth = iframeRef.current.parentElement.getBoundingClientRect()
        .width;
      const twitterImageWidth = 1024;
      console.log(containerWidth);
      setIframeRatioToFit(containerWidth / twitterImageWidth);
    }
  }, [iframeRef.current, setIframeRatioToFit]);

  if (!user) {
    return <Redirect noThrow to={"/"} />;
  }

  return (
    <AdminLayout>
      <h1> Create a Regret Share Image</h1>
      <PageWrapper iframeRatioToFit={iframeRatioToFit}>
        <div className="settings">
          <div className="setting">
            <label>Country</label>
            <input
              type="text"
              name="country"
              value={settings.country}
              onChange={updateSettings}
            />
          </div>
          <div className="setting">
            <label>State</label>
            <input
              type="text"
              name="state"
              value={settings.state}
              onChange={updateSettings}
            />
          </div>
          <div className="setting">
            <label>Gender</label>
            <input
              type="text"
              name="gender"
              value={settings.gender}
              onChange={updateSettings}
            />
          </div>
          <div className="setting">
            <label>Age</label>
            <input
              type="text"
              name="age"
              value={settings.age}
              onChange={updateSettings}
            />
          </div>
          <div className="setting">
            <label>Regret</label>
            <textarea
              name="regret"
              onChange={updateSettings}
              value={settings.regret}
            ></textarea>
          </div>
          <div className="options">
            <button onClick={seeAnotherRegret} type="button">
              Find Another
            </button>
            <button onClick={saveImage} type="button">
              Save as Image
            </button>
            {/*<button onClick={(e) => saveImage(e, true)} type="button">
              Save Image and Upload
						</button>*/}
          </div>
        </div>
        <div className="preview">
          <iframe
            ref={iframeRef}
            src={`/shareimage?age=${settings.age}&gender=${settings.gender}&regret=${settings.regret}&country=${settings.country}&state=${settings.state}`}
            width="1024"
            height="512"
          />
        </div>
      </PageWrapper>
    </AdminLayout>
  );
}
const PageWrapper = styled.div`
  font-family: ${fonts.family};
  display: flex;
  width: 100%;
  gap: 20px;
  .settings label {
    display: block;
    font-weight: bold;
    font-size: 14px;
  }
  textarea[name="regret"] {
    width: 300px;
    height: 200px;
    resize: none;
  }
  .options {
    display: flex;
    gap: 10px;
  }
  .preview {
    max-width: 100%;
    overflow-x: hidden;
    position: relative;
    width: 100%;
  }
  .preview iframe {
    transform: scale(${({ iframeRatioToFit }) => iframeRatioToFit});
    transform-origin: 0 0;
  }
`;
