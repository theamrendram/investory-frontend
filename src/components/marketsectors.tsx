"use client";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import { io } from "socket.io-client";
const MarketSectors = () => {
  const [nifty50, setNifty50] = useState(null);
  const [bankNifty, setBankNifty] = useState(null);
  const [midcap100, setMidcap100] = useState(null);
  const [nifty100, setNifty100] = useState(null);
  const [niftyIT, setNiftyIT] = useState(null);

  useEffect(() => {
    const server = io(process.env.NEXT_PUBLIC_BACKEND_URL);
    server.on("connect", () => {
      console.log("Connected to backend");
    });

    server.on("disconnect", () => {
      console.log("Disconnected from backend");
    });

    server.on("marketData", (msg) => {
      // console.log("msg", msg);
      if (msg.type === "live_feed" && msg.feeds) {
        const processFeed = (key: string, name: string, setter: Function) => {
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
              change: Math.round(change),
              percentChange: Math.round(percentChange),
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
  }, []);

  return (
    <main className="flex-grow bg-white">
      <div className="max-w-7xl mx-auto px-4 py-6">
        {/* Market and sectors */}
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-semibold">Market and sectors</h2>
          {/* <Button variant="link" className="text-blue-500">
            View All
          </Button> */}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          {/* <div className="flex justify-between items-center border-b pb-4">
            <div>
              <h3 className="font-semibold">NIFTY 50</h3>
              <div className="flex items-center mt-2">
                <Image
                  src="/placeholder.svg?height=40&width=120"
                  width={120}
                  height={40}
                  alt="Chart"
                  className="mr-4"
                />
                <div>
                  <div className="text-lg font-semibold">{nifty50}</div>
                  <div className="text-red-500 flex items-center">▼ 0.41%</div>
                </div>
              </div>
            </div>
          </div> */}
          {renderCard(nifty50)}
          {renderCard(bankNifty)}
        </div>
      </div>
    </main>
  );
};

export default MarketSectors;

const renderCard = (data: any) => {
  console.log("data", data);
  if (!data) {
    return (
      <div>
        <div className="bg-white rounded-lg shadow-md p-6 w-80 h-64 flex items-center justify-center">
          <div className="text-center">
            <div className="w-12 h-12 border-4 border-gray-200 border-t-blue-500 rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-gray-500">Waiting for data...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex justify-between items-center border-b pb-4">
      <div>
        <h3 className="font-semibold">{data.name}</h3>
        <div className="flex items-center mt-2">
          <Image
            src="/placeholder.svg?height=40&width=120"
            width={120}
            height={40}
            alt="Chart"
            className="mr-4"
          />
          <div>
            <div className="text-lg font-semibold">
              ₹
              {data.price.toLocaleString(undefined, {
                maximumFractionDigits: 1,
              })}
            </div>
            <div className="text-lg font-semibold">
              {data.change.toLocaleString(undefined, {
                maximumFractionDigits: 2,
              })}
            </div>
            <div
              className={`${
                data.change < 0 ? "text-red-500" : "text-green-500"
              } flex items-center`}>
              {data.percentChange.toLocaleString(undefined, {
                maximumFractionDigits: 2,
              })}
              %
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
