import React from "react";
import styled from "styled-components";
function ThanksSection({ className }) {
  return (
    <div className={className}>
      <h1>
        Thanks For Taking
        <br />
        The World Regret Survey
      </h1>
      <p>
        check out the map, and feel free to share it!! [TODO: share buttons ]
      </p>
    </div>
  );
}

export default styled(ThanksSection)`
  h1 {
    font-size: 38px;
    @media (min-width: 560px) {
      font-size: 51px;
    }
  }
  margin: 0 auto;
  max-width: 600px;
  padding-top: 100px;
  text-align: center;
  p {
    line-height: 1.5;
  }
`;
