import React from "react";
import styled from "styled-components";

const LogoWrapper = styled.div`
  height: ${(props) => props.height}px;
  width: ${(props) => props.width}px;
  background: linear-gradient(-47deg, #8731e8 0%, #4528dc 100%);
  color: white;
  text-align: center;
  transform: rotate(-10deg);

  border-radius: 6px;
`;

const LogoInner = styled.h1`
  margin: 0;
  position: relative;
  top: -6px;
  left: -1px;
  font-family: Poppins;
  font-size: ${(props) => props.height - 6}px;
  transform: rotate(10deg);
`;

const Logo = ({ height = 40, width = 40 }) => (
  <LogoWrapper height={height} width={width}>
    <LogoInner height={height}>t</LogoInner>
  </LogoWrapper>
);

export default Logo;