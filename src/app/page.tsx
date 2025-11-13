"use client";

import { useEffect, useState } from "react";
import Navbar from "@/components/Navbar";
import LeaderboardHero from "@/components/LeaderboardHero";
import LeaderboardTable from "@/components/LeaderboardTable";
import Footer from "@/components/Footer";
import { useWebSocket } from "@/hooks/useWebSocket";
import FloatingElements from "@/components/FloatingElements";

export default function Home() {
  const { leaderboardData, countdown, isConnected } = useWebSocket();
  const [mounted, setMounted] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    setMounted(true);
    // Simulate loading animation
    setTimeout(() => setIsLoading(false), 800);
  }, []);

  if (!mounted) {
    return (
      <div className="fixed inset-0 bg-bethanz-darker flex items-center justify-center z-50">
        <div className="animate-pulse">
          <div className="w-16 h-16 border-4 border-bethanz-red border-t-transparent rounded-full animate-spin"></div>
        </div>
      </div>
    );
  }

  return (
    <>
      {/* Fixed background with floating elements - truly fixed, doesn't scroll */}
      <div 
        className="fixed inset-0 bg-bethanz-darker z-0" 
        style={{ 
          position: 'fixed', 
          top: 0, 
          left: 0, 
          right: 0, 
          bottom: 0,
          width: '100vw',
          height: '100vh',
          overflow: 'hidden',
          transform: 'translateZ(0)',
          willChange: 'transform',
          backfaceVisibility: 'hidden',
          WebkitBackfaceVisibility: 'hidden',
          perspective: '1000px'
        }}
      >
        <FloatingElements />
      </div>
      
      {/* Loading overlay */}
      {isLoading && (
        <div className="fixed inset-0 z-40 bg-bethanz-darker flex items-center justify-center animate-fade-out">
          <div className="text-center">
            <div className="w-20 h-20 border-4 border-bethanz-red border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-gray-400 text-sm">Loading leaderboard...</p>
          </div>
        </div>
      )}
      
      {/* Content layer - scrolls independently */}
      <main className={`relative z-10 min-h-screen bg-transparent ${isLoading ? 'opacity-0' : 'opacity-100 animate-fade-in'}`}>
        <Navbar />
        <div className="container mx-auto px-3 sm:px-4 py-4 md:py-8">
          <LeaderboardHero
            countdown={countdown}
            isConnected={isConnected}
            leaderboardData={leaderboardData}
            isLoading={isLoading}
          />
          <LeaderboardTable data={leaderboardData} />
        </div>
        <Footer />
      </main>
    </>
  );
}
