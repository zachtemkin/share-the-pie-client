import styled from "styled-components";

const TopOverflowMask = styled.div`
  width: 100%;
  height: 3rem;
  position: fixed;
  top: 0;
  z-index: 999;
  pointer-events: none;

  &::before {
    content: "";
    position: absolute;

    background-color: transparent;
    bottom: -4rem;
    height: 6rem;
    width: calc(100vw - 2rem);
    border-top-left-radius: 2rem;
    border-top-right-radius: 2rem;
    box-shadow: 0 -4rem 0 0 #000;
    pointer-events: none;
  }
`;

export default TopOverflowMask;
