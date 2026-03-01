import { createContext, useEffect, useRef, useState, useCallback } from "react";
import { io } from "socket.io-client";

export const DoctorSocketContext = createContext();

export const DoctorSocketProvider = ({ children }) => {

  const socketRef = useRef(null);
  const hasConnectedRef = useRef(false);

  const [incomingCall, setIncomingCall] = useState(null);
  const [connected, setConnected] = useState(false);

  // ================= INITIALIZE SOCKET (ONLY ONCE) =================
  useEffect(() => {
    if (hasConnectedRef.current) return;

    const token = localStorage.getItem("dToken");
    if (!token) return;

    hasConnectedRef.current = true;

    const socket = io(import.meta.env.VITE_BACKEND_URL, {
      transports: ["websocket"],
      reconnection: true,
      reconnectionAttempts: Infinity,
      reconnectionDelay: 1000,
    });

    socketRef.current = socket;

    // ---- CONNECT ----
    socket.on("connect", () => {
      console.log("🟢 Doctor global socket connected:", socket.id);
      setConnected(true);

      socket.emit("doctor-online", { token });
    });

    // ---- DISCONNECT ----
    socket.on("disconnect", () => {
      console.log("🔴 Doctor socket disconnected");
      setConnected(false);
    });

    // ---- INCOMING CALL ----
    socket.on("incoming-call", ({ appointmentId }) => {
      console.log("📞 Incoming call for appointment:", appointmentId);
      setIncomingCall(appointmentId);
    });

  }, []);

  // ================= ACTIONS =================

  const clearIncomingCall = useCallback(() => {
    setIncomingCall(null);
  }, []);

  // Used by Consultation page (optional future usage)
  const getSocket = useCallback(() => socketRef.current, []);

  return (
    <DoctorSocketContext.Provider
      value={{
        socket: socketRef.current,
        getSocket,
        connected,
        incomingCall,
        clearIncomingCall
      }}
    >
      {children}
    </DoctorSocketContext.Provider>
  );
};