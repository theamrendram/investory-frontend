"use client"

import { useState, useEffect } from "react"
import { Trash2, TrendingUp, TrendingDown, Target } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Skeleton } from "@/components/ui/skeleton"
import axios from "axios"
import type { Stock, UpstoxStock } from "@/store/stock-store"

interface WatchlistItemProps {
  stock: Stock
  onDelete: (symbol: string) => void
}

export function WatchlistItem({ stock, onDelete }: WatchlistItemProps) {
  const [stockDetails, setStockDetails] = useState<UpstoxStock | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    fetchStockDetails()
    // Set up polling for real-time updates
    const interval = setInterval(fetchStockDetails, 30000) // Update every 30 seconds
    return () => clearInterval(interval)
  }, [stock.stock_name])

  const fetchStockDetails = async () => {
    try {
      setError(null)
      // First search for the instrument key
      const searchResponse = await axios.get(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/upstox/search`, {
        params: { query: stock.stock_name },
      })

      const searchResults = searchResponse.data.data || []
      const matchedStock = searchResults.find(
        (s: any) => s.tradingsymbol.toLowerCase() === stock.stock_name.toLowerCase(),
      )

      if (matchedStock) {
        // Fetch detailed quote
        const quoteResponse = await axios.get(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/upstox/quote`, {
          params: { instrument_key: matchedStock.instrument_key },
        })
        setStockDetails(quoteResponse.data.data[matchedStock.instrument_key])
      } else {
        setError("Stock not found")
      }
    } catch (error) {
      console.error("Error fetching stock details:", error)
      setError("Failed to fetch stock data")
    } finally {
      setIsLoading(false)
    }
  }

  const targetReached = stockDetails && stockDetails.last_price >= stock.target_price
  const priceChangePercent = stockDetails
    ? (stockDetails.net_change / (stockDetails.last_price - stockDetails.net_change)) * 100
    : 0

  if (isLoading) {
    return (
      <Card>
        <CardContent className="p-4">
          <div className="flex justify-between items-center">
            <div className="space-y-2 flex-1">
              <Skeleton className="h-5 w-24" />
              <Skeleton className="h-4 w-32" />
            </div>
            <Skeleton className="h-8 w-16" />
          </div>
        </CardContent>
      </Card>
    )
  }

  if (error) {
    return (
      <Card className="border-red-200">
        <CardContent className="p-4">
          <div className="flex justify-between items-center">
            <div>
              <div className="font-semibold text-red-600">{stock.stock_name}</div>
              <div className="text-sm text-red-500">{error}</div>
              <div className="text-sm text-gray-600 flex items-center gap-1 mt-1">
                <Target className="h-3 w-3" />
                Target: ₹{stock.target_price}
              </div>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => onDelete(stock.stock_name)}
              className="text-red-600 hover:text-red-700"
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className={`transition-colors ${targetReached ? "border-green-300 bg-green-50" : ""}`}>
      <CardContent className="p-4">
        <div className="flex justify-between items-start">
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-1">
              <span className="font-semibold text-lg">{stock.stock_name}</span>
              <Badge variant="outline" className="text-xs">
                {stock.exchange}
              </Badge>
              {targetReached && <Badge className="bg-green-600 text-white text-xs">Target Reached!</Badge>}
            </div>

            <div className="space-y-1">
              <div className="flex items-center gap-4">
                <span className="text-2xl font-bold">₹{stockDetails?.last_price.toFixed(2)}</span>
                <div
                  className={`flex items-center gap-1 ${
                    stockDetails && stockDetails.net_change >= 0 ? "text-green-600" : "text-red-600"
                  }`}
                >
                  {stockDetails && stockDetails.net_change >= 0 ? (
                    <TrendingUp className="h-4 w-4" />
                  ) : (
                    <TrendingDown className="h-4 w-4" />
                  )}
                  <span className="font-medium">
                    {stockDetails?.net_change.toFixed(2)} ({priceChangePercent.toFixed(2)}%)
                  </span>
                </div>
              </div>

              <div className="text-sm text-gray-600 flex items-center gap-1">
                <Target className="h-3 w-3" />
                Target: ₹{stock.target_price}
                {stockDetails && (
                  <span
                    className={`ml-2 ${
                      stockDetails.last_price >= stock.target_price ? "text-green-600" : "text-orange-600"
                    }`}
                  >
                    ({stockDetails.last_price >= stock.target_price ? "+" : ""}
                    {(((stockDetails.last_price - stock.target_price) / stock.target_price) * 100).toFixed(1)}%)
                  </span>
                )}
              </div>

              {stockDetails && (
                <div className="text-xs text-gray-500 grid grid-cols-2 gap-2 mt-2">
                  <span>Open: ₹{stockDetails.ohlc.open.toFixed(2)}</span>
                  <span>High: ₹{stockDetails.ohlc.high.toFixed(2)}</span>
                  <span>Low: ₹{stockDetails.ohlc.low.toFixed(2)}</span>
                  <span>Volume: {stockDetails.volume.toLocaleString()}</span>
                </div>
              )}
            </div>
          </div>

          <Button
            variant="ghost"
            size="sm"
            onClick={() => onDelete(stock.stock_name)}
            className="text-red-600 hover:text-red-700"
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}
