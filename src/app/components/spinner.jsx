import React from "react";
import styled, { keyframes } from "styled-components";

const rotate = keyframes`
  100% {
    transform: rotate(1turn);
  }
`;

const StyledSpinner = styled.div`
  width: ${({ size }) => size}px;
  height: ${({ size }) => size}px;
  border-radius: 50%;
  background: radial-gradient(farthest-side, #ffffff 94%, transparent) top/
      ${({ strokeWidth }) => strokeWidth}px
      ${({ strokeWidth }) => strokeWidth}px no-repeat,
    conic-gradient(transparent 30%, #ffffff);
  -webkit-mask: radial-gradient(
    farthest-side,
    transparent calc(100% - ${({ strokeWidth }) => strokeWidth}px),
    #000 0
  );
  animation: ${rotate} 1s infinite linear;
`;

const Spinner = ({ size = 48, strokeWidth = 6 }) => {
  return <StyledSpinner size={size} strokeWidth={strokeWidth} />;
};

export default Spinner;
