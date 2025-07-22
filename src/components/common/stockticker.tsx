"use client";
import { useState, useEffect, useRef, use } from "react";
import { ArrowUp, ArrowDown } from "lucide-react";
import { io } from "socket.io-client";

// const stocks: StockData[] = [
//   { 
//     symbol: "NIFTYBANK",
//     price: 46216.8,
//     change: -0.58,
//     changePercent: -0.58,
//   },
//   {
//     symbol: "BAJFINANCE",
//     price: 8342.6,
//     change: -0.74,
//     changePercent: -0.74,
//   },
//   { symbol: "BHARTIARTL", price: 1630.95, change: 0.02, changePercent: 0.02 },
//   { symbol: "HDFCBANK", price: 1687.5, change: -0.1, changePercent: -0.1 },
//   { symbol: "HINDUNILVR", price: 2247.75, change: 1.96, changePercent: 1.96 },
//   { symbol: "INFY", price: 1701.45, change: 0.92, changePercent: 0.92 },
//   { symbol: "RELIANCE", price: 2890.75, change: -0.59, changePercent: -0.59 },
//   { symbol: "TCS", price: 3644.4, change: -0.47, changePercent: -0.47 },
// ];

export interface StockData {
  symbol: string;
  name?: string;
  price: number;
  change: number;
  changePercent: number;
}
interface StockTickerProps {
  speed?: number;
  pauseonhover?: boolean;
}





export default function StockTicker({
  speed = 1,
  pauseonhover = true,
}: StockTickerProps) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [stockList, setStockList] = useState<StockData[]>([]);

  const [duplicatedStocks, setduplicateStocks] = useState<StockData[]>([]);
  const socketRef = useRef<any>(null);

  useEffect(() => {
    if (socketRef.current) {
      console.warn("Socket already exists! Preventing duplicate connection.");
      return;
    }
    const server = io(process.env.NEXT_PUBLIC_BACKEND_URL);
    socketRef.current = server;
    server.on("connect", () => {
      console.log("Connected to backend");
    });
    server.on("disconnect", () => {
      console.log("Disconnected from backend");
    });
    server.on("marketData", (msg) => {
      if (msg.type === "live_feed" && msg.feeds) {
        const stocksArray: StockData[] = [];
        Object.keys(msg.feeds).forEach((key) => {
          const symbol = key.split("|")[1];
          const data = msg.feeds[key];
          if (data) {
            const feed = data.fullFeed.indexFF;
            const price = feed.ltpc.ltp;
            const prevClose = feed.ltpc.cp;
            const change = price - prevClose;
            const changePercent = (change / prevClose) * 100;
            stocksArray.push({
              symbol,
              price,
              change,
              changePercent,
            });
          }
        });
        setStockList(stocksArray);
      }
    });
    return () => {
      if (socketRef.current) {
        socketRef.current.disconnect();
        socketRef.current = null;
      }
    };
  }, []);
  
  useEffect(() => {
    if (stockList.length > 0) {
      setduplicateStocks([...stockList, ...stockList]);
    }
  }, [stockList]);

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("en-IN", {
      maximumFractionDigits: 2,
      minimumFractionDigits: 2,
    }).format(price);
  };
  const formatChangepercent = (changePercent: number) => {
    return Math.abs(changePercent).toFixed(2) + "%";
  };
  return (
    <div
      className={`overflow-hidden bg-black text-white min-h-[40px]`}
    >
      <div
        className={
          `whitespace-nowwrap inline-flex items-center ${pauseonhover ? "hover:animate-none" : ""}`
        }
        style={{
          animation:
            `ticker 10000ms linear infinite`,
        }}
        ref={scrollRef}
      >
        {duplicatedStocks.map((stock, index) => (
          <div
            key={`${stock.symbol}-${index}`}
            className="inline-flex items-center px-4 py-1"
          >
            <span className="font-medium mr-2">{stock.symbol} </span>
            <span className="mr-1">{stock.price} </span>
            <span
              className={
                `flex items-center ${stock.change >= 0 ? "text-green-500" : "text-red-500"}`
              }
            >
              {stock.change >= 0 ? (
                <ArrowUp className="h-3 w-3 mr-1" />
              ) : (
                <ArrowDown className="h-3 w-3 mr-1" />
              )}
              {formatChangepercent(stock.changePercent)}
            </span>
          </div>
        ))}
      </div>

      <style jsx global>{`
        @keyframes ticker {
          0% {
            transform: translateX(0);
          }
          100% {
            transform: translateX(-50%);
          }
        }

        .animation-pause {
          animation-play-state: paused;
        }
      `}</style>
    </div>
  );
}
