"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useSearchParams } from "next/navigation";

// CSS for responsive progress bar
const progressBarStyles = `
  :root {
    --price-progress-width: 100%;
    --progress-track-color: #e2e8f0; /* Darker gray for track */
    --progress-fill-color: #0064a6; /* Darker blue for fill */
    --milestone-active-color: #0064a6; /* Active milestone color */
    --milestone-inactive-color: #94a3b8; /* Inactive milestone color */
  }
  
  @media (max-width: 480px) {
    :root {
      --price-progress-width: 100%;
    }
  }
`;

export default function SuccessPage() {
  const searchParams = useSearchParams();
  const sessionId = searchParams.get("session_id");
  const [loading, setLoading] = useState(false);
  
  useEffect(() => {
    // If we have a session ID, we can fetch the session details
    if (sessionId) {
      setLoading(true);
      // You could add an API endpoint to fetch session details if needed
      console.log("Checkout session ID:", sessionId);
      
      // For now, we'll just log the session ID and set loading to false
      // In a real app, you might want to fetch subscription details from your server
      setTimeout(() => {
        setLoading(false);
      }, 1000);
    }
  }, [sessionId]);
  
  return (
    <>
      {/* Add the CSS styles */}
      <style dangerouslySetInnerHTML={{ __html: progressBarStyles }} />
      
      <main className="min-h-screen bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto py-24">
            <div className="bg-white rounded-xl shadow-md p-8">
              {/* Progress Bar with Milestone Markers */}
              <div className="mb-12 relative">
                {/* Progress Track */}
                <div
                  className="w-full h-1 absolute top-3 z-0"
                  style={{ backgroundColor: "var(--progress-track-color)" }}
                ></div>
                
                {/* Progress Fill */}
                <div
                  className="h-1 absolute top-3 z-10"
                  style={{
                    backgroundColor: "var(--progress-fill-color)",
                    width: 'var(--price-progress-width)'
                  }}
                ></div>
                
                {/* Milestone Markers */}
                <div className="flex justify-between relative z-20">
                  {/* Account Milestone - Completed */}
                  <div className="flex flex-col items-center">
                    <div
                      className="w-6 h-6 rounded-full border-2 flex items-center justify-center"
                      style={{
                        borderColor: "var(--milestone-active-color)",
                        backgroundColor: "var(--milestone-active-color)",
                      }}
                    >
                      <div className="w-2 h-2 rounded-full bg-white"></div>
                    </div>
                    <div className="text-sm font-medium mt-2">Account</div>
                  </div>
                  
                  {/* Goals Milestone - Completed */}
                  <div className="flex flex-col items-center">
                    <div
                      className="w-6 h-6 rounded-full border-2 flex items-center justify-center"
                      style={{
                        borderColor: "var(--milestone-active-color)",
                        backgroundColor: "var(--milestone-active-color)",
                      }}
                    >
                      <div className="w-2 h-2 rounded-full bg-white"></div>
                    </div>
                    <div className="text-sm font-medium mt-2">Goals</div>
                  </div>
                  
                  {/* Price Milestone - Completed */}
                  <div className="flex flex-col items-center">
                    <div
                      className="w-6 h-6 rounded-full border-2 flex items-center justify-center"
                      style={{
                        borderColor: "var(--milestone-active-color)",
                        backgroundColor: "var(--milestone-active-color)",
                      }}
                    >
                      <div className="w-2 h-2 rounded-full bg-white"></div>
                    </div>
                    <div className="text-sm font-medium mt-2">Price</div>
                  </div>
                  
                  {/* App Milestone - Current */}
                  <div className="flex flex-col items-center">
                    <div
                      className="w-6 h-6 rounded-full border-2 bg-white flex items-center justify-center"
                      style={{
                        borderColor: "var(--milestone-active-color)",
                      }}
                    >
                      <div
                        className="w-2 h-2 rounded-full"
                        style={{
                          backgroundColor: "var(--milestone-active-color)",
                        }}
                      ></div>
                    </div>
                    <div className="text-sm font-medium mt-2">App</div>
                  </div>
                </div>
              </div>
              
              <div className="text-center space-y-6 max-w-2xl mx-auto">
                {loading ? (
                  <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto">
                    <svg
                      className="w-8 h-8 text-blue-500 animate-spin"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                      ></circle>
                      <path
                        className="opacity-75"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                        fill="currentColor"
                      ></path>
                    </svg>
                    <p className="mt-2">Loading subscription details...</p>
                  </div>
                ) : (
                  <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto">
                    <svg
                      className="w-8 h-8 text-green-500"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M5 13l4 4L19 7"
                      />
                    </svg>
                  </div>
                )}
                
                <h1 className="text-4xl font-bold tracking-tight">
                  You&apos;re All Set!
                </h1>
                
                <p className="text-lg text-muted-foreground">
                  Thank you for subscribing to Accountability Place. Your subscription has been confirmed and you&apos;re ready to start your accountability journey.
                </p>
                
                <div className="mt-8">
                  <h2 className="text-2xl font-semibold mb-4">Download the App to Get Started</h2>
                  <p className="text-muted-foreground mb-6">
                    Install our mobile app to track your goals, receive reminders, and stay accountable on the go.
                  </p>
                  
                  <div className="flex flex-col sm:flex-row justify-center gap-4 mt-6">
                    <Link href="https://apps.apple.com/app/accountability-place" target="_blank" rel="noopener noreferrer" className="inline-block">
                      <Image 
                        src="/app-store-download-button.svg" 
                        alt="Download on the App Store" 
                        width={200} 
                        height={60}
                        className="hover:opacity-90 transition-opacity"
                      />
                    </Link>
                    <Link href="https://play.google.com/store/apps/details?id=com.accountabilityplace.app" target="_blank" rel="noopener noreferrer" className="inline-block">
                      <Image 
                        src="/google-play-download-button.svg" 
                        alt="Get it on Google Play" 
                        width={200} 
                        height={60}
                        className="hover:opacity-90 transition-opacity"
                      />
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </>
  );
}
