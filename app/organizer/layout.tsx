import OrganizerSidebar from '../../src/view/organizer/OrganizerSidebar';

export default function OrganizerLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex">
      <OrganizerSidebar />
      <main className="flex-1 p-8">{children}</main>
    </div>
  );
}