// src/components/EditProfileClientComponent.tsx
'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';

interface EditProfileClientComponentProps {
  initialData: {
    currentstatus: string;
    phonenumber: string;
    bloodgroup: string;
    hall: string;
    linkedin: string;
    uniqueid: string;
    public_email: string;
  };
}

const EditProfileClientComponent: React.FC<EditProfileClientComponentProps> = ({ initialData }) => {
  const [formData, setFormData] = useState({
    currentStatus: initialData.currentstatus || '',
    phoneNumber: initialData.phonenumber || '',
    bloodGroup: initialData.bloodgroup || '',
    hall: initialData.hall || '',
    linkedin: initialData.linkedin || '',
    uniqueId: initialData.uniqueid || '',
    public_email: initialData.public_email || '',  // Ensure this is initialized correctly
  });

  const router = useRouter();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const response = await fetch('/api/update-profile', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(formData),
    });

    if (response.ok) {
      alert('Profile updated successfully');
      router.refresh();
    } else {
      alert('Error updating profile');
    }
  };

  const halls = [
    'Shaheed Mohammad Shah Hall',
    'Dr. Qudrat-E-Khuda Hall',
    'Bangabandhu Hall',
    'Shaheed Tareq Huda Hall',
    'Sheikh Russel Hall',
    'Sufia Kamal Hall',
    'Shamsunnahar Khan Hall',
    'Tapashi Rabeya Hall',
  ];

  return (
    <form onSubmit={handleSubmit} className="space-y-6 bg-gray-100 p-6 rounded-lg shadow-md">
      {/* Current Status */}
      <div className="flex flex-col">
        <label className="mb-2 text-gray-800 font-semibold">
          Current Status:
          <input
            type="text"
            name="currentStatus"
            value={formData.currentStatus}
            onChange={handleChange}
            className="mt-1 p-2 border border-gray-400 rounded-lg w-full bg-white text-gray-900 font-medium"
          />
        </label>
      </div>

      {/* Phone Number */}
      <div className="flex flex-col">
        <label className="mb-2 text-gray-800 font-semibold">
          Phone Number:
          <input
            type="text"
            name="phoneNumber"
            value={formData.phoneNumber}
            onChange={handleChange}
            className="mt-1 p-2 border border-gray-400 rounded-lg w-full bg-white text-gray-900 font-medium"
          />
        </label>
      </div>

      {/* Blood Group */}
      <div className="flex flex-col">
        <label className="mb-2 text-gray-800 font-semibold">
          Blood Group:
          <input
            type="text"
            name="bloodGroup"
            value={formData.bloodGroup}
            onChange={handleChange}
            className="mt-1 p-2 border border-gray-400 rounded-lg w-full bg-white text-gray-900 font-medium"
          />
        </label>
      </div>

      {/* Hall */}
      <div className="flex flex-col">
        <label className="mb-2 text-gray-800 font-semibold">
          Hall:
          <select
            name="hall"
            value={formData.hall}
            onChange={handleChange}
            className="mt-1 p-2 border border-gray-400 rounded-lg w-full bg-white text-gray-900 font-medium"
          >
            <option value="">Select your Hall</option>
            {halls.map((hall) => (
              <option key={hall} value={hall}>
                {hall}
              </option>
            ))}
          </select>
        </label>
      </div>

      {/* LinkedIn */}
      <div className="flex flex-col">
        <label className="mb-2 text-gray-800 font-semibold">
          LinkedIn:
          <input
            type="text"
            name="linkedin"
            value={formData.linkedin}
            onChange={handleChange}
            className="mt-1 p-2 border border-gray-400 rounded-lg w-full bg-white text-gray-900 font-medium"
          />
        </label>
      </div>

      {/* Unique ID */}
      <div className="flex flex-col">
        <label className="mb-2 text-gray-800 font-semibold">
          Unique ID:
          <input
            type="text"
            name="uniqueId"
            value={formData.uniqueId}
            onChange={handleChange}
            className="mt-1 p-2 border border-gray-400 rounded-lg w-full bg-white text-gray-900 font-medium"
          />
        </label>
      </div>

      {/* Public Email */}
      <div className="flex flex-col">
        <label className="mb-2 text-gray-800 font-semibold">
          Public Email:
          <input
            type="email"
            name="public_email"
            value={formData.public_email}
            onChange={handleChange}
            className="mt-1 p-2 border border-gray-400 rounded-lg w-full bg-white text-gray-900 font-medium"
          />
        </label>
      </div>

      <button type="submit" className="bg-blue-600 text-white p-3 rounded-lg hover:bg-blue-700 font-semibold w-full">
        Update Profile
      </button>
    </form>
  );
};

export default EditProfileClientComponent;
