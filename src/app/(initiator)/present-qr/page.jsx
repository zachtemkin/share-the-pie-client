"use client";

import React, { useEffect, useState, useRef } from "react";
import io from "socket.io-client";
import styled from "styled-components";

const QrPage = () => {
  const socket = io("ws://leo.local:3000/");

  const [isConnected, setIsConnected] = useState(socket.connected);
  const [sessionMembers, setSessionMembers] = useState([]);
  const [qrCode, setQrCode] = useState();

  useEffect(() => {
    function onConnect() {
      setIsConnected(true);
      console.log(`connected: ${isConnected}`);
    }

    socket.on("connect", onConnect);
    socket.emit("startSession", { sessionId: "4809283" });
    socket.emit("raiseHand", socket.id);

    function onSessionStarted(data) {
      console.log(data);

      setQrCode(data.qrCode);
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

  //   useEffect(() => {
  //     console.log(connections);
  //   });

  const Page = styled.div`
    text-align: center;
  `

  const QRCode = styled.img`
    filter: invert(1);
    width: 400px;
  `;

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
