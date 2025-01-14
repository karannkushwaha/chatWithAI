import socket from "socket.io-client";

let socketInstance = null;

export const initializeSocket = () => {
  socketInstance = socket(import.meta.env.VITE_SOCKET_URL, {
    auth: {
      token: localStorage.getItem("token"),
    },
  });
  return socketInstance;
};

export const receiveMessage = (eventName, cb) => {
  socketInstance.on(eventName, cb);
};

export const sendMessage = (eventName, cb) => {
  socketInstance.on(eventName, cb);
};
