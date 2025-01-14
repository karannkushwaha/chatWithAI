import "dotenv/config";
import http from "http";
import app from "./app.js";
import { Server } from "socket.io";
import jwt from "jsonwebtoken";

const port = process.env.PORT || 8000;
const server = http.createServer(app);

const io = new Server(server, { cors: { origin: "*" } });

io.use((socket, next) => {
  try {
    const token =
      socket.handshake.auth?.token ||
      socket.handshake.headers.authorization?.split(" ")[1];

    if (!token) {
      return next(new Error("Token is missing or invalid"));
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    if (!decoded) {
      return next(new Error("Token verification failed"));
    }

    socket.user = decoded;
    next();
  } catch (error) {
    console.error("Error during token validation:", error);
    next(new Error("Authentication error: " + error.message));
  }
});

io.on("connection", (socket) => {
  console.log("socket in");
  socket.on("event", (data) => {
    /* … */
  });
  socket.on("disconnect", () => {
    /* … */
  });
});

server.listen(port, () => {
  console.log(`Server running on port ${port}.`);
});
