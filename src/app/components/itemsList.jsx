"use client";

import React, { useState, useCallback, useEffect } from "react";
import { useAppContext } from "../AppContext";
import styled from "styled-components";
import Instructions from "@/app/components/instructions";
import Item from "@/app/components/item";
import socket from "@/app/socket";

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
  onSessionMembersChanged,
}) => {
  const [isConnected, setIsConnected] = useState(socket.connected);
  const [sessionMembers, setSessionMembers] = useState([]);
  const { appState, setAppState } = useAppContext();
  const [items, setItems] = useState([]);
  const [manualTipAmount, setManualTipAmount] = useState();
  const [socketId, setSocketId] = useState(socket.id);

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
        items.map((item) => {
          return item.id === data.itemId
            ? { ...item, checkedBy: data.checkedBy }
            : item;
        })
      );

      if (myCheckedItems) {
        let newMyCheckedItems = myCheckedItems.map((myCheckedItem) =>
          myCheckedItem.id === data.itemId
            ? { ...myCheckedItem, checkedBy: data.checkedBy }
            : myCheckedItem
        );
        calculateSubtotals(newMyCheckedItems, manualTipAmount);
      }
    });

    socket.on("tipAmountChanged", (data) => {
      setManualTipAmount(data.tip);
    });

    socket.on("sessionMembersChanged", (data) => {
      setSessionMembers(data.sessionMembers);
      onSessionMembersChanged(data.sessionMembers);
      if (data.memberLeft) {
        setItems((items) =>
          items.map((item) =>
            item.checkedBy.includes(data.memberLeft)
              ? {
                  ...item,
                  checkedBy: item.checkedBy.filter(
                    (socketId) => socketId !== data.memberLeft
                  ),
                }
              : item
          )
        );
      }
    });

    return () => {
      socket.off("connect");
      socket.off("itemsStatusChanged");
      socket.off("sessionMembersChanged");
      socket.off("tipAmountChanged");
      socket.off("disconnect");
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [onSessionMembersChanged]);

  useEffect(() => {
    sessionId &&
      socket.emit("newConnection", {
        sessionId,
        joinedFrom,
      });
  }, [sessionId, joinedFrom]);

  const handleItemClick = (itemId) => {
    const updatedItems = items.map((item) => {
      if (item.id === itemId) {
        if (item.checkedBy.length > 0) {
          if (item.checkedBy.includes(socketId)) {
            socket.emit("setItemUnchecked", {
              sessionId,
              itemId,
              socketIds: item.checkedBy,
              mySocketId: socketId,
            });
            item.isCheckedByMe = false;

            onMyCheckedItemsChange(
              myCheckedItems.filter(
                (myCheckedItem) => myCheckedItem.id !== itemId
              )
            );
          } else {
            socket.emit("setItemChecked", {
              sessionId,
              itemId,
              socketIds: [...item.checkedBy, socketId],
            });
            item.checkedBy = [...item.checkedBy, socketId];
            item.isCheckedByMe = true;

            onMyCheckedItemsChange((myCheckedItems) => [
              ...myCheckedItems,
              item,
            ]);
          }
        } else {
          socket.emit("setItemChecked", {
            sessionId,
            itemId,
            socketIds: [...item.checkedBy, socketId],
          });
          item.checkedBy = [...item.checkedBy, socketId];
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
          checkedItemsPrices.push(
            checkedItem.price / checkedItem.checkedBy.length
          );
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
      {isConnected ? (
        <Items>
          {items &&
            items.map((item, index) => (
              <Item
                key={item.id}
                item={item}
                mySocketId={socketId}
                handleClick={() => {
                  handleItemClick(item.id);
                }}
              />
            ))}
        </Items>
      ) : (
        <Instructions>Please wait...</Instructions>
      )}
    </>
  );
};

export default ItemsList;
