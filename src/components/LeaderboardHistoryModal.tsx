"use client";

import { useEffect, useState } from "react";
import { X } from "lucide-react";
import Image from "next/image";
import { HistoricalLeaderboard, LeaderboardData } from "@/types";

interface LeaderboardHistoryModalProps {
  isOpen: boolean;
  onClose: () => void;
  history: HistoricalLeaderboard | null;
}

const PRIZE_AMOUNTS: { [key: number]: number } = {
  1: 400,
  2: 150,
  3: 125,
  4: 50,
  5: 25,
};

export default function LeaderboardHistoryModal({
  isOpen,
  onClose,
  history,
}: LeaderboardHistoryModalProps) {
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

  const [topTen, setTopTen] = useState<LeaderboardData | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  // Get top 10 entries from historical leaderboard data
  useEffect(() => {
    const fetchHistoricalData = async () => {
      if (!history) return;
      
      // If we have leaderboard_data, use it
      if (history.leaderboard_data) {
        const data = history.leaderboard_data;
        const allEntries = [...(data.topThree || []), ...(data.challengers || [])]
          .sort((a, b) => a.rank - b.rank)
          .slice(0, 10);
        
        setTopTen({
          topThree: allEntries.slice(0, 3),
          challengers: allEntries.slice(3, 10),
          history: [],
        });
        return;
      }

      // If no leaderboard_data, try to fetch it using end_date from historical record
      // Check if we have end_date in the history object (might be in a different format)
      const historicalRecord = history as any;
      if (historicalRecord.end_date) {
        try {
          const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:3001";
          const response = await fetch(`${backendUrl}/api/leaderboard/historical?endDate=${historicalRecord.end_date}`);
          if (response.ok) {
            const fetchedData: LeaderboardData = await response.json();
            const allEntries = [...(fetchedData.topThree || []), ...(fetchedData.challengers || [])]
              .sort((a, b) => a.rank - b.rank)
              .slice(0, 10);
            
            setTopTen({
              topThree: allEntries.slice(0, 3),
              challengers: allEntries.slice(3, 10),
              history: [],
            });
            return;
          }
        } catch (error) {
          console.error("Failed to fetch historical leaderboard by date:", error);
        }
      }
      
      // If we can't fetch it, show empty state
      setTopTen(null);
    };

    if (isOpen && history) {
      setIsLoading(true);
      fetchHistoricalData().finally(() => setIsLoading(false));
    }
  }, [history, isOpen]);

  // Close on Escape key
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isOpen) {
        onClose();
      }
    };
    document.addEventListener("keydown", handleEscape);
    return () => document.removeEventListener("keydown", handleEscape);
  }, [isOpen, onClose]);

  // Prevent body scroll when modal is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isOpen]);

  if (!isOpen || !history) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fade-in"
      onClick={onClose}
    >
      <div
        className="bg-bethanz-dark border border-bethanz-gray rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto animate-scale-in"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="sticky top-0 bg-bethanz-dark border-b border-bethanz-gray p-4 sm:p-6 flex items-center justify-between z-10">
          <div>
            <h2 className="text-xl sm:text-2xl font-bold text-white uppercase tracking-wide">
              Previous Leaderboard
            </h2>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-bethanz-gray rounded-lg transition-colors"
            aria-label="Close modal"
          >
            <X className="w-5 h-5 sm:w-6 sm:h-6 text-gray-400 hover:text-white" />
          </button>
        </div>

        {/* Content */}
        <div className="p-4 sm:p-6">
          {isLoading ? (
            <div className="text-center py-12">
              <div className="w-12 h-12 border-4 border-bethanz-red border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
              <p className="text-gray-400">Loading previous leaderboard...</p>
            </div>
          ) : topTen && topTen.topThree.length + topTen.challengers.length > 0 ? (
            <>
              {/* Top 3 */}
              {topTen.topThree.length > 0 && (
                <div className="mb-6 sm:mb-8">
                  <h3 className="text-lg sm:text-xl font-bold text-white uppercase tracking-wide mb-4">
                    Top 3 Winners
                  </h3>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4">
                    {topTen.topThree.map((entry, index) => {
                      const colors = [
                        { border: "border-yellow-500/50", bg: "from-yellow-500 to-yellow-600", text: "text-black" },
                        { border: "border-cyan-400/50", bg: "from-cyan-500 to-blue-500", text: "text-white" },
                        { border: "border-amber-800/50", bg: "from-amber-800 to-amber-900", text: "text-white" },
                      ];
                      const color = colors[index] || colors[0];
                      
                      return (
                        <div
                          key={entry.userId}
                          className={`glass-card border ${color.border} rounded-lg p-3 sm:p-4 text-center`}
                        >
                          <div className="flex justify-center mb-3">
                            <div className="relative">
                              <Image
                                src={entry.avatarUrl || "https://cdn.diceblox.com/avatars/default.webp"}
                                alt={entry.username}
                                width={80}
                                height={80}
                                className="w-16 h-16 sm:w-20 sm:h-20 rounded-full border-2 object-cover"
                                unoptimized={entry.avatarUrl?.includes('rbxcdn.com')}
                                onError={(e) => {
                                  if (e.currentTarget.src !== "https://cdn.diceblox.com/avatars/default.webp") {
                                    e.currentTarget.src = "https://cdn.diceblox.com/avatars/default.webp";
                                  }
                                }}
                              />
                              <div className={`absolute -top-1 -right-1 bg-gradient-to-br ${color.bg} rounded-full w-6 h-6 sm:w-7 sm:h-7 flex items-center justify-center font-bold ${color.text} text-xs border-2`}>
                                {entry.rank}
                              </div>
                            </div>
                          </div>
                          <h4 className="text-sm sm:text-base font-bold text-white mb-2 truncate">
                            {entry.username}
                          </h4>
                          <p className="text-gray-400 text-xs mb-2">
                            WAGERED
                          </p>
                          <div className="text-white font-bold text-sm sm:text-base mb-3 flex items-center justify-center gap-1.5">
                            <Image src="/robux.svg" alt="Robux" width={14} height={20} className="w-4 h-4" />
                            {formatRobux(entry.wagered)}
                          </div>
                          <div className={`bg-gradient-to-r ${color.bg} ${color.text} font-bold py-2 px-3 sm:px-4 rounded text-sm sm:text-base flex items-center justify-center gap-1.5`}>
                            <Image src="/usd_green.svg" alt="USD" width={14} height={14} className="w-4 h-4" />
                            {formatUSD(PRIZE_AMOUNTS[entry.rank] || entry.prize)}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* Ranks 4-10 */}
              {topTen.challengers.length > 0 && (
                <div>
                  <h3 className="text-lg sm:text-xl font-bold text-white uppercase tracking-wide mb-4">
                    Ranks 4-10
                  </h3>
                  <div className="bg-bethanz-darker border border-bethanz-gray rounded-lg overflow-hidden">
                    <div className="overflow-x-auto">
                      <table className="w-full">
                        <thead className="bg-bethanz-gray/50 border-b border-bethanz-gray">
                          <tr>
                            <th className="hidden sm:table-cell px-4 sm:px-6 py-3 text-left text-xs font-semibold text-gray-400 uppercase tracking-wider">
                              #
                            </th>
                            <th className="px-4 sm:px-6 py-3 text-left text-xs font-semibold text-gray-400 uppercase tracking-wider">
                              USER
                            </th>
                            <th className="px-4 sm:px-6 py-3 text-right text-xs font-semibold text-gray-400 uppercase tracking-wider">
                              WAGERED
                            </th>
                            <th className="px-4 sm:px-6 py-3 text-right text-xs font-semibold text-gray-400 uppercase tracking-wider">
                              PRIZE
                            </th>
                          </tr>
                        </thead>
                        <tbody>
                          {topTen.challengers.map((entry) => (
                            <tr
                              key={entry.userId}
                              className="border-b border-bethanz-gray/30 hover:bg-bethanz-gray/20 transition-all"
                            >
                              <td className="hidden sm:table-cell px-4 sm:px-6 py-4 text-white font-semibold">
                                #{entry.rank}
                              </td>
                              <td className="px-4 sm:px-6 py-4">
                                <div className="flex items-center space-x-2 sm:space-x-3">
                                  <Image
                                    src={entry.avatarUrl || "https://cdn.diceblox.com/avatars/default.webp"}
                                    alt={entry.username}
                                    width={40}
                                    height={40}
                                    className="w-8 h-8 sm:w-10 sm:h-10 rounded-full border border-bethanz-dark object-cover"
                                    unoptimized={entry.avatarUrl?.includes('rbxcdn.com')}
                                    onError={(e) => {
                                      if (e.currentTarget.src !== "https://cdn.diceblox.com/avatars/default.webp") {
                                        e.currentTarget.src = "https://cdn.diceblox.com/avatars/default.webp";
                                      }
                                    }}
                                  />
                                  <span className="text-white font-medium text-sm sm:text-base truncate max-w-[120px] sm:max-w-none">
                                    {entry.username}
                                  </span>
                                </div>
                              </td>
                              <td className="px-4 sm:px-6 py-4 text-right text-white font-semibold text-sm sm:text-base">
                                <div className="flex items-center justify-end gap-1.5">
                                  <Image src="/robux.svg" alt="Robux" width={14} height={20} className="w-4 h-4" />
                                  {formatRobux(entry.wagered)}
                                </div>
                              </td>
                              <td className="px-4 sm:px-6 py-4 text-right">
                                <span className="text-white font-semibold text-sm sm:text-base flex items-center justify-end gap-1.5">
                                  <Image src="/usd_green.svg" alt="USD" width={14} height={14} className="w-4 h-4" />
                                  {formatUSD(PRIZE_AMOUNTS[entry.rank] || entry.prize)}
                                </span>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>
              )}
            </>
          ) : (
            <div className="text-center py-12">
              <p className="text-gray-400">No leaderboard data available for this period.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

