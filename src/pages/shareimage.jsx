import React, { useState, useEffect } from "react";
import styled from "styled-components";
import { colors, fonts, elevation } from "../styles/index.js";

export default function ShareImage() {
  const [regretInfo, setRegretInfo] = useState(null);
  useEffect(() => {
    if (typeof window !== "undefined") {
      const infoFromUrl = getUrlParams();
      setRegretInfo(infoFromUrl);
    }
  }, []);
  if (!regretInfo) return null;
  const { age, gender, regret, country, state } = regretInfo;
  return (
    <ShareImageWrapper className="shareimage-container">
      <div className="regret-card">
        <cite>
					<p className="location">
						{state ? <span className="state">{state},</span> : null}{" "}
						<span className="country">{country}</span>
					</p>
          <p className="info">
            <span className="gender">{gender}</span>, age{` `}
            <span className="age">{age}</span>
          </p>
        </cite>
        <blockquote className="regret">{regret}</blockquote>
				<a href="/">worldregretsurvey.com</a>
      </div>
    </ShareImageWrapper>
  );
}
const ShareImageWrapper = styled.div`
	position:fixed;
	top:0;
	left:0;
	width:100%;
  font-family:${fonts.family};
	height:100vh;
	background:url('/share-img-bg.jpg');
	background-repeat:no-repeat;
	display:flex;
	justify-content:center;
	align-items:center;

	.regret-card{
		text-align:center;
		background:white;
		box-shadow:0px 50px 100px rgba(50, 50, 50, 0.1), 0px 15px 35px rgba(50, 50, 93, 0.1), 0px 5px 15px rgba(0, 0, 0, 0.1);
		border-radius:10px;
		padding:26px 46px;
		width:746px;
		height:435px;
		display:flex;
		flex-direction:column;
		justify-content:space-between; 
		gap:24px;
	}
	cite{
		font-weight:700;
		color:black;
		font-style:normal;	            
		p{
			margin:0;
		}
	}
	.location{
		font-size: 14px;
		text-transform:uppercase;
	}
  .info{
		font-size:18px;
		text-transform:capitalize;  
	}
	a{
		text-decoration:none;
		color:${colors.primary.base};
		font-weight:bold;
	}
	.regret{
		font-size:30px;
		line-height:1.33;
		font-weight:300;
	}
	
`;

function getUrlParams() {
  const params = new URLSearchParams(window.location.search);
  const age = params.get("age");
  const gender = params.get("gender");
  const state = params.get("state");
  const country = params.get("country");
  const regret = params.get("regret");

  return {
    age,
    gender,
    regret: decodeURIComponent(regret),
    country,
    state,
  };
}
