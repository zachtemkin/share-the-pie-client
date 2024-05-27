import styled from "styled-components";

const FormField = styled.input`
  width: 100%;
  font-size: 1.125rem;
  line-height: 2.25rem;
  padding: 0.75rem;
  border-radius: ${(props) => props.theme.surfaceBorderRadius};
  outline: none;
  border: 2px solid rgba(255, 255, 255, 0.25);
  box-sizing: border-box;
  background-repeat: no-repeat;
  background-size: 2rem;
  background-position: 1.25rem 50%;
  text-indent: 3.25rem;
  background-color: ${(props) => props.theme.darkSurfaceColor};
  color: #fff;
  font-family: inherit;

  @keyframes blink_input_opacity_to_prevent_scrolling_when_focus {
    0% {
      opacity: 0;
    }
    100% {
      opacity: 1;
    }
  }

  &:focus {
    @media only screen and (hover: none) {
      animation: blink_input_opacity_to_prevent_scrolling_when_focus 0.01s;
    }
  }

  &::placeholder {
    color: rgba(255, 255, 255, 0.25);
  }

  &#cashTag {
    background-image: url("/images/cash-app.png");
  }

  &#venmoHandle {
    background-image: url("/images/venmo.png");
  }
`;

export default FormField;
