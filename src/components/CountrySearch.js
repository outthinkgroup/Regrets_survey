import React, { useState } from "react";
import { snakeCase } from "../lib";
import { colors } from "../styles";
export default function CountrySearch({ zoomToState }) {
  const [searchVal, setSearchVal] = useState("");
  return (
    <div>
      <form
        action=""
        style={{ position: `absolute` }}
        onSubmit={(e) => {
          e.preventDefault();
          const searchValSnakeCased = snakeCase(searchVal);
          const searchedState = document.querySelector(
            `#${searchValSnakeCased}`
          );
          if (!searchedState) {
            console.log(searchValSnakeCased, "no results");
            return null;
          }
          zoomToState(searchedState);
          setSearchVal("");
        }}
      >
        <input
          type="search"
          name=""
          value={searchVal}
          onChange={(e) => setSearchVal(e.target.value)}
          id=""
          style={{
            zIndex: 3,
            background: colors.grey[2],
          }}
        />
        <button type="submit" style={{ background: colors.grey[3] }}>
          search
        </button>
      </form>
    </div>
  );
}
