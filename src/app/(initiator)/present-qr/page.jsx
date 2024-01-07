"use client";

import React, { useEffect, useState, useRef } from "react";
import io from "socket.io-client";
// import styled from "styled-components";

const QrPage = () => {
  const socket = io("ws://leo.local:3000/");

  const [isConnected, setIsConnected] = useState(socket.connected);
  const [sessionMembers, setSessionMembers] = useState([]);

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

  return (
    <div>
      <h1>{`QR Page`}</h1>
      {sessionMembers.map(
        (member, index) => !member.isSessionCreator && <div key={index}>•</div>
      )}
    </div>
  );
};

export default QrPage;
