import React, { useState } from 'react';

// Define the type for the user prop for better type safety
interface UserProfile {
  name: string;
  role: string;
  bio: string;
  gmail: string;
  country: string;
  contact: string;
  social: string;
}

// Use the new landscape image path
const PROFILE_IMAGE_PATH = '/premium_photo-1689568126014-06fea9d5d341.jpg';

export default function FilmmakerProfileView({ user }: { user: UserProfile }) {
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
              <label className="block font-bold text-green-900 text-lg mb-2 text-center">Biography</label>
              <textarea
                className="w-full h-32 border rounded p-2"
                placeholder="Brief description of your film... (eg: Lina, a shy 16-year-old girl who loves dancing, secretly practices...)"
                defaultValue={user.bio}
              />
            </div>
          </div>
          <div className="mb-4">
            <label className="block font-semibold mb-1">Email</label>
            <input className="w-full border rounded p-2" defaultValue={user.gmail} placeholder="your@email.com" />
          </div>
          <div className="mb-4">
            <label className="block font-semibold mb-1">Full Name</label>
            <input className="w-full border rounded p-2" defaultValue={user.name} placeholder="John Doe" />
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

  // Removed the max-width and centering, as it will be contained by the layout
  return (
    <div className="p-8 w-full"> 
      
      {/* --- Main Content Container (Shadowed Box) --- */}
      <div className="border border-[#EDEDED] p-6 rounded-lg shadow-sm bg-white">
        
        {/* --- Header Section (Welcome back and Edit Button) --- */}
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

        {/* --- Profile Details Layout --- */}
        <div className="flex gap-8">
          
          {/* --- Left Content: Image and Contact Info (Horizontal Layout) --- */}
          <div className="flex flex-col flex-shrink-0 w-80">
            <img
              src={PROFILE_IMAGE_PATH} 
              alt="Profile"
              // Adjusted size and styling to better match the new image
              className="w-full h-48 rounded-lg object-cover mb-4 border border-[#EDEDED] shadow-sm"
              style={{ objectPosition: 'center' }}
            />
            
            {/* Contact Details */}
            <div className="text-sm">
              <div className="mb-1"><b>Gmail:</b> {user.gmail}</div>
              <div className="mb-1"><b>Country:</b> {user.country}</div>
              <div className="mb-1"><b>Contact:</b> {user.contact}</div>
              <div className="mb-1"><b>Social:</b> {user.social}</div>
            </div>
          </div>

          {/* --- Right Content: Biography --- */}
          <div className="flex-grow">
            <h2 className="text-xl font-bold mb-2" style={{ color: '#155c37' }}>
              Biography
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