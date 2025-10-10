"use client";
import { useCallback, useEffect, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import {
  ArrowUpRight,
  ArrowDownRight,
  TrendingUp,
  RotateCw,
} from "lucide-react";
import { io } from "socket.io-client";
type MarketIndexData = {
  name: string;
  price: number;
  prevClose: number;
  change: number;
  percentChange: number;
};

const MarketSectors = () => {
  const [nifty50, setNifty50] = useState<MarketIndexData | null>(null);
  const [bankNifty, setBankNifty] = useState<MarketIndexData | null>(null);
  const [midcap100, setMidcap100] = useState<MarketIndexData | null>(null);
  const [nifty100, setNifty100] = useState<MarketIndexData | null>(null);
  const [niftyIT, setNiftyIT] = useState<MarketIndexData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [usingFallback, setUsingFallback] = useState(false);

  const socketRef = useRef<any>(null);
  const feedTimeoutRef = useRef<any>(null);
  const autoRetryRef = useRef<any>(null);

  const applyDummyData = useCallback(() => {
    setUsingFallback(true);
    setIsLoading(false);
    setNifty50({
      name: "Nifty 50",
      price: 23500.4,
      prevClose: 23420.1,
      change: 80.3,
      percentChange: 0.34,
    });
    setBankNifty({
      name: "Bank Nifty",
      price: 50012.7,
      prevClose: 49890.2,
      change: 122.5,
      percentChange: 0.25,
    });
    setMidcap100({
      name: "Nifty Midcap 100",
      price: 52012.1,
      prevClose: 51950.0,
      change: 62.1,
      percentChange: 0.12,
    });
    setNifty100({
      name: "Nifty 100",
      price: 24750.6,
      prevClose: 24700.0,
      change: 50.6,
      percentChange: 0.2,
    });
    setNiftyIT({
      name: "Nifty IT",
      price: 36000.9,
      prevClose: 36250.0,
      change: -249.1,
      percentChange: -0.69,
    });
  }, []);

  const clearDataStates = () => {
    setNifty50(null);
    setBankNifty(null);
    setMidcap100(null);
    setNifty100(null);
    setNiftyIT(null);
  };

  const attemptConnect = useCallback(() => {
    setUsingFallback(false);
    if (socketRef.current) {
      try {
        socketRef.current.disconnect();
      } catch (_) {}
    }
    const server = io(process.env.NEXT_PUBLIC_BACKEND_URL as string, {
      transports: ["websocket", "polling"],
      reconnection: true,
    });
    socketRef.current = server;

    if (feedTimeoutRef.current) clearTimeout(feedTimeoutRef.current);
    feedTimeoutRef.current = setTimeout(() => {
      // No data arrived in time, show fallback
      if (!nifty50 && !bankNifty && !midcap100 && !nifty100 && !niftyIT) {
        applyDummyData();
      }
    }, 5000);

    server.on("connect", () => {
      console.log("Connected to backend");
    });

    server.on("disconnect", () => {
      console.log("Disconnected from backend");
    });

    server.on("marketData", (msg: any) => {
      if (msg?.type === "live_feed" && msg?.feeds) {
        if (feedTimeoutRef.current) clearTimeout(feedTimeoutRef.current);
        setIsLoading(false);
        setUsingFallback(false);
        const processFeed = (key: string, name: string, setter: any) => {
          const data = msg.feeds[key];
          if (data?.fullFeed?.indexFF?.ltpc) {
            const feed = data.fullFeed.indexFF;
            const price = feed.ltpc.ltp;
            const prevClose = feed.ltpc.cp;
            const change = price - prevClose;
            const percentChange = ((price - prevClose) / prevClose) * 100;
            setter({
              name,
              price,
              prevClose,
              change: Math.round(change * 100) / 100,
              percentChange: Math.round(percentChange * 100) / 100,
            });
          }
        };

        processFeed("NSE_INDEX|Nifty 50", "Nifty 50", setNifty50);
        processFeed("NSE_INDEX|Nifty Bank", "Bank Nifty", setBankNifty);
        processFeed(
          "NSE_INDEX|NIFTY MIDCAP 100",
          "Nifty Midcap 100",
          setMidcap100,
        );
        processFeed("NSE_INDEX|Nifty 100", "Nifty 100", setNifty100);
        processFeed("NSE_INDEX|Nifty IT", "Nifty IT", setNiftyIT);
      }
    });
  }, [applyDummyData, bankNifty, midcap100, nifty100, nifty50, niftyIT]);

  useEffect(() => {
    attemptConnect();

    // Auto retry every 10 minutes
    autoRetryRef.current = setInterval(
      () => {
        setIsLoading(true);
        clearDataStates();
        attemptConnect();
      },
      10 * 60 * 1000,
    );

    return () => {
      console.log("Cleaning up socket connection");
      if (feedTimeoutRef.current) clearTimeout(feedTimeoutRef.current);
      if (autoRetryRef.current) clearInterval(autoRetryRef.current);
      try {
        socketRef.current?.disconnect();
      } catch (_) {}
    };
  }, [attemptConnect]);

  const handleRefresh = () => {
    setIsLoading(true);
    setUsingFallback(false);
    clearDataStates();
    attemptConnect();
  };

  const marketData = [nifty50, bankNifty, midcap100, nifty100, niftyIT].filter(
    Boolean,
  );

  return (
    <main className="bg-gray-50 py-8">
      <div className="mx-auto max-w-7xl px-4">
        <div className="mb-6 flex items-center justify-between">
          <div className="flex items-center">
            <TrendingUp className="mr-2 text-blue-600" size={24} />
            <h2 className="text-2xl font-bold text-gray-800">
              Market & Sectors
            </h2>
          </div>
          <div className="flex items-center gap-2">
            {usingFallback && (
              <span className="text-xs text-gray-500">
                Showing fallback data
              </span>
            )}
            <Button variant="outline" size="sm" onClick={handleRefresh}>
              <RotateCw className="mr-2 h-4 w-4" /> Refresh
            </Button>
          </div>
        </div>

        {isLoading ? (
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
            {[1, 2, 3, 4, 5].map((item) => (
              <MarketCardSkeleton key={item} />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
            {marketData.map((data, index) => (
              <MarketCard key={index} data={data} />
            ))}
          </div>
        )}
      </div>
    </main>
  );
};

const MarketCard = ({ data }: { data: any }) => {
  const isPositive = data.change >= 0;

  return (
    <div className="rounded-xl border border-gray-100 bg-white p-6 shadow-sm transition-shadow duration-200 hover:shadow-md">
      <div className="mb-4 flex items-center justify-between">
        <h3 className="text-lg font-bold text-gray-800">{data.name}</h3>
        <div
          className={`rounded-full px-3 py-1 text-sm font-medium ${
            isPositive ? "bg-green-50 text-green-700" : "bg-red-50 text-red-700"
          }`}
        >
          {isPositive ? "+" : ""}
          {data.percentChange}%
        </div>
      </div>

      <div className="mb-3 flex items-end gap-3">
        <div className="text-2xl font-bold text-gray-900">
          ₹{data.price.toLocaleString(undefined, { maximumFractionDigits: 1 })}
        </div>
        <div
          className={`flex items-center text-sm ${
            isPositive ? "text-green-600" : "text-red-600"
          }`}
        >
          {isPositive ? (
            <ArrowUpRight size={16} className="mr-1" />
          ) : (
            <ArrowDownRight size={16} className="mr-1" />
          )}
          {Math.abs(data.change).toLocaleString(undefined, {
            maximumFractionDigits: 2,
          })}
        </div>
      </div>
      <div className="mt-4 border-t border-gray-100 pt-4">
        <div className="flex justify-between text-sm text-gray-500">
          <span>Previous Close</span>
          <span className="font-medium text-gray-700">
            ₹
            {data.prevClose.toLocaleString(undefined, {
              maximumFractionDigits: 2,
            })}
          </span>
        </div>
      </div>
    </div>
  );
};

const MarketCardSkeleton = () => (
  <div className="rounded-xl border border-gray-100 bg-white p-6 shadow-sm">
    <div className="mb-4 flex items-center justify-between">
      <div className="h-6 w-28 animate-pulse rounded bg-gray-200"></div>
      <div className="h-6 w-16 animate-pulse rounded-full bg-gray-200"></div>
    </div>

    <div className="mb-3 flex items-end gap-3">
      <div className="h-8 w-32 animate-pulse rounded bg-gray-200"></div>
      <div className="h-5 w-16 animate-pulse rounded bg-gray-200"></div>
    </div>

    <div className="mt-4 border-t border-gray-100 pt-4">
      <div className="flex justify-between">
        <div className="h-4 w-24 animate-pulse rounded bg-gray-200"></div>
        <div className="h-4 w-20 animate-pulse rounded bg-gray-200"></div>
      </div>
    </div>
  </div>
);

export default MarketSectors;
