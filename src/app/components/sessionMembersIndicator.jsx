import React from "react";
import styled from "styled-components";

const SessionMembersWrapper = styled.div`
  display: flex;
  flex-flow: row nowrap;
  align-items: center;
  justify-content: space-between;
  padding: 0 44px;
  width: 100%;
`;

const SocketIndicator = styled.div`
  color: rgba(255, 255, 255, 0.5);
  &.is-connected {
    color: ${(props) => props.theme.connectedColor};
  }
`;

const MemberIndicatorsWrapper = styled.div`
  display: flex;
  gap: 0.5rem;
`;

const MemberIndicator = styled.div`
  background-color: ${(props) => props.theme.connectedColor};
  width: 0.5rem;
  height: 0.5rem;
  border-radius: 0.5rem;
`;

const SessionMembersIndicator = ({ isConnected, sessionMembers }) => {
  return (
    <SessionMembersWrapper>
      <SocketIndicator className={isConnected ? "is-connected" : ""}>
        {isConnected && <p>Active</p>}
      </SocketIndicator>
      <MemberIndicatorsWrapper>
        {sessionMembers.map(
          (member, index) =>
            !member.isSessionCreator && <MemberIndicator key={index} />
        )}
      </MemberIndicatorsWrapper>
    </SessionMembersWrapper>
  );
};

export default SessionMembersIndicator;
