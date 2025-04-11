export function MarketOverview() {
    const indices = [
      { name: "S&P 500", value: "5,234.18", change: "+0.82%", status: "up" },
      { name: "Dow Jones", value: "38,765.45", change: "+0.64%", status: "up" },
      { name: "Nasdaq", value: "16,432.67", change: "+1.12%", status: "up" },
      { name: "Russell 2000", value: "2,032.45", change: "-0.23%", status: "down" },
    ]
  
    const topGainers = [
      { symbol: "XYZ", name: "XYZ Corp", change: "+12.4%" },
      { symbol: "ABC", name: "ABC Inc", change: "+8.7%" },
      { symbol: "DEF", name: "DEF Holdings", change: "+7.2%" },
    ]
  
    const topLosers = [
      { symbol: "JKL", name: "JKL Industries", change: "-9.8%" },
      { symbol: "MNO", name: "MNO Tech", change: "-7.5%" },
      { symbol: "PQR", name: "PQR Services", change: "-6.3%" },
    ]
  
    return (
      <div className="space-y-6">
        <div>
          <h3 className="text-lg font-medium mb-3">Major Indices</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {indices.map((index) => (
              <div key={index.name} className="bg-gray-50 rounded-lg p-4">
                <div className="text-sm text-gray-500">{index.name}</div>
                <div className="text-lg font-semibold">{index.value}</div>
                <div className={`text-sm ${index.status === "up" ? "text-green-600" : "text-red-600"}`}>
                  {index.change}
                </div>
              </div>
            ))}
          </div>
        </div>
  
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <h3 className="text-lg font-medium mb-3">Top Gainers</h3>
            <div className="space-y-2">
              {topGainers.map((stock) => (
                <div key={stock.symbol} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div>
                    <div className="font-medium">{stock.symbol}</div>
                    <div className="text-sm text-gray-500">{stock.name}</div>
                  </div>
                  <div className="text-green-600 font-medium">{stock.change}</div>
                </div>
              ))}
            </div>
          </div>
  
          <div>
            <h3 className="text-lg font-medium mb-3">Top Losers</h3>
            <div className="space-y-2">
              {topLosers.map((stock) => (
                <div key={stock.symbol} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div>
                    <div className="font-medium">{stock.symbol}</div>
                    <div className="text-sm text-gray-500">{stock.name}</div>
                  </div>
                  <div className="text-red-600 font-medium">{stock.change}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    )
  }
  
  