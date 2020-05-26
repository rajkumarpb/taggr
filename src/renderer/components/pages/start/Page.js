import React from "react";
import PropTypes from "prop-types";
import Button from "@material-ui/core/Button";
import Typography from "@material-ui/core/Typography";
import styled from "styled-components";

import backgroundImage from "../../../statics/background.jpeg";
import FancyButton from "../../molecules/FancyButton";

const InnerWrapper = styled.div`
  background: linear-gradient(
    -47deg,
    rgb(135, 49, 232, 0.9) 0%,
    rgb(69, 40, 220, 0.9) 100%
  );

  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: space-evenly;
  margin: auto;
  text-align: center;
`;

const Wrapper = styled.div`
  background: rgba(0, 0, 0, 0) url(${backgroundImage}) no-repeat scroll center
    center / cover;
  height: 100%;
`;

const Main = styled.div`
  margin: auto;
`;

const UnderTitle = styled.p`
  margin-bottom: 2rem;
  font-family: Open Sans;
  color: white;
  font-size: 1.75rem;
`;

const Footer = styled.div`
  font-family: Open Sans;
  margin-bottom: 1rem;
  color: white;
  font-weight: 600;
  text-decoration: none;

  :hover {
    cursor: pointer;
  }
`;

const StartPage = ({ onSelectRootFolderPath, onSelectLogo }) => (
  <Wrapper>
    <InnerWrapper>
      <Main>
        <Typography
          variant="h1"
          component="h1"
          style={{
            fontFamily: "Poppins, sans-serif",
            color: "white",
            marginBottom: ".5em",
          }}
          gutterBottom
        >
          taggr
        </Typography>
        <Typography
          variant="h6"
          style={{
            fontFamily: "Poppins, sans-serif",
            color: "white",
            marginBottom: "2.5em",
          }}
        >
          Rediscover your <b>memories</b> while keeping your <b>privacy</b>
        </Typography>
        <FancyButton
          text="Select picture folder"
          onClick={onSelectRootFolderPath}
        />
      </Main>

      <Footer onClick={onSelectLogo}>
        <Typography
          variant="h6"
          style={{
            fontFamily: "Poppins, sans-serif",
            color: "white",
            fontWeight: "bold",
          }}
        >
          taggr.ai
        </Typography>
      </Footer>
    </InnerWrapper>
  </Wrapper>
);

StartPage.propTypes = {
  onSelectRootFolderPath: PropTypes.func,
  onSelectLogo: PropTypes.func,
};

export default StartPage;
