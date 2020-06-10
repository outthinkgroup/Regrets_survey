import React, { useState } from "react";
import Downshift, { useSelect } from "downshift";
import styled from "styled-components";
import { snakeCase, unSnakeCase } from "../lib";
import { colors, fonts, elevation, breakpoints } from "../styles";
import { useGetRegrets } from "../hooks/useGetRegrets";
import { useNotification } from "../context";

function CountrySearch({ send, className }) {
  const { totalRegretsPerCountry, locations } = useGetRegrets();
  const { createWarning } = useNotification();

  const locationsPretty = locations.map(({ name, regretCount }) => {
    return { location: unSnakeCase(name), regretCount };
  });

  const [searchVal, setSearchVal] = useState("");
  return (
    <div className={className}>
      <form
        action=""
        style={{ display: `flex` }}
        onSubmit={(e) => {
          e.preventDefault();
          if (searchVal == "") return;

          const searchValSnakeCased = snakeCase(searchVal);
          const searchedState = document.querySelector(
            `[data-country="${searchValSnakeCased}"], [data-state=${searchValSnakeCased}]`
          );
          if (!searchedState) {
            createWarning("NO_RESULTS");
            console.log(searchValSnakeCased, "no results"); //TODO: make this something the user can see.
            return null;
          }

          const type = searchedState.dataset.state
            ? "STATE"
            : searchedState.dataset.hasChildren
            ? "PARENT_COUNTRY"
            : "COUNTRY";
          if (type === "STATE") {
            searchedState.closest("[data-country]").dataset.active = "true";
          }
          send(["searched", { searchedState, type }]);
          setSearchVal("");
        }}
      >
        <span>
          <DropdownSelect
            searchVal={searchVal}
            setSearchVal={setSearchVal}
            items={locationsPretty}
          />
        </span>
        <span>
          <SearchButton type="submit">Search Location</SearchButton>
        </span>
      </form>
    </div>
  );
}

function DropdownSelect({ items, setSearchVal, searchVal }) {
  function handleStateChange(changes) {
    if (changes.hasOwnProperty("selectedItem")) {
      setSearchVal(changes.selectedItem.location);
    } else if (changes.hasOwnProperty("inputValue")) {
      setSearchVal(changes.inputValue);
    }
  }
  return (
    <>
      <Downshift
        selectedItem={searchVal}
        onStateChange={handleStateChange}
        //itemToString={(item) => (item ? item.country : "")}
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
                <SearchBar
                  {...getInputProps({
                    value: searchVal,
                  })}
                />
              </div>
            </div>
            {isOpen && (
              <Options {...getMenuProps({ isOpen })}>
                {items
                  .filter((item) => {
                    return (
                      !inputValue ||
                      item.location
                        .toLowerCase()
                        .includes(inputValue.toLowerCase())
                    );
                  })

                  .map((item, index) => (
                    <ListItem
                      className="listItem"
                      isHighLighted={highlightedIndex === index}
                      style={{
                        color: `black`,
                      }}
                      {...getItemProps({
                        key: item.location,
                        index,
                        item,
                        style: {
                          color: `black`,
                          borderLeft:
                            highlightedIndex === index
                              ? `2px solid ${colors.primary.base}`
                              : "none",
                          backgroundColor:
                            highlightedIndex === index ? "lightgray" : "white",
                          fontWeight:
                            highlightedIndex === index ? "bold" : "normal",
                        },
                      })}
                    >
                      <span className="name">{item.location}</span>
                      <span className="count">{item.regretCount}</span>
                    </ListItem>
                  ))}
              </Options>
            )}
          </div>
        )}
      </Downshift>
    </>
  );
}
export default styled(CountrySearch)`
  padding: 5px;
  background: #eaeaea;
  display: flex;
  justify-content: flex-end;
  z-index: 2;
  @media (min-width: ${breakpoints.small}) {
    background: transparent;
    position: absolute;
    top: 0;
    right: 0%;
    form {
      ${elevation[3]};
    }
  }
  form {
    display: flex;
    margin-bottom: 0;
    position: relative;
  }
`;
const Options = styled.ul`
  font-family: ${fonts.family};
  list-style: none;
  margin: 0;
  padding: 0;
  position: absolute;
  width: 100%;
  z-index: 100;
  max-height: 300px;
  overflow-y: scroll;
  box-shadow: 0 14px 28px rgba(0, 0, 0, 0.25), 0 10px 10px rgba(0, 0, 0, 0.22);
`;
const ListItem = styled.li`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin: 0;
  padding: 10px 15px;
  .count {
    display: block;
    border-radius: 50%;
    text-align: center;
    background: ${({ isHighLighted }) =>
      isHighLighted ? "white" : "lightgray"};
    font-feature-settings: "tnum";
    font-variant-numeric: tabular-nums;
    font-weight: 700;
    font-size: 0.75em;
    padding: 0.25rem;
    line-height: 1rem;
    min-width: 1.5rem;
  }
`;
const SearchBar = styled.input`
  background: white;
  position: relative;
  border: 1px solid transparent;
  font-family: ${fonts.family};
  font-weight: ${fonts.weights[2]};
`;
const SearchButton = styled.button`
  font-family: ${fonts.family};
  font-weight: ${fonts.weights[2]};
  border: 1px solid transparent;
  font-size: 14px;
  background: ${colors.primary.light};
  white-space: nowrap;
  /* height: 100%; */
  &:hover {
    background: ${colors.primary.base};
    color: white;
  }
`;
