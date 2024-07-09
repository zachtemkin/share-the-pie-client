import React from "react";
import styled from "styled-components";
import useDetectStandaloneMode from "@/app/hooks/useDetectStandaloneMode";
import TopOverflowMask from "@/app/components/topOverflowMask";
import BottomOverflowMask from "@/app/components/bottomOverflowMask";

const StyledContainer = styled.div`
  display: flex;
  width: 100vw;
  flex-direction: column;
  gap: 1rem;
  padding-top: 1rem;
  padding-bottom: ${(props) => (props.$isStandalone ? 3 : 1)}rem;
  padding-left: 1rem;
  padding-right: 1rem;
  opacity: ${(props) => (props.$isVisible ? 1 : 0)};
  transition: opacity ${(props) => props.theme.motion.fadeInPageDuration}ms;

  ${(props) =>
    props.$isFixedHeight &&
    `
      // To make sure iOS Safari uses correct height (doesn't include nav bar)
      height: 100%;
      height: 100dvh;
      overflow: hidden;
      position: fixed;
    `};
`;

const Container = ({ isVisible, isFixedHeight, children, ...rest }) => {
  const isStandalone = useDetectStandaloneMode();

  return (
    <StyledContainer
      $isStandalone={isStandalone}
      $isFixedHeight={isFixedHeight}
      $isVisible={isVisible}
      {...rest}
    >
      <TopOverflowMask />
      {children}
      {(isStandalone || !isFixedHeight) && <BottomOverflowMask />}
    </StyledContainer>
  );
};

export default Container;
