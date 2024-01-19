import React from "react";
import PropTypes from "prop-types";
import styled from "styled-components";

const StyledButton = styled.button`
  background-color: #fff;
  color: #000;
  font-size: 1.125rem;
  font-weight: bold;
  border: none;
  border-radius: 0.75rem;
  padding: 0.5rem 1rem;

  ${(props) =>
    props.size === 'small' &&
    `
      font-weight: normal;
      font-size: 0.9rem;
      padding: 0.25rem 0.5rem;
    `};

  ${(props) =>
    props.size === 'large' &&
    `
      line-height: 2rem;
      width: 100%;
      font-size: 1.25rem;
      padding: 0.75rem 1.5rem;
    `};

    transition: 0.2s all;

    &:active {
      opacity: 0.75;
      transform: scale(0.95);
    }
`;

const Button = ({ children, ...rest }) => {
  return <StyledButton {...rest}>{children}</StyledButton>;
};

Button.propTypes = {
  size: PropTypes.string,
};

export default Button;
