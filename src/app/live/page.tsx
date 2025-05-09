"use client";
import Chatbot from "@/components/Chatbot";
import { useEffect, useState } from "react";
import { io } from "socket.io-client";

export default function LiveFeed() {
  const [nifty50, setNifty50] = useState(null);
  const [bankNifty, setBankNifty] = useState(null);
  const [midcap100, setMidcap100] = useState(null);
  const [nifty100, setNifty100] = useState(null);
  const [niftyIT, setNiftyIT] = useState(null);
  const [connected, setConnected] = useState(false);

  useEffect(() => {
    const socket = io(`${process.env.NEXT_PUBLIC_BACKEND_URL}`);

    socket.on("connect", () => {
      console.log("✅ Connected to backend");
      setConnected(true);
    });

    socket.on("disconnect", () => {
      console.log("❌ Disconnected from backend");
      setConnected(false);
    });

    socket.on("marketData", (msg) => {
      console.log("msg", msg);
      if (msg.type === "live_feed" && msg.feeds) {
        const processFeed = (key: string, name: string, setter: Function) => {
          const data = msg.feeds[key];
          console.log("data", key, data);
          if (data) {
            const feed = data.fullFeed.indexFF;
            const price = feed.ltpc.ltp;
            const prevClose = feed.ltpc.cp;
            const ohlc = feed.marketOHLC.ohlc.find(
              (o: any) => o.interval === "1d"
            );

            setter({
              name,
              price,
              prevClose,
              change: price - prevClose,
              percentChange: ((price - prevClose) / prevClose) * 100,
              ...ohlc,
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
      socket.disconnect();
    };
  }, []);

  const renderCard = (data: any) => {
    if (!data) {
      return (
        <div className="bg-white rounded-lg shadow-md p-6 w-80 h-64 flex items-center justify-center">
          <div className="text-center">
            <div className="w-12 h-12 border-4 border-gray-200 border-t-blue-500 rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-gray-500">Waiting for data...</p>
          </div>
        </div>
      );
    }

    const isPositive = data.change >= 0;
    const changeColor = isPositive ? "text-green-600" : "text-red-600";
    const changeBg = isPositive ? "bg-green-50" : "bg-red-50";
    const changeIcon = isPositive ? "↑" : "↓";

    return (
      <div className="bg-white rounded-lg shadow-md overflow-hidden w-80">
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
          <h3 className="text-lg font-semibold text-gray-800">{data.name}</h3>
          <div className="flex items-center">
            <span className="h-2 w-2 bg-green-500 rounded-full mr-1"></span>
            <span className="text-xs text-green-600 font-medium">Live</span>
          </div>
        </div>

        <div className="px-6 py-4">
          <div className="flex items-baseline mb-1">
            <div className="text-3xl font-bold">
              ₹
              {data.price.toLocaleString(undefined, {
                maximumFractionDigits: 1,
              })}
            </div>
            <div className={`ml-2 ${changeColor} text-sm font-medium`}>
              {changeIcon} {Math.abs(data.change).toFixed(1)}
            </div>
          </div>

          <div
            className={`inline-block px-2 py-1 rounded-md ${changeBg} ${changeColor} text-sm font-medium mb-4`}>
            {data.percentChange.toFixed(2)}%
          </div>

          <div className="grid grid-cols-2 gap-x-6 gap-y-2 mt-2 text-sm">
            <div className="flex justify-between">
              <span className="text-gray-500">Open</span>
              <span className="font-medium">
                ₹
                {data.open.toLocaleString(undefined, {
                  maximumFractionDigits: 1,
                })}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-500">Close</span>
              <span className="font-medium">
                ₹
                {data.close.toLocaleString(undefined, {
                  maximumFractionDigits: 1,
                })}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-500">High</span>
              <span className="font-medium text-green-600">
                ₹
                {data.high.toLocaleString(undefined, {
                  maximumFractionDigits: 1,
                })}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-500">Low</span>
              <span className="font-medium text-red-600">
                ₹
                {data.low.toLocaleString(undefined, {
                  maximumFractionDigits: 1,
                })}
              </span>
            </div>
          </div>
        </div>

        <div className="bg-gray-50 px-6 py-2 text-xs text-gray-500">
          Last updated: {new Date().toLocaleTimeString()}
        </div>
      </div>
    );
  };

  return (
    <div className="bg-blue-50 min-h-screen p-6 font-sans">
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-2xl font-bold text-gray-800">
            📊 Live Indices Feed
          </h2>
          {connected && (
            <div className="bg-green-100 text-green-700 px-3 py-1 rounded-full text-sm flex items-center">
              <span className="h-2 w-2 bg-green-500 rounded-full mr-2 animate-pulse"></span>
              Connected
            </div>
          )}
        </div>

        <div className="flex flex-wrap justify-center gap-8 bg-blue-50">
          {renderCard(nifty50)}
          {renderCard(bankNifty)}
          {renderCard(midcap100)}
          {renderCard(nifty100)}
          {renderCard(niftyIT)}
        </div>

        <div className="text-center mt-8 text-sm text-gray-500">
          Note: Using simulated data updates for demonstration
        </div>
      </div>
      <div>
        <Chatbot />
      </div>
    </div>
  );
}
