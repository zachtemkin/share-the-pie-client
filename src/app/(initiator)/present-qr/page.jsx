"use client";

import React, { useEffect, useState, useRef } from "react";
import io from "socket.io-client";
import styled from "styled-components";
import { useAppContext } from "../../AppContext";

const Page = styled.div`
  text-align: center;
`;

const QRCode = styled.img`
  filter: invert(1);
  width: 400px;
`;

const QrPage = () => {
  const socket = io("ws://localhost:4858/");

  const [isConnected, setIsConnected] = useState(socket.connected);
  const [sessionMembers, setSessionMembers] = useState([]);
  const [qrCode, setQrCode] = useState();
  const { appState, setAppState } = useAppContext();

  useEffect(() => {
    async function getQrCode(sessionId) {
      try {
        const response = await fetch("https://localhost:4000/generateQrCode", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ sessionId }),
        });
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();

        console.log(data.url)

        setQrCode(data.qrCode)
      } catch (error) {
        console.error("Error:", error);
      }
    }

    getQrCode(appState.sessionId);

    console.log('QR page:', appState.sessionId)

    function onConnect() {
      setIsConnected(true);
      console.log(`connected: ${isConnected}`);
    }

    socket.on("connect", onConnect);
    socket.emit("startSession", { sessionId: appState.sessionId });
    socket.emit("raiseHand", socket.id);

    function onSessionStarted(data) {
      console.log(data);
    }

    socket.on("sessionStarted", onSessionStarted);

    function onSessionMembersChanged(data) {
      console.log(data);
      setSessionMembers(data.sessionMembers);
    }

    socket.on("sessionMembersChanged", onSessionMembersChanged);

    return () => {
      socket.off("connect", onConnect);
      socket.off("sessionStarted", onSessionStarted);
      socket.off("sessionMembersChanged", onSessionMembersChanged);
    };
  }, []);

  return (
    <Page>
      <QRCode src={qrCode} draggable={false} />
      {sessionMembers.map(
        (member, index) => !member.isSessionCreator && <div key={index}>•</div>
      )}
    </Page>
  );
};

export default QrPage;
