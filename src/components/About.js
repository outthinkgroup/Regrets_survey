import React from "react";
import styled from "styled-components";

import AuthorImage from "./AuthorImage";
function About({ className }) {
  return (
    <div className={className}>
      <AuthorImage />
      <h2>About the Author</h2>
      <p>
        Molestie rutrum duis ipsum nec imperdiet sapien netus penatibus tempor,
        vulputate venenatis at hendrerit felis fringilla aliquet parturient urna
        arcu, erat morbi a maximus gravida lobortis litora luctus. Consectetur
        convallis eleifend imperdiet efficitur mauris quis tempor metus faucibus
        ornare per mollis, leo a suspendisse hac maecenas pretium potenti
        egestas tincidunt lectus.
      </p>
    </div>
  );
}
export default styled(About)`
  text-align: center;
  h2 {
    margin: 20px;
  }
`;
