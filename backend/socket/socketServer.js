import React, { useContext, useEffect, useRef, useState } from "react";
import { useParams } from "react-router-dom";
import { io } from "socket.io-client";
import axios from "axios";
import { AppContext } from "../context/AppContext";

export default function Consultation() {

  const { appointmentId } = useParams();
  const { backendURL, token, userData } = useContext(AppContext);

  /* ---------------- SOCKET (persistent) ---------------- */
  const socketRef = useRef(null);

  /* ---------------- STATE ---------------- */
  const [permissions, setPermissions] = useState(null);
  const [messages, setMessages] = useState([]);
  const [text, setText] = useState("");
  const [connected, setConnected] = useState(false);

  /* ---------------- CONNECT SOCKET ---------------- */
  useEffect(() => {

    socketRef.current = io(import.meta.env.VITE_BACKEND_URL, {
      withCredentials: true,
      transports: ["websocket"]   // prevents polling 404 spam
    });

    socketRef.current.on("connect", () => {
      console.log("Socket connected:", socketRef.current.id);
      setConnected(true);
    });

    socketRef.current.on("disconnect", () => {
      setConnected(false);
    });

    return () => socketRef.current.disconnect();

  }, []);

  /* ---------------- FETCH CAPABILITIES ---------------- */
  const fetchPermissions = async () => {
    try {
      const { data } = await axios.get(
        `${backendURL}/api/appointment/capabilities/${appointmentId}`,
        { headers: { token } }
      );
      setPermissions(data);
    } catch (err) {
      console.log("Permission error", err);
    }
  };

  /* ---------------- JOIN ROOM ONLY AFTER CONNECT ---------------- */
  useEffect(() => {

    if (!connected || !appointmentId || !userData?._id) return;

    socketRef.current.emit("join-appointment", {
      appointmentId,
      userId: userData._id
    });

    fetchPermissions();

  }, [connected, appointmentId, userData]);

  /* ---------------- RECEIVE EVENTS ---------------- */
  useEffect(() => {

    if (!socketRef.current) return;

    const socket = socketRef.current;

    socket.on("chat-message", (msg) => {
      setMessages(prev => [...prev, msg]);
    });

    socket.on("payment-updated", fetchPermissions);

    socket.on("consultation-ended", () => {
      alert("Consultation finished");
      setPermissions(prev => ({ ...prev, canCall: false, reason: "ENDED" }));
    });

    return () => {
      socket.off("chat-message");
      socket.off("payment-updated");
      socket.off("consultation-ended");
    };

  }, []);

  /* ---------------- SEND CHAT ---------------- */
  const sendMessage = () => {

    if (!text.trim() || !socketRef.current) return;

    const msg = {
      appointmentId,
      message: text
    };

    socketRef.current.emit("chat-message", msg);

    // DO NOT add optimistic duplicate from server
    setMessages(prev => [...prev, { ...msg, from: "me", local: true }]);

    setText("");
  };

  /* ---------------- CALL ---------------- */
  const startCall = () => {

    if (!permissions?.canCall) return;

    socketRef.current.emit("consultation-call-request", {
      appointmentId
    });

  };

  /* ---------------- UI ---------------- */

  if (!permissions)
    return <div style={{ padding: 30 }}>Checking consultation permissions...</div>;

  return (
    <div style={{ padding: 30 }}>

      <h2>Consultation Room</h2>

      {/* STATUS */}
      <div style={{ marginBottom: 20 }}>
        <b>Connection:</b> {connected ? "Online" : "Connecting..."} <br/>
        <b>Chat:</b> Allowed <br/>
        <b>Call:</b> {permissions.canCall ? "Allowed" : permissions.reason}
      </div>

      {/* CHAT */}
      <div style={{
        border: "1px solid gray",
        height: 260,
        overflowY: "auto",
        padding: 10,
        marginBottom: 10
      }}>
        {messages.map((m,i)=>(
          <div key={i}>
            <b>{m.from === "me" || m.local ? "Me" : "Doctor"}:</b> {m.message}
          </div>
        ))}
      </div>

      <input
        value={text}
        onChange={(e)=>setText(e.target.value)}
        placeholder="Type message"
      />
      <button onClick={sendMessage}>Send</button>

      <hr style={{margin:"20px 0"}}/>

      {/* CALL BUTTON */}
      <button
        disabled={!permissions?.canCall}
        onClick={startCall}
        style={{
          padding: 10,
          background: permissions?.canCall ? "green" : "gray",
          color: "white",
          cursor: permissions?.canCall ? "pointer" : "not-allowed"
        }}
      >
        {permissions?.canCall ? "Start Video Call" : permissions.reason}
      </button>

    </div>
  );
}