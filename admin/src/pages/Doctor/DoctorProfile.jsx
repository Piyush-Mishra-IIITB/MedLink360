import React, { useContext, useEffect, useState } from "react";
import { DoctorContext } from "../../context/DoctorContext";
import axios from "axios";
import { toast } from "react-toastify";

function DoctorProfile() {
const { profileData, backendURL, setProfileData, dToken, getProfileData } =
useContext(DoctorContext);

const [isEdit, setIsEdit] = useState(false);

// Fetch profile once token available
useEffect(() => {
if (dToken) getProfileData();
}, [dToken]);

// Update profile
const updateProfile = async () => {
try {
if (!profileData?.address?.line1 || !profileData?.fees) {
toast.error("Please fill required fields");
return;
}


  const updateData = {
    address: {
      line1: profileData.address?.line1 || "",
      line2: profileData.address?.line2 || "",
    },
    fees: Number(profileData.fees),
    available: Boolean(profileData.available),
  };

  const { data } = await axios.post(
    backendURL + "/api/doctor/update-profile",
    updateData,
    { headers: { token: dToken } }
  );

  if (data.success) {
    toast.success(data.message);
    setIsEdit(false);
    await getProfileData();
  } else {
    toast.error(data.message);
  }
} catch (error) {
  toast.error(error.response?.data?.message || error.message);
}


};

if (!profileData) return null;

return ( <div className="w-full flex justify-center px-6 py-10 bg-gray-50"> <div className="bg-white w-full max-w-5xl rounded-2xl shadow-md border p-8"> <div className="flex flex-col md:flex-row gap-10">


      {/* Image */}
      <div className="flex flex-col items-center">
        <img
          src={profileData.image}
          alt="profile"
          className="w-48 h-48 rounded-2xl object-cover border shadow-sm"
        />

        <div className="flex items-center gap-2 mt-4">
          <input
            type="checkbox"
            disabled={!isEdit}
            checked={profileData.available || false}
            onChange={() =>
              setProfileData(prev => ({
                ...prev,
                available: !prev.available,
              }))
            }
            className="w-4 h-4 accent-primary cursor-pointer disabled:opacity-40"
          />
          <label className="text-gray-700 font-medium">Available</label>
        </div>
      </div>

      {/* Info */}
      <div className="flex-1 space-y-5">

        {/* Name */}
        <div>
          <p className="text-3xl font-semibold text-gray-800">
            {profileData.name}
          </p>
          <p className="text-gray-500 mt-1">
            {profileData.degree} - {profileData.speciality}
          </p>
        </div>

        {/* Experience */}
        <button className="px-4 py-1 rounded-full text-sm border bg-blue-50 text-blue-700">
          {profileData.experience}
        </button>

        {/* About */}
        <div>
          <p className="font-semibold text-gray-700">About</p>
          <p className="text-gray-600 leading-relaxed mt-1">
            {profileData.about}
          </p>
        </div>

        {/* Fees */}
        <div>
          <p className="font-semibold text-gray-700">
            Appointment Fee:
            <span className="ml-2 text-lg font-medium text-primary">
              ₹{" "}
              {isEdit ? (
                <input
                  type="number"
                  value={profileData.fees || ""}
                  onChange={(e) =>
                    setProfileData(prev => ({
                      ...prev,
                      fees: e.target.value,
                    }))
                  }
                  className="border rounded px-2 py-1 w-24 ml-2"
                />
              ) : (
                profileData.fees
              )}
            </span>
          </p>
        </div>

        {/* Address */}
        <div>
          <p className="font-semibold text-gray-700">Address</p>

          {isEdit ? (
            <div className="space-y-2">
              <input
                type="text"
                value={profileData.address?.line1 || ""}
                onChange={(e) =>
                  setProfileData(prev => ({
                    ...prev,
                    address: { ...prev.address, line1: e.target.value },
                  }))
                }
                className="border rounded px-3 py-2 w-full"
                placeholder="Address line 1"
              />

              <input
                type="text"
                value={profileData.address?.line2 || ""}
                onChange={(e) =>
                  setProfileData(prev => ({
                    ...prev,
                    address: { ...prev.address, line2: e.target.value },
                  }))
                }
                className="border rounded px-3 py-2 w-full"
                placeholder="Address line 2"
              />
            </div>
          ) : (
            <>
              <p className="text-gray-600">{profileData.address?.line1}</p>
              <p className="text-gray-600">{profileData.address?.line2}</p>
            </>
          )}
        </div>

        {/* Buttons */}
        {isEdit ? (
          <button
            onClick={updateProfile}
            className="mt-4 px-6 py-2 rounded-lg bg-primary text-white font-medium hover:bg-primary/90 active:scale-95 transition"
          >
            Save
          </button>
        ) : (
          <button
            onClick={() => setIsEdit(true)}
            className="mt-4 px-6 py-2 rounded-lg bg-primary text-white font-medium hover:bg-primary/90 active:scale-95 transition"
          >
            Edit
          </button>
        )}

      </div>
    </div>
  </div>
</div>


);
}

export default DoctorProfile;
