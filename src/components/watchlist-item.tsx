"use client";

import { useState } from "react";
import { Trash2, TrendingUp, TrendingDown, Minus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

export interface Stock {
  id: string;
  symbol: string;
  name: string;
  exchange: string;
  currentPrice: number;
  change: number;
  changePercent: number;
  targetPrice?: number;
  addedAt: string;
}

interface WatchlistItemProps {
  stock: Stock;
  onRemove: (stockId: string) => void;
  onUpdateTargetPrice: (stockId: string, targetPrice: number) => void;
}

export function WatchlistItem({
  stock,
  onRemove,
  onUpdateTargetPrice,
}: WatchlistItemProps) {
  const [isEditingTarget, setIsEditingTarget] = useState(false);
  const [targetPrice, setTargetPrice] = useState(
    stock.targetPrice?.toString() || "",
  );

  const handleSaveTargetPrice = () => {
    const price = parseFloat(targetPrice);
    if (!isNaN(price) && price > 0) {
      onUpdateTargetPrice(stock.id, price);
      setIsEditingTarget(false);
    }
  };

  const handleCancelEdit = () => {
    setTargetPrice(stock.targetPrice?.toString() || "");
    setIsEditingTarget(false);
  };

  const getChangeIcon = () => {
    if (stock.change > 0)
      return <TrendingUp className="h-4 w-4 text-green-600" />;
    if (stock.change < 0)
      return <TrendingDown className="h-4 w-4 text-red-600" />;
    return <Minus className="h-4 w-4 text-gray-500" />;
  };

  const getChangeColor = () => {
    if (stock.change > 0) return "text-green-600";
    if (stock.change < 0) return "text-red-600";
    return "text-gray-500";
  };

  const getTargetStatus = () => {
    if (!stock.targetPrice) return null;

    if (stock.currentPrice >= stock.targetPrice) {
      return (
        <Badge variant="default" className="bg-green-100 text-green-800">
          Target Reached
        </Badge>
      );
    }

    const remainingPercent =
      ((stock.targetPrice - stock.currentPrice) / stock.currentPrice) * 100;
    return (
      <Badge variant="outline">
        Target: {remainingPercent.toFixed(1)}% away
      </Badge>
    );
  };

  return (
    <Card className="transition-shadow hover:shadow-md">
      <CardContent className="p-4">
        <div className="flex items-center justify-between">
          <div className="flex-1">
            <div className="mb-1 flex items-center gap-2">
              <h3 className="font-semibold">{stock.symbol}</h3>
              <Badge variant="secondary" className="text-xs">
                {stock.exchange}
              </Badge>
              {getTargetStatus()}
            </div>
            <p className="mb-2 text-sm text-muted-foreground">{stock.name}</p>

            <div className="flex items-center gap-4">
              <div>
                <div className="text-lg font-bold">
                  ₹{stock.currentPrice.toFixed(2)}
                </div>
                <div
                  className={cn(
                    "flex items-center gap-1 text-sm",
                    getChangeColor(),
                  )}
                >
                  {getChangeIcon()}
                  {stock.change >= 0 ? "+" : ""}
                  {stock.change.toFixed(2)} (
                  {stock.changePercent >= 0 ? "+" : ""}
                  {stock.changePercent.toFixed(2)}%)
                </div>
              </div>

              <div className="text-xs text-muted-foreground">
                Added: {new Date(stock.addedAt).toLocaleDateString()}
              </div>
            </div>
          </div>

          <div className="flex flex-col gap-2">
            {isEditingTarget ? (
              <div className="flex gap-1">
                <input
                  type="number"
                  value={targetPrice}
                  onChange={(e) => setTargetPrice(e.target.value)}
                  placeholder="Target price"
                  className="w-20 rounded border px-2 py-1 text-sm"
                />
                <Button size="sm" onClick={handleSaveTargetPrice}>
                  Save
                </Button>
                <Button size="sm" variant="outline" onClick={handleCancelEdit}>
                  Cancel
                </Button>
              </div>
            ) : (
              <Button
                size="sm"
                variant="outline"
                onClick={() => setIsEditingTarget(true)}
              >
                {stock.targetPrice ? "Edit Target" : "Set Target"}
              </Button>
            )}

            <Button
              size="sm"
              variant="destructive"
              onClick={() => onRemove(stock.id)}
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
