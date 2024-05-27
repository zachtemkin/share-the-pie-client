"use client";

import useChooseServer from "@/app/hooks/useChooseServer";
import React, { useState, useEffect, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { useAppContext } from "../../AppContext";
import styled from "styled-components";
import Container from "@/app/components/container";
import Instructions from "@/app/components/instructions";
import Button from "../../components/button";
import ItemsList from "../../components/itemsList";
import Gap from "@/app/components/gap";

const Subtotals = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  padding: ${(props) => props.theme.surfacePadding};
`;

const Subtotal = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
`;

const SubtotalValue = styled.div`
  width: 6rem;
  font-size: 1.5rem;
  font-weight: 600;
  text-align: center;
`;

const SubtotalLabel = styled.div`
  margin-top: 0.5rem;
  color: rgba(255, 255, 255, 0.5);
`;

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
            label: "Venmo",
            prefix: "@",
            color: "#008cff",
            value: appState.receiptData.initiator.venmoHandle,
          },
          {
            label: "Cash App",
            prefix: "$",
            color: "#00d64f",
            value: appState.receiptData.initiator.cashTag,
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

  let subTotalLabels = {
    myItems: "Items",
    myTip: "Tip",
    myTax: "Tax",
  };

  return (
    <>
      {sessionId && (
        <Container>
          <Instructions>Select items that you ordered</Instructions>
          <ItemsList
            joinedFrom="view-items"
            sessionId={sessionId}
            onSubtotalsChange={handleSetMySubtotals}
            onMyCheckedItemsChange={handleSetMyCheckedItems}
            myCheckedItems={myCheckedItems}
          />
          <Gap />
          <Instructions>Pay for your share</Instructions>
          <Subtotals>
            {mySubTotals &&
              Object.keys(mySubTotals).map((subTotalKey, index) => {
                const subTotalValue = mySubTotals[subTotalKey].toFixed(2);
                const subTotalValueUSD = new Intl.NumberFormat("en-US", {
                  style: "currency",
                  currency: "USD",
                }).format(subTotalValue);

                return (
                  <Subtotal key={index}>
                    <SubtotalValue>{subTotalValueUSD}</SubtotalValue>
                    <SubtotalLabel>{subTotalLabels[subTotalKey]}</SubtotalLabel>
                  </Subtotal>
                );
              })}
          </Subtotals>
          {handlesArray.map((handle, key) => (
            <Button
              key={key}
              onClick={() => handlePaymentButtonClick(handle, myCheckedItems)}
              size="large"
              backgroundColor={handle.color}
              textColor="#fff"
            >
              Pay {myTotal} to {handle.prefix}
              {handle.value} on {handle.label}
            </Button>
          ))}
        </Container>
      )}
    </>
  );
};

const ViewItems = () => {
  return (
    <Suspense>
      <ShowItemsList />
    </Suspense>
  );
};

export default ViewItems;
