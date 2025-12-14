import RoleSelectForm from '@/features/auth/RoleSelectForm';

export default function ChooseRolePage() {
  return (
    <main className="mx-auto flex min-h-[70vh] max-w-6xl items-start justify-center px-6 pt-10">
      <RoleSelectForm />
    </main>
  );
}