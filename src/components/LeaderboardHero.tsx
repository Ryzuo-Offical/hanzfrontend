"use client";

import { useEffect, useState, useRef } from "react";
import { CountdownData, LeaderboardData } from "@/types";
import { ExternalLink } from "lucide-react";
import Image from "next/image";

interface LeaderboardHeroProps {
  countdown: CountdownData;
  isConnected: boolean;
  leaderboardData: LeaderboardData;
  isLoading?: boolean;
}

export default function LeaderboardHero({
  countdown,
  isConnected,
  leaderboardData,
  isLoading = false,
}: LeaderboardHeroProps) {
  const formatRobux = (amount: number) => {
    return new Intl.NumberFormat("en-US", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(amount);
  };

  const formatUSD = (amount: number) => {
    return new Intl.NumberFormat("en-US", {
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const PRIZE_AMOUNTS: { [key: number]: number } = {
    1: 400,
    2: 150,
    3: 125,
  };

  const topThree = leaderboardData?.topThree || [];
  const [showCrown, setShowCrown] = useState(false);
  const [animatedCountdown, setAnimatedCountdown] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
  });
  const [prevCountdown, setPrevCountdown] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
  });
  const [hasAnimatedUp, setHasAnimatedUp] = useState(false);
  const hasStartedCountUp = useRef(false);
  
  // Animated values for wagered and prizes
  const [animatedWagered, setAnimatedWagered] = useState<{ [key: string]: number }>({});
  const [animatedPrizes, setAnimatedPrizes] = useState<{ [key: string]: number }>({});
  const hasAnimatedValues = useRef<{ [key: string]: boolean }>({});

  useEffect(() => {
    if (!isLoading) {
      // Trigger crown animation after loading completes
      const timer = setTimeout(() => {
        setShowCrown(true);
      }, 300);
      return () => clearTimeout(timer);
    }
  }, [isLoading]);

  // Animate wagered and prize amounts counting up
  useEffect(() => {
    if (!isLoading && topThree.length > 0) {
      topThree.forEach((entry, index) => {
        const key = `${entry.userId}-${index}`;
        
        if (!hasAnimatedValues.current[key]) {
          hasAnimatedValues.current[key] = true;
          
          // Animate wagered
          const targetWagered = entry.wagered || 0;
          const duration = 2000;
          const steps = 60;
          const interval = duration / steps;
          let currentStep = 0;

          const animateWagered = setInterval(() => {
            currentStep++;
            const progress = currentStep / steps;
            const easeOut = 1 - Math.pow(1 - progress, 3);
            const currentValue = Math.floor(targetWagered * easeOut);
            
            setAnimatedWagered(prev => ({ ...prev, [key]: currentValue }));

            if (currentStep >= steps) {
              setAnimatedWagered(prev => ({ ...prev, [key]: targetWagered }));
              clearInterval(animateWagered);
            }
          }, interval);

          // Animate prize (with delay)
          setTimeout(() => {
            const targetPrize = PRIZE_AMOUNTS[index + 1] || entry.prize || 0;
            let prizeStep = 0;

            const animatePrize = setInterval(() => {
              prizeStep++;
              const progress = prizeStep / steps;
              const easeOut = 1 - Math.pow(1 - progress, 3);
              const currentValue = Math.floor(targetPrize * easeOut);
              
              setAnimatedPrizes(prev => ({ ...prev, [key]: currentValue }));

              if (prizeStep >= steps) {
                setAnimatedPrizes(prev => ({ ...prev, [key]: targetPrize }));
                clearInterval(animatePrize);
              }
            }, interval);

            return () => clearInterval(animatePrize);
          }, 500);

          return () => clearInterval(animateWagered);
        }
      });
    }
  }, [isLoading, topThree]);

  // Set initial countdown values when first received (only once)
  useEffect(() => {
    // Check if countdown is available for the first time
    const isCountdownAvailable = countdown.days !== undefined && countdown.days >= 0;
    
    // Only start count-up animation if we haven't started yet
    if (!hasStartedCountUp.current && isCountdownAvailable) {
      hasStartedCountUp.current = true;
      
      // Capture initial values immediately to prevent changes during animation
      const targetValues = {
        days: countdown.days,
        hours: countdown.hours,
        minutes: countdown.minutes,
        seconds: countdown.seconds,
      };

      const duration = 1500; // 1.5 seconds to count up
      const steps = 60;
      const interval = duration / steps;
      let currentStep = 0;

      const animate = setInterval(() => {
        currentStep++;
        const progress = currentStep / steps;
        const easeOut = 1 - Math.pow(1 - progress, 3); // Ease out cubic

        setAnimatedCountdown({
          days: Math.floor(targetValues.days * easeOut),
          hours: Math.floor(targetValues.hours * easeOut),
          minutes: Math.floor(targetValues.minutes * easeOut),
          seconds: Math.floor(targetValues.seconds * easeOut),
        });

        if (currentStep >= steps) {
          setAnimatedCountdown(targetValues);
          setPrevCountdown(targetValues);
          setHasAnimatedUp(true);
          clearInterval(animate);
        }
      }, interval);

      return () => clearInterval(animate);
    }
  }, [countdown.days]); // Track countdown.days but ref prevents re-running

  // Update countdown with flip animation when values change (only after initial animation)
  useEffect(() => {
    if (hasAnimatedUp) {
      const hasChanged = 
        countdown.days !== prevCountdown.days ||
        countdown.hours !== prevCountdown.hours ||
        countdown.minutes !== prevCountdown.minutes ||
        countdown.seconds !== prevCountdown.seconds;

      if (hasChanged) {
        // Update the displayed values immediately
        setAnimatedCountdown({
          days: countdown.days,
          hours: countdown.hours,
          minutes: countdown.minutes,
          seconds: countdown.seconds,
        });
        // Update previous values after animation completes
        const timer = setTimeout(() => {
          setPrevCountdown({
            days: countdown.days,
            hours: countdown.hours,
            minutes: countdown.minutes,
            seconds: countdown.seconds,
          });
        }, 600); // Match animation duration
        return () => clearTimeout(timer);
      }
    } else if (countdown.days !== undefined && countdown.days >= 0 && !hasAnimatedUp) {
      // Fallback: If count-up animation hasn't completed yet, still update the countdown
      // This ensures the countdown always shows current values
      const hasChanged = 
        countdown.days !== animatedCountdown.days ||
        countdown.hours !== animatedCountdown.hours ||
        countdown.minutes !== animatedCountdown.minutes ||
        countdown.seconds !== animatedCountdown.seconds;

      if (hasChanged) {
        setAnimatedCountdown({
          days: countdown.days,
          hours: countdown.hours,
          minutes: countdown.minutes,
          seconds: countdown.seconds,
        });
        setPrevCountdown({
          days: countdown.days,
          hours: countdown.hours,
          minutes: countdown.minutes,
          seconds: countdown.seconds,
        });
      }
    }
  }, [countdown.days, countdown.hours, countdown.minutes, countdown.seconds, prevCountdown, hasAnimatedUp, animatedCountdown]);

  return (
    <div className="text-center py-8 relative animate-fade-in">
      {/* Title Section - Better Styled */}
          <div className="mb-6 md:mb-12 animate-fade-in-up" style={{ animationDelay: '0.1s', opacity: 0 }}>
            <div className="mb-3 md:mb-4 relative inline-block px-2">
              <Image
                src="/diceblox.png"
                alt="DICEBLOX"
                width={600}
                height={200}
                className="w-auto h-16 sm:h-12 md:h-20 lg:h-24 object-contain"
                priority
              />
            </div>
            {/* Spacer instead of LEADERBOARD text */}
            <div className="h-3 md:h-8"></div>
          </div>

      {/* Top 3 Winners - Above Countdown */}
      {topThree.length > 0 && (
        <div className="mb-6 sm:mb-8 md:mb-12">
          <div className="flex flex-col md:grid md:grid-cols-3 gap-3 sm:gap-4 md:gap-6 max-w-6xl mx-auto px-2 sm:px-4 podium-container">
            {/* 1st Place - Mobile first */}
            {topThree[0] && (
              <div className="glass-card border border-yellow-500/50 rounded-lg p-3 sm:p-4 md:p-6 text-center relative shadow-lg animate-fade-in-up glow-1st order-1 md:order-2 podium-1st flex flex-col" style={{ animationDelay: '0.2s', opacity: 0, alignSelf: 'flex-start' }}>
                {/* Beautiful Gold Crown - Natural entrance animation */}
                {showCrown && (
                  <div className="absolute -top-6 md:-top-8 left-1/2 transform -translate-x-1/2 z-10">
                    <div className="crown-3d rounded-full p-2 md:p-3 shadow-2xl animate-crown-entrance animate-crown-bounce">
                      <svg 
                        className="w-7 h-7 md:w-9 md:h-9 text-yellow-900" 
                        fill="currentColor" 
                        viewBox="0 0 24 24" 
                        style={{ 
                          filter: 'drop-shadow(0 4px 8px rgba(0,0,0,0.6))',
                        }}
                      >
                        <path d="M5 16L3 5l5.5 5L12 4l3.5 6L21 5l-2 11H5zm14 2c0 1.1-.9 2-2 2H7c-1.1 0-2-.9-2-2v-1h14v1z"/>
                      </svg>
                    </div>
                  </div>
                )}
                <div className="flex justify-center mb-3 md:mb-4 mt-2">
                  <div className="relative">
                    <Image
                      src={topThree[0].avatarUrl || "https://cdn.diceblox.com/avatars/default.webp"}
                      alt={topThree[0].username}
                      width={96}
                      height={96}
                      className="w-20 h-20 md:w-24 md:h-24 rounded-full border-2 border-yellow-500 shadow-lg object-cover"
                      unoptimized={topThree[0].avatarUrl?.includes('rbxcdn.com')}
                      onError={(e) => {
                        if (e.currentTarget.src !== "https://cdn.diceblox.com/avatars/default.webp") {
                          e.currentTarget.src = "https://cdn.diceblox.com/avatars/default.webp";
                        }
                      }}
                    />
                    <div className="absolute -top-1 -right-1 bg-yellow-500 rounded-full w-7 h-7 md:w-8 md:h-8 flex items-center justify-center font-bold text-black text-xs md:text-sm border-2 border-yellow-600">
                      1
                    </div>
                  </div>
                </div>
                <h3 className="text-lg md:text-xl font-bold text-white mb-2 uppercase truncate px-2">
                  {topThree[0].username}
                </h3>
                <p className="text-gray-400 text-xs md:text-sm mb-2">
                  WAGERED
                  <br />
                  <span className="text-white font-bold text-base md:text-lg flex items-center justify-center gap-1.5">
                    <Image src="/robux.svg" alt="Robux" width={16} height={23} className="w-5 h-5 md:w-6 md:h-6" />
                    {formatRobux(animatedWagered[`${topThree[0].userId}-0`] ?? topThree[0].wagered)}
                  </span>
                </p>
                <div className="bg-gradient-to-r from-yellow-500 to-yellow-600 text-black font-bold py-2 md:py-3 px-4 md:px-6 rounded border border-yellow-400 text-sm md:text-base flex items-center justify-center gap-1.5">
                  <Image src="/usd_green.svg" alt="USD" width={16} height={16} className="w-5 h-5" />
                  {formatUSD(animatedPrizes[`${topThree[0].userId}-0`] ?? (PRIZE_AMOUNTS[1] || topThree[0].prize))}
                </div>
              </div>
            )}

            {/* 2nd Place - Diamond Color */}
            {topThree[1] && (
              <div className="glass-card border border-cyan-400/50 rounded-lg p-3 sm:p-4 md:p-6 text-center hover:border-cyan-300/70 transition-all shadow-lg shadow-cyan-500/20 animate-fade-in-up flex flex-col glow-2nd order-2 md:order-1 podium-2nd" style={{ animationDelay: '0.1s', opacity: 0, marginTop: '0' }}>
                <div className="flex justify-center mb-3 md:mb-4 mt-2">
                  <div className="relative">
                    <Image
                      src={topThree[1].avatarUrl || "https://cdn.diceblox.com/avatars/default.webp"}
                      alt={topThree[1].username}
                      width={96}
                      height={96}
                      className="w-20 h-20 md:w-24 md:h-24 rounded-full border-2 border-cyan-400 object-cover shadow-lg"
                      unoptimized={topThree[1].avatarUrl?.includes('rbxcdn.com')}
                      onError={(e) => {
                        if (e.currentTarget.src !== "https://cdn.diceblox.com/avatars/default.webp") {
                          e.currentTarget.src = "https://cdn.diceblox.com/avatars/default.webp";
                        }
                      }}
                    />
                    <div className="absolute -top-1 -right-1 bg-gradient-to-br from-cyan-400 to-blue-500 rounded-full w-7 h-7 md:w-8 md:h-8 flex items-center justify-center font-bold text-white text-xs md:text-sm border-2 border-cyan-300 shadow-lg">
                      2
                    </div>
                  </div>
                </div>
                <h3 className="text-lg md:text-xl font-bold text-white mb-2 uppercase truncate px-2">
                  {topThree[1].username}
                </h3>
                <p className="text-gray-400 text-xs md:text-sm mb-2">
                  WAGERED
                  <br />
                  <span className="text-white font-bold text-base md:text-lg flex items-center justify-center gap-1.5">
                    <Image src="/robux.svg" alt="Robux" width={16} height={23} className="w-5 h-5 md:w-6 md:h-6" />
                    {formatRobux(animatedWagered[`${topThree[1].userId}-1`] ?? topThree[1].wagered)}
                  </span>
                </p>
                <div className="bg-gradient-to-r from-cyan-500 to-blue-500 text-white font-bold py-2 md:py-3 px-4 md:px-6 rounded border border-cyan-400 text-sm md:text-base flex items-center justify-center gap-1.5">
                  <Image src="/usd_green.svg" alt="USD" width={16} height={16} className="w-5 h-5" />
                  {formatUSD(animatedPrizes[`${topThree[1].userId}-1`] ?? (PRIZE_AMOUNTS[2] || topThree[1].prize))}
                </div>
              </div>
            )}

            {/* 3rd Place - Brown Color */}
            {topThree[2] && (
              <div className="glass-card border border-amber-800/50 rounded-lg p-3 sm:p-4 md:p-6 text-center hover:border-amber-700/70 transition-all shadow-lg shadow-amber-900/20 animate-fade-in-up flex flex-col glow-3rd order-3 podium-3rd" style={{ animationDelay: '0.3s', opacity: 0, marginTop: '0' }}>
                <div className="flex justify-center mb-3 md:mb-4 mt-2">
                  <div className="relative">
                    <Image
                      src={topThree[2].avatarUrl || "https://cdn.diceblox.com/avatars/default.webp"}
                      alt={topThree[2].username}
                      width={96}
                      height={96}
                      className="w-20 h-20 md:w-24 md:h-24 rounded-full border-2 border-amber-800 object-cover shadow-lg"
                      unoptimized={topThree[2].avatarUrl?.includes('rbxcdn.com')}
                      onError={(e) => {
                        if (e.currentTarget.src !== "https://cdn.diceblox.com/avatars/default.webp") {
                          e.currentTarget.src = "https://cdn.diceblox.com/avatars/default.webp";
                        }
                      }}
                    />
                    <div className="absolute -top-1 -right-1 bg-gradient-to-br from-amber-800 to-amber-900 rounded-full w-7 h-7 md:w-8 md:h-8 flex items-center justify-center font-bold text-white text-xs md:text-sm border-2 border-amber-700 shadow-lg">
                      3
                    </div>
                  </div>
                </div>
                <h3 className="text-lg md:text-xl font-bold text-white mb-2 uppercase truncate px-2">
                  {topThree[2].username}
                </h3>
                <p className="text-gray-400 text-xs md:text-sm mb-2">
                  WAGERED
                  <br />
                  <span className="text-white font-bold text-base md:text-lg flex items-center justify-center gap-1.5">
                    <Image src="/robux.svg" alt="Robux" width={16} height={23} className="w-5 h-5 md:w-6 md:h-6" />
                    {formatRobux(animatedWagered[`${topThree[2].userId}-2`] ?? topThree[2].wagered)}
                  </span>
                </p>
                <div className="bg-gradient-to-r from-amber-800 to-amber-900 text-white font-bold py-2 md:py-3 px-4 md:px-6 rounded border border-amber-700 text-sm md:text-base flex items-center justify-center gap-1.5">
                  <Image src="/usd_green.svg" alt="USD" width={16} height={16} className="w-5 h-5" />
                  {formatUSD(animatedPrizes[`${topThree[2].userId}-2`] ?? (PRIZE_AMOUNTS[3] || topThree[2].prize))}
                </div>
              </div>
            )}
          </div>
        </div>
      )}

          {/* Bonus Button */}
          <div className="mb-4 md:mb-8 animate-fade-in-up px-2" style={{ animationDelay: '0.5s', opacity: 0 }}>
            <a
              href={process.env.NEXT_PUBLIC_AFFILIATE_URL || "https://bit.ly/hanzdiceblox"}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center space-x-2 bg-bethanz-red hover:bg-red-700 text-white font-bold py-2 md:py-3 px-4 md:px-6 lg:px-8 rounded-lg transition-all duration-300 transform hover:scale-105 text-xs sm:text-sm md:text-base shadow-lg hover:shadow-xl"
            >
              <span>GET A 10% BONUS</span>
              <ExternalLink className="w-3 h-3 md:w-4 md:h-4" />
            </a>
          </div>

      {/* Countdown Section - Modern Design */}
          <div className="mb-6 animate-fade-in-up" style={{ animationDelay: '0.6s', opacity: 0 }}>
            <h3 className="text-base md:text-lg lg:text-xl text-gray-300 mb-4 md:mb-6 uppercase tracking-wide font-semibold px-2">
              LEADERBOARD ENDS IN
            </h3>
            <div className="flex justify-center items-center gap-1.5 sm:gap-2 md:gap-4 max-w-2xl mx-auto px-2">
          {[
            { label: "DAYS", value: animatedCountdown.days, prevValue: prevCountdown.days },
            { label: "HRS", value: animatedCountdown.hours, prevValue: prevCountdown.hours },
            { label: "MIN", value: animatedCountdown.minutes, prevValue: prevCountdown.minutes },
            { label: "SEC", value: animatedCountdown.seconds, prevValue: prevCountdown.seconds },
          ].map((item, index) => {
            const isChanging = hasAnimatedUp && item.value !== item.prevValue;
            return (
              <div 
                key={`${item.label}-${index}`} 
                className="text-center flex-1 max-w-[70px] sm:max-w-[80px] md:max-w-[100px] animate-scale-in"
                style={{ animationDelay: `${0.7 + index * 0.1}s`, opacity: 0 }}
              >
                <div className="bg-gradient-to-b from-bethanz-dark to-bethanz-darker border-2 border-bethanz-red/50 rounded-lg sm:rounded-xl p-2 sm:p-3 md:p-4 shadow-lg backdrop-blur-sm transition-all hover:border-bethanz-red hover:shadow-xl relative overflow-hidden">
                  <div 
                    key={`${item.label}-${item.value}`}
                    className={`text-xl sm:text-2xl md:text-4xl lg:text-5xl font-black text-white tabular-nums countdown-number ${isChanging ? 'countdown-flip' : ''}`} 
                    style={{ fontFamily: 'monospace' }}
                  >
                    {String(item.value).padStart(2, "0")}
                  </div>
                </div>
                <div className="text-[10px] sm:text-xs md:text-sm text-gray-400 mt-1 sm:mt-2 uppercase font-medium tracking-wider">
                  {item.label}
                </div>
              </div>
            );
          })}
        </div>
        <p className="text-gray-400 text-xs sm:text-sm md:text-base mt-4 md:mt-6 px-2">
          THE WINNER WILL BE DETERMINED WHEN THE TIME RUNS OUT,{" "}
          <span className="text-bethanz-red font-semibold">HURRY UP!</span>
        </p>
        <p className="text-gray-500 text-xs mt-2 px-2">
          WINNERS ANNOUNCED 1 HOUR AFTER TIMER ENDS
        </p>
      </div>
    </div>
  );
}
