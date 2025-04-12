import StockTicker from "@/components/common/stockticker";
import React from "react";
import Compare from "@/components/Compare";
import MarketMovers from "@/components/MarketMovers";

const page = () => {
  return (
    <section className="min-h-screen bg-blue-50">
      <StockTicker pauseonhover={true} />
      <MarketMovers />
      <Compare />
    </section>
  );
};

export default page;
