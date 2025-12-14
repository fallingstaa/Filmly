import React, { useState } from 'react';

// Organizer profile type
interface OrganizerProfile {
  name: string;
  role: string;
  bio: string;
  email: string;
  country: string;
  contact: string;
  organization: string;
  social: string;
}

const PROFILE_IMAGE_PATH = '/premium_photo-1689568126014-06fea9d5d341.jpg';

export default function OrganizerProfileView({ user }: { user: OrganizerProfile }) {
  const [isEditing, setIsEditing] = useState(false);

  if (isEditing) {
    return (
      <div className="p-8 w-full">
        <div className="bg-white rounded-lg shadow p-8 max-w-4xl mx-auto">
          <div className="flex justify-between items-center mb-6">
            <div className="flex items-center gap-2">
              <img src="/image 10.svg" alt="Logo" style={{ height: 32 }} />
              <span className="text-lg font-semibold text-green-900">Welcome back, {user.name}!</span>
            </div>
            <button
              className="bg-green-900 text-white px-4 py-2 rounded"
              onClick={() => setIsEditing(false)}
            >
              Cancel
            </button>
          </div>
          <div className="flex gap-8 mb-6">
            <div>
              <label className="block font-semibold text-green-900 mb-2">Upload Image</label>
              <div className="w-32 h-32 border-2 border-dashed border-green-300 rounded flex items-center justify-center cursor-pointer mb-2">
                <span className="text-5xl text-green-400">+</span>
              </div>
            </div>
            <div className="flex-1">
              <label className="block font-bold text-green-900 text-lg mb-2 text-center">Organization Bio</label>
              <textarea
                className="w-full h-32 border rounded p-2"
                placeholder="Describe your organization..."
                defaultValue={user.bio}
              />
            </div>
          </div>
          <div className="mb-4">
            <label className="block font-semibold mb-1">Email</label>
            <input className="w-full border rounded p-2" defaultValue={user.email} placeholder="your@email.com" />
          </div>
          <div className="mb-4">
            <label className="block font-semibold mb-1">Full Name</label>
            <input className="w-full border rounded p-2" defaultValue={user.name} placeholder="Jane Doe" />
          </div>
          <div className="mb-4">
            <label className="block font-semibold mb-1">Organization</label>
            <input className="w-full border rounded p-2" defaultValue={user.organization} placeholder="Your Organization" />
          </div>
          <div className="mb-4">
            <label className="block font-semibold mb-1">Country</label>
            <input className="w-full border rounded p-2" defaultValue={user.country} placeholder="Select your country" />
          </div>
          <div className="mb-4">
            <label className="block font-semibold mb-1">Contact</label>
            <input className="w-full border rounded p-2" defaultValue={user.contact} placeholder="Contact" />
          </div>
          <div className="mb-4">
            <label className="block font-semibold mb-1">Social Link</label>
            <input className="w-full border rounded p-2" defaultValue={user.social} placeholder="Social Link" />
          </div>
          <button className="bg-green-900 text-white px-6 py-2 rounded mt-4 float-right">
            Update Profile
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="p-8 w-full">
      <div className="border border-[#EDEDED] p-6 rounded-lg shadow-sm bg-white">
        <div className="flex justify-between items-center mb-6 border-b border-[#EDEDED] pb-3">
          <h1 className="text-xl font-bold flex items-center gap-2" style={{ color: '#155c37' }}>
            Welcome back, {user.name.split(' ')[0]}!
          </h1>
          <button
            className="flex items-center gap-1 px-4 py-2 text-white rounded-lg font-medium text-sm transition duration-200"
            style={{ backgroundColor: '#155c37' }}
            onClick={() => setIsEditing(true)}
          >
            Update Profile
          </button>
        </div>
        <div className="flex gap-8">
          <div className="flex flex-col flex-shrink-0 w-80">
            <img
              src={PROFILE_IMAGE_PATH}
              alt="Profile"
              className="w-full h-48 rounded-lg object-cover mb-4 border border-[#EDEDED] shadow-sm"
              style={{ objectPosition: 'center' }}
            />
            <div className="text-sm">
              <div className="mb-1"><b>Email:</b> {user.email}</div>
              <div className="mb-1"><b>Organization:</b> {user.organization}</div>
              <div className="mb-1"><b>Country:</b> {user.country}</div>
              <div className="mb-1"><b>Contact:</b> {user.contact}</div>
              <div className="mb-1"><b>Social:</b> {user.social}</div>
            </div>
          </div>
          <div className="flex-grow">
            <h2 className="text-xl font-bold mb-2" style={{ color: '#155c37' }}>
              Organization Bio
            </h2>
            <p className="text-sm text-[#222] leading-relaxed whitespace-pre-wrap">
              {user.bio}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
