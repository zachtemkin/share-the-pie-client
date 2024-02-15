import React from "react";
import styled from "styled-components";

const CardSurface = styled.div`
  background-color: ${(props) => props.theme.lightSurfaceColor};
  border-radius: ${(props) => props.theme.surfaceBorderRadius};
`;

const Card = ({ children }) => {
  return <CardSurface>{children}</CardSurface>;
};

export default Card;
