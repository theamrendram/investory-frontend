"use client";
import React, { useState } from "react";
import { Input } from "./ui/input";
import { Button } from "./ui/button";

const stockFundamentals = [
  {
    name: "Infosys Ltd.",
    sector: "IT Services",
    marketCap: "₹6.3T",
    peRatio: 25.4,
    roe: "29.5%",
    eps: 54.6,
    marketType: "NSE",
    establishedYear: 1981,
    headquarters: "Bangalore, India",
    ceo: "Salil Parekh",
    employees: 343234,
  },
  {
    name: "HDFC Bank Ltd.",
    sector: "Banking",
    marketCap: "₹11.2T",
    peRatio: 18.7,
    roe: "16.2%",
    eps: 69.1,
    marketType: "NSE",
    establishedYear: 1994,
    headquarters: "Mumbai, India",
    ceo: "Sashidhar Jagdishan",
    employees: 177000,
  },
  {
    name: "Reliance Industries Ltd.",
    sector: "Conglomerate",
    marketCap: "₹19.4T",
    peRatio: 22.3,
    roe: "13.1%",
    eps: 89.5,
    marketType: "NSE",
    establishedYear: 1966,
    headquarters: "Mumbai, India",
    ceo: "Mukesh Ambani",
    employees: 389414,
  },
  {
    name: "Tata Consultancy Services Ltd.",
    sector: "IT Services",
    marketCap: "₹13.7T",
    peRatio: 28.5,
    roe: "38.7%",
    eps: 112.3,
    marketType: "NSE",
    establishedYear: 1968,
    headquarters: "Mumbai, India",
    ceo: "K. Krithivasan",
    employees: 614795,
  },
];

const Compare = () => {
  const [first, setFirst] = useState("");
  const [second, setSecond] = useState("");
  const [comparison, setComparison] = useState<any[]>([]);
  const [suggestionsFirst, setSuggestionsFirst] = useState<string[]>([]);
  const [suggestionsSecond, setSuggestionsSecond] = useState<string[]>([]);

  const handleInputChange = (
    value: string,
    setter: React.Dispatch<React.SetStateAction<string>>,
    suggestionSetter: React.Dispatch<React.SetStateAction<string[]>>
  ) => {
    setter(value);

    const filteredSuggestions = stockFundamentals
      .filter((stock) => stock.name.toLowerCase().includes(value.toLowerCase()))
      .map((stock) => stock.name);

    suggestionSetter(filteredSuggestions);
  };

  const handleSelectSuggestion = (
    value: string,
    setter: React.Dispatch<React.SetStateAction<string>>,
    suggestionSetter: React.Dispatch<React.SetStateAction<string[]>>
  ) => {
    setter(value);
    suggestionSetter([]);
  };

  const handleCompare = () => {
    if (first.trim() === "" || second.trim() === "") {
      alert("Please enter both company names.");
      return;
    }

    if (first.toLowerCase() === second.toLowerCase()) {
      alert("Please select two different companies.");
      return;
    }

    const result = stockFundamentals.filter(
      (stock) =>
        stock.name.toLowerCase() === first.toLowerCase() ||
        stock.name.toLowerCase() === second.toLowerCase()
    );

    setComparison(result);
  };

  return (
    <section className="bg-white min-h-screen px-8 py-6">
      <p className="text-2xl font-semibold mb-4">Compare Stocks</p>
      <div className="flex gap-4 mb-6">
        {/* First Input */}
        <div className="relative w-full">
          <Input
            placeholder="First company"
            value={first}
            onChange={(e) =>
              handleInputChange(e.target.value, setFirst, setSuggestionsFirst)
            }
          />
          {suggestionsFirst.length > 0 && (
            <ul className="absolute z-10 bg-white border border-gray-300 rounded shadow-md w-full max-h-40 overflow-auto">
              {suggestionsFirst.map((suggestion, index) => (
                <li
                  key={index}
                  className="p-2 hover:bg-gray-100 cursor-pointer"
                  onClick={() =>
                    handleSelectSuggestion(
                      suggestion,
                      setFirst,
                      setSuggestionsFirst
                    )
                  }>
                  {suggestion}
                </li>
              ))}
            </ul>
          )}
        </div>

        {/* Second Input */}
        <div className="relative w-full">
          <Input
            placeholder="Second company"
            value={second}
            onChange={(e) =>
              handleInputChange(e.target.value, setSecond, setSuggestionsSecond)
            }
          />
          {suggestionsSecond.length > 0 && (
            <ul className="absolute z-10 bg-white border border-gray-300 rounded shadow-md w-full max-h-40 overflow-auto">
              {suggestionsSecond.map((suggestion, index) => (
                <li
                  key={index}
                  className="p-2 hover:bg-gray-100 cursor-pointer"
                  onClick={() =>
                    handleSelectSuggestion(
                      suggestion,
                      setSecond,
                      setSuggestionsSecond
                    )
                  }>
                  {suggestion}
                </li>
              ))}
            </ul>
          )}
        </div>

        <Button
          className="w-[150px] text-lg"
          variant={"secondary"}
          onClick={handleCompare}>
          Go
        </Button>
      </div>

      {comparison.length === 2 ? (
        <div className="overflow-auto">
          <table className="min-w-full border border-gray-300">
            <thead className="bg-gray-100">
              <tr>
                <th className="text-left p-2">Metric</th>
                {comparison.map((stock) => (
                  <th key={stock.name} className="text-left p-2">
                    {stock.name}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              <tr>
                <td className="p-2 font-semibold">Market Type</td>
                <td className="p-2">{comparison[0].marketType}</td>
                <td className="p-2">{comparison[1].marketType}</td>
              </tr>
              <tr>
                <td className="p-2 font-semibold">Established Year</td>
                <td className="p-2">{comparison[0].establishedYear}</td>
                <td className="p-2">{comparison[1].establishedYear}</td>
              </tr>
              <tr>
                <td className="p-2 font-semibold">Headquarters</td>
                <td className="p-2">{comparison[0].headquarters}</td>
                <td className="p-2">{comparison[1].headquarters}</td>
              </tr>
              <tr>
                <td className="p-2 font-semibold">CEO</td>
                <td className="p-2">{comparison[0].ceo}</td>
                <td className="p-2">{comparison[1].ceo}</td>
              </tr>
              <tr>
                <td className="p-2 font-semibold">Employees</td>
                <td className="p-2">
                  {comparison[0].employees.toLocaleString()}
                </td>
                <td className="p-2">
                  {comparison[1].employees.toLocaleString()}
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      ) : comparison.length > 0 ? (
        <p className="text-red-600 mt-4">
          Please enter 2 valid and different companies.
        </p>
      ) : null}
    </section>
  );
};

export default Compare;
