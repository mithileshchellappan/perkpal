import { SignIn } from "@clerk/nextjs";

export default function SignInPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-black to-gray-900 text-white">
        <SignIn 
          appearance={{ 
            elements: { 
              formButtonPrimary: "bg-blue-600 hover:bg-blue-700 text-white",
              card: "bg-gray-800 border-gray-700",
              headerTitle: "text-white",
              headerSubtitle: "text-gray-300",
              formFieldLabel: "text-gray-300",
              formFieldInput: "bg-gray-700 border-gray-600 text-white",
              footerActionLink: "text-blue-400 hover:text-blue-300",
            } 
          }}
          path="/sign-in"
          routing="path"
          signUpUrl="/sign-up"
          redirectUrl="/"
        />
    </div>
  );
} 