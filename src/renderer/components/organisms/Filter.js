import React, { useState } from "react";
import styled from "styled-components";

import FancyButton from "../molecules/FancyButton";
import FilterButton from "../molecules/FilterButton";

const Wrapper = styled.div`
  width: 100%;

  display: flex;
`;

const Sections = styled.div`
  width: 85%;

  display: flex;
  align-items: flex-start;
  justify-content: center;
`;

const Section = styled.div`
  margin: 16px 8px;

  border: 1px solid #dddddd;
  box-sizing: border-box;
  border-radius: 4px;

  display: flex;
  flex-direction: column;
  align-items: center;
`;

const Title = styled.div`
  border: 1px solid #dddddd;
  box-sizing: border-box;
  border-radius: 4px;
  padding: 2px 4px;

  color: #717171;
  background-color: white;

  font-weight: 700;
  font-family: Open Sans;
  font-size: 14px;

  position: relative;
  top: -12px;
  margin-bottom: -6px;
`;

const ButtonWrapper = styled.div`
  margin: 0 8px 8px;

  display: flex;
  flex-wrap: wrap;
  justify-content: center;
`;

const Filter = ({ onFilterChange }) => {
  const [activeFilter, setActiveFilter] = useState({
    dark: false,
    bright: false,
    vehicle: false,
    animal: false,
    food: false,
    sport: false,
  });

  const triggerFilter = (name) => {
    const newFilter = {
      ...activeFilter,
      [name]: !activeFilter[name],
    };

    onFilterChange(newFilter);
    setActiveFilter(newFilter);
  };

  return (
    <Wrapper>
      <Sections>
        {/* <Section>
          <Title>when</Title>
          <ButtonWrapper>
            <FilterButton text="🌙 Nights" />
            <FilterButton text="🌅 Mornings" />
          </ButtonWrapper>
        </Section> */}
        <Section>
          <Title>what</Title>
          <ButtonWrapper>
            <FilterButton
              text="🌚 Dark pics"
              active={activeFilter.dark}
              onClick={() => triggerFilter("dark")}
            />
            <FilterButton
              text="💡 Bright pics"
              active={activeFilter.bright}
              onClick={() => triggerFilter("bright")}
            />
            <FilterButton
              text="🚗 Vehicles"
              active={activeFilter.vehicle}
              onClick={() => triggerFilter("vehicle")}
            />
            <FilterButton
              text=" 🐱 Animals"
              active={activeFilter.animal}
              onClick={() => triggerFilter("animal")}
            />
            <FilterButton
              text="🍜 Food"
              active={activeFilter.food}
              onClick={() => triggerFilter("food")}
            />
            <FilterButton
              text="⚽️ Sports"
              active={activeFilter.sport}
              onClick={() => triggerFilter("sport")}
            />
          </ButtonWrapper>
        </Section>
        {/* <Section>
          <Title>where</Title>
          <ButtonWrapper>
            <FilterButton text="⛰ Mountains" />
            <FilterButton text="🌊 Water" />
          </ButtonWrapper>
        </Section>
        <Section>
          <Title>people</Title>
          <ButtonWrapper>
            <FilterButton text="🤗 Happy" />
            <FilterButton text="☹️ Sad" />
            <FilterButton text="💨 Alone" />
            <FilterButton text="👯‍♂️ Group" />
          </ButtonWrapper>
        </Section> */}
      </Sections>
      <div style={{ margin: "auto" }}>
        <FancyButton text="surprise me" />
      </div>
    </Wrapper>
  );
};

export default Filter;
