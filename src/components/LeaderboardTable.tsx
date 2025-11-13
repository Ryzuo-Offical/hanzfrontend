"use client";

import { useState } from "react";
import { LeaderboardData } from "@/types";
import Image from "next/image";
import LeaderboardHistoryModal from "./LeaderboardHistoryModal";

interface LeaderboardTableProps {
  data: LeaderboardData;
}

// Prize amounts based on rank
const PRIZE_AMOUNTS: { [key: number]: number } = {
  1: 400,
  2: 150,
  3: 125,
  4: 50,
  5: 25,
};

export default function LeaderboardTable({ data }: LeaderboardTableProps) {
  const [selectedHistory, setSelectedHistory] = useState<typeof data.history[0] | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

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

  // Get all entries and ensure we have top 10
  const allEntries = [...(data.topThree || []), ...(data.challengers || [])].sort((a, b) => a.rank - b.rank);
  const remainingEntries = allEntries.slice(3, 10); // Ranks 4-10 (should be 7 entries)

  const handleViewHistory = (history: typeof data.history[0]) => {
    setSelectedHistory(history);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedHistory(null);
  };

  return (
    <div className="space-y-8 sm:space-y-12 mt-6 sm:mt-8">
      {/* Leaderboard Table - Ranks 4-10 */}
      <div className="max-w-6xl mx-auto animate-fade-in-up px-2 sm:px-4" style={{ animationDelay: '0.4s', opacity: 0 }}>
        <div className="mb-3 sm:mb-4">
          {/* Spacer instead of LEADERBOARD text */}
          <div className="h-6 sm:h-8"></div>
        </div>

        <div className="bg-bethanz-dark border border-bethanz-gray rounded-lg overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full min-w-[500px]">
            <thead className="bg-bethanz-gray/50 border-b border-bethanz-gray">
              <tr>
                  <th className="hidden sm:table-cell px-4 sm:px-6 py-2 sm:py-3 text-left text-xs font-semibold text-gray-400 uppercase tracking-wider">
                  #
                </th>
                  <th className="px-3 sm:px-4 md:px-6 py-2 sm:py-3 text-left text-xs font-semibold text-gray-400 uppercase tracking-wider">
                  USER
                </th>
                  <th className="px-3 sm:px-4 md:px-6 py-2 sm:py-3 text-right text-xs font-semibold text-gray-400 uppercase tracking-wider">
                  WAGERED
                </th>
                  <th className="px-3 sm:px-4 md:px-6 py-2 sm:py-3 text-right text-xs font-semibold text-gray-400 uppercase tracking-wider">
                  PRIZE
                </th>
              </tr>
            </thead>
            <tbody>
              {remainingEntries.length > 0 ? (
                remainingEntries.map((entry, index) => (
                  <tr
                    key={entry.userId}
                    className="border-b border-bethanz-gray/30 hover:bg-bethanz-gray/20 transition-all animate-fade-in-up"
                    style={{ animationDelay: `${0.5 + index * 0.1}s`, opacity: 0 }}
                  >
                      <td className="hidden sm:table-cell px-4 sm:px-6 py-3 sm:py-4 text-white font-semibold text-sm sm:text-base">
                          #{entry.rank}
                        </td>
                      <td className="px-3 sm:px-4 md:px-6 py-3 sm:py-4">
                        <div className="flex items-center space-x-2 sm:space-x-3">
                            <Image
                              src={entry.avatarUrl || "https://cdn.diceblox.com/avatars/default.webp"}
                              alt={entry.username}
                              width={40}
                              height={40}
                            className="w-7 h-7 sm:w-8 sm:h-8 md:w-10 md:h-10 rounded-full border border-bethanz-dark object-cover flex-shrink-0"
                              unoptimized={entry.avatarUrl?.includes('rbxcdn.com')}
                              onError={(e) => {
                                if (e.currentTarget.src !== "https://cdn.diceblox.com/avatars/default.webp") {
                                  e.currentTarget.src = "https://cdn.diceblox.com/avatars/default.webp";
                                }
                              }}
                            />
                          <span className="text-white font-medium text-xs sm:text-sm md:text-base truncate max-w-[100px] sm:max-w-[150px] md:max-w-none">
                              {entry.username}
                            </span>
                          </div>
                        </td>
                      <td className="px-3 sm:px-4 md:px-6 py-3 sm:py-4 text-right text-white font-semibold text-xs sm:text-sm md:text-base">
                        <div className="flex items-center justify-end gap-1 sm:gap-1.5">
                          <Image src="/robux.svg" alt="Robux" width={14} height={20} className="w-3 h-3 sm:w-4 sm:h-4 flex-shrink-0" />
                          <span className="whitespace-nowrap">{formatRobux(entry.wagered)}</span>
                          </div>
                        </td>
                      <td className="px-3 sm:px-4 md:px-6 py-3 sm:py-4 text-right">
                        <span className="text-white font-semibold text-xs sm:text-sm md:text-base flex items-center justify-end gap-1 sm:gap-1.5">
                          <Image src="/usd_green.svg" alt="USD" width={14} height={14} className="w-3 h-3 sm:w-4 sm:h-4 flex-shrink-0" />
                          <span className="whitespace-nowrap">{formatUSD(PRIZE_AMOUNTS[entry.rank] || entry.prize)}</span>
                          </span>
                        </td>
                  </tr>
                ))
              ) : (
                <tr>
                    <td colSpan={4} className="px-4 sm:px-6 py-8 sm:py-12 text-center text-gray-400 text-sm sm:text-base">
                    No entries yet. Be the first to compete!
                  </td>
                </tr>
              )}
            </tbody>
          </table>
          </div>
        </div>
      </div>

      {/* Leaders History - Only show most recent previous leaderboard */}
      {data.history && data.history.length > 0 && (
        <div className="max-w-6xl mx-auto mt-12 sm:mt-16">
          <h2 className="text-xl sm:text-2xl font-bold text-white uppercase tracking-wide mb-3 sm:mb-4 px-2 sm:px-0">
            LEADERS HISTORY
          </h2>
          <p className="text-gray-400 text-xs sm:text-sm mb-4 sm:mb-6 text-center max-w-3xl mx-auto px-2 sm:px-0">
            VIEW PREVIOUS LEADERBOARD WINNERS AND TOP 10 RANKINGS
          </p>

          <div className="flex justify-center items-center px-2 sm:px-0">
            {data.history[0] && (
              <button
                onClick={() => handleViewHistory(data.history[0])}
                className="w-full sm:w-auto bg-bethanz-dark border border-bethanz-gray rounded-lg p-4 sm:p-6 hover:border-bethanz-red transition-all cursor-pointer text-center max-w-[400px] sm:max-w-none"
              >
                <div className="text-center mb-3 sm:mb-4">
                  <p className="text-gray-400 text-sm sm:text-base mb-1 font-semibold">{data.history[0].period}</p>
                  <p className="text-gray-500 text-xs sm:text-sm">{data.history[0].date}</p>
                </div>
                <div className="flex justify-center mb-3 sm:mb-4">
                  <div className="w-12 h-12 sm:w-16 sm:h-16 rounded-full bg-gradient-to-br from-yellow-400 to-yellow-600 flex items-center justify-center border-2 border-yellow-500">
                    <span className="text-xl sm:text-2xl">🏆</span>
                  </div>
                </div>
                <h3 className="text-base sm:text-lg font-bold text-white text-center mb-2 uppercase">
                  WINNER {data.history[0].winner.username}
                </h3>
                <p className="text-gray-400 text-center text-xs mb-2 sm:mb-3">
                  TOTAL PRIZE
                </p>
                <div className="bg-gradient-to-r from-bethanz-red to-red-700 text-white font-bold py-2 px-3 sm:px-4 rounded text-center border border-red-600 flex items-center justify-center gap-1.5 text-sm sm:text-base">
                  <Image src="/usd_green.svg" alt="USD" width={14} height={14} className="w-4 h-4" />
                  {formatUSD(data.history[0].winner.prize)}
                </div>
                <div className="mt-3 sm:mt-4 pt-3 sm:pt-4 border-t border-bethanz-gray/30">
                  <p className="text-bethanz-red text-xs sm:text-sm font-semibold text-center uppercase">
                    View Previous Leaderboard →
                  </p>
                </div>
              </button>
            )}
          </div>
        </div>
      )}

      {/* History Modal */}
      <LeaderboardHistoryModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        history={selectedHistory}
      />
    </div>
  );
}
