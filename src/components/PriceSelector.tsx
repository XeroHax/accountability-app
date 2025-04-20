"use client"

import React, { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { auth } from "@/lib/firebase";
import { onAuthStateChanged } from "firebase/auth";

const PriceSelector = () => {
  const [dailyPrice, setDailyPrice] = useState(3);
  const [isLoading, setIsLoading] = useState(false);
  const [userId, setUserId] = useState<string | null>(null);
  
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        setUserId(user.uid);
      } else {
        setUserId(null);
      }
    });
    
    return () => unsubscribe();
  }, []);

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    }).format(price);
  };

  const getMonthlyPrice = (daily: number) => {
    return (daily * (365/12)).toFixed(2);
  };

  const handleChoosePrice = async () => {
    if (!userId) {
      alert('You must be logged in to subscribe');
      return;
    }
    
    try {
      setIsLoading(true);
      
      // Detect user's timezone using Intl.DateTimeFormat
      const timezone = Intl.DateTimeFormat().resolvedOptions().timeZone;
      
      const response = await fetch('/api/create-checkout-session', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          pricePerDay: dailyPrice,
          currency: 'usd',
          userId: userId,
          timezone: timezone
        }),
      });

      const data = await response.json();
      
      if (data.error) {
        throw new Error(data.error);
      }

      if (data.url) {
        window.location.href = data.url;
      } else {
        throw new Error('No checkout URL received');
      }
    } catch (error) {
      console.error('Error initiating checkout:', error);
      alert('There was an error initiating checkout. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto space-y-8">
      {/* Message Section */}
      <div className="text-center space-y-4">
        <h2 className="text-4xl font-bold tracking-tight">
          Let&apos;s put skin in the game!
        </h2>
        <p className="text-lg text-muted-foreground">
          Choose the price that will motivate you. Too high, and it becomes stressful, too low and it&apos;s not motivating. You want there to be a consequence without it being too much.
          Use the slider to pick the price that will keep it interesting.
        </p>
        <p className="text-muted-foreground italic">
          Most people choose around $3 (you can change this later)
        </p>
      </div>

      {/* Price Display */}
      <div className="text-center py-8">
        <div className="text-5xl font-bold mb-2">
          {formatPrice(dailyPrice)}
        </div>
        <p className="text-xl text-muted-foreground">per day</p>
      </div>

      {/* Slider with penny increments */}
      <input
        type="range"
        min="1"
        max="10"
        step="0.05"
        value={dailyPrice}
        onChange={(e) => setDailyPrice(parseFloat(e.target.value))}
        className="w-full h-5"
        style={{
          accentColor: 'var(--progress-fill-color)'
        }}
      />

      {/* Price Range Labels */}
      <div className="flex justify-between text-sm text-muted-foreground mb-8">
        <span>$1.00</span>
        <span className="text-lg font-medium">
          Popular: $3.00
        </span>
        <span>$10.00</span>
      </div>

      {/* Action Button */}
      <div className="text-center">
        <Button
          onClick={handleChoosePrice}
          size="lg"
          className="font-bold text-lg px-8"
          disabled={isLoading}
        >
          {isLoading ? 'Processing...' : 'Choose Your Price'}
        </Button>
      </div>

      {/* Monthly Price Info */}
      <div className="text-sm text-muted-foreground text-center mt-8">
        Monthly equivalent: {formatPrice(parseFloat(getMonthlyPrice(dailyPrice)))}
        <br/>
        <span className="text-xs">(based on 365/12 days per month)</span>
      </div>
    </div>
  );
};

export default PriceSelector;
