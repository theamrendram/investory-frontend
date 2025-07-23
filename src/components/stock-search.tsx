"use client"

import { useState, useEffect } from "react"
import { Search, TrendingUp, TrendingDown } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Skeleton } from "@/components/ui/skeleton"
import axios from "axios"
import type { SearchResult, UpstoxStock } from "@/store/stock-store"

interface StockSearchProps {
  onSelectStock: (stock: SearchResult & { currentPrice: number }) => void
}

export function StockSearch({ onSelectStock }: StockSearchProps) {
  const [query, setQuery] = useState("")
  const [searchResults, setSearchResults] = useState<SearchResult[]>([])
  const [stockDetails, setStockDetails] = useState<Record<string, UpstoxStock>>({})
  const [isSearching, setIsSearching] = useState(false)
  const [isLoadingDetails, setIsLoadingDetails] = useState<Record<string, boolean>>({})

  // Debounced search
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      if (query.trim().length > 2) {
        searchStocks(query)
      } else {
        setSearchResults([])
        setStockDetails({})
      }
    }, 300)

    return () => clearTimeout(timeoutId)
  }, [query])

  const searchStocks = async (searchQuery: string) => {
    setIsSearching(true)
    try {
      // Replace with your Upstox search endpoint
      const response = await axios.get(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/upstox/search`, {
        params: { query: searchQuery },
      })
      setSearchResults(response.data.data || [])
    } catch (error) {
      console.error("Error searching stocks:", error)
      setSearchResults([])
    } finally {
      setIsSearching(false)
    }
  }

  const fetchStockDetails = async (instrumentKey: string) => {
    if (stockDetails[instrumentKey] || isLoadingDetails[instrumentKey]) return

    setIsLoadingDetails((prev) => ({ ...prev, [instrumentKey]: true }))
    try {
      // Replace with your Upstox market data endpoint
      const response = await axios.get(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/upstox/quote`, {
        params: { instrument_key: instrumentKey },
      })
      setStockDetails((prev) => ({
        ...prev,
        [instrumentKey]: response.data.data[instrumentKey],
      }))
    } catch (error) {
      console.error("Error fetching stock details:", error)
    } finally {
      setIsLoadingDetails((prev) => ({ ...prev, [instrumentKey]: false }))
    }
  }

  const handleSelectStock = (stock: SearchResult) => {
    const details = stockDetails[stock.instrument_key]
    if (details) {
      onSelectStock({
        ...stock,
        currentPrice: details.last_price,
      })
      setQuery("")
      setSearchResults([])
      setStockDetails({})
    }
  }

  return (
    <div className="relative">
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
        <Input
          type="text"
          placeholder="Search stocks (e.g., RELIANCE, TCS, INFY)"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="pl-10"
        />
      </div>

      {(isSearching || searchResults.length > 0) && (
        <Card className="absolute top-full left-0 right-0 mt-1 z-50 max-h-96 overflow-y-auto">
          <CardContent className="p-2">
            {isSearching ? (
              <div className="space-y-2">
                {[...Array(3)].map((_, i) => (
                  <Skeleton key={i} className="h-16 w-full" />
                ))}
              </div>
            ) : (
              <div className="space-y-1">
                {searchResults.map((stock) => {
                  const details = stockDetails[stock.instrument_key]
                  const isLoading = isLoadingDetails[stock.instrument_key]

                  return (
                    <div
                      key={stock.instrument_key}
                      className="p-3 hover:bg-gray-50 rounded-lg cursor-pointer border"
                      onClick={() => {
                        if (!details && !isLoading) {
                          fetchStockDetails(stock.instrument_key)
                        }
                      }}
                    >
                      <div className="flex justify-between items-start">
                        <div className="flex-1">
                          <div className="flex items-center gap-2">
                            <span className="font-semibold">{stock.tradingsymbol}</span>
                            <Badge variant="outline" className="text-xs">
                              {stock.exchange}
                            </Badge>
                          </div>
                          <p className="text-sm text-gray-600 truncate">{stock.name}</p>
                        </div>

                        {isLoading ? (
                          <Skeleton className="h-8 w-20" />
                        ) : details ? (
                          <div className="text-right">
                            <div className="font-semibold">₹{details.last_price.toFixed(2)}</div>
                            <div
                              className={`text-sm flex items-center gap-1 ${
                                details.net_change >= 0 ? "text-green-600" : "text-red-600"
                              }`}
                            >
                              {details.net_change >= 0 ? (
                                <TrendingUp className="h-3 w-3" />
                              ) : (
                                <TrendingDown className="h-3 w-3" />
                              )}
                              {details.net_change.toFixed(2)} (
                              {((details.net_change / (details.last_price - details.net_change)) * 100).toFixed(2)}%)
                            </div>
                            <Button
                              size="sm"
                              className="mt-1"
                              onClick={(e) => {
                                e.stopPropagation()
                                handleSelectStock(stock)
                              }}
                            >
                              Add to Watchlist
                            </Button>
                          </div>
                        ) : (
                          <Button variant="outline" size="sm">
                            View Details
                          </Button>
                        )}
                      </div>
                    </div>
                  )
                })}
              </div>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  )
}
