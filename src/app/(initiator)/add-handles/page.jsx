"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import Button from "../../components/button";

const AddHandles = () => {
  const router = useRouter();

  const [initiatorData, setInitiatorData] = useState({
    sessionId: "659f45f92dee0c5bd1d0d3ac",
    humanName: "",
    cashTag: "",
    venmoHandle: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setInitiatorData({ ...initiatorData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch("https://localhost:4000/setInitiatorData", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(initiatorData),
      });

      if (response.ok) {
        const data = await response.json();
        // .then(advanceScreen);
        console.log(data);
        // Handle the response from the server as needed
      } else {
        console.error("Server response:", response.statusText);
        // Handle the error as needed
      }
    } catch (error) {
      console.error("Error submitting form:", error);
      // Handle the error as needed
    }
  };

  const advanceScreen = () => {
    router.push("/present-qr");
  };

  return (
    <div>
      <h1>Choose how to get paid back</h1>
      <form onSubmit={handleSubmit}>
        <p>Add Cash App</p>
        <label htmlFor='cashTag'>Cash Tag</label>
        <input
          type='text'
          name='cashTag'
          value={initiatorData.cashTag}
          onChange={handleChange}
          placeholder='Cash Tag'
        />
        <p>Add Venmo</p>
        <label htmlFor='venmoHandle'>Venmo Handle</label>
        <input
          type='text'
          name='venmoHandle'
          value={initiatorData.venmoHandle}
          onChange={handleChange}
          placeholder='Venmo Handle'
        />
        <label htmlFor='humanName'>Human Name</label>
        <input
          type='text'
          name='humanName'
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
