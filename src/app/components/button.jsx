import React from "react";
import PropTypes from "prop-types";
import styled from "styled-components";

const StyledButton = styled.button`
  background-color: #fff;
  color: #000;
  font-size: 1em;
  font-weight: bold;
  border: none;
  border-radius: 5em;
  padding: 0.5em 1em;
  ${(props) =>
    props.s &&
    `
      font-weight: normal;
      font-size: 0.9em;
      padding: 0.25em 0.5em;
    `};

  ${(props) =>
    props.l &&
    `
      font-size: 1.25em;
      padding: 1em 1.5em;
    `};
`;

const Button = ({ children, ...rest }) => {
  return <StyledButton {...rest}>{children}</StyledButton>;
};

Button.propTypes = {
  buttonSize: PropTypes.string,
};

export default Button;
