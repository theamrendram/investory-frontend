"use client";

import { useState, useEffect } from "react";
import { Search, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";

export interface SearchResult {
  symbol: string;
  name: string;
  exchange: string;
  price?: number;
  change?: number;
}

interface StockSearchProps {
  onSelect: (stock: SearchResult) => void;
  onClose: () => void;
  isOpen: boolean;
}

export function StockSearch({ onSelect, onClose, isOpen }: StockSearchProps) {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<SearchResult[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Mock search results for demo
  const mockStocks: SearchResult[] = [
    {
      symbol: "RELIANCE",
      name: "Reliance Industries Ltd",
      exchange: "NSE",
      price: 2450.75,
      change: 1.2,
    },
    {
      symbol: "TCS",
      name: "Tata Consultancy Services Ltd",
      exchange: "NSE",
      price: 3420.5,
      change: -0.5,
    },
    {
      symbol: "HDFCBANK",
      name: "HDFC Bank Ltd",
      exchange: "NSE",
      price: 1650.25,
      change: 0.8,
    },
    {
      symbol: "INFY",
      name: "Infosys Ltd",
      exchange: "NSE",
      price: 1420.6,
      change: 1.1,
    },
    {
      symbol: "HINDUNILVR",
      name: "Hindustan Unilever Ltd",
      exchange: "NSE",
      price: 2580.3,
      change: -0.3,
    },
    {
      symbol: "ITC",
      name: "ITC Ltd",
      exchange: "NSE",
      price: 485.75,
      change: 0.7,
    },
    {
      symbol: "SBIN",
      name: "State Bank of India",
      exchange: "NSE",
      price: 580.4,
      change: 2.1,
    },
    {
      symbol: "BHARTIARTL",
      name: "Bharti Airtel Ltd",
      exchange: "NSE",
      price: 1120.8,
      change: -1.2,
    },
  ];

  useEffect(() => {
    if (!query.trim()) {
      setResults([]);
      return;
    }

    setIsLoading(true);
    setError(null);

    // Simulate API delay
    const timer = setTimeout(() => {
      const filtered = mockStocks.filter(
        (stock) =>
          stock.symbol.toLowerCase().includes(query.toLowerCase()) ||
          stock.name.toLowerCase().includes(query.toLowerCase()),
      );
      setResults(filtered.slice(0, 5)); // Limit to 5 results
      setIsLoading(false);
    }, 300);

    return () => clearTimeout(timer);
  }, [query]);

  const handleSelect = (stock: SearchResult) => {
    onSelect(stock);
    setQuery("");
    setResults([]);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <Card className="w-full max-w-md">
        <CardContent className="p-6">
          <div className="mb-4 flex items-center justify-between">
            <h3 className="text-lg font-semibold">Add Stock to Watchlist</h3>
            <Button variant="ghost" size="sm" onClick={onClose}>
              <X className="h-4 w-4" />
            </Button>
          </div>

          <div className="relative mb-4">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 transform text-muted-foreground" />
            <Input
              placeholder="Search for stocks..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="pl-10"
            />
          </div>

          <div className="max-h-60 space-y-2 overflow-y-auto">
            {isLoading && (
              <>
                {[1, 2, 3].map((i) => (
                  <div key={i} className="flex items-center space-x-3 p-2">
                    <Skeleton className="h-4 w-16" />
                    <Skeleton className="h-4 w-32" />
                    <Skeleton className="h-4 w-12" />
                  </div>
                ))}
              </>
            )}

            {!isLoading && results.length === 0 && query && (
              <div className="py-4 text-center text-muted-foreground">
                No stocks found for "{query}"
              </div>
            )}

            {!isLoading &&
              results.map((stock) => (
                <div
                  key={stock.symbol}
                  className="flex cursor-pointer items-center justify-between rounded-lg p-2 transition-colors hover:bg-muted"
                  onClick={() => handleSelect(stock)}
                >
                  <div>
                    <div className="font-medium">{stock.symbol}</div>
                    <div className="text-sm text-muted-foreground">
                      {stock.name}
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-sm font-medium">
                      {stock.price ? `₹${stock.price.toFixed(2)}` : "N/A"}
                    </div>
                    {stock.change && (
                      <div
                        className={cn(
                          "text-xs",
                          stock.change >= 0 ? "text-green-600" : "text-red-600",
                        )}
                      >
                        {stock.change >= 0 ? "+" : ""}
                        {stock.change.toFixed(2)}%
                      </div>
                    )}
                  </div>
                </div>
              ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
