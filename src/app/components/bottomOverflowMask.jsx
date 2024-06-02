import styled from "styled-components";
import useDetectStandaloneMode from "@/app/hooks/useDetectStandaloneMode";

const StyledBottomOverflowMask = styled.div`
  width: 100%;
  height: 3rem;
  position: fixed;
  bottom: ${(props) => (props.$isStandalone ? 3 : 2)}rem;
  z-index: 999;
  pointer-events: none;

  &::after {
    content: "";
    position: absolute;

    background-color: transparent;
    top: -4rem;
    height: 8rem;
    margin-left: 1rem;
    width: calc(100vw - 2rem);
    border-bottom-left-radius: 2rem;
    border-bottom-right-radius: 2rem;
    box-shadow: 0 4rem 0 0 #000;
    pointer-events: none;
  }
`;

const BottomOverflowMask = () => {
  const isStandalone = useDetectStandaloneMode();

  return <StyledBottomOverflowMask $isStandalone={isStandalone} />;
};

export default BottomOverflowMask;
