import React, { useEffect, useRef, useState } from "react";
import { useParams } from "react-router-dom";
import { io } from "socket.io-client";
import { toast } from "react-toastify";
function Consultation() {
  const { appointmentId } = useParams();

  const socketRef = useRef(null);
  const localVideoRef = useRef(null);
  const remoteVideoRef = useRef(null);
  const pcRef = useRef(null);
  const localStreamRef = useRef(null);
  const bottomRef = useRef(null);
 const callBlockedRef = useRef(false);
  // chat
  const [messages, setMessages] = useState([]);
  const [text, setText] = useState("");
  const [canChat, setCanChat] = useState(false);

  const [status, setStatus] = useState("Connecting...");
  const [inCall, setInCall] = useState(false);
  const [peerReady, setPeerReady] = useState(false);
  const [micOn, setMicOn] = useState(true);
const [camOn, setCamOn] = useState(true);
  // ================= SOCKET =================
  useEffect(() => {
  const socket = io(import.meta.env.VITE_BACKEND_URL, {
    transports: ["websocket"],
  });

  socketRef.current = socket;

  // ---------- LISTENERS FIRST ----------
  socket.on("room-ready", () => {
    console.log("ROOM READY RECEIVED");
    setPeerReady(true);
    setStatus("Doctor available");
  });

  socket.on("chat-history", (history) => {
    const formatted = history.map((m) => ({
      from: m.sender,
      message: m.text,
    }));
    setMessages(formatted);
    setCanChat(true);
  });

  socket.on("chat-message", (msg) => {
    setMessages((prev) => [...prev, msg]);
  });

  socket.on("webrtc-end-call", ({ reason }) => {
    if (!inCall) return;
    toast.info("Call ended");
    endCallLocal();
  });

  // ---------- THEN CONNECT ----------
  socket.on("connect", () => {
    console.log("CONNECTED:", socket.id);

    const token =
      localStorage.getItem("token") ||
      localStorage.getItem("dToken");

    socket.emit("join-room", { appointmentId, token });
  });

  return () => socket.disconnect();
}, [appointmentId]);

  // ================= PEER =================
  const createPeer = () => {
    const pc = new RTCPeerConnection({
      iceServers: [{ urls: "stun:stun.l.google.com:19302" }],
    });

    pc.ontrack = (e) => {
      remoteVideoRef.current.srcObject = e.streams[0];
    };

    pc.onicecandidate = (e) => {
      if (e.candidate) {
        socketRef.current.emit("webrtc-ice-candidate", {
          appointmentId,
          candidate: e.candidate,
        });
      }
    };

    pcRef.current = pc;
    return pc;
  };

  // ================= MEDIA =================
  const startMedia = async () => {
    const stream = await navigator.mediaDevices.getUserMedia({
      video: true,
      audio: true,
    });

    localStreamRef.current = stream;
    localVideoRef.current.srcObject = stream;
    return stream;
  };
  // ================= MEDIA CONTROLS =================
const toggleMic = () => {
  if (!localStreamRef.current) return;

  const audioTrack = localStreamRef.current.getAudioTracks()[0];
  if (!audioTrack) return;

  audioTrack.enabled = !audioTrack.enabled;
  setMicOn(audioTrack.enabled);
};

const toggleCamera = () => {
  if (!localStreamRef.current) return;

  const videoTrack = localStreamRef.current.getVideoTracks()[0];
  if (!videoTrack) return;

  videoTrack.enabled = !videoTrack.enabled;
  setCamOn(videoTrack.enabled);
};

  // ================= START CALL =================
  const startCall = async () => {
    if (callBlockedRef.current) {
    toast.info("Please wait before retrying");
    return;
  }

     if (!peerReady) {
    toast.info("Doctor is not in consultation room yet");
    return;
  }
  callBlockedRef.current = true;
  try{
    const stream = await startMedia();
    const pc = createPeer();

    stream.getTracks().forEach((track) => pc.addTrack(track, stream));

    const offer = await pc.createOffer();
    await pc.setLocalDescription(offer);

    socketRef.current.emit("webrtc-offer", {
      appointmentId,
      offer,
    });

    setInCall(true);}
    catch (err) {
    callBlockedRef.current = false;
  }
  };
  // adding universal hendler
  const notifyLeaving = () => {
  if (!socketRef.current || !appointmentId) return;

  socketRef.current.emit("webrtc-end-call", {
    appointmentId,
    reason: "peer-left"
  });
};

useEffect(() => {
  const handleUnload = () => {
    notifyLeaving();
  };

  window.addEventListener("beforeunload", handleUnload);

  return () => {
    window.removeEventListener("beforeunload", handleUnload);
    notifyLeaving(); // also fires on route change
  };
}, [appointmentId]);

  // ================= END CALL =================
  const endCallLocal = () => {
    pcRef.current?.close();
    pcRef.current = null;

    localStreamRef.current?.getTracks().forEach((t) => t.stop());

    if (localVideoRef.current) localVideoRef.current.srcObject = null;
    if (remoteVideoRef.current) remoteVideoRef.current.srcObject = null;

    setInCall(false);
  };

 const endCall = () => {
  notifyLeaving();
  endCallLocal();
};

  // ================= JOIN ROOM =================
  useEffect(() => {
    const socket = socketRef.current;
    if (!socket || !appointmentId) return;

    const token = localStorage.getItem("token") || localStorage.getItem("dToken");
    if (!token) return;



    socket.on("room-ready", () => {
      setPeerReady(true);
      setStatus("Doctor available");
    });

    // ===== CHAT HISTORY =====
    socket.on("chat-history", (history) => {
      const formatted = history.map((m) => ({
        from: m.sender,
        message: m.text,
      }));
      setMessages(formatted);
      setCanChat(true);
    });

    socket.on("chat-message", (msg) => {
      setMessages((prev) => [...prev, msg]);
    });
// call blocked 
socket.off("call-blocked");

socket.on("call-blocked", ({ reason }) => {

  if (callBlockedRef.current === "shown") return; // HARD GUARD
  callBlockedRef.current = "shown";

  const messages = {
    TOO_EARLY: "⏰ Consultation hasn't started yet",
    EXPIRED: "🕒 Consultation time is over",
    APPOINTMENT_INACTIVE: "❌ Appointment cancelled or completed",
    INVALID_SLOT_DATA: "⚠️ Server time configuration error"
  };

  toast.error(messages[reason] || "Call not allowed");

  endCallLocal?.();

  // allow retry after cooldown
  setTimeout(() => {
    callBlockedRef.current = false;
  }, 4000);
});

    // ===== OFFER RECEIVED =====
    socket.on("webrtc-offer", async ({ offer }) => {
      const stream = await startMedia();
      const pc = createPeer();

      stream.getTracks().forEach((track) => pc.addTrack(track, stream));

      await pc.setRemoteDescription(new RTCSessionDescription(offer));

      const answer = await pc.createAnswer();
      await pc.setLocalDescription(answer);

      socket.emit("webrtc-answer", { appointmentId, answer });
      setInCall(true);
    });

    // ===== ANSWER RECEIVED =====
    socket.on("webrtc-answer", async ({ answer }) => {
      if (!pcRef.current) return;
      await pcRef.current.setRemoteDescription(new RTCSessionDescription(answer));
    });

    // ===== ICE RECEIVED =====
    socket.on("webrtc-ice-candidate", async ({ candidate }) => {
      try {
        if (!pcRef.current) return;
        await pcRef.current.addIceCandidate(new RTCIceCandidate(candidate));
      } catch {}
    });

    // ===== CALL ENDED =====
    socket.on("webrtc-end-call", ({ reason }) => {

  if (!inCall) return;

  const msgMap = {
    "peer-left": "Other participant left the consultation",
    "disconnect": "Connection lost",
    "manual": "Call ended"
  };

  toast.info(msgMap[reason] || "Call ended");

  endCallLocal();
});

    return () => {
      socket.off("room-ready");
      socket.off("chat-history");
      socket.off("chat-message");
      socket.off("webrtc-offer");
      socket.off("webrtc-answer");
      socket.off("webrtc-ice-candidate");
      socket.off("webrtc-end-call");
      socket.off("call-blocked");
    };
  }, [appointmentId]);

  // ================= SEND MESSAGE =================
  const sendMessage = () => {
    if (!text.trim()) return;
    socketRef.current.emit("chat-message", { message: text });
    setText("");
  };

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  return (
    <div className="h-screen flex flex-col items-center gap-4 p-6">
      <h2 className="text-2xl font-semibold">Patient Consultation</h2>
      <p>{status}</p>

      <div className="flex gap-4">
        <video ref={localVideoRef} autoPlay playsInline muted className="w-72 h-48 bg-black rounded" />
        <video ref={remoteVideoRef} autoPlay playsInline className="w-72 h-48 bg-black rounded" />
      </div>

     {!inCall ? (
  <button
    
    onClick={startCall}
    className={`px-5 py-2 rounded text-white ${peerReady ? "bg-blue-600" : "bg-gray-400"}`}
  >
    Start Call
  </button>
) : (
  <div className="flex flex-col items-center gap-3">

    <div className="flex gap-3">

      <button
        onClick={toggleMic}
        className={`px-4 py-2 rounded text-white ${micOn ? "bg-gray-700" : "bg-yellow-500"}`}
      >
        {micOn ? "Mute Mic" : "Unmute Mic"}
      </button>

      <button
        onClick={toggleCamera}
        className={`px-4 py-2 rounded text-white ${camOn ? "bg-gray-700" : "bg-yellow-500"}`}
      >
        {camOn ? "Turn Camera Off" : "Turn Camera On"}
      </button>

      <button
        onClick={endCall}
        className="bg-red-600 text-white px-5 py-2 rounded"
      >
        End Call
      </button>

    </div>

  </div>
)}
        

      {/* CHAT */}
      <div className="w-[420px] h-[300px] border rounded p-3 overflow-y-auto bg-white">
        {messages.map((m, i) => (
          <div key={i} className={`my-1 flex ${m.from === "patient" ? "justify-end" : "justify-start"}`}>
            <div className={`px-3 py-2 rounded-lg max-w-[70%] ${m.from === "patient" ? "bg-green-600 text-white" : "bg-gray-200 text-gray-800"}`}>
              {m.message}
            </div>
          </div>
        ))}
        <div ref={bottomRef} />
      </div>

      <div className="flex gap-2">
        <input
          value={text}
          onChange={(e) => setText(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && sendMessage()}
          className="border px-3 py-2 rounded w-72"
          placeholder="Type message..."
        />
        <button
          disabled={!canChat}
          onClick={sendMessage}
          className={`px-4 py-2 rounded text-white ${canChat ? "bg-green-600 hover:bg-green-700" : "bg-gray-400"}`}
        >
          Send
        </button>
      </div>
    </div>
  );
}

export default Consultation;