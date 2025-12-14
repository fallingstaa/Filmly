import AuthForm from '@/features/auth/AuthForm';

export default function SignupPage() {
  return (
    <main className="mx-auto flex min-h-[70vh] max-w-6xl items-start justify-center px-6 pt-10">
      <AuthForm mode="signup" hideRole />
    </main>
  );
}