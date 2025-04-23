"use client";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { ArrowUpRight, ArrowDownRight, TrendingUp } from "lucide-react";
import { io } from "socket.io-client";
const MarketSectors = () => {
  const [nifty50, setNifty50] = useState(null);
  const [bankNifty, setBankNifty] = useState(null);
  const [midcap100, setMidcap100] = useState(null);
  const [nifty100, setNifty100] = useState(null);
  const [niftyIT, setNiftyIT] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const server = io(process.env.NEXT_PUBLIC_BACKEND_URL);

    server.on("connect", () => {
      console.log("Connected to backend");
    });

    server.on("disconnect", () => {
      console.log("Disconnected from backend");
    });

    server.on("marketData", (msg) => {
      if (msg.type === "live_feed" && msg.feeds) {
        setIsLoading(false);
        const processFeed = (key: string, name: string, setter: any) => {
          const data = msg.feeds[key];
          if (data) {
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
          setMidcap100
        );
        processFeed("NSE_INDEX|Nifty 100", "Nifty 100", setNifty100);
        processFeed("NSE_INDEX|Nifty IT", "Nifty IT", setNiftyIT);
      }
    });

    return () => {
      server.disconnect();
    };
  }, []);

  const marketData = [nifty50, bankNifty, midcap100, nifty100, niftyIT].filter(
    Boolean
  );

  return (
    <main className="bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex justify-between items-center mb-6">
          <div className="flex items-center">
            <TrendingUp className="mr-2 text-blue-600" size={24} />
            <h2 className="text-2xl font-bold text-gray-800">
              Market & Sectors
            </h2>
          </div>
        </div>

        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3, 4, 5].map((item) => (
              <MarketCardSkeleton key={item} />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
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
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 hover:shadow-md transition-shadow duration-200">
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-bold text-lg text-gray-800">{data.name}</h3>
        <div
          className={`px-3 py-1 rounded-full text-sm font-medium ${
            isPositive ? "bg-green-50 text-green-700" : "bg-red-50 text-red-700"
          }`}>
          {isPositive ? "+" : ""}
          {data.percentChange}%
        </div>
      </div>

      <div className="flex items-end gap-3 mb-3">
        <div className="text-2xl font-bold text-gray-900">
          ₹{data.price.toLocaleString(undefined, { maximumFractionDigits: 1 })}
        </div>
        <div
          className={`flex items-center text-sm ${
            isPositive ? "text-green-600" : "text-red-600"
          }`}>
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

      <div className="mt-4 pt-4 border-t border-gray-100">
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
  <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
    <div className="flex items-center justify-between mb-4">
      <div className="h-6 w-28 bg-gray-200 rounded animate-pulse"></div>
      <div className="h-6 w-16 bg-gray-200 rounded-full animate-pulse"></div>
    </div>

    <div className="flex items-end gap-3 mb-3">
      <div className="h-8 w-32 bg-gray-200 rounded animate-pulse"></div>
      <div className="h-5 w-16 bg-gray-200 rounded animate-pulse"></div>
    </div>

    <div className="mt-4 pt-4 border-t border-gray-100">
      <div className="flex justify-between">
        <div className="h-4 w-24 bg-gray-200 rounded animate-pulse"></div>
        <div className="h-4 w-20 bg-gray-200 rounded animate-pulse"></div>
      </div>
    </div>
  </div>
);

export default MarketSectors;
