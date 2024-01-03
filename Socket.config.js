import express from "express";
import http from "http";
import socketIO from "socket.io";

const app = express();
const server = http.createServer(app);
const io = socketIO(server, { cors: { origin: "*" } });

export { app, server, io };
