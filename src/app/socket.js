import { io } from "socket.io-client";
import chooseServer from "./utils/chooseServer";

const server = chooseServer();
const socket = io(server.socket);

export default socket;
