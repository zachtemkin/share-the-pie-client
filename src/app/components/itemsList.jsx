"use client";

import io from "socket.io-client";
import React, { useState, useContext, useCallback, useEffect } from "react";
// import { useRouter, useSearchParams } from "next/navigation";
// import Button from "./button";
// import { useAppContext } from "../../AppContext";
import styled from "styled-components";

// Testing user deploy

const Items = styled.ul`
  width: 100%;
  list-style-type: none;
`;

const Item = styled.li`
  width: calc(100% - 2rem);
  margin: 1rem;
  padding: 1rem;
  border-radius: 12px;
  background: rgba(255, 255, 255, 0.1);

  &.isChecked {
    color: rgba(0, 0, 0, 1);
    background: rgba(255, 255, 255, 1);
  }

  &.isNotCheckedByMe {
    color: rgba(0, 0, 0, 1);
    background: rgba(255, 255, 255, 0.05);
  }
`;

const Description = styled.span``;

const Price = styled.span``;

const ItemsList = ({ sessionId, onSubtotalsChange }) => {
  const socket = io("ws://localhost:4858/");
  const [isConnected, setIsConnected] = useState(socket.connected);
  const [sessionMembers, setSessionMembers] = useState([]);
  const [receiptData, setReceiptData] = useState();
  const [items, setItems] = useState([]);
  const [myCheckedItems, setMyCheckedItems] = useState([]);

  useEffect(() => {
    const handleBeforeUnload = (event) => {
      socket.emit("setMyCheckedItemsUnchecked", { sessionId, myCheckedItems });
    };

    window.addEventListener("beforeunload", handleBeforeUnload);

    return () => {
      window.removeEventListener("beforeunload", handleBeforeUnload);
    };
  }, [socket, sessionId, myCheckedItems]);

  useEffect(() => {
    socket.on("connect", () => {
      setIsConnected(true);
    });

    socket.on("itemsStatusChanged", (data) => {
      setItems((items) =>
        items.map((item) =>
          item.id === data.itemId
            ? { ...item, isChecked: data.isChecked }
            : item
        )
      );
    });

    const onSessionMembersChanged = (data) => {
      setSessionMembers(data.sessionMembers);
    };

    socket.on("sessionMembersChanged", onSessionMembersChanged);

    const getReceiptData = async (sessionId) => {
      try {
        const response = await fetch("https://sharethepie.app:9346/getReceiptData", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ sessionId }),
        });

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();

        setReceiptData(data);

        setItems(data.items);
      } catch (error) {
        console.error("Error:", error);
      }
    };

    getReceiptData(sessionId);

    socket.emit("newConnection", { sessionId });

    return () => {
      socket.off("connect");
      socket.off("itemsStatusChanged");
      socket.off("sessionMembersChanged");
      socket.off("disconnect");
    };
  }, []);

  const handleItemClick = (itemId) => {
    const updatedItems = items.map((item) => {
      if (item.id === itemId) {
        if (item.isChecked) {
          if (item.isCheckedByMe) {
            socket.emit("setItemUnchecked", { sessionId, itemId });
            item.isChecked = false;
            item.isCheckedByMe = false;

            setMyCheckedItems(
              myCheckedItems.filter(
                (myCheckedItem) => myCheckedItem.id !== itemId
              )
            );
          } else {
            alert("Someone else has already checked this item!");
          }
        } else {
          socket.emit("setItemChecked", { sessionId, itemId });
          item.isChecked = true;
          item.isCheckedByMe = true;

          setMyCheckedItems((myCheckedItems) => [...myCheckedItems, item]);
        }
        return item;
      } else {
        return item;
      }
    });

    setItems(updatedItems);
  };

  const calculateSubtotals = useCallback(
    (myCheckedItems) => {
      if (receiptData && receiptData.transaction) {
        let checkedItemsPrices = [];
        myCheckedItems.map((checkedItem) => {
          checkedItemsPrices.push(checkedItem.price);
        });

        let myItems = checkedItemsPrices.reduce(
          (acc, current) => acc + current,
          0
        );

        let myTip =
          (myItems / receiptData.transaction.items) *
          receiptData.transaction.tip;

        let myTax =
          (myItems / receiptData.transaction.items) *
          receiptData.transaction.tax;

        onSubtotalsChange({ myItems, myTip, myTax });
      }
    },
    [receiptData]
  );

  useEffect(() => {
    calculateSubtotals(myCheckedItems);
  }, [myCheckedItems, calculateSubtotals]);

  return (
    <>
      <p>Socket: {isConnected ? "Connected" : "Disconnected"}</p>
      <div>
        {sessionMembers.map(
          (member, index) =>
            !member.isSessionCreator && <span key={index}>•</span>
        )}
      </div>
      <Items>
        {items &&
          items.map((item, index) => (
            <Item
              key={item.id}
              className={`${item.isChecked && "isChecked"} ${
                item.isChecked && !item.isCheckedByMe && "isNotCheckedByMe"
              }`}
              onClick={() => handleItemClick(item.id)}>
              <Description>{item.description}</Description>
              <Price>{item.price}</Price>
              <div>Me? {item.isCheckedByMe ? "yes" : "no"}</div>
            </Item>
          ))}
      </Items>
    </>
  );
};

export default ItemsList;
