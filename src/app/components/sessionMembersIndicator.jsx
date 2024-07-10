import React, { useRef, useEffect, useState } from "react";
import styled from "styled-components";

const NoOneJoinedYetIndicator = styled.div`
  color: rgba(0, 0, 0, 0.3);
  font-weight: normal;
  position: absolute;
  width: calc(100% - 2rem);
  text-align: center;
  margin-top: -0.25rem;
  z-index: 2;
  opacity: 1;
  transition: opacity
    ${(props) => props.theme.motion.defaultTransitionDuration}ms;

  &.hidden {
    opacity: 0;
  }
`;

const MembersIndicatorsWrapper = styled.div`
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
  font-size: 0;
  opacity: 0;
  transition-property: opacity;
  transition-duration: ${(props) =>
    props.theme.motion.defaultTransitionDuration}ms;

  &.people-joined {
    opacity: 1;
  }
`;

const MemberCountString = styled.div`
  transition: color ${(props) => props.theme.motion.defaultTransitionDuration}ms;
  font-size: 1rem;
  font-weight: 600;
  color: ${(props) => props.theme.connectedColor};
`;

const MembersIndicators = styled.div`
  font-size: 0;
  width: fit-content;
  height: 0.5rem;
`;

const JoinedMembersIndicators = styled.div`
  display: inline-block;
  width: fit-content;
  position: relative;
  height: 0.5rem;
  margin-left: -8px;
`;

const JustLeftJoinedMembersIndicators = styled.div`
  display: inline-block;
  reverse: true;
`;

const MemberIndicator = styled.div`
  border-radius: 0.5rem;
  display: inline-block;
  transition-property: margin-left, opacity, width, height;
  transition-duration: ${(props) =>
    props.theme.motion.defaultTransitionDuration}ms;
  transition-timing-function: ease-out;

  background-color: ${(props) => props.theme.connectedColor};
  width: 0.5rem;
  height: 0.5rem;
  margin-left: 8px;
  opacity: 1;

  &.size-0 {
    width: 0;
    height: 0;
    margin-left: 0;
    opacity: 0;
  }

  &.opacity-0 {
    width: 0.5rem;
    height: 0.5rem;
    margin-left: 8px;
    opacity: 0;
  }

  &.visible {
    width: 0.5rem;
    height: 0.5rem;
    margin-left: 8px;
    opacity: 1;
  }
`;

const renderSessionMembersString = (sessionMembers) => {
  if (sessionMembers.length <= 1) {
    return `1 person has scanned`;
  } else {
    return `${sessionMembers.length} people have scanned`;
  }
};

const SessionMembersIndicator = ({ isConnected, sessionMembers }) => {
  const sessionMembersWithoutSessionCreator = sessionMembers.filter(
    (member) => !member.isSessionCreator
  );

  const [hasPeopleJoined, setHasPeopleJoined] = useState(false);
  const [showNoOneHasJoinedYetIndicator, setShowNoOneHasJoinedYetIndicator] =
    useState(true);

  useEffect(() => {
    let delay;
    let delay2;
    if (
      isConnected &&
      !hasPeopleJoined &&
      sessionMembersWithoutSessionCreator.length > 0
    ) {
      setShowNoOneHasJoinedYetIndicator(
        isConnected && sessionMembersWithoutSessionCreator.length > 0
      );
      delay = setTimeout(() => {
        setHasPeopleJoined(true);
      }, 500);
    } else {
      delay2 = setTimeout(() => {
        setShowNoOneHasJoinedYetIndicator(
          isConnected && sessionMembersWithoutSessionCreator.length > 0
        );
      }, 500);
      setHasPeopleJoined(
        isConnected && sessionMembersWithoutSessionCreator.length > 0
      );
    }

    return () => {
      clearTimeout(delay);
      clearTimeout(delay2);
    };
  }, [isConnected, sessionMembersWithoutSessionCreator, hasPeopleJoined]);

  const joinedMembersIndicators = useRef(null);
  const justLeftMemberIndicators = useRef(null);
  const joinedMembersIndicatorsObserver = useRef(null);

  useEffect(() => {
    joinedMembersIndicatorsObserver.current = new MutationObserver(
      (mutationsList) => {
        for (const mutation of mutationsList) {
          if (mutation.type === "childList") {
            mutation.addedNodes.forEach((memberIndicator) => {
              if (memberIndicator.nodeType === memberIndicator.ELEMENT_NODE) {
                handleMemberIndicatorAdded(memberIndicator);
              }
            });

            mutation.removedNodes.forEach((memberIndicator) => {
              if (memberIndicator.nodeType === memberIndicator.ELEMENT_NODE) {
                handleMemberIndicatorRemoved(memberIndicator);
              }
            });
          }
        }
      }
    );

    joinedMembersIndicatorsObserver.current.observe(
      joinedMembersIndicators.current,
      {
        childList: true,
      }
    );

    return () => {
      joinedMembersIndicatorsObserver.current.disconnect();
    };
  }, []);

  const handleMemberIndicatorAdded = (memberIndicator) => {
    memberIndicator.classList.add("size-0");

    setTimeout(() => {
      memberIndicator.classList.remove("size-0");
      memberIndicator.classList.add("opacity-0");

      setTimeout(() => {
        memberIndicator.classList.add("visible");
      }, 250);
    }, 250);
  };

  const handleMemberIndicatorRemoved = (memberIndicator) => {
    justLeftMemberIndicators.current.appendChild(memberIndicator);

    memberIndicator.classList.add("visible");

    setTimeout(() => {
      memberIndicator.classList.remove("visible");
      memberIndicator.classList.add("opacity-0");

      setTimeout(() => {
        memberIndicator.classList.remove("opacity-0");
        memberIndicator.classList.add("size-0");

        setTimeout(() => {
          memberIndicator.classList.remove("size-0");
          justLeftMemberIndicators.current.removeChild(memberIndicator);
        }, 250);
      }, 250);
    }, 250);
  };

  return (
    <>
      <NoOneJoinedYetIndicator
        className={showNoOneHasJoinedYetIndicator && "hidden"}
      >
        No one has scanned yet
      </NoOneJoinedYetIndicator>
      <MembersIndicatorsWrapper className={hasPeopleJoined && "people-joined"}>
        <MemberCountString>
          {renderSessionMembersString(sessionMembersWithoutSessionCreator)}
        </MemberCountString>
        <MembersIndicators>
          <JoinedMembersIndicators ref={joinedMembersIndicators}>
            {sessionMembersWithoutSessionCreator.map((member, index) => (
              <MemberIndicator key={index} />
            ))}
          </JoinedMembersIndicators>
          <JustLeftJoinedMembersIndicators ref={justLeftMemberIndicators} />
        </MembersIndicators>
      </MembersIndicatorsWrapper>
    </>
  );
};

export default SessionMembersIndicator;
