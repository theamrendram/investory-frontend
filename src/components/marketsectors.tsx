"use client"
import { Button } from "@/components/ui/button"
import Image from "next/image"

const MarketSectors = () => {
  return (
    <main className="flex-grow bg-white">
      <div className="max-w-7xl mx-auto px-4 py-6">
        {/* Market and sectors */}
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-semibold">Market and sectors</h2>
          <Button variant="link" className="text-blue-500">
            View All
          </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          
          <div className="flex justify-between items-center border-b pb-4">
            <div>
              <h3 className="font-semibold">NIFTY 50</h3>
              <div className="flex items-center mt-2">
                <Image
                  src="/placeholder.svg?height=40&width=120"
                  width={120}
                  height={40}
                  alt="Chart"
                  className="mr-4"
                />
                <div>
                  <div className="text-lg font-semibold">22,460.30</div>
                  <div className="text-red-500 flex items-center">▼ 0.41%</div>
                </div>
              </div>
            </div>
          </div>

         
          <div className="flex justify-between items-center border-b pb-4">
            <div>
              <h3 className="font-semibold">NIFTY 100 Largecap</h3>
              <div className="flex items-center mt-2">
                <Image
                  src="/placeholder.svg?height=40&width=120"
                  width={120}
                  height={40}
                  alt="Chart"
                  className="mr-4"
                />
                <div>
                  <div className="text-lg font-semibold">22,890.75</div>
                  <div className="text-red-500 flex items-center">▼ 0.59%</div>
                </div>
              </div>
            </div>
          </div>

          
          <div className="flex justify-between items-center border-b pb-4">
            <div>
              <h3 className="font-semibold">NIFTY Bank</h3>
              <div className="flex items-center mt-2">
                <Image
                  src="/placeholder.svg?height=40&width=120"
                  width={120}
                  height={40}
                  alt="Chart"
                  className="mr-4"
                />
                <div>
                  <div className="text-lg font-semibold">48,216.80</div>
                  <div className="text-red-500 flex items-center">▼ 0.58%</div>
                </div>
              </div>
            </div>
          </div>

         
          <div className="flex justify-between items-center border-b pb-4">
            <div>
              <h3 className="font-semibold">USD/INR</h3>
              <div className="flex items-center mt-2">
                <Image
                  src="/placeholder.svg?height=40&width=120"
                  width={120}
                  height={40}
                  alt="Chart"
                  className="mr-4"
                />
                <div>
                  <div className="text-lg font-semibold">87.44</div>
                  <div className="text-green-500 flex items-center">▲ 0.44%</div>
                </div>
              </div>
            </div>
          </div>

          
          <div className="flex justify-between items-center border-b pb-4">
            <div>
              <h3 className="font-semibold">NIFTY 100 Midcap</h3>
              <div className="flex items-center mt-2">
                <Image
                  src="/placeholder.svg?height=40&width=120"
                  width={120}
                  height={40}
                  alt="Chart"
                  className="mr-4"
                />
                <div>
                  <div className="text-lg font-semibold">48,440.10</div>
                  <div className="text-red-500 flex items-center">▼ 1.53%</div>
                </div>
              </div>
            </div>
          </div>

          
          <div className="flex justify-between items-center border-b pb-4">
            <div>
              <h3 className="font-semibold">NIFTY IT</h3>
              <div className="flex items-center mt-2">
                <Image
                  src="/placeholder.svg?height=40&width=120"
                  width={120}
                  height={40}
                  alt="Chart"
                  className="mr-4"
                />
                <div>
                  <div className="text-lg font-semibold">37,644.40</div>
                  <div className="text-red-500 flex items-center">▼ 0.47%</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  )
}

export default MarketSectors

