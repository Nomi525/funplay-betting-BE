import { Server } from "socket.io";
import { express, http } from "../index.js";
const app = express();
const server = http.createServer(app);
// const wsServer = new WebSocketServer({ server: server, path: "/api/stock-data" });

const Socket = new Server(server, { cors: { origin: "*" } });
export { app, server, Socket };
