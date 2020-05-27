import React, { useState } from "react";
import Downshift, { useSelect } from "downshift";
import { snakeCase } from "../lib";
import { colors } from "../styles";
import { useGetRegrets } from "../hooks/useGetRegrets";
export default function CountrySearch({ zoomToState }) {
  const { totalRegretsPerCountry } = useGetRegrets();
  const countries = Object.keys(totalRegretsPerCountry);
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
        }}
      >
        <DropdownSelect
          searchVal={searchVal}
          setSearchVal={setSearchVal}
          items={countries}
        />

        <button type="submit" style={{ background: colors.grey[3] }}>
          search
        </button>
      </form>
    </div>
  );
}

function DropdownSelect({ items, setSearchVal, searchVal }) {
  function handleStateChange(changes) {
    if (changes.hasOwnProperty("selectedItem")) {
      setSearchVal(changes.selectedItem);
    } else if (changes.hasOwnProperty("inputValue")) {
      setSearchVal(changes.inputValue);
    }
  }
  return (
    <>
      <Downshift
        selectedItem={searchVal}
        onStateChange={handleStateChange}
        itemToString={(item) => (item ? item : "")}
      >
        {({
          getInputProps,
          getItemProps,
          getLabelProps,
          getMenuProps,
          isOpen,
          inputValue,
          highlightedIndex,
          selectedItem,
          getRootProps,
        }) => (
          <div>
            <div
              style={{
                display: "inline-block",
              }}
              {...getRootProps(
                {},
                {
                  suppressRefError: true,
                }
              )}
            >
              <input {...getInputProps()} />
            </div>
            <ul {...getMenuProps()}>
              {isOpen
                ? items
                    .filter(
                      (item) =>
                        !inputValue ||
                        item.toLowerCase().includes(inputValue.toLowerCase())
                    )
                    .map((item, index) => (
                      <li
                        styles={{
                          color: `black`,
                        }}
                        {...getItemProps({
                          key: item,
                          index,
                          item,
                          style: {
                            color: `black`,
                            backgroundColor:
                              highlightedIndex === index
                                ? "lightgray"
                                : "white",
                            fontWeight:
                              selectedItem === item ? "bold" : "normal",
                          },
                        })}
                      >
                        {item}
                      </li>
                    ))
                : null}
            </ul>
          </div>
        )}
      </Downshift>
    </>
  );
}
