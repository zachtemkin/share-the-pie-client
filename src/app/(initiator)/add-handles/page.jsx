"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAppContext } from "../../AppContext";
import chooseServer from "@/app/utils/chooseServer";
import styled from "styled-components";
import Container from "@/app/components/container";
import Instructions from "@/app/components/instructions";
import FormField from "@/app/components/formField";
import Button from "@/app/components/button";
import { motion } from "@/app/theme";

const Stack = styled.div`
  display: flex;
  row-gap: 1rem;
  flex-direction: column;
`;

const AddHandles = () => {
  const server = chooseServer();
  const router = useRouter();
  const { appState, setAppState } = useAppContext();
  const [isContainerReady, setIsContainerReady] = useState(false);
  const [isContainerVisible, setIsContainerVisible] = useState(false);

  useEffect(() => {
    setIsContainerReady(true);

    setTimeout(() => {
      setIsContainerVisible(true);
    }, motion.delayToShowContainer);
  }, []);

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
    setIsContainerVisible(false);
    setTimeout(() => {
      router.push("/present-qr");
    }, motion.delayBetweenPages);
  };

  return (
    isContainerReady && (
      <Container isVisible={isContainerVisible}>
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
              autocorrect="off"
              autocapitalize="none"
            />
            <FormField
              type="text"
              id="cashTag"
              value={initiatorData.cashTag}
              onChange={handleChange}
              placeholder="Cash App"
              spellCheck="false"
              autocorrect="off"
              autocapitalize="none"
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
    )
  );
};

export default AddHandles;
