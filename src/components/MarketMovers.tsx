import React from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
  TableFooter,
} from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const stocks = [
  {
    companyName: "Infosys Ltd.",
    price: 1410.6,
    dayHigh: 1410.6,
  },
  {
    companyName: "Nestle India Ltd.",
    price: 2360.85,
    dayHigh: 2360.85,
  },
  {
    companyName: "HDFC Bank Ltd.",
    price: 1806.6,
    dayHigh: 1806.6,
  },
  {
    companyName: "Reliance Industries Ltd.",
    price: 1219.3,
    dayHigh: 1219.3,
  },
  {
    companyName: "Tata Consultancy Services Ltd.",
    price: 3500.0,
    dayHigh: 3520.0,
  },
  {
    companyName: "Wipro Ltd.",
    price: 450.0,
    dayHigh: 455.0,
  },
  {
    companyName: "HCL Technologies Ltd.",
    price: 1200.0,
    dayHigh: 1210.0,
  },
  {
    companyName: "Heritage Foods Ltd.",
    price: 500.0,
    dayHigh: 505.0,
  },
  {
    companyName: "Vadilal Industries Ltd.",
    price: 300.0,
    dayHigh: 305.0,
  },
  {
    companyName: "KRBL Ltd.",
    price: 250.0,
    dayHigh: 255.0,
  },
];

const MarketMovers = () => {
  return (
    <div className=" p-8">
      <div className="mb-4">
        <div className="">
          <Input placeholder="search" />
          <div className="flex gap-4 my-2">
            <Badge className="bg-blue-200 text-blue-800 font-semibold">
              Nifty 50
            </Badge>
            <Badge className="bg-blue-200 text-blue-800 font-semibold">
              Nifty 50
            </Badge>
            <Badge className="bg-blue-200 text-blue-800 font-semibold">
              Nifty 50
            </Badge>
            <Badge className="bg-blue-200 text-blue-800 font-semibold">
              Nifty 50
            </Badge>
            <Badge className="bg-blue-200 text-blue-800 font-semibold">
              Nifty 50
            </Badge>
          </div>
        </div>
      </div>
      <div className="">
        <p className="text-2xl font-semibold">Market Movers</p>
        <div className="">
          <div className="flex">
            <div className="w-1/2 border-r-2 border-secondary p-4">
              <Tabs defaultValue="high">
                <TabsList className="flex items-center justify-between bg-transparent">
                  <p className="text-lg font-semibold"> 52 Week High/Low </p>
                  <div className="">
                    <TabsTrigger
                      value="high"
                      className="bg-transparent data-[state=active]:border-b-2 data-[state=active]:border-b-green-500 data-[state=active]:bg-transparent data-[state=active]:shadow-none data-[state=active]:rounded-none w-[100px]">
                      High
                    </TabsTrigger>
                    <TabsTrigger
                      value="low"
                      className="bg-transparent data-[state=active]:border-b-2 data-[state=active]:border-b-red-500 data-[state=active]:bg-transparent data-[state=active]:shadow-none data-[state=active]:rounded-none w-[100px]">
                      Low
                    </TabsTrigger>
                  </div>
                </TabsList>
                <TabsContent value="high">
                  <Table className="border border-blue-500 rounded-full">
                    <TableCaption className="text-right text-blue-500 underline">
                      View all 52 week high
                    </TableCaption>
                    <TableHeader className="bg-blue-100">
                      <TableRow>
                        <TableHead className="text-md font-bold">
                          Company
                        </TableHead>
                        <TableHead className="text-md font-bold">
                          Prices (Rs.)
                        </TableHead>
                        <TableHead className="text-md font-bold">
                          Day High (Rs.)
                        </TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {stocks.map((stock) => (
                        <TableRow
                          key={stock.companyName + stock.price}
                          className="hover:bg-blue-100">
                          <TableCell className="font-medium">
                            {stock.companyName}
                          </TableCell>
                          <TableCell>{stock.price}</TableCell>
                          <TableCell>{stock.dayHigh}</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </TabsContent>
                <TabsContent value="low">
                  <Table className="border border-blue-500 rounded-full">
                    <TableCaption className="text-right text-blue-500 underline">
                      View all 52 week low
                    </TableCaption>
                    <TableHeader className="bg-blue-100">
                      <TableRow>
                        <TableHead className="text-md font-bold">
                          Company
                        </TableHead>
                        <TableHead className="text-md font-bold">
                          Prices (Rs.)
                        </TableHead>
                        <TableHead className="text-md font-bold">
                          Day High (Rs.)
                        </TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {stocks.map((stock) => (
                        <TableRow
                          key={stock.companyName + stock.price}
                          className="hover:bg-blue-100">
                          <TableCell className="font-medium">
                            {stock.companyName}
                          </TableCell>
                          <TableCell>{stock.price}</TableCell>
                          <TableCell>{stock.dayHigh}</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </TabsContent>
              </Tabs>
            </div>
            <div className="w-1/2 p-4">
              <Tabs defaultValue="gainers">
                <TabsList className="flex items-center justify-between bg-transparent">
                  <p className="text-lg font-semibold">
                    Today's Gainer / Loser
                  </p>
                  <div className="">
                    <TabsTrigger
                      value="gainers"
                      className="bg-transparent data-[state=active]:border-b-2 data-[state=active]:border-b-green-500 data-[state=active]:bg-transparent data-[state=active]:shadow-none data-[state=active]:rounded-none w-[100px]">
                      Gainer
                    </TabsTrigger>
                    <TabsTrigger
                      value="losers"
                      className="bg-transparent data-[state=active]:border-b-2 data-[state=active]:border-b-red-500 data-[state=active]:bg-transparent data-[state=active]:shadow-none data-[state=active]:rounded-none w-[100px]">
                      Looser
                    </TabsTrigger>
                  </div>
                </TabsList>
                <TabsContent value="gainers">
                  <Table className="border border-blue-500 rounded-full">
                    <TableCaption className="text-right text-blue-500 underline">
                      View all gainers
                    </TableCaption>
                    <TableHeader className="bg-blue-100">
                      <TableRow>
                        <TableHead className="text-md font-bold">
                          Company
                        </TableHead>
                        <TableHead className="text-md font-bold">
                          Prices (Rs.)
                        </TableHead>
                        <TableHead className="text-md font-bold">
                          Change (%)
                        </TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {stocks.map((stock) => (
                        <TableRow
                          key={stock.companyName + stock.price}
                          className="hover:bg-blue-100">
                          <TableCell className="font-medium">
                            {stock.companyName}
                          </TableCell>
                          <TableCell>{stock.price}</TableCell>
                          <TableCell>{stock.dayHigh}</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </TabsContent>
                <TabsContent value="losers">
                  <Table className="border border-blue-500 rounded-full">
                    <TableCaption className="text-right text-blue-500 underline">
                      View all losers
                    </TableCaption>
                    <TableHeader className="bg-blue-100">
                      <TableRow>
                        <TableHead className="text-md font-bold">
                          Company
                        </TableHead>
                        <TableHead className="text-md font-bold">
                          Prices (Rs.)
                        </TableHead>
                        <TableHead className="text-md font-bold">
                          Change (%)
                        </TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {stocks.map((stock) => (
                        <TableRow
                          key={stock.companyName + stock.price}
                          className="hover:bg-blue-100">
                          <TableCell className="font-medium">
                            {stock.companyName}
                          </TableCell>
                          <TableCell>{stock.price}</TableCell>
                          <TableCell>{stock.dayHigh}</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </TabsContent>
              </Tabs>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MarketMovers;
