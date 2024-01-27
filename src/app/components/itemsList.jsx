"use client";

import io from "socket.io-client";
import React, { useState, useCallback, useEffect } from "react";
import { useAppContext } from "../AppContext";
import styled from "styled-components";
import useChooseServer from "@/app/hooks/useChooseServer";

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
  const server = useChooseServer();
  const socket = io(server.socket);
  const [isConnected, setIsConnected] = useState(socket.connected);
  const [sessionMembers, setSessionMembers] = useState([]);
  const [myCheckedItems, setMyCheckedItems] = useState([]);
  const [socketId, setSocketId] = useState("");
  const { appState, setAppState } = useAppContext();
  const [items, setItems] = useState([]);

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

    socket.emit("newConnection", { sessionId });

    return () => {
      socket.off("connect");
      socket.off("itemsStatusChanged");
      socket.off("sessionMembersChanged");
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

            setMyCheckedItems(
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
    // eslint-disable-next-line react-hooks/exhaustive-deps
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
              className={`${item.isChecked && "isChecked"} ${item.isChecked && !item.isCheckedByMe && "isNotCheckedByMe"
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
