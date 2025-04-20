"use client";

import { useEffect } from "react";
import PriceSelector from '@/components/PriceSelector';
import AuthCheck from "@/components/AuthCheck";

// CSS for responsive progress bar
const progressBarStyles = `
  :root {
    --progress-width: 68%;
    --progress-track-color: #e2e8f0; /* Darker gray for track */
    --progress-fill-color: #0064a6; /* Darker blue for fill */
    --milestone-active-color: #0064a6; /* Active milestone color */
    --milestone-inactive-color: #94a3b8; /* Inactive milestone color */
  }
  
  @media (max-width: 480px) {
    :root {
      --progress-width: 68%;
    }
  }
`;

export default function PriceSelectorPage() {
  // Scroll to top when component mounts
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const renderContent = () => {
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
                      width: "var(--progress-width)"
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
                          backgroundColor: "var(--milestone-active-color)"
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
                          backgroundColor: "var(--milestone-active-color)"
                        }}
                      >
                        <div className="w-2 h-2 rounded-full bg-white"></div>
                      </div>
                      <div className="text-sm font-medium mt-2">Goals</div>
                    </div>
                    
                    {/* Price Milestone - Current */}
                    <div className="flex flex-col items-center">
                      <div
                        className="w-6 h-6 rounded-full border-2 bg-white flex items-center justify-center"
                        style={{ borderColor: "var(--milestone-active-color)" }}
                      >
                        <div
                          className="w-2 h-2 rounded-full"
                          style={{ backgroundColor: "var(--milestone-active-color)" }}
                        ></div>
                      </div>
                      <div className="text-sm font-medium mt-2">Price</div>
                    </div>
                    
                    {/* App Milestone */}
                    <div className="flex flex-col items-center">
                      <div
                        className="w-6 h-6 rounded-full border-2 bg-white"
                        style={{ borderColor: "var(--milestone-inactive-color)" }}
                      ></div>
                      <div className="text-sm font-medium mt-2">App</div>
                    </div>
                  </div>
                </div>
                
                <PriceSelector />
              </div>
            </div>
          </div>
        </main>
      </>
    );
  };

  return <AuthCheck>{renderContent()}</AuthCheck>;
}
