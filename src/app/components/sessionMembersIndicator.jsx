import React from "react";
import styled from "styled-components";

const SessionMembersWrapper = styled.div`
  height: 3rem;
  display: flex;
  flex-flow: column nowrap;
  gap: 1rem;
  align-items: center;
  justify-content: center;
  margin-top: -1.25rem;
  margin-bottom: 1.25rem;
  width: 100%;
  position: relative;
  z-index: 2;
`;

const SocketIndicator = styled.div`
  color: rgba(0, 0, 0, 0.3);
  font-weight: normal;
  &.people-joined {
    font-weight: 600;
    color: ${(props) => props.theme.connectedColor};
  }
`;

const MemberIndicatorsWrapper = styled.div`
  display: flex;
  gap: 0.5rem;
  height: 0.5rem;
`;

const MemberIndicator = styled.div`
  background-color: ${(props) => props.theme.connectedColor};
  width: 0.5rem;
  height: 0.5rem;
  border-radius: 0.5rem;
`;

const renderSessionMembersString = (sessionMembers) => {
  if (sessionMembers.length === 0) {
    // When sessionMembers.length is 2, it's just the session creator
    // One session member is created when the QR code is generated and
    // the session is started, then another is created in itemsList
    return "No one has scanned yet";
  } else if (sessionMembers.length === 1) {
    return `${sessionMembers.length} person has scanned`;
  } else {
    return `${sessionMembers.length} people have scanned`;
  }
};

const SessionMembersIndicator = ({ isConnected, sessionMembers }) => {
  const sessionMembersWithoutSessionCreator = sessionMembers.filter(
    (session) => !session.isSessionCreator
  );

  return (
    <SessionMembersWrapper>
      <SocketIndicator
        className={
          isConnected && sessionMembersWithoutSessionCreator.length > 0
            ? "people-joined"
            : ""
        }
      >
        {isConnected && (
          <p>
            {renderSessionMembersString(sessionMembersWithoutSessionCreator)}
          </p>
        )}
      </SocketIndicator>
      {isConnected && sessionMembersWithoutSessionCreator.length > 0 && (
        <MemberIndicatorsWrapper>
          {sessionMembersWithoutSessionCreator.map((member, index) => (
            <MemberIndicator key={index} />
          ))}
        </MemberIndicatorsWrapper>
      )}
    </SessionMembersWrapper>
  );
};

export default SessionMembersIndicator;
