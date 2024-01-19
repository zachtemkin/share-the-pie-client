"use client";

import useChooseServer from "@/app/hooks/useChooseServer";
import React, { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import { useAppContext } from "../../AppContext";
import styled from "styled-components";
import Button from "../../components/button";
import ItemsList from "../../components/itemsList";

const Subtotals = styled.ul``;

const Row = styled.li``;

const ViewItems = () => {
  const searchParams = useSearchParams();
  const sessionId = searchParams.get("sessionId");
  const [mySubTotals, setMySubtotals] = useState({
    myItems: 0,
    myTip: 0,
    myTax: 0,
  });

  const { appState, setAppState } = useAppContext();

  const server = useChooseServer();

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

    getReceiptData(sessionId);
  }, []);

  const [myTotal, setMyTotal] = useState(0);

  const handleSetMySubtotals = (newMySubtotals) => {
    setMySubtotals(newMySubtotals);
  };

  useEffect(() => {
    const myTotalValue = Object.values(mySubTotals).reduce(
      (acc, current) => acc + current,
      0
    );

    const myTotalValueUSD = new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(myTotalValue);

    setMyTotal(myTotalValueUSD);
  }, [mySubTotals, setMyTotal]);

  const [buttonLabel, setButtonLabel] = useState("");
  const [handlesArray, setHandlesArray] = useState([]);

  useEffect(() => {
    setHandlesArray(
      [
        { label: "Cash App", value: `$${appState.receiptData.initiator.cashTag}` },
        { label: "Venmo", value: `@${appState.receiptData.initiator.venmoHandle}` },
      ].filter((handle) => handle.value !== "")
    );
    setButtonLabel(appState.cashTag ? appState.cashTag : "");
  }, [appState]);

  return (
    <>
      {sessionId && (
        <>
          <ItemsList
            sessionId={sessionId}
            onSubtotalsChange={handleSetMySubtotals}></ItemsList>
          <Subtotals>
            {mySubTotals &&
              Object.keys(mySubTotals).map((subTotalKey, index) => {
                const subTotalValue = mySubTotals[subTotalKey].toFixed(2);
                const subTotalValueUSD = new Intl.NumberFormat("en-US", {
                  style: "currency",
                  currency: "USD",
                }).format(subTotalValue);

                return (
                  <Row key={index}>
                    {subTotalKey}: {subTotalValueUSD}
                  </Row>
                );
              })}
          </Subtotals>
          {handlesArray.map((handle, key) => (
            <Button key={key}>
              Pay {myTotal} to {handle.value} on {handle.label}
            </Button>
          ))}
        </>
      )}
    </>
  );
};

export default ViewItems;
