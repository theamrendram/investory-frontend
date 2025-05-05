"use client";
import { useState, useEffect } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  ArrowUp,
  ArrowDown,
  Activity,
  DollarSign,
  BarChart3,
} from "lucide-react";
import axios from "axios";

interface StockData {
  timestamp: string;
  last_price: number;
  net_change: number;
  ohlc: {
    open: number;
    high: number;
    low: number;
    close: number;
  };
  average_price: number;
  volume: number;
  total_buy_quantity: number;
  total_sell_quantity: number;
  upper_circuit_limit: number;
  lower_circuit_limit: number;
  oi: number;
  depth: {
    buy: { price: number; quantity: number; orders: number }[];
    sell: { price: number; quantity: number; orders: number }[];
  };
}
export default function IdeaStockCard() {
  const [stock, setStock] = useState<StockData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function fetchStockData() {
      try {
        setLoading(true);
        const response = await axios.get(
          `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/market/quote?symbol=NSE_EQ%7CINE669E01016`
        );

        const stockData = response.data.data["NSE_EQ:IDEA"];
        setStock(stockData);
      } catch (err) {
        setError("Failed to fetch stock data");
        console.error(err);
      } finally {
        setLoading(false);
      }
    }

    fetchStockData();

    // Optional: Set up polling for live updates
    const interval = setInterval(fetchStockData, 60000); // Update every minute

    return () => clearInterval(interval);
  }, []);

  if (loading) {
    return (
      <Card className="w-full max-w-md mx-auto shadow-md border">
        <CardContent className="flex items-center justify-center h-64">
          <p className="text-gray-500">Loading stock data...</p>
        </CardContent>
      </Card>
    );
  }

  if (error || !stock) {
    return (
      <Card className="w-full max-w-md mx-auto shadow-md border">
        <CardContent className="flex items-center justify-center h-64">
          <p className="text-red-500">{error || "Error loading stock data"}</p>
        </CardContent>
      </Card>
    );
  }

  // Format timestamp to readable date and time
  const timestamp = new Date(stock.timestamp);
  const formattedDate = timestamp.toLocaleDateString("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
  const formattedTime = timestamp.toLocaleTimeString("en-IN", {
    hour: "2-digit",
    minute: "2-digit",
  });

  // Calculate price change percentage
  const priceChangePercent = (
    (stock.net_change / stock.last_price) *
    100
  ).toFixed(2);
  const isPriceUp = stock.net_change >= 0;

  return (
    <Card className="w-full max-w-md mx-auto shadow-md border hover:shadow-lg transition-shadow duration-300">
      <CardHeader className="bg-gray-50 border-b">
        <div className="flex justify-between items-center">
          <div>
            <CardTitle className="flex items-center gap-2">
              <Activity className="h-5 w-5 text-blue-600" />
              <span>IDEA Stock</span>
              <span className="text-sm text-gray-500 font-normal">(NSE)</span>
            </CardTitle>
            <CardDescription>
              {formattedDate}, {formattedTime} IST
            </CardDescription>
          </div>
          <div className="text-right">
            <div className="text-2xl font-bold">
              ₹{stock.last_price.toFixed(2)}
            </div>
            <div
              className={`flex items-center text-sm ${
                isPriceUp ? "text-green-600" : "text-red-600"
              }`}>
              {isPriceUp ? (
                <ArrowUp className="h-4 w-4 mr-1" />
              ) : (
                <ArrowDown className="h-4 w-4 mr-1" />
              )}
              <span>
                ₹{Math.abs(stock.net_change).toFixed(2)} (
                {Math.abs(parseInt(priceChangePercent))}%)
              </span>
            </div>
          </div>
        </div>
      </CardHeader>

      <CardContent className="pt-4">
        <div className="grid grid-cols-2 gap-4">
          {/* Price Summary Section */}
          <div className="col-span-2 bg-gray-50 p-3 rounded-lg">
            <h3 className="text-sm font-semibold mb-2 flex items-center">
              <DollarSign className="h-4 w-4 mr-1 text-blue-600" />
              Price Summary
            </h3>
            <div className="grid grid-cols-3 gap-2 text-sm">
              <div>
                <p className="text-gray-500">Open</p>
                <p className="font-medium">₹{stock.ohlc.open.toFixed(2)}</p>
              </div>
              <div>
                <p className="text-gray-500">High</p>
                <p className="font-medium">₹{stock.ohlc.high.toFixed(2)}</p>
              </div>
              <div>
                <p className="text-gray-500">Low</p>
                <p className="font-medium">₹{stock.ohlc.low.toFixed(2)}</p>
              </div>
              <div>
                <p className="text-gray-500">Close</p>
                <p className="font-medium">₹{stock.ohlc.close.toFixed(2)}</p>
              </div>
              <div>
                <p className="text-gray-500">Last</p>
                <p className="font-medium">₹{stock.last_price.toFixed(2)}</p>
              </div>
              <div>
                <p className="text-gray-500">Avg</p>
                <p className="font-medium">₹{stock.average_price.toFixed(2)}</p>
              </div>
            </div>
          </div>

          {/* Volume Section */}
          <div className="col-span-1 bg-gray-50 p-3 rounded-lg">
            <h3 className="text-sm font-semibold mb-2 flex items-center">
              <BarChart3 className="h-4 w-4 mr-1 text-blue-600" />
              Volume
            </h3>
            <div className="space-y-1 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-500">Total Volume</span>
                <span className="font-medium">
                  {stock.volume.toLocaleString("en-IN")}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">Buy Qty</span>
                <span className="font-medium">
                  {stock.total_buy_quantity.toLocaleString("en-IN")}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">Sell Qty</span>
                <span className="font-medium">
                  {stock.total_sell_quantity.toLocaleString("en-IN")}
                </span>
              </div>
            </div>
          </div>

          {/* Circuit Limits Section */}
          <div className="col-span-1 bg-gray-50 p-3 rounded-lg">
            <h3 className="text-sm font-semibold mb-2">Circuit Limits</h3>
            <div className="space-y-1 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-500">Upper</span>
                <span className="font-medium text-green-600">
                  ₹{stock.upper_circuit_limit.toFixed(2)}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">Lower</span>
                <span className="font-medium text-red-600">
                  ₹{stock.lower_circuit_limit.toFixed(2)}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">OI</span>
                <span className="font-medium">{stock.oi}</span>
              </div>
            </div>
          </div>

          {/* Market Depth Section */}
          <div className="col-span-2">
            <h3 className="text-sm font-semibold mb-2">Market Depth</h3>
            <div className="grid grid-cols-2 gap-4">
              {/* Buy Orders */}
              <div className="bg-gray-50 p-3 rounded-lg">
                <h4 className="text-xs font-medium text-green-600 mb-2">
                  BUY ORDERS
                </h4>
                {stock.depth.buy[0].price > 0 ? (
                  <div className="text-sm">
                    <div className="flex justify-between text-gray-500 text-xs mb-1">
                      <span>Price</span>
                      <span>Qty</span>
                      <span>Orders</span>
                    </div>
                    {stock.depth.buy.map(
                      (level, index) =>
                        level.price > 0 && (
                          <div
                            key={`buy-${index}`}
                            className="flex justify-between mb-1">
                            <span>₹{level.price.toFixed(2)}</span>
                            <span>
                              {level.quantity.toLocaleString("en-IN")}
                            </span>
                            <span>{level.orders}</span>
                          </div>
                        )
                    )}
                  </div>
                ) : (
                  <p className="text-xs text-gray-500">No active buy orders</p>
                )}
              </div>

              {/* Sell Orders */}
              <div className="bg-gray-50 p-3 rounded-lg">
                <h4 className="text-xs font-medium text-red-600 mb-2">
                  SELL ORDERS
                </h4>
                {stock.depth.sell[0].price > 0 ? (
                  <div className="text-sm">
                    <div className="flex justify-between text-gray-500 text-xs mb-1">
                      <span>Price</span>
                      <span>Qty</span>
                      <span>Orders</span>
                    </div>
                    {stock.depth.sell.map(
                      (level, index) =>
                        level.price > 0 && (
                          <div
                            key={`sell-${index}`}
                            className="flex justify-between mb-1">
                            <span>₹{level.price.toFixed(2)}</span>
                            <span>
                              {level.quantity.toLocaleString("en-IN")}
                            </span>
                            <span>{level.orders}</span>
                          </div>
                        )
                    )}
                  </div>
                ) : (
                  <p className="text-xs text-gray-500">No active sell orders</p>
                )}
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
