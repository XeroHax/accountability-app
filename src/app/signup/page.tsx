"use client";

import GoogleAuthButton from "@/components/GoogleAuthButton";
import AppleAuthButton from "@/components/AppleAuthButton";
import EmailAuthForm from "@/components/EmailAuthForm";

// CSS for responsive progress bar
const progressBarStyles = `
  :root {
    --account-progress-width: 4%;
    --progress-track-color: #e2e8f0; /* Darker gray for track */
    --progress-fill-color: #0064a6; /* Darker blue for fill */
    --milestone-active-color: #0064a6; /* Active milestone color */
    --milestone-inactive-color: #94a3b8; /* Inactive milestone color */
  }
  
  @media (max-width: 480px) {
    :root {
      --account-progress-width: 5%;
    }
  }
`;

export default function SignupPage() {
  return (
    <>
      {/* Add the CSS styles */}
      <style dangerouslySetInnerHTML={{ __html: progressBarStyles }} />
      
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto py-24">
          <div className="bg-white rounded-xl shadow-md p-8">
            {/* Progress Bar with Milestone Markers */}
            <div className="mb-12 relative">
              {/* Progress Track */}
              <div className="w-full h-1 absolute top-3 z-0" style={{ backgroundColor: 'var(--progress-track-color)' }}></div>
              
              {/* Progress Fill */}
              <div className="h-1 absolute top-3 z-10" style={{ backgroundColor: 'var(--progress-fill-color)', width: 'var(--account-progress-width)' }}></div>
              
              {/* Milestone Markers */}
              <div className="flex justify-between relative z-20">
                {/* Account Milestone */}
                <div className="flex flex-col items-center">
                  <div className="w-6 h-6 rounded-full border-2 bg-background flex items-center justify-center" style={{ borderColor: 'var(--milestone-active-color)' }}>
                    <div className="w-2 h-2 rounded-full" style={{ backgroundColor: 'var(--milestone-active-color)' }}></div>
                  </div>
                  <div className="text-sm font-medium mt-2">Account</div>
                </div>
                
                {/* Goals Milestone */}
                <div className="flex flex-col items-center">
                  <div className="w-6 h-6 rounded-full border-2 bg-background" style={{ borderColor: 'var(--milestone-inactive-color)' }}></div>
                  <div className="text-sm font-medium mt-2">Goals</div>
                </div>
                
                {/* Price Milestone */}
                <div className="flex flex-col items-center">
                  <div className="w-6 h-6 rounded-full border-2 bg-background" style={{ borderColor: 'var(--milestone-inactive-color)' }}></div>
                  <div className="text-sm font-medium mt-2">Price</div>
                </div>
                
                {/* App Milestone */}
                <div className="flex flex-col items-center">
                  <div className="w-6 h-6 rounded-full border-2 bg-background" style={{ borderColor: 'var(--milestone-inactive-color)' }}></div>
                  <div className="text-sm font-medium mt-2">App</div>
                </div>
              </div>
            </div>
            
            <h1 className="text-4xl font-bold tracking-tight text-center mb-8">
              Let&apos;s get started!
            </h1>

            <div className="mb-8">
              <p className="text-lg mb-4">
                Signing up is quick and easy—just four simple steps:
              </p>
              <ol className="list-decimal pl-8 space-y-3 text-base">
                <li className="pl-2">
                  <span className="font-semibold">Create your account</span> –
                  It only takes a minute.
                </li>
                <li className="pl-2">
                  <span className="font-semibold">
                    Set and clarify your goals
                  </span>{" "}
                  – Tell us what matters most.
                </li>
                <li className="pl-2">
                  <span className="font-semibold">Pick your price</span> – Put
                  skin in the game.
                </li>
                <li className="pl-2">
                  <span className="font-semibold">Download the app</span> –
                  Start achieving your goals right away.
                </li>
              </ol>

              <div className="mt-8 p-8 bg-muted rounded-xl">
                <h3 className="text-xl font-semibold mb-4">Ready to begin?</h3>
                <p className="mb-4">
                  Create your account with your preferred method:
                </p>

                <div className="space-y-4 max-w-md mx-auto">
                  <GoogleAuthButton className="w-full" />
                  <AppleAuthButton className="w-full" />

                  <div className="relative my-6">
                    <div className="absolute inset-0 flex items-center">
                      <div className="w-full border-t border-muted-foreground/30"></div>
                    </div>
                    <div className="relative flex justify-center text-sm">
                      <span className="px-2 bg-muted text-muted-foreground">
                        Or continue with
                      </span>
                    </div>
                  </div>

                  <EmailAuthForm className="w-full" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}