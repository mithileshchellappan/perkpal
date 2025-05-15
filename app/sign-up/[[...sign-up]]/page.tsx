import { SignUp } from "@clerk/nextjs";

export default function SignUpPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-md">
        <h1 className="text-2xl font-bold mb-6 text-center">Sign up for PerkPal</h1>
        <SignUp appearance={{ elements: { formButtonPrimary: "bg-blue-600 hover:bg-blue-700" } }} />
      </div>
    </div>
  );
} 