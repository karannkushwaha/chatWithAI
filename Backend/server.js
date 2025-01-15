import "dotenv/config";
import http from "http";
import app from "./app.js";
import { Server } from "socket.io";
import jwt from "jsonwebtoken";
import mongoose from "mongoose";
import projectModel from "./models/project.model.js";
import userModel from "../Backend/models/user.model.js";
import { generateAIContent } from "./services/geminiAI.service.js";

const port = process.env.PORT || 8000;
const server = http.createServer(app);

const io = new Server(server, { cors: { origin: "*" } });

io.use(async (socket, next) => {
  try {
    const token =
      socket.handshake.auth?.token ||
      socket.handshake.headers.authorization?.split(" ")[1];

    const projectId = socket.handshake.query.projectId;

    if (!mongoose.Types.ObjectId.isValid(projectId)) {
      console.error("Invalid ProjectID:", projectId);
      return next(new Error("Invalid ProjectID"));
    }

    const project = await projectModel.findById(projectId);
    if (!project) {
      console.error("Project not found:", projectId);
      return next(new Error("Project not found"));
    }

    if (!token) {
      console.error("Token is missing.");
      return next(new Error("Token is missing."));
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    if (!decoded) {
      console.error("Token verification failed.");
      return next(new Error("Authentication error: Invalid token."));
    }

    socket.project = project;
    socket.user = decoded;
    next();
  } catch (error) {
    console.error("Error during socket authentication:", error);
    next(new Error("Authentication error: " + error.message));
  }
});

io.on("connection", (socket) => {
  if (!socket.project || !socket.project._id) {
    console.error(`Socket ${socket.id} has no valid project assigned.`);
    return;
  }
  const roomID = socket.project._id.toString();
  socket.join(roomID);

  socket.on("project-message", async (data) => {
    try {
      const user = await userModel.findById(data.sender._id);

      if (!user) {
        console.error(`User with id ${data.sender._id} not found.`);
        return;
      }
      data.senderEmail = user.email;
      if (!roomID) {
        console.error(`Socket ${socket.id} has no room to broadcast to.`);
        return;
      }

      const aiIsPresentInMessage = data.message.includes("@ai");
      socket.broadcast.to(roomID).emit("project-message", data);

      if (aiIsPresentInMessage) {
        const prompt = data.message.replace("@ai", "");
        const result = await generateAIContent(prompt);

        // socket.emit("project-message", {
        //   senderEmail: "AI",
        //   message: result,
        // });

        io.to(roomID).emit("project-message", {
          message: result,
          sender: {
            email: "AI",
            _id: "ai",
            __v: 0,
          },
        });
        return;
      }
    } catch (error) {
      console.error("Error fetching user email:", error);
    }
  });

  socket.on("disconnect", () => {
    console.log(`Socket disconnected: ${socket.id} from room: ${roomID}`);
    socket.leave(socket.roomID);
  });
});

server.listen(port, () => {
  console.log(`Server running on port ${port}.`);
});
