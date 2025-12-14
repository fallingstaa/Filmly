import FestivalSidebar from '../../src/view/festival/Sidebar';

export default function FestivalLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex">
      <FestivalSidebar />
      <main className="flex-1 p-8">{children}</main>
    </div>
  );
}