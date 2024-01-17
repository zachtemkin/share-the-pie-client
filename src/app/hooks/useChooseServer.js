import React, { useEffect, useState } from "react";

function useChooseServer() {
  let server = {};
  
  if (process.env.NODE_ENV === 'development') {
    server.socket = "wss://localhost:4858";
    server.api = "https://localhost:4000";
  } else {
    server.socket = "wss://sharethepie.app:4858";
    server.api = "https://api.sharethepie.app";
  }

  return server;
}

export default useChooseServer;
