import React, { useState } from "react";
import Downshift, { useSelect } from "downshift";
import { snakeCase } from "../lib";
import { colors, fonts } from "../styles";
import { useGetRegrets } from "../hooks/useGetRegrets";
import styled from "styled-components";
export default function CountrySearch({ zoomToState }) {
  const { totalRegretsPerCountry } = useGetRegrets();
  const countries = Object.keys(totalRegretsPerCountry);
  const [searchVal, setSearchVal] = useState("");
  return (
    <div>
      <form
        action=""
        style={{ position: `absolute`, display: `flex` }}
        onSubmit={(e) => {
          e.preventDefault();
          if (searchVal == "") return;
          const searchValSnakeCased = snakeCase(searchVal);
          const searchedState = document.querySelector(
            `[data-country="${searchValSnakeCased}"], [data-state=${searchValSnakeCased}]`
          );
          if (!searchedState) {
            console.log(searchValSnakeCased, "no results");
            return null;
          }
          zoomToState(searchedState);
          setSearchVal("");
        }}
      >
        <DropdownSelect
          searchVal={searchVal}
          setSearchVal={setSearchVal}
          items={countries}
        />

        <SearchButton type="submit">Search Location</SearchButton>
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
              <div>
                <SearchBar {...getInputProps()} />
              </div>
            </div>
            <Options {...getMenuProps()}>
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
                            borderLeft:
                              highlightedIndex === index
                                ? `2px solid ${colors.primary.base}`
                                : "none",
                            backgroundColor:
                              highlightedIndex === index
                                ? "lightgray"
                                : "white",
                            fontWeight:
                              highlightedIndex === index ? "bold" : "normal",
                          },
                        })}
                      >
                        {item}
                      </li>
                    ))
                : null}
            </Options>
          </div>
        )}
      </Downshift>
    </>
  );
}
const Options = styled.ul`
  font-family: ${fonts.family};
  list-style: none;
  margin: 0;
  padding: 0;
  max-height: 300px;
  overflow-y: scroll;
  box-shadow: 0 14px 28px rgba(0, 0, 0, 0.25), 0 10px 10px rgba(0, 0, 0, 0.22);
  li {
    margin: 0;
    padding: 10px;
  }
`;
const SearchBar = styled.input`
  background: ${colors.grey[2]};
  position: relative;
  z-index: 3;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.12), 0 1px 2px rgba(0, 0, 0, 0.24);
  border: none;
  border-radius: 3px;
  font-family: ${fonts.family};
  font-weight: ${fonts.weights[2]};
  margin-right: 10px;
`;
const SearchButton = styled.button`
  font-family: ${fonts.family};
  font-weight: ${fonts.weights[2]};
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.12), 0 1px 2px rgba(0, 0, 0, 0.24);
  border: none;
  font-size: 16px;
  border-radius: 3px;
  background: ${colors.primary.light};
  height: 28px;
  &:hover {
    background: ${colors.primary.base};
    color: white;
  }
`;
