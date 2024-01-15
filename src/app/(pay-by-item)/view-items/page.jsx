"use client";

import io from "socket.io-client";

import React, { useState, useContext, useEffect } from "react";
import styled from "styled-components";
import { useSearchParams } from "next/navigation";
import Button from "../../components/button"
import ItemsList from "../../components/itemsList";

const Subtotals = styled.ul`
`

const Row = styled.li`
`

const ViewItems = () => {
  const searchParams = useSearchParams();
  const sessionId = searchParams.get("sessionId");
  const [mySubTotals, setMySubtotals] = useState({
    myItems: 0,
    myTip: 0,
    myTax: 0,
  });
  const [myTotal, setMyTotal] = useState(0);

  const handleSetMySubtotals = (newMySubtotals) => {
    setMySubtotals(newMySubtotals);
  };

  useEffect(() => {
    const myTotalValue = Object.values(mySubTotals).reduce(
      (acc, current) => acc + current,
      0
    );

    const myTotalValueUSD = new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(myTotalValue);

    setMyTotal(myTotalValueUSD);
  }, [mySubTotals, setMyTotal])

  return <>{sessionId && (
    <>
      <ItemsList sessionId={sessionId} onSubtotalsChange={handleSetMySubtotals}></ItemsList>
      <Subtotals>
        {mySubTotals && Object.keys(mySubTotals).map((subTotalKey, index) => {
          const subTotalValue = mySubTotals[subTotalKey].toFixed(2);
          const subTotalValueUSD = new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(subTotalValue);

          return <Row key={index}>{subTotalKey}: {subTotalValueUSD}</Row>
        })}
      </Subtotals>
      <Button>Pay {myTotal}</Button>
    </>
  )}</>;
};

export default ViewItems;
