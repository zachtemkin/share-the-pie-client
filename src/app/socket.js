import { io } from "socket.io-client";

function chooseServer() {
  let server = {};

  if (process.env.NODE_ENV === "development") {
    // server.socket = "wss://localhost:4858";
    // server.api = "https://localhost:4000";
    server.socket = "wss://leo.local:4858";
    server.api = "https://leo.local:4000";
  } else {
    server.socket = "wss://sharethepie.app:4858";
    server.api = "https://api.sharethepie.app";
  }

  return server;
}

const server = chooseServer();
const socket = io(server.socket);

export default socket;
