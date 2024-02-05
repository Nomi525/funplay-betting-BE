import { Server } from "socket.io";
import { express, http } from "../index.js";
const app = express();
const server = http.createServer(app);
// const wsServer = new WebSocketServer({ server: server, path: "/api/stock-data" });



const Socket = new Server(server, { cors: { origin: "*" } });
const socketRoute = (path, Auth) => {
    return Socket.of(path).use((socket, next) => {
        // if (Auth.isAuth) {
        // SocketAuth(socket, next);
        // } else {
        next();
        // }
    });
}
export { app, server, Socket, socketRoute };
