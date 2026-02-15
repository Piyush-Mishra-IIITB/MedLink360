import React, { useState } from 'react';
import { assets } from '../assets/assets_frontend/assets';

function MyProfile() {
  const [userData, setUserData] = useState({
    name: "Edward Vincent",
    image: assets.profile_pic,
    email: 'hello@gmail.com',
    phone: '+91 7362922772',
    address: {
      line1: "57th Cross",
      line2: "Circle, Church Road, London"
    },
    gender: 'Male',
    dob: '2000-01-20'
  });

  const [isEdit, setIsEdit] = useState(false);

  return (
    <div className="bg-gray-50 flex justify-center px-4 pt-10 pb-10 ">

      <div className="w-full max-w-3xl bg-white rounded-xl shadow-sm p-6 shadow hover:shadow-2xl p-4 rounded ">

        {/* Header */}
        <div className="flex items-center gap-4">

          <img
            src={userData.image}
            alt="user"
            className="w-24 h-24 rounded-full object-cover border"
          />

          <div className="flex-1">
            {isEdit ? (
              <input
                className="border px-3 py-1 rounded w-full text-lg font-semibold"
                value={userData.name}
                onChange={(e) =>
                  setUserData(prev => ({ ...prev, name: e.target.value }))
                }
              />
            ) : (
              <p className="text-xl font-semibold text-gray-800">
                {userData.name}
              </p>
            )}
            <p className="text-sm text-gray-500">{userData.email}</p>
          </div>

        </div>

        <hr className="my-6" />

        {/* Info Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">

          {/* Email */}
          <div>
            <p className="text-gray-500">Email</p>
            {isEdit ? (
              <input
                className="border px-3 py-1 rounded w-full"
                value={userData.email}
                onChange={(e) =>
                  setUserData(prev => ({ ...prev, email: e.target.value }))
                }
              />
            ) : (
              <p className="font-medium">{userData.email}</p>
            )}
          </div>

          {/* Phone */}
          <div>
            <p className="text-gray-500">Phone</p>
            {isEdit ? (
              <input
                className="border px-3 py-1 rounded w-full"
                value={userData.phone}
                onChange={(e) =>
                  setUserData(prev => ({ ...prev, phone: e.target.value }))
                }
              />
            ) : (
              <p className="font-medium">{userData.phone}</p>
            )}
          </div>

          {/* Address Line 1 */}
          <div>
            <p className="text-gray-500">Address Line 1</p>
            {isEdit ? (
              <input
                className="border px-3 py-1 rounded w-full"
                value={userData.address.line1}
                onChange={(e) =>
                  setUserData(prev => ({
                    ...prev,
                    address: { ...prev.address, line1: e.target.value }
                  }))
                }
              />
            ) : (
              <p className="font-medium">{userData.address.line1}</p>
            )}
          </div>

          {/* Address Line 2 */}
          <div>
            <p className="text-gray-500">Address Line 2</p>
            {isEdit ? (
              <input
                className="border px-3 py-1 rounded w-full"
                value={userData.address.line2}
                onChange={(e) =>
                  setUserData(prev => ({
                    ...prev,
                    address: { ...prev.address, line2: e.target.value }
                  }))
                }
              />
            ) : (
              <p className="font-medium">{userData.address.line2}</p>
            )}
          </div>

          {/* Gender */}
          <div>
            <p className="text-gray-500">Gender</p>
            {isEdit ? (
              <select
                className="border px-3 py-1 rounded w-full"
                value={userData.gender}
                onChange={(e) =>
                  setUserData(prev => ({ ...prev, gender: e.target.value }))
                }
              >
                <option>Male</option>
                <option>Female</option>
              </select>
            ) : (
              <p className="font-medium">{userData.gender}</p>
            )}
          </div>

          {/* DOB */}
          <div>
            <p className="text-gray-500">Date of Birth</p>
            {isEdit ? (
              <input
                type="date"
                className="border px-3 py-1 rounded w-full"
                value={userData.dob}
                onChange={(e) =>
                  setUserData(prev => ({ ...prev, dob: e.target.value }))
                }
              />
            ) : (
              <p className="font-medium">{userData.dob}</p>
            )}
          </div>

        </div>

        {/* Button */}
        <div className="mt-6 text-center">
          <button
            onClick={() => setIsEdit(!isEdit)}
            className="bg-primary text-white px-5 py-2 rounded-full text-sm hover:shadow-md transition"
          >
            {isEdit ? "Save Information" : "Edit Profile"}
          </button>
        </div>

      </div>
    </div>
  );
}

export default MyProfile;
