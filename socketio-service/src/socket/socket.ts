import { Server } from "socket.io";
import { createAdapter } from "@socket.io/redis-adapter";
import { Redis } from "ioredis";
import { env } from "../config/env.js";

export let io: Server;

export const initSocket = async (server: any) => {
  io = new Server(server, {
    cors: {
      origin: env.CLIENT_URL || "*",
      methods: ["GET", "POST"],
      credentials: true
    },
    pingTimeout: 60000,
    pingInterval: 25000
  });

  // Redis Adapter Setup
  const pubClient = new Redis({
    host: env.REDIS_HOST,
    port: env.REDIS_PORT,
    password: env.REDIS_PASSWORD,
    username: env.REDIS_USERNAME,
    lazyConnect: true,
    retryStrategy: (times) => {
      const delay = Math.min(times * 50, 2000);
      return delay;
    }
  });

  const subClient = pubClient.duplicate();

  pubClient.on("error", (err: Error) => {
    console.error("❌ Redis PubClient Error", err);
  });
  
  subClient.on("error", (err: Error) => {
    console.error("❌ Redis SubClient Error", err);
  });

  pubClient.on("connect", () => {
    console.log("✅ Redis PubClient connected");
  });
  
  subClient.on("connect", () => {
    console.log("✅ Redis SubClient connected");
  });

  // Explicitly connect
  try {
    await pubClient.connect();
    await subClient.connect();
    io.adapter(createAdapter(pubClient, subClient));
    console.log("✅ Redis adapter initialized");
  } catch (error) {
    console.error("❌ Failed to connect to Redis:", error);
    // Continue without Redis if needed
  }

  // Connection handler with better logging
  io.on("connection", (socket) => {
    console.log("✅ User connected:", socket.id);

    // Join room with better logging
    socket.on("join-room", (roomId) => {
      if (!roomId) {
        console.log("⚠️ No roomId provided");
        return;
      }

      const roomName = roomId.toString();
      
      // Leave all previous rooms (except default)
      const rooms = Array.from(socket.rooms);
      rooms.forEach(room => {
        if (room !== socket.id) {
          socket.leave(room);
        }
      });
      
      // Join new room
      socket.join(roomName);
      console.log(`📦 User ${socket.id} joined room: ${roomName}`);
      
      // Send confirmation to client
      socket.emit("room-joined", {
        roomId: roomName,
        message: "Successfully joined room"
      });

      // Log room size
      const room = io.sockets.adapter.rooms.get(roomName);
      console.log(`👥 Room ${roomName} has ${room?.size || 0} users`);
    });

    socket.on("disconnect", () => {
      console.log("❌ User disconnected:", socket.id);
    });

    socket.on("error", (error) => {
      console.error("Socket error:", error);
    });
  });

  console.log("✅ Socket.io initialized successfully");
  return io;
};