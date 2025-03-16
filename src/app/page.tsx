import MarketSentiment from "@/components/Marketsentiment";
import Navbar from "@/components/common/Navbar";
import StockTicker from "@/components/common/stockticker";
import MarketSectors from "@/components/marketsectors";
export default function Home() {
  return (
    <section className="min-h-screen bg-primary">
      <StockTicker pauseonhover={true}></StockTicker>
      <Navbar />
      <MarketSentiment />
      <MarketSectors />
    
      
    </section>
  );
}
