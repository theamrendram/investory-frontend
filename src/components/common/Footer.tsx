"use client";

import Link from "next/link";
import { TextHoverEffect } from "../ui/text-hover-effect";

const Footer = () => {
  return (
    <footer className="bg-[#1a202c] text-white py-12">
      <div className="max-w-7xl mx-auto px-6 md:px-12 lg:px-16">
        <div className="text-center mb-12">
          <div className="">
            <TextHoverEffect text="INVESTORY" />
          </div>
          <p className="text-gray-400 mt-2 max-w-lg mx-auto">
            Your one-stop platform for tracking stocks, mutual funds, and market insights!
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-12">
          <div>
            <h3 className="text-xl font-semibold mb-4 text-orange-500">About Us</h3>
            <p className="text-sm text-gray-400">
              Investory provides data, information & content for Indian stocks, mutual funds,
              ETFs & indices. We help investors make informed decisions with real-time market
              data and expert analysis.
            </p>
            <div className="mt-6">
              <h3 className="text-xl text-orange-500 font-semibold mb-4">Contact Us</h3>
              <p className="text-sm text-gray-400">support@investory.com</p>
              <p className="text-sm text-gray-400">+918586078543</p>
            </div>
          </div>

          <div>
            <h3 className="text-xl   text-orange-500 font-semibold mb-4">Assets</h3>
            <ul className="space-y-3 text-gray-300">
              {['Stocks', 'Mutual Funds', 'ETFs', 'Bonds', 'Commodities'].map((item) => (
                <li key={item}>
                  <Link href="#" className="hover:text-orange-500 transition-colors">{item}</Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="text-xl  text-orange-500 font-semibold mb-4">Tools</h3>
            <ul className="space-y-3 text-gray-300">
              {['Market Movers', 'Stock Screener', 'MF Screener', 'Portfolio Tracker', 'Investment Calculator'].map((tool) => (
                <li key={tool}>
                  <Link href="#" className="hover:text-orange-500 transition-colors">{tool}</Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="text-xl  text-orange-500 font-semibold mb-4">Learn & Connect</h3>
            <ul className="space-y-3 text-gray-300">
              {['Blog', 'Glossary', 'Market News', 'Community', 'Help Center'].map((resource) => (
                <li key={resource}>
                  <Link href="#" className="hover:text-orange-500 transition-colors">{resource}</Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-700 pt-8">
          <div className="flex flex-wrap justify-center gap-6 text-sm text-gray-400 mb-4">
            {['Privacy Policy', 'Terms of Service', 'Disclaimer'].map((link) => (
              <Link key={link} href="#" className="hover:text-white transition-colors">{link}</Link>
            ))}
          </div>

          <p className="text-center text-xs text-gray-500">
            © {new Date().getFullYear()} Investory Technologies. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;