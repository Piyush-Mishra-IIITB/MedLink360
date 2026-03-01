 import dotenv from "dotenv";
dotenv.config();

import express from "express";
import cors from "cors";
import http from "http";
import { Server } from "socket.io";
import jwt from "jsonwebtoken";

import connectDB from "./config/mongodb.js";
import connectCloudinary from "./config/cloudinary.js";

import adminRouter from "./routes/adminRoutes.js";
import doctorRouter from "./routes/doctorRoutes.js";
import userRouter from "./routes/userRoutes.js";
import recommendRouter from "./routes/recommendRoutes.js";

import appointmentModel from "./models/appointmentModel.js";
import messageModel from "./models/messageModel.js";


const app = express();

connectDB();
connectCloudinary();

app.use(cors({ origin: "*", credentials: true }));
app.use(express.json());

app.get("/", (req, res) => res.send("API WORKING"));

app.use("/api/admin", adminRouter);
app.use("/api/doctor", doctorRouter);
app.use("/api/user", userRouter);
app.use("/api", recommendRouter);

const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"],
    credentials: true
  }
});

app.set("io", io);

// ======================================================
// ONLINE DOCTOR TRACKER
// ======================================================
const onlineDoctors = new Map(); 
// doctorId -> socketId

// ======================================================
// SOCKET
// ======================================================
io.on("connection", (socket) => {

  console.log("🔌 Socket connected:", socket.id);

  // ======================================================
// DOCTOR GLOBAL ONLINE
// ======================================================
socket.on("doctor-online", ({ token }) => {
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    if (decoded.role !== "doctor") return;

    if (!onlineDoctors.has(decoded.id))
      onlineDoctors.set(decoded.id, new Set());

    onlineDoctors.get(decoded.id).add(socket.id);

    socket.userId = decoded.id;
    socket.role = "doctor";

    console.log("🟢 Doctor online:", decoded.id);

  } catch (err) {
    console.log("doctor-online error", err.message);
  }
});

  // ======================================================
  // JOIN ROOM
  // ======================================================
  socket.on("join-room", async (data) => {
    try {
      if (!data?.appointmentId || !data?.token) return;

      const { appointmentId, token } = data;

      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      const role = decoded.role === "doctor" ? "doctor" : "patient";
      const userId = decoded.id;

      const appt = await appointmentModel.findById(appointmentId);
      if (!appt) return;

      if (
        (role === "doctor" && appt.docId.toString() !== userId) ||
        (role === "patient" && appt.userId.toString() !== userId)
      ) {
        console.log("❌ Unauthorized room join blocked");
        return;
      }

      // attach identity to socket (important)
      socket.join(appointmentId);
      socket.appointmentId = appointmentId;
      socket.role = role;
      socket.userId = userId;

      console.log(`✅ ${role} joined room ${appointmentId}`);

      // notify other peer
socket.to(appointmentId).emit("peer-joined", { role });

// authoritative room state
const clients = await io.in(appointmentId).fetchSockets();
const peerReady = clients.length === 2;

// send state ONLY to joining user (CRITICAL)
socket.emit("room-state", { peerReady });

// realtime event for both users
if (peerReady) {
  io.to(appointmentId).emit("room-ready");
}

      // chat history
      const oldMessages = await messageModel
        .find({ appointmentId })
        .sort({ createdAt: 1 });

      socket.emit("chat-history", oldMessages);

      await messageModel.updateMany(
        { appointmentId, sender: { $ne: role }, seen: false },
        { seen: true }
      );

      if (role === "doctor")
        await appointmentModel.findByIdAndUpdate(appointmentId, { doctorUnreadCount: 0 });
      else
        await appointmentModel.findByIdAndUpdate(appointmentId, { patientUnreadCount: 0 });

    } catch (err) {
      console.log("Join error:", err.message);
    }
  });

  // ======================================================
// APPOINTMENT TIME GUARD
// ======================================================
const isConsultationAllowed = async () => {

  if (!socket.appointmentId) return false;

  const appt = await appointmentModel.findById(socket.appointmentId);
  if (!appt) return false;

  // Only business rules — no time restrictions
  if (appt.cancelled || appt.isCompleted) {
    socket.emit("call-blocked", { reason: "APPOINTMENT_INACTIVE" });
    return false;
  }

  return appt;
};

  // ======================================================
  // WEBRTC SIGNALING (SAFE — NO CRASH POSSIBLE)
  // ======================================================

 socket.on("webrtc-offer", async (data) => {
  try {
    if (!data?.offer || !socket.appointmentId) return;

    // 🔐 TIME VALIDATION
    const appt = await isConsultationAllowed();
    if (!appt) return;

    // normal room forwarding
    socket.to(socket.appointmentId).emit("webrtc-offer", { offer: data.offer });

    // dashboard popup
    const doctorSockets = onlineDoctors.get(String(appt.docId));

if (doctorSockets) {
  doctorSockets.forEach(id =>
    io.to(id).emit("incoming-call", {
      appointmentId: socket.appointmentId,
      patientId: appt.userId
    })
  );
}

      console.log("📞 Incoming call sent to doctor dashboard");
    

  } catch (err) {
    console.log("offer error", err.message);
  }
});

  socket.on("webrtc-answer", async (data) => {
  if (!data?.answer) return;

  const allowed = await isConsultationAllowed();
  if (!allowed) return;

  socket.to(socket.appointmentId).emit("webrtc-answer", { answer: data.answer });
});

  socket.on("webrtc-ice-candidate", async (data) => {
  if (!data?.candidate) return;

  const allowed = await isConsultationAllowed();
  if (!allowed) return;

  socket.to(socket.appointmentId).emit("webrtc-ice-candidate", { candidate: data.candidate });
});

socket.on("webrtc-end-call", () => {
  if (!socket.appointmentId) return;

  socket.to(socket.appointmentId).emit("webrtc-end-call", {
    reason: "peer-left"
  });
});


  // ======================================================
  // CHAT
  // ======================================================
  socket.on("chat-message", async ({ message }) => {

    if (!socket.appointmentId || !message?.trim()) return;

    try {
      const msg = await messageModel.create({
        appointmentId: socket.appointmentId,
        sender: socket.role,
        senderId: socket.userId,
        text: message,
        seen: false
      });

      const update =
        socket.role === "patient"
          ? { $inc: { doctorUnreadCount: 1 } }
          : { $inc: { patientUnreadCount: 1 } };

      await appointmentModel.updateOne(
        { _id: socket.appointmentId },
        { ...update, $set: { lastMessage: message, lastMessageAt: new Date() } }
      );

      io.to(socket.appointmentId).emit("chat-message", {
        _id: msg._id,
        from: socket.role,
        message: msg.text,
        createdAt: msg.createdAt
      });

    } catch (err) {
      console.log("Message error:", err.message);
    }
  });


  // ======================================================
  // DISCONNECT
  // ======================================================
 socket.on("disconnect", () => {

  // ================= DOCTOR PRESENCE =================
  if (socket.role === "doctor" && onlineDoctors.has(socket.userId)) {

    const sockets = onlineDoctors.get(socket.userId);
    sockets.delete(socket.id);

    // remove doctor only if ALL tabs closed
    if (sockets.size === 0) {
      onlineDoctors.delete(socket.userId);
      console.log("🔴 Doctor offline:", socket.userId);
    }
  }

  // ================= CALL TERMINATION =================
  if (socket.appointmentId) {

    socket.to(socket.appointmentId).emit("webrtc-end-call", {
      reason: "disconnect"
    });

    console.log(`❌ ${socket.role || "unknown"} disconnected from ${socket.appointmentId}`);
  }

});


socket.on("leave-room", () => {
  if (!socket.appointmentId) return;

  socket.to(socket.appointmentId).emit("webrtc-end-call", {
    reason: "peer-left"
  });

  socket.leave(socket.appointmentId);
});

});


const PORT = process.env.PORT || 4000;
server.listen(PORT, () => {
  console.log(`🚀 HTTP + Socket server running on port ${PORT}`);
}); 