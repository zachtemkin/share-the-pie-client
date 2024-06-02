"use client";

import React, { useState, useContext, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAppContext } from "../../AppContext";
import useChooseServer from "@/app/hooks/useChooseServer";
import styled from "styled-components";
import Image from "next/image";
import Container from "@/app/components/container";
import Instructions from "@/app/components/instructions";
import FormField from "@/app/components/formField";
import Button from "@/app/components/button";

const Stack = styled.div`
  display: flex;
  row-gap: 1rem;
  flex-direction: column;
`;

const AddHandles = () => {
  const server = useChooseServer();
  const router = useRouter();
  const { appState, setAppState } = useAppContext();

  const cleanInitiatorData = (key, value) => {
    let cleanedValue = value;

    if (["cashTag", "venmoHandle"].includes(key)) {
      cleanedValue = cleanedValue.replace("@", "").replace("$", "");
    }

    return cleanedValue;
  };

  const initialInitatorData =
    (typeof window !== "undefined" &&
      JSON.parse(localStorage.getItem("initiatorData"))) ||
    {};

  const [initiatorData, setInitiatorData] = useState({
    sessionId: appState.sessionId,
    cashTag:
      initialInitatorData && initialInitatorData.cashTag
        ? initialInitatorData.cashTag
        : "",
    venmoHandle:
      initialInitatorData && initialInitatorData.venmoHandle
        ? initialInitatorData.venmoHandle
        : "",
  });

  const handleChange = (e) => {
    const { id, value } = e.target;
    setInitiatorData({ ...initiatorData, [id]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    let cleanedInitiatorData = {};

    for (const initiatorDataKey in initiatorData) {
      cleanedInitiatorData[initiatorDataKey] = cleanInitiatorData(
        initiatorDataKey,
        initiatorData[initiatorDataKey]
      );
    }

    localStorage.setItem(
      "initiatorData",
      JSON.stringify({
        cashTag: cleanedInitiatorData.cashTag,
        venmoHandle: cleanedInitiatorData.venmoHandle,
      })
    );

    try {
      const response = await fetch(`${server.api}/setInitiatorData`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(cleanedInitiatorData),
      });
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      advanceScreen();
    } catch (error) {
      console.error("Error submitting form:", error);
    }
  };

  const advanceScreen = () => {
    router.push("/present-qr");
  };

  return (
    <Container>
      <Instructions>Add your app usernames</Instructions>
      <form onSubmit={handleSubmit} autoComplete="off">
        <Stack>
          <FormField
            type="text"
            id="venmoHandle"
            value={initiatorData.venmoHandle}
            onChange={handleChange}
            placeholder="Venmo"
            spellCheck="false"
          />
          <FormField
            type="text"
            id="cashTag"
            value={initiatorData.cashTag}
            onChange={handleChange}
            placeholder="Cash App"
            spellCheck="false"
          />
          <input
            type="hidden"
            name="sessionId"
            value={initiatorData.sessionId}
            onChange={handleChange}
          />
          <Button type="submit" $size="large">
            Continue
          </Button>
        </Stack>
      </form>
    </Container>
  );
};

export default AddHandles;
