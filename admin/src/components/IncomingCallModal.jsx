import { useContext } from "react";
import { useNavigate } from "react-router-dom";
import { DoctorSocketContext } from "../context/DoctorSocketContext";

function IncomingCallModal() {
  const { incomingCall, clearIncomingCall } = useContext(DoctorSocketContext);
  const navigate = useNavigate();

  if (!incomingCall) return null;

  const joinCall = () => {
    navigate(`/consult/${incomingCall}`);
    clearIncomingCall();
  };

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl shadow-2xl p-6 w-80 flex flex-col items-center gap-4">
        <h2 className="text-xl font-semibold">📞 Patient Calling</h2>

        <p className="text-gray-500 text-sm">
          Appointment ID: {incomingCall}
        </p>

        <button
          onClick={joinCall}
          className="bg-green-600 text-white px-6 py-2 rounded-lg"
        >
          Join Consultation
        </button>
      </div>
    </div>
  );
}

export default IncomingCallModal;