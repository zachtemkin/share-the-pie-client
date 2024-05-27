"use client";

import React, { useState, useContext, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAppContext } from "../../AppContext";
import useChooseServer from "@/app/hooks/useChooseServer";
import styled from "styled-components";
import Image from "next/image";
import Page from "@/app/components/page";
import Instructions from "@/app/components/instructions";
import Button from "@/app/components/button";

const Stack = styled.div`
  display: flex;
  row-gap: 1rem;
  flex-direction: column;
`;

const FormField = styled.input`
  width: 100%;
  font-size: 1.125rem;
  line-height: 2rem;
  padding: 1rem;
  border-radius: ${(props) => props.theme.surfaceBorderRadius};
  outline: none;
  border: 2px solid rgba(255, 255, 255, 0.25);
  box-sizing: border-box;
  background-repeat: no-repeat;
  background-size: 2rem;
  background-position: 1rem 50%;
  text-indent: 2.75rem;
  background-color: ${(props) => props.theme.darkSurfaceColor};
  color: #fff;
  font-family: inherit;

  @keyframes blink_input_opacity_to_prevent_scrolling_when_focus {
    0% {
      opacity: 0;
    }
    100% {
      opacity: 1;
    }
  }

  &:focus {
    @media only screen and (hover: none) {
      animation: blink_input_opacity_to_prevent_scrolling_when_focus 0.01s;
    }
  }

  &::placeholder {
    color: rgba(255, 255, 255, 0.25);
  }

  &#cashTag {
    background-image: url("/images/cash-app.png");
  }

  &#venmoHandle {
    background-image: url("/images/venmo.png");
  }
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
    <Page>
      <Instructions>Add your app usernames</Instructions>
      <form onSubmit={handleSubmit} autoComplete="off">
        <Stack>
          <FormField
            type="text"
            id="venmoHandle"
            value={initiatorData.venmoHandle}
            onChange={handleChange}
            placeholder="Venmo"
            spellcheck="false"
            autoFocus="true"
          />
          <FormField
            type="text"
            id="cashTag"
            value={initiatorData.cashTag}
            onChange={handleChange}
            placeholder="Cash App"
            spellcheck="false"
          />
          <input
            type="hidden"
            name="sessionId"
            value={initiatorData.sessionId}
            onChange={handleChange}
          />
          <Button type="submit" size="large">
            Next
          </Button>
        </Stack>
      </form>
    </Page>
  );
};

export default AddHandles;
