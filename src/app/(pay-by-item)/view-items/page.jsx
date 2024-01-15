"use client";

import io from "socket.io-client";

import React, { useState, useContext, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import ItemsList from "../../components/itemsList";

const ViewItems = () => {
  const searchParams = useSearchParams();
  const sessionId = searchParams.get("sessionId");

  return <>{sessionId && <ItemsList sessionId={sessionId}></ItemsList>}</>;
};

export default ViewItems;
