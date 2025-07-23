"use client"

import { useEffect, useState } from "react"
import { Plus, RefreshCw, AlertCircle } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Skeleton } from "@/components/ui/skeleton"
import { StockSearch } from "@/components/stock-search"
import { WatchlistItem } from "@/components/watchlist-item"
import axios from "axios"
import type { Stock, SearchResult } from "@/store/stock-store"

export default function WatchlistPage() {
  const [stocks, setStocks] = useState<Stock[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [isAdding, setIsAdding] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [showManualAdd, setShowManualAdd] = useState(false)
  const [manualStock, setManualStock] = useState({ name: "", targetPrice: "" })

  // Get user ID from localStorage or your auth system
  const user_id = typeof window !== "undefined" ? localStorage.getItem("firebase_uid") || "" : "" // Remove auth dependency for now

  useEffect(() => {
    fetchWatchlist() // Remove the user_id condition
  }, [])

  const fetchWatchlist = async () => {
    try {
      setError(null)
      const res = await axios.get(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/watchlist/${user_id}`)
      // Ensure we always store an array to avoid `map` runtime errors
      const payload = res.data
      // Your API might return `{ data: [...] }`, `{ stocks: [...] }`, or a raw array
      const list = Array.isArray(payload)
        ? payload
        : Array.isArray(payload?.data)
          ? payload.data
          : Array.isArray(payload?.stocks)
            ? payload.stocks
            : []

      setStocks(list as Stock[])
    } catch (error) {
      console.error("Error fetching watchlist:", error)
      setError("Failed to fetch watchlist. Please try again.")
      setStocks([]) // <-- guarantee an array even on error
    } finally {
      setIsLoading(false)
    }
  }

  const handleAddFromSearch = async (stock: SearchResult & { currentPrice: number }) => {
    setIsAdding(true)
    try {
      await axios.post(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/watchlist`, {
        user_id,
        stock_name: stock.tradingsymbol,
        target_price: stock.currentPrice * 1.1, // Default to 10% above current price
        exchange: stock.exchange,
      })
      await fetchWatchlist()
    } catch (error) {
      console.error("Error adding to watchlist:", error)
      setError("Failed to add stock to watchlist.")
    } finally {
      setIsAdding(false)
    }
  }

  const handleManualAdd = async () => {
    if (!manualStock.name.trim() || !manualStock.targetPrice) return

    setIsAdding(true)
    try {
      await axios.post(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/watchlist`, {
        user_id,
        stock_name: manualStock.name.toUpperCase(),
        target_price: Number.parseFloat(manualStock.targetPrice),
        exchange: "NSE",
      })
      setManualStock({ name: "", targetPrice: "" })
      setShowManualAdd(false)
      await fetchWatchlist()
    } catch (error) {
      console.error("Error adding to watchlist:", error)
      setError("Failed to add stock to watchlist.")
    } finally {
      setIsAdding(false)
    }
  }

  const handleDelete = async (symbol: string) => {
    try {
      await axios.delete(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/watchlist`, {
        data: { user_id, stock_symbol: symbol },
      })
      await fetchWatchlist()
    } catch (error) {
      console.error("Error removing from watchlist:", error)
      setError("Failed to remove stock from watchlist.")
    }
  }

  return (
    <div className="p-6 max-w-4xl mx-auto space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">📈 My Watchlist</h1>
        <Button onClick={fetchWatchlist} variant="outline" size="sm">
          <RefreshCw className="h-4 w-4 mr-2" />
          Refresh
        </Button>
      </div>

      {error && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {/* Add Stock Section */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Plus className="h-5 w-5" />
            Add Stock to Watchlist
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label htmlFor="stock-search">Search Stocks</Label>
            <StockSearch onSelectStock={handleAddFromSearch} />
          </div>

          <div className="flex items-center gap-2">
            <div className="flex-1 border-t"></div>
            <span className="text-sm text-gray-500">or</span>
            <div className="flex-1 border-t"></div>
          </div>

          {!showManualAdd ? (
            <Button variant="outline" onClick={() => setShowManualAdd(true)} className="w-full">
              Add Manually
            </Button>
          ) : (
            <div className="space-y-3">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <Label htmlFor="manual-stock">Stock Symbol</Label>
                  <Input
                    id="manual-stock"
                    placeholder="e.g., RELIANCE"
                    value={manualStock.name}
                    onChange={(e) => setManualStock((prev) => ({ ...prev, name: e.target.value }))}
                  />
                </div>
                <div>
                  <Label htmlFor="target-price">Target Price</Label>
                  <Input
                    id="target-price"
                    type="number"
                    placeholder="₹0.00"
                    value={manualStock.targetPrice}
                    onChange={(e) => setManualStock((prev) => ({ ...prev, targetPrice: e.target.value }))}
                  />
                </div>
              </div>
              <div className="flex gap-2">
                <Button
                  onClick={handleManualAdd}
                  disabled={isAdding || !manualStock.name.trim() || !manualStock.targetPrice}
                  className="flex-1"
                >
                  {isAdding ? "Adding..." : "Add to Watchlist"}
                </Button>
                <Button
                  variant="outline"
                  onClick={() => {
                    setShowManualAdd(false)
                    setManualStock({ name: "", targetPrice: "" })
                  }}
                >
                  Cancel
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Watchlist Items */}
      <div>
        <h2 className="text-xl font-semibold mb-4">Your Stocks ({stocks.length})</h2>

        {isLoading ? (
          <div className="space-y-4">
            {[...Array(3)].map((_, i) => (
              <Card key={i}>
                <CardContent className="p-4">
                  <div className="flex justify-between items-center">
                    <div className="space-y-2 flex-1">
                      <Skeleton className="h-6 w-32" />
                      <Skeleton className="h-4 w-48" />
                      <Skeleton className="h-4 w-24" />
                    </div>
                    <Skeleton className="h-8 w-8" />
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : stocks.length === 0 ? (
          <Card>
            <CardContent className="p-8 text-center">
              <div className="text-gray-500">
                <div className="text-4xl mb-4">📊</div>
                <h3 className="text-lg font-medium mb-2">No stocks in your watchlist</h3>
                <p className="text-sm">Add some stocks to start tracking their performance!</p>
              </div>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-4">
            {stocks.map((stock) => (
              <WatchlistItem key={stock.id} stock={stock} onDelete={handleDelete} />
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
