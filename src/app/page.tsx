import Hero from "@/components/Hero";
import Navbar from "@/components/common/Navbar";
import StockTicker from "@/components/common/stockticker";
import MarketSectors from "@/components/marketsectors";
import Footer from "@/components/common/Footer";
import StockNews from "@/components/stock-news";
import Faq from "@/components/faq";
import Chatbot from "@/components/Chatbot";
export default function Home() {
  return (
    <section className="min-h-screen bg-primary">
      {/* <StockTicker pauseonhover={true}></StockTicker> */}
      <Navbar />
      <Hero />
      <MarketSectors />
      <StockNews />
      <Faq />
      <Footer />
      <Chatbot />
    </section>
  );
}
