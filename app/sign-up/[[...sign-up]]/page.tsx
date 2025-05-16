import { SignUp } from "@clerk/nextjs";

export default function SignUpPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-black to-gray-900 text-white">
      <div className="bg-gray-800 p-8 rounded-lg shadow-lg w-full max-w-md border border-gray-700">
        <div className="flex items-center gap-2 mb-6 justify-center">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
            <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 8.25h19.5M2.25 9h19.5m-16.5 5.25h6m-6 2.25h3m-3.75 3h15a2.25 2.25 0 002.25-2.25V6.75A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25v10.5A2.25 2.25 0 004.5 19.5z" />
          </svg>
          <span className="text-xl font-bold">PerkPal</span>
        </div>
        <h1 className="text-2xl font-bold mb-6 text-center">Sign up for PerkPal</h1>
        <SignUp 
          appearance={{ 
            elements: { 
              formButtonPrimary: "bg-blue-600 hover:bg-blue-700 text-white",
              card: "bg-gray-800 border-gray-700",
              headerTitle: "text-white",
              headerSubtitle: "text-gray-300",
              formFieldLabel: "text-gray-300",
              formFieldInput: "bg-gray-700 border-gray-600 text-white",
              footerActionLink: "text-blue-400 hover:text-blue-300"
            } 
          }}
          path="/sign-up"
          routing="path"
          signInUrl="/sign-in"
          redirectUrl="/"
        />
      </div>
    </div>
  );
} 