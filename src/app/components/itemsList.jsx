"use client";

import io from "socket.io-client";
import React, { useState, useCallback, useEffect } from "react";
import { useAppContext } from "../AppContext";
import styled from "styled-components";
import useChooseServer from "@/app/hooks/useChooseServer";
import Item from "@/app/components/item";

const Items = styled.ul`
  width: 100%;
  min-height: 50vh;
  list-style-type: none;
  display: flex;
  flex-direction: column;
  gap: 1rem;
`;

const Description = styled.span``;

const Price = styled.span``;

const ItemsList = ({
  joinedFrom,
  sessionId,
  onSubtotalsChange,
  onMyCheckedItemsChange,
  myCheckedItems,
}) => {
  const server = useChooseServer();
  const socket = io(server.socket);
  const [isConnected, setIsConnected] = useState(socket.connected);
  const [sessionMembers, setSessionMembers] = useState([]);
  const [socketId, setSocketId] = useState("");
  const { appState, setAppState } = useAppContext();
  const [items, setItems] = useState([]);
  const [manualTipAmount, setManualTipAmount] = useState();

  const receiptData = appState.receiptData ? appState.receiptData : {};

  useEffect(() => {
    setItems(
      appState.receiptData && appState.receiptData.items
        ? appState.receiptData.items
        : []
    );
  }, [appState]);

  useEffect(() => {
    socket.on("connect", () => {
      setIsConnected(true);
      setSocketId(socket.id);
    });

    socket.on("itemsStatusChanged", (data) => {
      setItems((items) =>
        items.map((item) =>
          item.id === data.itemId
            ? { ...item, isChecked: data.isChecked, checkedBy: data.checkedBy }
            : item
        )
      );
    });

    socket.on("tipAmountChanged", (data) => {
      setManualTipAmount(data.tip);
    });

    const onSessionMembersChanged = (data) => {
      setSessionMembers(data.sessionMembers);

      if (data.memberLeft) {
        setItems((items) =>
          items.map((item) =>
            item.checkedBy === data.memberLeft
              ? { ...item, isChecked: false, checkedBy: null }
              : item
          )
        );
      }
    };

    socket.on("sessionMembersChanged", onSessionMembersChanged);

    socket.emit("newConnection", {
      sessionId,
      joinedFrom,
    });

    return () => {
      socket.off("connect");
      socket.off("itemsStatusChanged");
      socket.off("sessionMembersChanged");
      socket.off("tipAmountChanged");
      socket.off("disconnect");
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleItemClick = (itemId) => {
    const updatedItems = items.map((item) => {
      if (item.id === itemId) {
        if (item.isChecked) {
          if (item.isCheckedByMe) {
            socket.emit("setItemUnchecked", { sessionId, itemId });
            item.isChecked = false;
            item.isCheckedByMe = false;

            onMyCheckedItemsChange(
              myCheckedItems.filter(
                (myCheckedItem) => myCheckedItem.id !== itemId
              )
            );
          } else {
            alert("Someone else has already checked this item!");
          }
        } else {
          socket.emit("setItemChecked", { sessionId, itemId, socketId });
          item.isChecked = true;
          item.isCheckedByMe = true;

          onMyCheckedItemsChange((myCheckedItems) => [...myCheckedItems, item]);
        }
        return item;
      } else {
        return item;
      }
    });

    setItems(updatedItems);
  };

  const calculateSubtotals = useCallback(
    (myCheckedItems, manualTipAmount) => {
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

        if (manualTipAmount !== undefined) {
          myTip = (myItems / receiptData.transaction.items) * manualTipAmount;
        }

        let myTax =
          (myItems / receiptData.transaction.items) *
          receiptData.transaction.tax;

        onSubtotalsChange({ myItems, myTip, myTax });
      }
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [receiptData]
  );

  useEffect(() => {
    if (myCheckedItems) {
      calculateSubtotals(myCheckedItems, manualTipAmount);
    }
  }, [myCheckedItems, calculateSubtotals, manualTipAmount]);

  return (
    <>
      <Items>
        {items &&
          items.map((item, index) => (
            <Item
              key={item.id}
              item={item}
              handleClick={() => {
                handleItemClick(item.id);
              }}
            />
          ))}
      </Items>
    </>
  );
};

export default ItemsList;
