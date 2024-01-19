"use client";

import React, { useState, useContext, useEffect } from "react";
import { useRouter } from "next/navigation";
import Button from "../../components/button";
import { useAppContext } from "../../AppContext";
import useChooseServer from "@/app/hooks/useChooseServer";
import styled from "styled-components";
import Image from 'next/image';

const Page = styled.div`
  padding: 2rem;
`

const Stack = styled.div`
  display: flex;
  row-gap: 0.5rem;
  flex-direction: column;
`

const Header = styled.h1`
  margin-bottom: 2rem;
`

const FormField = styled.input`
  width: 100%;
  font-size: 1.125rem;
  line-height: 2rem;
  padding: 1rem;
  border-radius: 0.75rem;
  outline: none;
  border: 0;
  box-shadow:
    inset 0 1px 1px rgba(255, 255, 255, 0.2),
    inset 0 1px 4px rgba(255, 255, 255, 0.2),
    0 1px 1px rgba(0, 0, 0, 0.8),
    0 0 6rem rgba(255, 255, 255, 0.1);
  box-sizing: border-box;
  margin-bottom: 1rem;
  background-repeat: no-repeat;
  background-size: 2rem;
  background-position: 1rem 50%;
  text-indent: 2.75rem;
  background-color: rgba(255, 255, 255, 0.1);

  @keyframes blink_input_opacity_to_prevent_scrolling_when_focus {
    0% { opacity: 0; }
    100% { opacity: 1; }
  }

  &:focus {
    animation: blink_input_opacity_to_prevent_scrolling_when_focus 0.01s;
  }

  &::placeholder {
    color: rgba(255, 255, 255, 0.25);
  }

  &#cashTag {
    background-image: url('/images/cash-app.png');
  }

  &#venmoHandle {
    background-image: url('/images/venmo.png');
  }
`

const AddHandles = () => {
  const server = useChooseServer();
  const router = useRouter();
  const { appState, setAppState } = useAppContext();

  const [initiatorData, setInitiatorData] = useState({
    sessionId: appState.sessionId,
    humanName: "",
    cashTag: "",
    venmoHandle: "",
  });

  const handleChange = (e) => {
    const { id, value } = e.target;
    setInitiatorData({ ...initiatorData, [id]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    setAppState((prevAppState) => ({
      ...prevAppState,
      cashTag: initiatorData.cashTag,
      venmoHandle: initiatorData.venmoHandle,
      humanName: initiatorData,
    }));

    try {
      const response = await fetch(`${server.api}/setInitiatorData`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(initiatorData),
      });
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      console.log(data);
      advanceScreen();
    } catch (error) {
      console.error("Error submitting form:", error);
      // Handle the error as needed
    }
  };

  const advanceScreen = () => {
    router.push("/present-qr");
  };

  useEffect(() => {
    console.log(appState);
  }, []);

  return (
    <Page>
      <Header>Who are you?</Header>
      <form onSubmit={handleSubmit}>
        <Stack>
          <FormField
            type='text'
            id='venmoHandle'
            value={initiatorData.venmoHandle}
            onChange={handleChange}
            placeholder='Venmo'
          />
          <FormField
            type='text'
            id='cashTag'
            value={initiatorData.cashTag}
            onChange={handleChange}
            placeholder='Cash App'
          />
          <input
            type='hidden'
            name='sessionId'
            value={initiatorData.sessionId}
            onChange={handleChange}
          />
          <Button type='submit' size='large'>Next</Button>
        </Stack>
      </form>
    </Page>
  );
};

export default AddHandles;
