import React from 'react';

interface FestivalDetailCardProps {
  festival: any; // Backend event object
  onClose: () => void;
  onDelete?: (eventId: number) => void;
}

export default function FestivalDetailCard({ festival, onClose, onDelete }: FestivalDetailCardProps) {
  // Map backend data to display format
  const modal = {
    name: festival.title || 'Untitled Festival',
    theme: festival.description || 'No theme provided',
    about: festival.description || 'No description available',
    location: festival.location || 'Not specified',
    festivalDates: festival.createdAt ? `Created: ${new Date(festival.createdAt).toLocaleDateString()}` : 'N/A',
    language: festival.language || 'Not specified',
    duration: festival.duration ? `${festival.duration} minutes` : 'Not specified',
    deadline: festival.deadline ? new Date(festival.deadline).toLocaleDateString() : 'No deadline set',
    genres: festival.genre || [],
    stats: {
      submissions: 0, // Would need to fetch from submissions API
      filmmakers: 0,
      awards: 0,
      complete: new Date(festival.deadline) < new Date(),
    },
  };

  const handleDelete = () => {
    if (onDelete) {
      onDelete(festival.id);
    }
  };
  return (
    <div className="w-full min-h-screen bg-[#F6F7F6] flex flex-col items-center py-10">
      <div className="w-full max-w-5xl bg-white rounded-2xl shadow-lg overflow-hidden relative">
        {/* Back Button */}
        <button className="absolute top-6 left-6 text-[#0B4C2F] hover:text-[#17613B] text-base border border-[#0B4C2F] rounded px-4 py-1 bg-white shadow" onClick={onClose}>&larr; Back</button>
        {/* Theme Banner */}
        <div className="bg-gradient-to-r from-[#0B4C2F] to-[#17613B] py-10 px-8 text-center rounded-t-2xl flex flex-col items-center">
          <div className="text-white text-lg mb-2 tracking-wide uppercase font-semibold">Theme</div>
          <div className="text-white text-3xl font-extrabold italic">“{modal.theme}”</div>
        </div>
        {/* Main Content */}
        <div className="flex flex-col md:flex-row gap-10 px-10 py-10">
          {/* About Section */}
          <div className="flex-1 min-w-[260px]">
            <div className="font-bold text-[#1B7A3A] mb-3 text-xl">About</div>
            <div className="text-[#3A4A4A] whitespace-pre-line text-base mb-6 leading-relaxed">
              {modal.about || (
                <>
                  There are things we sense but never speak, shadows hiding behind everyday smiles.<br />
                  Sometimes the smallest detail reveals everything we tried to ignore.<br />
                  Follow the path of what's hidden, whispered, or half-forgotten.<br />
                  Let your film uncover what people rarely dare to face.
                </>
              )}
            </div>
            {modal.website && (
              <div className="mb-2 text-[#1B7A3A]">
                <span className="font-semibold">Website: </span>
                <a href={modal.website} target="_blank" rel="noopener noreferrer" className="underline text-[#17613B]">{modal.website}</a>
              </div>
            )}
            {modal.contactEmail && (
              <div className="mb-2 text-[#1B7A3A]">
                <span className="font-semibold">Contact: </span>
                <a href={`mailto:${modal.contactEmail}`} className="underline text-[#17613B]">{modal.contactEmail}</a>
              </div>
            )}
            <div className="flex gap-3 mt-4">
              <button
                className="bg-[#0B4C2F] text-white font-bold px-6 py-2 rounded-lg hover:bg-[#17613B]"
                onClick={() => alert('Edit functionality coming soon')}
              >
                Edit Festival
              </button>
              {onDelete && (
                <button
                  className="bg-red-600 text-white font-bold px-6 py-2 rounded-lg hover:bg-red-700"
                  onClick={handleDelete}
                >
                  Delete Festival
                </button>
              )}
            </div>
          </div>
          {/* Info Section - visually distinct card, styled as screenshot */}
          <div className="flex-1 min-w-[260px] bg-white rounded-xl shadow-inner p-6 space-y-6 text-base border border-[#E0E4E0]">
            {/* Location */}
            <div className="flex items-start gap-3">
              <span className="text-[#1B7A3A] text-xl mt-1">{/* map-pin icon */}
                <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 21c-4.418-4.418-7-7.418-7-10a7 7 0 1 1 14 0c0 2.582-2.582 5.582-7 10z" />
                  <circle cx="12" cy="11" r="3" />
                </svg>
              </span>
              <div>
                <div className="text-xs text-[#6B7280] font-semibold">Location</div>
                <div className="text-[#17613B] font-medium text-base">{modal.country || modal.location || 'N/A'}</div>
              </div>
            </div>
            {/* Festival Dates */}
            <div className="flex items-start gap-3">
              <span className="text-[#1B7A3A] text-xl mt-1">{/* calendar icon */}
                <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
                  <rect x="3" y="5" width="18" height="16" rx="2" />
                  <path d="M16 3v4M8 3v4M3 9h18" />
                </svg>
              </span>
              <div>
                <div className="text-xs text-[#6B7280] font-semibold">Festival Dates</div>
                <div className="text-[#17613B] font-medium text-base">{modal.festivalDates}</div>
              </div>
            </div>
            {/* Language(s) */}
            <div className="flex items-start gap-3">
              <span className="text-[#1B7A3A] text-xl mt-1">{/* globe icon */}
                <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
                  <circle cx="12" cy="12" r="10" />
                  <path d="M2 12h20M12 2a15.3 15.3 0 0 1 0 20M12 2a15.3 15.3 0 0 0 0 20" />
                </svg>
              </span>
              <div>
                <div className="text-xs text-[#6B7280] font-semibold">Language</div>
                <div className="text-[#17613B] font-medium text-base truncate max-w-[180px]">
                  {(() => {
                    let langs = [];
                    if (Array.isArray(modal.language)) langs = modal.language;
                    else if (modal.language) langs = [modal.language];
                    if (modal.languages && Array.isArray(modal.languages)) langs = langs.concat(modal.languages);
                    const langStr = langs.join(', ');
                    return langStr.length > 28 ? langStr.slice(0, 28) + '...' : langStr;
                  })()}
                </div>
              </div>
            </div>
            {/* Duration */}
            <div className="flex items-start gap-3">
              <span className="text-[#1B7A3A] text-xl mt-1">{/* globe icon for duration */}
                <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
                  <circle cx="12" cy="12" r="10" />
                  <path d="M2 12h20M12 2a15.3 15.3 0 0 1 0 20M12 2a15.3 15.3 0 0 0 0 20" />
                </svg>
              </span>
              <div>
                <div className="text-xs text-[#6B7280] font-semibold">Duration</div>
                <div className="text-[#17613B] font-medium text-base">{modal.duration}</div>
              </div>
            </div>
            {/* Deadline */}
            <div className="flex items-start gap-3">
              <span className="text-[#1B7A3A] text-xl mt-1">{/* pin icon for deadline */}
                <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 21c-4.418-4.418-7-7.418-7-10a7 7 0 1 1 14 0c0 2.582-2.582 5.582-7 10z" />
                  <circle cx="12" cy="11" r="3" />
                </svg>
              </span>
              <div>
                <div className="text-xs text-[#6B7280] font-semibold">Deadline</div>
                <div className="text-[#17613B] font-medium text-base">{modal.deadline}</div>
              </div>
            </div>
          </div>
        </div>
        {/* Stats Section */}
        <div className="w-full bg-[#F6F7F6] px-10 py-8 flex flex-col md:flex-row gap-6 border-t border-[#E0E4E0]">
          <div className="flex-1 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
            <div className="bg-white rounded-xl shadow p-6 flex flex-col items-center justify-between h-40">
              <div className="text-gray-500 text-sm font-medium mb-2 flex items-center gap-1">Total Submissions <span>🎬</span></div>
              <div className="text-[#0B4C2F] text-3xl font-extrabold">{modal.stats.submissions}</div>
              <div className="text-gray-400 text-xs mt-2">All festivals combined</div>
            </div>
            <div className="bg-white rounded-xl shadow p-6 flex flex-col items-center justify-between h-40">
              <div className="text-gray-500 text-sm font-medium mb-2 flex items-center gap-1">Total Filmmakers <span>👤</span></div>
              <div className="text-[#0B4C2F] text-3xl font-extrabold">{modal.stats.filmmakers}</div>
              <div className="text-gray-400 text-xs mt-2">Unique filmmakers</div>
            </div>
            <div className="bg-white rounded-xl shadow p-6 flex flex-col items-center justify-between h-40">
              <div className="text-gray-500 text-sm font-medium mb-2 flex items-center gap-1">Awards Given <span>🏅</span></div>
              <div className="text-[#0B4C2F] text-3xl font-extrabold">{modal.stats.awards}</div>
              <div className="text-gray-400 text-xs mt-2">Across all festivals</div>
            </div>
            <div className="bg-white rounded-xl shadow p-6 flex flex-col items-center justify-center h-40">
              <div className="text-[#0B4C2F] text-lg font-semibold">{modal.stats.complete ? 'Complete' : ''}</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
