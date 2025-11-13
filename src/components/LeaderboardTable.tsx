"use client";

import { LeaderboardData } from "@/types";
import Image from "next/image";

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

  return (
    <div className="space-y-12 mt-8">
      {/* Leaderboard Table - Ranks 4-10 */}
      <div className="max-w-6xl mx-auto animate-fade-in-up" style={{ animationDelay: '0.4s', opacity: 0 }}>
        <div className="mb-4">
          {/* Spacer instead of LEADERBOARD text */}
          <div className="h-8"></div>
        </div>

        <div className="bg-bethanz-dark border border-bethanz-gray rounded-lg overflow-hidden">
          <table className="w-full">
            <thead className="bg-bethanz-gray/50 border-b border-bethanz-gray">
              <tr>
                <th className="hidden md:table-cell px-6 py-3 text-left text-xs font-semibold text-gray-400 uppercase tracking-wider">
                  #
                </th>
                <th className="px-4 md:px-6 py-3 text-left text-xs font-semibold text-gray-400 uppercase tracking-wider">
                  USER
                </th>
                <th className="px-4 md:px-6 py-3 text-right text-xs font-semibold text-gray-400 uppercase tracking-wider">
                  WAGERED
                </th>
                <th className="px-4 md:px-6 py-3 text-right text-xs font-semibold text-gray-400 uppercase tracking-wider">
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
                        <td className="hidden md:table-cell px-4 md:px-6 py-4 text-white font-semibold">
                          #{entry.rank}
                        </td>
                        <td className="px-4 md:px-6 py-4">
                          <div className="flex items-center space-x-2 md:space-x-3">
                            <Image
                              src={entry.avatarUrl || "https://cdn.diceblox.com/avatars/default.webp"}
                              alt={entry.username}
                              width={40}
                              height={40}
                              className="w-8 h-8 md:w-10 md:h-10 rounded-full border border-bethanz-dark object-cover"
                              unoptimized={entry.avatarUrl?.includes('rbxcdn.com')}
                              onError={(e) => {
                                if (e.currentTarget.src !== "https://cdn.diceblox.com/avatars/default.webp") {
                                  e.currentTarget.src = "https://cdn.diceblox.com/avatars/default.webp";
                                }
                              }}
                            />
                            <span className="text-white font-medium text-sm md:text-base truncate max-w-[120px] md:max-w-none">
                              {entry.username}
                            </span>
                          </div>
                        </td>
                        <td className="px-4 md:px-6 py-4 text-right text-white font-semibold text-sm md:text-base">
                          <div className="flex items-center justify-end gap-1.5">
                            <Image src="/robux.svg" alt="Robux" width={16} height={23} className="w-4 h-4" />
                            {formatRobux(entry.wagered)}
                          </div>
                        </td>
                        <td className="px-4 md:px-6 py-4 text-right">
                          <span className="text-white font-semibold text-sm md:text-base flex items-center justify-end gap-1.5">
                            <Image src="/usd_green.svg" alt="USD" width={16} height={16} className="w-4 h-4" />
                            {formatUSD(PRIZE_AMOUNTS[entry.rank] || entry.prize)}
                          </span>
                        </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={4} className="px-4 md:px-6 py-12 text-center text-gray-400">
                    No entries yet. Be the first to compete!
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Leaders History */}
      {data.history && data.history.length > 0 && (
        <div className="max-w-6xl mx-auto mt-16">
          <h2 className="text-2xl font-bold text-white uppercase tracking-wide mb-4">
            LEADERS HISTORY
          </h2>
          <p className="text-gray-400 text-sm mb-6 text-center max-w-3xl mx-auto">
            THIS IS A HISTORY OF LATEST LEADERBOARD TOP WINNERS. CLICK ON IT TO EXPLORE THE WHOLE LEADERBOARD & PRIZES.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {data.history.map((hist) => (
              <div
                key={hist.id}
                className="bg-bethanz-dark border border-bethanz-gray rounded-lg p-6 hover:border-bethanz-red transition-all cursor-pointer"
              >
                <div className="text-center mb-4">
                  <p className="text-gray-400 text-sm mb-1 font-semibold">{hist.period}</p>
                  <p className="text-gray-500 text-xs">{hist.date}</p>
                </div>
                <div className="flex justify-center mb-4">
                  <div className="w-16 h-16 rounded-full bg-gradient-to-br from-yellow-400 to-yellow-600 flex items-center justify-center border-2 border-yellow-500">
                    <span className="text-2xl">?</span>
                  </div>
                </div>
                <h3 className="text-lg font-bold text-white text-center mb-2 uppercase">
                  WINNER {hist.winner.username}
                </h3>
                <p className="text-gray-400 text-center text-xs mb-3">
                  TOTAL PRIZE POOL
                </p>
                <div className="bg-gradient-to-r from-bethanz-red to-red-700 text-white font-bold py-2 px-4 rounded text-center border border-red-600 flex items-center justify-center gap-1.5">
                  <Image src="/usd_green.svg" alt="USD" width={16} height={16} className="w-4 h-4" />
                  {formatUSD(hist.winner.prize)}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
