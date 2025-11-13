"use client";

import { useEffect, useState, useRef } from "react";
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
  const hasFetchedInitialData = useRef(false);
  const countdownIntervalRef = useRef<NodeJS.Timeout | null>(null);

  // Fallback: Fetch leaderboard via HTTP if WebSocket fails
  const fetchLeaderboardFallback = async () => {
    try {
      const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:3001";
      const response = await fetch(`${backendUrl}/api/leaderboard`);
      if (response.ok) {
        const data = await response.json();
        setLeaderboardData(data);
        return true;
      }
    } catch (error) {
      console.error("Failed to fetch leaderboard via HTTP:", error);
    }
    return false;
  };

  // Client-side countdown calculation as fallback
  const calculateCountdown = (endDate: Date): CountdownData => {
    const now = new Date();
    const diff = endDate.getTime() - now.getTime();

    if (diff <= 0) {
      return {
        days: 0,
        hours: 0,
        minutes: 0,
        seconds: 0,
        endDate: endDate,
      };
    }

    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((diff % (1000 * 60)) / 1000);

    return {
      days,
      hours,
      minutes,
      seconds,
      endDate: endDate,
    };
  };

  // Update countdown every second if we have an endDate
  useEffect(() => {
    const endDate = countdown.endDate instanceof Date 
      ? countdown.endDate 
      : (typeof countdown.endDate === 'string' ? new Date(countdown.endDate) : null);
    
    if (endDate && !isNaN(endDate.getTime())) {
      // Clear existing interval
      if (countdownIntervalRef.current) {
        clearInterval(countdownIntervalRef.current);
      }

      // Update immediately
      const updated = calculateCountdown(endDate);
      setCountdown(prev => ({ ...prev, ...updated, endDate }));

      // Set up interval to update every second
      countdownIntervalRef.current = setInterval(() => {
        const updated = calculateCountdown(endDate);
        setCountdown(prev => ({ ...prev, ...updated, endDate }));
      }, 1000);
    }

    return () => {
      if (countdownIntervalRef.current) {
        clearInterval(countdownIntervalRef.current);
      }
    };
  }, [countdown.endDate]);

  useEffect(() => {
    const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:3001";
    
    // Fetch initial leaderboard data via HTTP first (more reliable)
    if (!hasFetchedInitialData.current) {
      hasFetchedInitialData.current = true;
      fetchLeaderboardFallback();
    }

    const socketInstance = io(backendUrl, {
      transports: ["websocket", "polling"],
      reconnection: true,
      reconnectionDelay: 1000,
      reconnectionAttempts: 5,
    });

    socketInstance.on("connect", () => {
      console.log("Connected to WebSocket");
      setIsConnected(true);
      // Request immediate update on connect
      socketInstance.emit("request_update");
    });

    socketInstance.on("disconnect", () => {
      console.log("Disconnected from WebSocket");
      setIsConnected(false);
      // Try HTTP fallback for leaderboard when disconnected
      fetchLeaderboardFallback();
    });

    socketInstance.on("connect_error", (error) => {
      console.error("WebSocket connection error:", error);
      // Try HTTP fallback on connection error
      if (!hasFetchedInitialData.current) {
        fetchLeaderboardFallback();
      }
    });

    socketInstance.on("leaderboard_update", (data: LeaderboardData) => {
      setLeaderboardData(data);
    });

    socketInstance.on("countdown_update", (data: CountdownData) => {
      // Ensure endDate is a Date object
      if (data.endDate && typeof data.endDate === 'string') {
        data.endDate = new Date(data.endDate);
      }
      setCountdown(data);
    });

    setSocket(socketInstance);

    return () => {
      socketInstance.disconnect();
      if (countdownIntervalRef.current) {
        clearInterval(countdownIntervalRef.current);
      }
    };
  }, []);

  return { socket, isConnected, leaderboardData, countdown };
}

