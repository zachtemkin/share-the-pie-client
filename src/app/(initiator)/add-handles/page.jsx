"use client";

import React, { useState, useContext, useEffect } from "react";
import { useRouter } from "next/navigation";
import Button from "../../components/button";
import { useAppContext } from "../../AppContext";
import useChooseServer from "@/app/hooks/useChooseServer";

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
    <div>
      <h1>Choose how to get paid back</h1>
      <form onSubmit={handleSubmit}>
        <p>Add Cash App</p>
        <label htmlFor='cashTag'>Cash Tag</label>
        <input
          type='text'
          id='cashTag'
          value={initiatorData.cashTag}
          onChange={handleChange}
          placeholder='Cash Tag'
        />
        <p>Add Venmo</p>
        <label htmlFor='venmoHandle'>Venmo Handle</label>
        <input
          type='text'
          id='venmoHandle'
          value={initiatorData.venmoHandle}
          onChange={handleChange}
          placeholder='Venmo Handle'
        />
        <label htmlFor='humanName'>Human Name</label>
        <input
          type='text'
          id='humanName'
          value={initiatorData.humanName}
          onChange={handleChange}
          placeholder='Your human name'
        />
        <input
          type='hidden'
          name='sessionId'
          value={initiatorData.sessionId}
          onChange={handleChange}
        />
        <Button type='submit'>Next</Button>
      </form>
    </div>
  );
};

export default AddHandles;
