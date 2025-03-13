'use client';

import { useState } from 'react';

const MarketSentiment = () => {
  const [sentiment, setSentiment] = useState('Fear');
  const marketData = {
    nifty: 22082.65,
    sensexChange: -0.13,
    days: ['TUE', 'THU', 'FRI', 'MON', 'TODAY'],
  };

  return (
    <div className="bg-gray-900 text-white p-6 w-full max-w mx-auto relative">
      <div className="flex items-center justify-between mb-10 mt-10">
        <div className="flex space-x-4">
          <span className="bg-gray-700 px-3 py-1 rounded text-sm">NIFTY 50 {marketData.nifty}</span>
          <span className="bg-gray-700 px-3 py-1 rounded text-sm">SENSEX {marketData.sensexChange}</span>

        </div>
      </div>
      <h2 className="text-4xl font-semibold mt-4">The market is in</h2>
      <h1 className="text-4xl font-bold text-orange-500">{sentiment} zone</h1>
      <div className="flex justify-end items-center space-x-4 mt-6 space-x-3 pr-6">
        {marketData.days.map((day, index) => (
          <div key={index} className="flex flex-col items-right">
            <div className="w-8 h-8 border-2 border-yellow-500 rounded-full flex items-center justify-center">
              <div className="w-4 h-4 bg-yellow-500 rounded-full"></div>
            </div>
            <span className="text-xs mt-2">{day}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default MarketSentiment;
