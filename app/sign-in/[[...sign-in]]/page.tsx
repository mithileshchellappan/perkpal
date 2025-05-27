"use client"

import { SignIn } from "@clerk/nextjs";
import { useState } from "react";
import { Copy, Check } from "lucide-react";

export default function SignInPage() {
  const [copiedField, setCopiedField] = useState<string | null>(null);

  const copyToClipboard = async (text: string, fieldName: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedField(fieldName);
      setTimeout(() => setCopiedField(null), 2000);
    } catch (err) {
      console.error('Failed to copy: ', err);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-black to-gray-900 text-white">
      <div className="w-full max-w-fit">
        <div className="mb-6 p-4 bg-blue-900/30 border border-blue-700 rounded-lg">
          <h3 className="text-sm font-semibold text-blue-300 mb-2">🚨 For Testers</h3>
          <p className="text-xs text-blue-200 mb-3">Use these test credentials:</p>
          <div className="space-y-2">
            <div 
              className="bg-gray-800/50 p-3 rounded border text-xs font-mono cursor-pointer hover:bg-gray-700/50 transition-colors flex items-center justify-between group"
              onClick={() => copyToClipboard('perkpal-test@gmail.com', 'email')}
            >
              <div className="text-gray-300">
                Email: <span className="text-white">perkpal-test@gmail.com</span>
              </div>
              <div className="opacity-0 group-hover:opacity-100 transition-opacity">
                {copiedField === 'email' ? (
                  <Check className="w-4 h-4 text-green-400" />
                ) : (
                  <Copy className="w-4 h-4 text-gray-400" />
                )}
              </div>
            </div>
            
            <div 
              className="bg-gray-800/50 p-3 rounded border text-xs font-mono cursor-pointer hover:bg-gray-700/50 transition-colors flex items-center justify-between group"
              onClick={() => copyToClipboard('PerkPalTesting@', 'password')}
            >
              <div className="text-gray-300">
                Password: <span className="text-white">PerkPalTesting@</span>
              </div>
              <div className="opacity-0 group-hover:opacity-100 transition-opacity">
                {copiedField === 'password' ? (
                  <Check className="w-4 h-4 text-green-400" />
                ) : (
                  <Copy className="w-4 h-4 text-gray-400" />
                )}
              </div>
            </div>
          </div>
          <p className="text-xs text-blue-300 mt-2 italic">Click to copy</p>
        </div>
        
        <SignIn 
          path="/sign-in"
          routing="path"
          signUpUrl="/sign-up"
          redirectUrl="/"
          appearance={{
            elements: {
              formButtonPrimary: "bg-blue-600 hover:bg-blue-700 text-white",
              card: "bg-gray-800 border-gray-700 shadow-xl",
              headerTitle: "text-white",
              headerSubtitle: "text-gray-300",
              formFieldLabel: "text-gray-300",
              formFieldInput: "bg-gray-700 border-gray-600 text-white placeholder:text-gray-400 focus:border-blue-500",
              footerActionLink: "text-blue-400 hover:text-blue-300",
              identityPreviewText: "text-gray-300",
              identityPreviewEditButton: "text-blue-400 hover:text-blue-300",
              formFieldInputShowPasswordButton: "text-gray-400 hover:text-gray-300",
              dividerLine: "bg-gray-600",
              dividerText: "text-gray-400",
              socialButtonsBlockButton: "bg-gray-700 border-gray-600 text-white hover:bg-gray-600",
              socialButtonsBlockButtonText: "text-white",
              formResendCodeLink: "text-blue-400 hover:text-blue-300",
              otpCodeFieldInput: "bg-gray-700 border-gray-600 text-white",
              formFieldWarningText: "text-yellow-400",
              formFieldErrorText: "text-red-400",
              alertText: "text-red-400",
              formFieldSuccessText: "text-green-400"
            },
            layout: {
              logoImageUrl: undefined,
              showOptionalFields: true
            }
          }}
        />
      </div>
    </div>
  );
} 