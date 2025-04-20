"use client";

import Image from "next/image";

export function Hero() {
  return (
    <div className="max-w-4xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-8 pt-16 pb-12 items-center bg-background rounded-t-xl shadow-md px-8">
      <div className="flex flex-col gap-6 px-8">
        <h1 className="text-4xl font-bold tracking-tight lg:text-5xl whitespace-nowrap">
          Accountability Place
        </h1>
        <p className="text-2xl text-muted-foreground">
          &quot;It&apos;s like I&apos;m stuck in a loop of giving up and trying
          again.&quot;
        </p>
        <p className="text-lg text-muted-foreground">
          Stop the cycle. Make it easy to stick to your goals until you achieve
          them.
        </p>
      </div>
      <div className="relative w-full aspect-square md:aspect-[4/3] lg:aspect-[3/2]">
        <Image
          src="/happy-dancing-dog.png"
          alt="Happy dog doing a victory dance"
          fill
          sizes="(max-width: 768px) 100vw, 50vw"
          className="object-contain rounded-lg scale-x-[-1]"
          priority
        />
      </div>
    </div>
  );
}
