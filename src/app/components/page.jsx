import React from "react";
import styled from "styled-components";
import useDetectStandaloneMode from "@/app/hooks/useDetectStandaloneMode";

const StyledPage = styled.div`
  display: flex;
  width: 100vw;
  flex-direction: column;
  gap: 1rem;
  padding-top: 1rem;
  padding-bottom: ${(props) => (props.$isStandalone ? 3 : 1)}rem;

  ${(props) =>
    props.fullscreen === "true" &&
    `
      // To make sure iOS Safari uses correct height (doesn't include nav bar)
      height: 100%;
      height: 100dvh;
      overflow: hidden;
    `};
`;

const Page = ({ fullscreen, children, ...rest }) => {
  const isStandalone = useDetectStandaloneMode();

  return (
    <StyledPage $isStandalone={isStandalone} fullscreen={fullscreen} {...rest}>
      {children}
    </StyledPage>
  );
};

export default Page;
