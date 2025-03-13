import MarketSentiment from "@/components/Marketsentiment";
import Navbar from "@/components/common/Navbar";
import StockTicker from "@/components/common/stockticker";
export default function Home() {
  return (
    <div className="">
      <StockTicker
        className="flex flex-col min-h-screen bg-white"
        pauseonhover={true}
      ></StockTicker>
      <Navbar />
      <MarketSentiment />
      this is home
    </div>
  );
}
