
export default function PastSubmissionsSection() {
  return (
    <section className="mt-6 rounded-2xl border border-[#EDEDED] bg-white p-8 shadow-sm flex flex-col items-center justify-center min-h-[220px]">
      <div className="flex flex-col items-center justify-center">
        <svg width="40" height="40" viewBox="0 0 40 40" fill="none" className="mb-2" aria-hidden="true">
          <circle cx="20" cy="20" r="20" fill="#D1FAE5" />
          <path d="M13 27V13a1 1 0 0 1 1-1h12a1 1 0 0 1 1 1v14a1 1 0 0 1-1 1H14a1 1 0 0 1-1-1z" fill="#10B981" />
          <rect x="16" y="17" width="8" height="2" rx="1" fill="white" />
          <rect x="16" y="21" width="8" height="2" rx="1" fill="white" />
        </svg>
        <span className="text-2xl font-bold text-[#00441B] mb-2">Keep Creating</span>
        <p className="text-gray-600 text-center max-w-md mt-2">
          Every story deserves to be told. Whether you’re working on your next masterpiece or taking a creative break, remember: the journey is as important as the destination.
        </p>
      </div>
    </section>
  );
}