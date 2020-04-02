import React from "react"
import styled from "styled-components"
import { Link } from "gatsby"
import SurveyButton from "./SurveyButton"
import WorldRegreArtwork from "./WorldRegretArtwork"
function Welcome({ className }) {
  return (
    <div className={className}>
      <div className="artwork">
        <WorldRegreArtwork />
      </div>
      <h1>Welcome To the Regrets Survey</h1>
      <p>
        Eu sem conubia tincidunt, maecenas netus fusce, natoque ipsum. Duis
        lacus eleifend venenatis a adipiscing ipsum condimentum, iaculis
        himenaeos suspendisse varius semper efficitur facilisi aenean, hac
        consequat dictum volutpat augue non. Iaculis ridiculus dignissim cubilia
        magna nec scelerisque tortor, parturient tristique commodo inceptos et
        ex, dolor aliquam venenatis duis vehicula donec.
      </p>
      <h2>Take the Survey</h2>
      <SurveyButton to="/survey">Take Survey</SurveyButton>
    </div>
  )
}

export default styled(Welcome)`
  .artwork {
    margin: 0 auto;
    max-width: 200px;
    padding: 20px;
  }
  text-align: center;
  ${SurveyButton} {
    padding: 10px 18px;
    font-size: 18px;
  }
`
