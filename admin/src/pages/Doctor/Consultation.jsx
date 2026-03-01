import { useEffect, useRef, useState } from "react";
import { useParams } from "react-router-dom";
import { io } from "socket.io-client";

function Consultation() {
  const { appointmentId } = useParams();
  const pendingCandidatesRef = useRef([]);
  const socketRef = useRef(null);
  const pcRef = useRef(null);
  const localStreamRef = useRef(null);

  const localVideoRef = useRef(null);
  const remoteVideoRef = useRef(null);
  const bottomRef = useRef(null);

  const [status, setStatus] = useState("Connecting...");
  const [messages, setMessages] = useState([]);
  const [text, setText] = useState("");
  const [canChat, setCanChat] = useState(false);

  const [micOn, setMicOn] = useState(true);
  const [camOn, setCamOn] = useState(true);
  const [incomingCall, setIncomingCall] = useState(false);
  const [incomingOffer, setIncomingOffer] = useState(null);
  const [inCall, setInCall] = useState(false);

  const myRole = "doctor";

  // ================= SOCKET =================
  useEffect(() => {
    const socket = io(import.meta.env.VITE_BACKEND_URL, {
      transports: ["websocket"],
      reconnection: true,
      reconnectionAttempts: Infinity,
      reconnectionDelay: 1000,
    });

    socketRef.current = socket;

    socket.on("connect", () => {
      console.log("SOCKET CONNECTED");
      setStatus("Joining consultation room...");
      joinRoom(socket);
    });

    return () => socket.disconnect();
  }, [appointmentId]);

  // ================= JOIN ROOM =================
  const joinRoom = (socket) => {
    const token =
      localStorage.getItem("dToken") || localStorage.getItem("token");
    socket.emit("join-room", { appointmentId, token });

    socket.on("chat-history", (history) => {
      const formatted = history.map((m) => ({
        from: m.sender,
        message: m.text,
      }));
      setMessages(formatted);
      setCanChat(true);
      setStatus("Connected");
    });

    socket.on("chat-message", (msg) => setMessages((prev) => [...prev, msg]));

    socket.on("call-blocked", ({ reason }) => {
      const messages = {
        TOO_EARLY: "Consultation not started yet",
        EXPIRED: "Consultation time is over",
        APPOINTMENT_INACTIVE: "Appointment cancelled or completed",
        INVALID_SLOT_DATA: "Server time error",
      };

      alert(messages[reason] || reason);
    });

    socket.on("webrtc-offer", ({ offer }) => {
      console.log("📞 OFFER RECEIVED BY DOCTOR");
      setIncomingOffer(offer);
      setIncomingCall(true);
      setStatus("Incoming patient call...");
    });

    socket.on("webrtc-answer", async ({ answer }) => {
      if (!pcRef.current) return;
      await pcRef.current.setRemoteDescription(
        new RTCSessionDescription(answer),
      );
    });

    socket.on("webrtc-ice-candidate", async ({ candidate }) => {
      try {
        // Peer not created yet → store candidates
        if (!pcRef.current || !pcRef.current.remoteDescription) {
          pendingCandidatesRef.current.push(candidate);
          return;
        }

        await pcRef.current.addIceCandidate(new RTCIceCandidate(candidate));
      } catch (err) {
        console.log("ICE error:", err);
      }
    });

    socket.on("webrtc-end-call", ({ reason }) => {
      if (!inCall) return;

      const msgMap = {
        "peer-left": "Patient left the consultation",
        disconnect: "Patient connection lost",
        manual: "Call ended",
      };

      alert(msgMap[reason] || "Call ended");

      cleanupCall();
    });
  };

  // ================= PEER CONNECTION =================
  const createPeerConnection = () => {
    console.log("🧠 DOCTOR creating PeerConnection");

    const pc = new RTCPeerConnection({
      iceServers: [{ urls: "stun:stun.l.google.com:19302" }],
    });

    pc.ontrack = (event) => {
      console.log("🎥 DOCTOR RECEIVED REMOTE TRACK");
      remoteVideoRef.current.srcObject = event.streams[0];
    };

    pc.onicecandidate = (event) => {
      if (event.candidate) {
        socketRef.current.emit("webrtc-ice-candidate", {
          appointmentId,
          candidate: event.candidate,
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
  // ================= ACCEPT CALL =================
  const acceptCall = async () => {
    setIncomingCall(false);
    setStatus("Starting camera...");

    const stream = await startMedia();
    const pc = createPeerConnection();

    stream.getTracks().forEach((track) => pc.addTrack(track, stream));

    // set patient offer
    await pc.setRemoteDescription(new RTCSessionDescription(incomingOffer));

    // IMPORTANT: apply queued ICE candidates
    for (const candidate of pendingCandidatesRef.current) {
      try {
        await pc.addIceCandidate(new RTCIceCandidate(candidate));
      } catch (err) {
        console.log("Queued ICE error:", err);
      }
    }
    pendingCandidatesRef.current = [];

    // small delay avoids Chrome race condition
    await new Promise((res) => setTimeout(res, 100));

    const answer = await pc.createAnswer();
    await pc.setLocalDescription(answer);

    socketRef.current.emit("webrtc-answer", { appointmentId, answer });

    setInCall(true);
    setStatus("In call");
  };

  const notifyLeaving = () => {
    if (!socketRef.current || !appointmentId || !inCall) return;

    socketRef.current.emit("webrtc-end-call", {
      appointmentId,
      reason: "peer-left",
    });
  };

  // ================= END CALL =================
  const cleanupCall = () => {
    if (!inCall && !pcRef.current) return;

  console.log("Cleaning call");
    pcRef.current?.close();
    pcRef.current = null;

    localStreamRef.current?.getTracks().forEach((t) => t.stop());

    if (localVideoRef.current) localVideoRef.current.srcObject = null;
    if (remoteVideoRef.current) remoteVideoRef.current.srcObject = null;

    setInCall(false);
    setStatus("Call ended");
  };

  const endCall = () => {
    notifyLeaving();
    cleanupCall();
  };

  useEffect(() => {
    const handleUnload = () => {
      notifyLeaving();
    };

    window.addEventListener("beforeunload", handleUnload);

    return () => {
      window.removeEventListener("beforeunload", handleUnload);
      notifyLeaving(); // fires on navigation
    };
  }, [appointmentId]);

  // ================= CHAT =================
  const sendMessage = () => {
    if (!text.trim()) return;
    socketRef.current.emit("chat-message", { message: text });
    setText("");
  };

  useEffect(
    () => bottomRef.current?.scrollIntoView({ behavior: "smooth" }),
    [messages],
  );

  // ================= UI =================
return (
  <div className="h-screen w-screen flex flex-col bg-black text-white overflow-hidden">

    {/* ================= VIDEO STAGE ================= */}
    <div className="relative flex-1 bg-black flex items-center justify-center">

      {/* remote full screen */}
      <video
        ref={remoteVideoRef}
        autoPlay
        playsInline
        className="absolute inset-0 w-full h-full object-cover"
      />

      {/* local preview */}
      <video
        ref={localVideoRef}
        autoPlay
        muted
        playsInline
        className="absolute top-4 right-4 w-40 h-28 rounded-xl border border-white object-cover bg-black shadow-lg"
      />

      {/* top status */}
      <div className="absolute top-4 left-4 bg-black/60 px-3 py-1 rounded-lg text-sm">
        {status}
      </div>

      {/* incoming call modal */}
      {incomingCall && (
        <div className="absolute inset-0 flex items-center justify-center bg-black/70 backdrop-blur-sm">
          <div className="bg-white text-black p-8 rounded-2xl flex flex-col items-center gap-4">
            <p className="text-xl font-semibold">Patient is calling...</p>
            <button
              onClick={acceptCall}
              className="bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-xl"
            >
              Accept Call
            </button>
          </div>
        </div>
      )}

      {/* call controls */}
      {inCall && (
        <div className="absolute bottom-5 left-1/2 -translate-x-1/2 flex gap-4 bg-black/60 backdrop-blur-md px-6 py-3 rounded-full">

          <button
            onClick={toggleMic}
            className={`px-4 py-2 rounded-full ${micOn ? "bg-gray-700" : "bg-yellow-500"}`}
          >
            {micOn ? "Mute" : "Unmute"}
          </button>

          <button
            onClick={toggleCamera}
            className={`px-4 py-2 rounded-full ${camOn ? "bg-gray-700" : "bg-yellow-500"}`}
          >
            {camOn ? "Camera Off" : "Camera On"}
          </button>

          <button
            onClick={endCall}
            className="bg-red-600 hover:bg-red-700 px-5 py-2 rounded-full"
          >
            End
          </button>

        </div>
      )}
    </div>

    {/* ================= CHAT PANEL ================= */}
    <div className="h-[38%] bg-white text-black flex flex-col rounded-t-2xl shadow-2xl">

      {/* header */}
      <div className="p-3 border-b font-semibold text-center">
        Consultation Chat
      </div>

      {/* messages */}
      <div className="flex-1 overflow-y-auto p-3 space-y-2">
        {messages.map((m, i) => (
          <div
            key={i}
            className={`flex ${m.from === myRole ? "justify-end" : "justify-start"}`}
          >
            <div
              className={`px-3 py-2 rounded-xl max-w-[75%] ${
                m.from === myRole
                  ? "bg-green-600 text-white"
                  : "bg-gray-200"
              }`}
            >
              {m.message}
            </div>
          </div>
        ))}
        <div ref={bottomRef} />
      </div>

      {/* input */}
      <div className="p-3 border-t flex gap-2">
        <input
          value={text}
          onChange={(e) => setText(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && sendMessage()}
          className="flex-1 border rounded-lg px-3 py-2 outline-none"
          placeholder="Type message..."
        />
        <button
          onClick={sendMessage}
          className="bg-green-600 hover:bg-green-700 text-white px-4 rounded-lg"
        >
          Send
        </button>
      </div>

    </div>
  </div>
);
}
export default Consultation;