"use client";

import React, { useEffect, useState } from "react";
import io from "socket.io-client";
import styled from "styled-components";
import Button from "@/app/components/button";
import ItemsList from "@/app/components/itemsList";
import { useRouter } from "next/navigation";
import { useAppContext } from "../../AppContext";
import useChooseServer from "@/app/hooks/useChooseServer";
import Container from "@/app/components/container";
import Instructions from "@/app/components/instructions";
import Card from "@/app/components/card";
import SessionMembersIndicator from "@/app/components/sessionMembersIndicator";
import Gap from "@/app/components/gap";

const QRCode = styled.img`
  width: 100vw;
  height: 100vw;
  border-radius: ${(props) => props.theme.surfaceBorderRadius};
  overflow: hidden;
`;

const QrPage = () => {
  const server = useChooseServer();
  const socket = io(server.socket);
  const [isConnected, setIsConnected] = useState(socket.connected);
  const [sessionMembers, setSessionMembers] = useState([]);
  const [qrCode, setQrCode] = useState();
  const { appState, setAppState } = useAppContext();
  const router = useRouter();

  useEffect(() => {
    const getReceiptData = async (sessionId) => {
      try {
        const response = await fetch(`${server.api}/getReceiptData`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ sessionId }),
        });

        if (response && !response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();

        setAppState((prevAppState) => ({ ...prevAppState, receiptData: data }));
      } catch (error) {
        console.error("Error:", error);
      }
    };

    getReceiptData(appState.sessionId);

    async function getQrCode(sessionId) {
      try {
        const response = await fetch(`${server.api}/generateQrCode`, {
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

        console.log(data.url);

        setQrCode(data.qrCode);
      } catch (error) {
        console.error("Error:", error);
      }
    }

    getQrCode(appState.sessionId);

    function onConnect() {
      setIsConnected(true);
    }

    socket.on("connect", onConnect);
    socket.emit("startSession", { sessionId: appState.sessionId });
    socket.emit("raiseHand", socket.id);

    function onSessionMembersChanged(data) {
      setSessionMembers(data.sessionMembers);
    }

    socket.on("sessionMembersChanged", onSessionMembersChanged);

    return () => {
      socket.off("connect", onConnect);
      socket.off("sessionMembersChanged", onSessionMembersChanged);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (appState.sessionId == null) {
      router.push("/capture-receipt");
    }
  }, [appState.sessionId, router]);

  const [mySubTotals, setMySubtotals] = useState({
    myItems: 0,
    myTip: 0,
    myTax: 0,
  });

  const handleSetMySubtotals = (newMySubtotals) => {
    setMySubtotals(newMySubtotals);
  };

  const [myCheckedItems, setMyCheckedItems] = useState([]);

  const handleSetMyCheckedItems = (newMyCheckedItems) => {
    setMyCheckedItems(newMyCheckedItems);
  };

  return (
    <>
      {appState.sessionId && isConnected ? (
        <Container>
          <Instructions>Show this code to everyone</Instructions>
          <Card>
            <QRCode src={qrCode} draggable={false} />
            <SessionMembersIndicator
              isConnected={isConnected}
              sessionMembers={sessionMembers}
            />
          </Card>
          <Gap />
          <Instructions>Select items that you ordered</Instructions>
          <ItemsList
            joinedFrom="present-qr"
            sessionId={appState.sessionId}
            onSubtotalsChange={handleSetMySubtotals}
            onMyCheckedItemsChange={handleSetMyCheckedItems}
            myCheckedItems={myCheckedItems}
          />
          <Button
            onClick={() => setAppState({ sessionId: null })}
            size="large"
            type="destructive"
          >
            Stop sharing
          </Button>
        </Container>
      ) : (
        <Container>
          <Instructions>Please wait</Instructions>
        </Container>
      )}
    </>
  );
};

export default QrPage;
