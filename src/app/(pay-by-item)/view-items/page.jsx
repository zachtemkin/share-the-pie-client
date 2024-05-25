"use client";

import useChooseServer from "@/app/hooks/useChooseServer";
import React, { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import { useAppContext } from "../../AppContext";
import { Suspense } from "react";
import styled from "styled-components";
import Button from "../../components/button";
import ItemsList from "../../components/itemsList";

const Subtotals = styled.ul``;

const Row = styled.li``;

const ShowItemsList = () => {
  const searchParams = useSearchParams();
  const sessionId = searchParams.get("sessionId");

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
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

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

  const [myTotal, setMyTotal] = useState(0);

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

  const [handlesArray, setHandlesArray] = useState([]);

  useEffect(() => {
    if (appState.receiptData && appState.receiptData.initiator) {
      setHandlesArray(
        [
          {
            label: "Cash App",
            prefix: "$",
            value: appState.receiptData.initiator.cashTag,
          },
          {
            label: "Venmo",
            prefix: "@",
            value: appState.receiptData.initiator.venmoHandle,
          },
        ].filter((handle) => handle.value !== "")
      );
    }
  }, [appState]);

  const handlePaymentButtonClick = (handle, myCheckedItems) => {
    const items = myCheckedItems
      .map((item) => {
        return item.description.replaceAll("\r", " ").replaceAll("\n", " ");
      })
      .join(", ");

    let note = "";
    if (appState.receiptData.merchant.name) {
      note = `${appState.receiptData.merchant.name}: ${items}`;
    } else {
      note = items;
    }

    let url;
    switch (handle.label) {
      case "Cash App":
        url = `https://cash.app/${handle.prefix}${
          handle.value
        }/${encodeURIComponent(myTotal.replace("$", ""))}`;
        break;
      case "Venmo":
        url = `https://venmo.com/${
          handle.value
        }?txn=pay&note=${encodeURIComponent(note).replaceAll(
          "%20",
          "%C2%A0"
        )}&amount=${encodeURIComponent(myTotal)} `;
        break;
      default:
        url = "";
    }

    window.location.href = url;
  };

  return (
    <>
      {sessionId && (
        <>
          <ItemsList
            sessionId={sessionId}
            onSubtotalsChange={handleSetMySubtotals}
            onMyCheckedItemsChange={handleSetMyCheckedItems}
            myCheckedItems={myCheckedItems}
          />
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
            <Button
              key={key}
              onClick={() => handlePaymentButtonClick(handle, myCheckedItems)}>
              Pay {myTotal} to {handle.prefix}
              {handle.value} on {handle.label}
            </Button>
          ))}
        </>
      )}
    </>
  );
};

const ViewItems = () => {
  <Suspense>
    <ShowItemsList />
  </Suspense>;
};

export default ViewItems;
