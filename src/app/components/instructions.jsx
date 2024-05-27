import React from "react";
import styled from "styled-components";

const StyledInstructions = styled.div`
  color: rgba(255, 255, 255, 1);
  font-size: 1.125rem;
  font-weight: 600;
  border: none;
  border-radius: ${(props) => props.theme.surfaceBorderRadius};
  height: 2.5rem;
  min-height: 2.5rem;
  display: flex;
  align-items: center;
  justify-content: center;
`;

const Instructions = ({ children, ...rest }) => {
  return <StyledInstructions {...rest}>{children}</StyledInstructions>;
};

export default Instructions;
