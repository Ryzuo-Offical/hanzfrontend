"use client";

import { useEffect, useState } from "react";
import { io, Socket } from "socket.io-client";
import { LeaderboardData, CountdownData } from "@/types";

export function useWebSocket() {
  const [socket, setSocket] = useState<Socket | null>(null);
  const [isConnected, setIsConnected] = useState(false);
  const [leaderboardData, setLeaderboardData] = useState<LeaderboardData>({
    topThree: [],
    challengers: [],
    history: [],
  });
  const [countdown, setCountdown] = useState<CountdownData>({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
    endDate: new Date(),
  });

  useEffect(() => {
    const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:3001";
    const socketInstance = io(backendUrl, {
      transports: ["websocket", "polling"],
    });

    socketInstance.on("connect", () => {
      console.log("Connected to WebSocket");
      setIsConnected(true);
    });

    socketInstance.on("disconnect", () => {
      console.log("Disconnected from WebSocket");
      setIsConnected(false);
    });

    socketInstance.on("leaderboard_update", (data: LeaderboardData) => {
      setLeaderboardData(data);
    });

    socketInstance.on("countdown_update", (data: CountdownData) => {
      setCountdown(data);
    });

    setSocket(socketInstance);

    return () => {
      socketInstance.disconnect();
    };
  }, []);

  return { socket, isConnected, leaderboardData, countdown };
}

