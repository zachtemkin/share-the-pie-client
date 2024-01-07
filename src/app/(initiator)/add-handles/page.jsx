"use client";

import React from "react";
import { useRouter } from "next/navigation";

const AddHandles = () => {
  const router = useRouter();

  const advanceScreen = () => {
    router.push("/present-qr");
  };
  return (
    <div>
      <h1>Add Handles</h1>
      <p>add your Cash App</p>
      <p>add your Venmo</p>
      <button onClick={advanceScreen}>Next</button>
    </div>
  );
};

export default AddHandles;
