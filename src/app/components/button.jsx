import React from "react";
import PropTypes from "prop-types";
import styled from "styled-components";

const StyledButton = styled.button`
  background-color: ${(props) =>
    props.$backgroundColor ? props.$backgroundColor : "#fff"};
  color: ${(props) => (props.$textColor ? props.$textColor : "#000")};
  font-weight: bold;
  border: none;
  border-radius: ${(props) => props.theme.surfaceBorderRadius};
  flex: 1;

  ${(props) =>
    props.$size === "small" &&
    `
      font-size: 1.125rem;
      line-height: 2rem;
      width: 100%;
      height: 2.5rem;
      min-height: 2.5rem;
      padding: 0 0.75rem;
    `};

  ${(props) =>
    props.$size === "large" &&
    `
      font-size: 1.125rem;
      line-height: 2rem;
      width: 100%;
      height: 3.5rem;
      min-height: 3.5rem;
    `};

  ${(props) =>
    props.$isDestructive === true &&
    `
      color: #fff;
      background: red;
    `};

  transition: 0.2s all;

  &:active {
    opacity: 0.75;
    transform: scale(0.95);
  }

  &:disabled {
    pointer-events: none;
    opacity: 0.25;
  }
`;

const Button = ({ children, ...rest }) => {
  return <StyledButton {...rest}>{children}</StyledButton>;
};

Button.propTypes = {
  $size: PropTypes.string,
  $isDestructive: PropTypes.bool,
  $backgroundColor: PropTypes.string,
  $textColor: PropTypes.string,
};

export default Button;
