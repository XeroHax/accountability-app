"use client";

import { Hero } from "@/components/Hero";
import { SalesContent } from "@/components/SalesContent";

export default function Home() {
  return (
    <div className="container mx-auto max-w-7xl flex flex-col items-center">
      <Hero />
      <SalesContent />
    </div>
  );
}
