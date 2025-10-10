"use client";

import { useMemo, useState } from "react";
import { ArrowUpRight, ArrowDownRight, Gauge, RefreshCw } from "lucide-react";

type SentimentLevel =
  | "Extreme Fear"
  | "Fear"
  | "Neutral"
  | "Greed"
  | "Extreme Greed";

const MarketSentiment = () => {
  const [sentiment, setSentiment] = useState<SentimentLevel>("Fear");
  const [lastUpdated, setLastUpdated] = useState<Date>(new Date());

  const marketData = useMemo(
    () => ({
      indices: [
        { label: "NIFTY 50", value: 22082.65, changePct: -0.13 },
        { label: "SENSEX", value: 72811.24, changePct: 0.21 },
        { label: "BANK NIFTY", value: 48215.3, changePct: -0.32 },
      ],
      breadth: { advancers: 912, decliners: 678, unchanged: 110 },
      volatility: { indiaVix: 13.8, changePct: -1.2 },
      putCall: { ratio: 0.92 },
    }),
    [],
  );

  const sentimentColor = useMemo(() => {
    switch (sentiment) {
      case "Extreme Fear":
        return "from-red-600 via-red-500 to-orange-400";
      case "Fear":
        return "from-orange-500 via-amber-400 to-yellow-300";
      case "Neutral":
        return "from-slate-400 via-slate-300 to-slate-200";
      case "Greed":
        return "from-emerald-400 via-green-400 to-lime-300";
      case "Extreme Greed":
        return "from-emerald-600 via-green-500 to-lime-400";
      default:
        return "from-slate-400 via-slate-300 to-slate-200";
    }
  }, [sentiment]);

  const sentimentScore = useMemo(() => {
    switch (sentiment) {
      case "Extreme Fear":
        return 10;
      case "Fear":
        return 30;
      case "Neutral":
        return 50;
      case "Greed":
        return 70;
      case "Extreme Greed":
        return 90;
      default:
        return 50;
    }
  }, [sentiment]);

  const handleRefresh = () => {
    // Simulate a soft refresh for UI demo
    setLastUpdated(new Date());
    // Cycle sentiment for demo purposes
    setSentiment((prev) => {
      const order: SentimentLevel[] = [
        "Extreme Fear",
        "Fear",
        "Neutral",
        "Greed",
        "Extreme Greed",
      ];
      const idx = order.indexOf(prev);
      return order[(idx + 1) % order.length];
    });
  };

  return (
    <div className="max-w relative mx-auto w-full bg-gray-900 p-6 text-white">
      {/* Header with indices and quick stats */}
      <div className="mb-8 mt-6 flex items-center justify-between">
        <div className="flex flex-wrap gap-3">
          {marketData.indices.map((item) => {
            const isPositive = item.changePct >= 0;
            return (
              <span
                key={item.label}
                className="inline-flex items-center gap-2 rounded border border-gray-700 bg-gray-800/70 px-3 py-1 text-sm"
              >
                <span className="opacity-80">{item.label}</span>
                <span className="font-semibold">
                  {item.value.toLocaleString(undefined, {
                    maximumFractionDigits: 2,
                  })}
                </span>
                <span
                  className={
                    isPositive
                      ? "inline-flex items-center gap-1 text-green-400"
                      : "inline-flex items-center gap-1 text-red-400"
                  }
                >
                  {isPositive ? (
                    <ArrowUpRight size={14} />
                  ) : (
                    <ArrowDownRight size={14} />
                  )}
                  {isPositive ? "+" : ""}
                  {item.changePct}%
                </span>
              </span>
            );
          })}
        </div>
        <button
          aria-label="Refresh sentiment"
          onClick={handleRefresh}
          className="inline-flex items-center gap-2 rounded border border-gray-700 bg-gray-800 px-3 py-2 text-sm transition-colors hover:bg-gray-700"
        >
          <RefreshCw className="h-4 w-4" />
          Refresh
        </button>
      </div>

      {/* Sentiment header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-semibold md:text-4xl">
            The market is in
          </h2>
          <div className="mt-2 inline-flex items-center gap-2">
            <Gauge className="h-6 w-6 text-orange-400" />
            <h1 className="text-3xl font-bold text-orange-400 md:text-4xl">
              {sentiment} zone
            </h1>
          </div>
          <p className="mt-3 max-w-2xl text-sm text-gray-300">
            This score blends volatility, breadth, momentum, and options
            activity to estimate overall risk appetite. Use it as context, not a
            signal.
          </p>
          <p className="mt-2 text-xs text-gray-400">
            Last updated: {lastUpdated.toLocaleTimeString()}
          </p>
        </div>

        {/* Gauge */}
        <div className="hidden items-center justify-center md:flex">
          <div className="relative h-48 w-48">
            <div
              className={`absolute inset-0 rounded-full bg-gradient-to-tr ${sentimentColor} opacity-90`}
            />
            <div className="absolute inset-2 rounded-full bg-gray-900" />
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="text-center">
                <div className="text-5xl font-bold">{sentimentScore}</div>
                <div className="text-xs uppercase tracking-wider text-gray-400">
                  Sentiment
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Cards row */}
      <div className="mt-8 grid grid-cols-1 gap-4 md:grid-cols-3">
        <div className="rounded-lg border border-gray-700 bg-gray-800 p-4">
          <div className="mb-2 text-xs text-gray-400">Market Breadth</div>
          <div className="flex items-end gap-6">
            <div>
              <div className="text-2xl font-semibold text-green-400">
                {marketData.breadth.advancers.toLocaleString()}
              </div>
              <div className="text-xs text-gray-400">Advancers</div>
            </div>
            <div>
              <div className="text-2xl font-semibold text-red-400">
                {marketData.breadth.decliners.toLocaleString()}
              </div>
              <div className="text-xs text-gray-400">Decliners</div>
            </div>
            <div>
              <div className="text-2xl font-semibold text-gray-300">
                {marketData.breadth.unchanged.toLocaleString()}
              </div>
              <div className="text-xs text-gray-400">Unchanged</div>
            </div>
          </div>
        </div>

        <div className="rounded-lg border border-gray-700 bg-gray-800 p-4">
          <div className="mb-2 text-xs text-gray-400">
            Volatility (India VIX)
          </div>
          <div className="flex items-center gap-3">
            <div className="text-2xl font-semibold">
              {marketData.volatility.indiaVix}
            </div>
            <div
              className={
                marketData.volatility.changePct >= 0
                  ? "inline-flex items-center gap-1 text-green-400"
                  : "inline-flex items-center gap-1 text-red-400"
              }
            >
              {marketData.volatility.changePct >= 0 ? (
                <ArrowUpRight size={16} />
              ) : (
                <ArrowDownRight size={16} />
              )}
              {marketData.volatility.changePct}%
            </div>
          </div>
          <p className="mt-2 text-xs text-gray-400">
            Lower values usually coincide with higher risk appetite.
          </p>
        </div>

        <div className="rounded-lg border border-gray-700 bg-gray-800 p-4">
          <div className="mb-2 text-xs text-gray-400">Put/Call Ratio (PCR)</div>
          <div className="text-2xl font-semibold">
            {marketData.putCall.ratio}
          </div>
          <p className="mt-2 text-xs text-gray-400">
            Below 1 leans bearish; above 1 leans bullish. Extremes can signal
            reversals.
          </p>
        </div>
      </div>
    </div>
  );
};

export default MarketSentiment;
