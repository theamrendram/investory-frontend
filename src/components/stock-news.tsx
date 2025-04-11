"use client";

import type React from "react";

import { cn } from "@/lib/utils";
import { AnimatePresence, motion } from "framer-motion";
import Link from "next/link";
import { useState } from "react";
import { CalendarDays, ExternalLink } from "lucide-react";
import { useEffect } from "react";
import { NewsItem } from "@/types";


// const newsItems: NewsItem[] = [
//   {
//     title: "Apple Unveils New AI Features for iPhone",
//     description:
//       "Apple announced a suite of new AI features coming to iPhone...",
//     link: "/news/apple-ai",
//     source: "TechCrunch",
//     date: "May 15, 2025",
//     category: "Technology",
//   },
//   {
//     title: "Apple Unveils New AI Features for iPhone",
//     description:
//       "Apple announced a suite of new AI features coming to iPhone...",
//     link: "/news/apple-ai",
//     source: "TechCrunch",
//     date: "May 15, 2025",
//     category: "Technology",
//   },
//   {
//     title: "Microsoft's Cloud Revenue Surges 30% in Q1",
//     description: "Microsoft reported a 30% increase in cloud revenue for Q1...",
//     link: "/news/microsoft-cloud",
//     source: "Bloomberg",
//     date: "May 14, 2025",
//     category: "Technology",
//   },
//   {
//     title: "Fed Signals Potential Rate Cut in June",
//     description:
//       "Federal Reserve officials hinted at a possible interest rate cut...",
//     link: "/news/fed-rate-cut",
//     source: "Wall Street Journal",
//     date: "May 15, 2025",
//     category: "Financial",
//   },
//   {
//     title: "Fed Signals Potential Rate Cut in June",
//     description:
//       "Federal Reserve officials hinted at a possible interest rate cut...",
//     link: "/news/fed-rate-cut",
//     source: "Wall Street Journal",
//     date: "May 15, 2025",
//     category: "Financial",
//   },
//   {
//     title: "JPMorgan Acquires Fintech Startup for $2.5B",
//     description:
//       "JPMorgan Chase announced the acquisition of a leading fintech startup...",
//     link: "/news/jpmorgan-acquisition",
//     source: "Financial Times",
//     date: "May 13, 2025",
//     category: "Financial",
//   },    
// ];
const NewsComponent = () =>{
  const [newsItems, setNewsItem] = useState<NewsItem[]>([]);
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);


useEffect (() => {
  const fetchnews = async() =>{
    try{
      const response = await fetch("https://newsdata.io/api/1/latest?country=in&category=business&apikey=pub_7965065016ce9f33ef7b3d6ef41e6d29de590");
      const data = await response.json();
      console.log("Fetched News Data:", data);
      const formattedNews = data.results.map((item: any) => ({
              title: item.title,
              description: item.description,
              link: item.link,
              source: item.source_id || "Unknown Source",
              date: item.pubDate ? new Date(item.pubDate).toLocaleDateString() : "",
              category: item.category?.[0] || "General",
            }));
            // console.log(
            //   "Formatted News:", formattedNews
            // )
      setNewsItem(formattedNews);
    } catch (error) {
      console.error("Error fetching news categories:", error);
    }
  };
  fetchnews();

}, []);

const categories = [...new Set(newsItems.map((item) => item.category))]
// export const StockNews = ({ className }: { className?: string }) => {
//   const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

//   const categories = [...new Set(newsItems.map((item) => item.category))];

  return (
    <div className="space-y-8 p-8">
      <h2 className="text-2xl text-white font-bold">Market News</h2>

      <div className="space-y-8">
        {categories.map((category) => (
          <div key={category} className="space-y-4">
            <h3 className="text-xl font-semibold text-orange-500 dark:text-orange-500">
              {category}
            </h3>

            <div className={cn("flex justify-center mx-auto gap-4")}
            >
              {newsItems
                .filter((item) => item.category === category)
                .map((item, idx) => {
                  const itemIndex = newsItems.findIndex((i) => i === item);
                    

                  return (
                    <Link
                      href={item.link}
                      key={itemIndex}
                      className="relative group block h-full max-w-[400px]"
                      onMouseEnter={() => setHoveredIndex(itemIndex)}
                      onMouseLeave={() => setHoveredIndex(null)}
                      target="_blank"
                    >
                      <AnimatePresence>
                        {hoveredIndex === itemIndex && (
                          <motion.span
                            className="absolute inset-0 h-full w-full bg-neutral-200 dark:bg-slate-800/[0.8] block rounded-3xl"
                            layoutId="hoverBackground"
                            initial={{ opacity: 0 }}
                            animate={{
                              opacity: 1,
                              transition: { duration: 0.15 },
                            }}
                            exit={{
                              opacity: 0,
                              transition: { duration: 0.15, delay: 0.2 },
                            }}
                          />
                        )}
                      </AnimatePresence>
                      <NewsCard>
                        <div className="flex justify-between items-start">
                          <NewsCardTitle>{item.title}</NewsCardTitle>
                          <ExternalLink className="h-4 w-4 text-zinc-400 mt-4 flex-shrink-0" />
                        </div>
                        <NewsCardDescription>
                          {item.description}
                        </NewsCardDescription>
                        <div className="mt-4 flex items-center justify-between text-xs text-zinc-500">
                          <span className="font-medium">{item.source}</span>
                          <div className="flex items-center">
                            <CalendarDays className="h-3 w-3 mr-1" />
                            <span>{item.date}</span>
                          </div>
                        </div>
                      </NewsCard>
                    </Link>
                  );
                })}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
export const NewsCard = ({
  className,
  children,
}: {
  className?: string;
  children: React.ReactNode;
}) => {
  return (
    <div
      className={cn(
        "rounded-2xl h-full w-full p-4 overflow-hidden bg-black border border-transparent dark:border-white/[0.2] group-hover:border-slate-700 relative z-20",
        className
      )}
    >
      <div className="relative z-50">
        <div className="p-4">{children}</div>
      </div>
    </div>
  );
};

export const NewsCardTitle = ({
  className,
  children,
}: {
  className?: string;
  children: React.ReactNode;
}) => {
  return (
    <h4
      className={cn(
        "text-zinc-100 font-bold tracking-wide mt-4 pr-4",
        className
      )}
    >
      {children}
    </h4>
  );
};

export const NewsCardDescription = ({
  className,
  children,
}: {
  className?: string;
  children: React.ReactNode;
}) => {
  return (
    <p
      className={cn(
        "mt-4 text-zinc-400 tracking-wide leading-relaxed text-sm line-clamp-3",
        className
      )}
    >
      {children}
    </p>
  );
};
export default NewsComponent;

// function item(value: never, index: number, array: never[]): unknown {
//   throw new Error("Function not implemented.");
// }


