import netlifyIdentity from "netlify-identity-widget";

window.netlifyIdentity = netlifyIdentity;
// You must run this once before trying to interact with the widget
netlifyIdentity.init();

export { wrapRootElement } from "./src/context";

// Get IE or Edge browser version
var version = detectIE();

if (version !== false) {
  document.body.innerHTML = `<div style="display:flex; justify-content:center; align-items:center; height:100vh; width:100vw; flex-direction:column;">
      <h1>This site requires a more modern Browser.</h1>
      <p>You can still take the world regret survey by clicking on this <a href="https://worldregretsurvey.iad1.qualtrics.com/jfe/form/SV_3CRcRbjb7pIenxr">link</a></p>
      
      <p>
        <a href="https://worldregretsurvey.iad1.qualtrics.com/jfe/form/SV_3CRcRbjb7pIenxr/?Q_Language=ES">
          Participe en la encuesta
        </a>
        | 
        <a href="https://worldregretsurvey.iad1.qualtrics.com/jfe/form/SV_3CRcRbjb7pIenxr/?Q_Language=ZH-S">
          参加调查
        </a>
      </p>
    </div>
  `;
}

/**
 * detect IE
 * returns version of IE or false, if browser is not Internet Explorer
 */
function detectIE() {
  var ua = window.navigator.userAgent;

  var msie = ua.indexOf("MSIE ");
  if (msie > 0) {
    // IE 10 or older => return version number
    return parseInt(ua.substring(msie + 5, ua.indexOf(".", msie)), 10);
  }

  var trident = ua.indexOf("Trident/");
  if (trident > 0) {
    // IE 11 => return version number
    var rv = ua.indexOf("rv:");
    return parseInt(ua.substring(rv + 3, ua.indexOf(".", rv)), 10);
  }

  var edge = ua.indexOf("Edge/");
  if (edge > 0) {
    // Edge (IE 12+) => return version number
    return parseInt(ua.substring(edge + 5, ua.indexOf(".", edge)), 10);
  }

  // other browser
  return false;
}
