/* eslint-disable react-hooks/exhaustive-deps */
"use client";

import React, { useEffect, useState, useCallback } from "react";
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
import FormField from "@/app/components/formField";
import SessionMembersIndicator from "@/app/components/sessionMembersIndicator";
import Gap from "@/app/components/gap";
import { debounce } from "lodash";

const QRCode = styled.img`
  width: calc(100vw - 2rem);
  height: calc(100vw - 2rem);
  min-height: calc(100vw - 2rem);
  border-radius: ${(props) => props.theme.surfaceBorderRadius};
  overflow: hidden;
  opacity: 1;
  transform: scale(1);
  transition: 0.8s all;
  position: relative;
  z-index: 1;

  &:not([src]) {
    // Prevents border that browser adds on images without sources
    // before QR code is generated and shown
    transform: scale(0.9);
    opacity: 0;
  }
`;

const Suggestions = styled.div`
  position: absolute;
  display: flex;
  flex-direction: row;
  right: calc(0.5rem + 2px);
  top: 50%;
  transform: translateY(-50%);
  z-index: 2;
  font-size: 1rem;
  height: 100%;
`;

const Suggestion = styled.div`
  align-items: center;
  display: flex;
  color: ${(props) =>
    props.$isSelected ? "rgba(255, 255, 255, 1)" : "rgba(255, 255, 255, 0.5)"};
  padding: 0.75rem;
  transition: 0.2s all;
  height: 100%;

  &:active {
    opacity: 0.5;
    transform: scale(0.95);
  }
`;

const FormFieldWithSuggestions = styled.div`
  position: relative;
  z-index: 1;
`;

const Prefix = styled.div`
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  left: calc(1.25rem + 2px);
  font-size: 1rem;
  line-height: 2.25rem;
`;

const FormFieldWithPrefix = styled.div`
  position: relative;

  input:placeholder-shown + ${Prefix} {
    color: rgba(255, 255, 255, 0.25);
  }
`;

const QrPage = () => {
  const server = useChooseServer();
  const socket = io(server.socket);
  const [isConnected, setIsConnected] = useState(socket.connected);
  const [sessionMembers, setSessionMembers] = useState([]);
  const [qrCode, setQrCode] = useState();
  const [parsedTipAmount, setParsedTipAmount] = useState();
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

        setParsedTipAmount(data.transaction.tip);
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

    function onSessionMembersChanged(data) {
      setSessionMembers(data.sessionMembers);
    }

    socket.on("sessionMembersChanged", onSessionMembersChanged);

    return () => {
      socket.off("connect", onConnect);
      socket.off("sessionMembersChanged", onSessionMembersChanged);
    };
  }, []);

  useEffect(() => {
    if (appState.sessionId == null) {
      router.push("/capture-receipt");
    }
  }, [appState.sessionId, router]);

  const handleSetMySubtotals = () => {
    // We're not showing subtotals on this page, so no need to do anything here
    return false;
  };

  const [myCheckedItems, setMyCheckedItems] = useState([]);

  const handleSetMyCheckedItems = (newMyCheckedItems) => {
    setMyCheckedItems(newMyCheckedItems);
  };

  const handleClearAppState = () => {
    setAppState({ sessionId: null });
  };

  async function setTipAmount(sessionId, tip) {
    try {
      socket.emit("tipAmountChanged", {
        sessionId,
        tip,
      });

      const response = await fetch(`${server.api}/setTipAmount`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ sessionId, tip }),
      });
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      await response.json();
    } catch (error) {
      console.error("Error:", error);
    }
  }

  const debouncedSetTipAmount = useCallback(
    debounce((sessionId, tipAmount) => {
      setTipAmount(sessionId, tipAmount);
    }, 500),
    []
  );

  const handleSetTipAmount = (tip) => {
    let tipAmount = parseFloat(tip) || 0;

    setAppState((prevAppState) => ({
      ...prevAppState,
      receiptData: {
        ...prevAppState.receiptData,
        transaction: {
          ...prevAppState.receiptData.transaction,
          tip: tip,
        },
      },
    }));

    debouncedSetTipAmount(appState.sessionId, tipAmount);
  };

  return (
    <>
      {appState.sessionId &&
      appState.receiptData &&
      appState.receiptData.transaction &&
      isConnected ? (
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
          {(parsedTipAmount == null ||
            appState.receiptData.isManualTipAmount === true) && (
            <>
              <Instructions>Record tip amount</Instructions>
              <FormFieldWithSuggestions>
                <Suggestions>
                  <Suggestion
                    onClick={() => {
                      handleSetTipAmount(
                        (
                          Math.round(
                            (appState.receiptData.transaction.total -
                              appState.receiptData.transaction.tax) *
                              18
                          ) / 100
                        ).toFixed(2)
                      );
                    }}
                    $isSelected={
                      parseFloat(appState.receiptData.transaction.tip) ===
                      Math.round(
                        (appState.receiptData.transaction.total -
                          appState.receiptData.transaction.tax) *
                          18
                      ) /
                        100
                    }
                  >
                    18%
                  </Suggestion>
                  <Suggestion
                    onClick={() => {
                      handleSetTipAmount(
                        (
                          Math.round(
                            (appState.receiptData.transaction.total -
                              appState.receiptData.transaction.tax) *
                              20
                          ) / 100
                        ).toFixed(2)
                      );
                    }}
                    $isSelected={
                      parseFloat(appState.receiptData.transaction.tip) ===
                      Math.round(
                        (appState.receiptData.transaction.total -
                          appState.receiptData.transaction.tax) *
                          20
                      ) /
                        100
                    }
                  >
                    20%
                  </Suggestion>
                  <Suggestion
                    onClick={() => {
                      handleSetTipAmount(
                        (
                          Math.round(
                            (appState.receiptData.transaction.total -
                              appState.receiptData.transaction.tax) *
                              22
                          ) / 100
                        ).toFixed(2)
                      );
                    }}
                    $isSelected={
                      parseFloat(appState.receiptData.transaction.tip) ===
                      Math.round(
                        (appState.receiptData.transaction.total -
                          appState.receiptData.transaction.tax) *
                          22
                      ) /
                        100
                    }
                  >
                    22%
                  </Suggestion>
                </Suggestions>
                <FormFieldWithPrefix>
                  <FormField
                    type="text"
                    id="manualTipAmount"
                    value={appState.receiptData.transaction.tip || ""}
                    onChange={(e) => {
                      handleSetTipAmount(e.target.value);
                    }}
                    placeholder="0.00"
                    spellCheck="false"
                    $textIndent="1.5rem"
                    $prefix="$"
                  />
                  <Prefix>$</Prefix>
                </FormFieldWithPrefix>
              </FormFieldWithSuggestions>
              <Gap />
            </>
          )}
          <Instructions>Select the items that you ordered</Instructions>
          <ItemsList
            joinedFrom="present-qr"
            sessionId={appState.sessionId}
            onSubtotalsChange={handleSetMySubtotals}
            onMyCheckedItemsChange={handleSetMyCheckedItems}
            myCheckedItems={myCheckedItems}
          />
          <Gap />
          <Button
            onClick={handleClearAppState}
            $size="large"
            $isDestructive={true}
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
