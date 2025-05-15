import { SignIn } from "@clerk/nextjs";

export default function SignInPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-md">
        <h1 className="text-2xl font-bold mb-6 text-center">Sign in to PerkPal</h1>
        <SignIn appearance={{ elements: { formButtonPrimary: "bg-blue-600 hover:bg-blue-700" } }} />
      </div>
    </div>
  );
} 