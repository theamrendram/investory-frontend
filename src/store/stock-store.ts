export interface Stock {
  id: string
  stock_name: string
  target_price: number
  exchange: string
  created_at?: string
}

export interface UpstoxStock {
  instrument_key: string
  exchange_token: string
  tradingsymbol: string
  name: string
  last_price: number
  volume: number
  average_price: number
  oi: number
  net_change: number
  total_buy_quantity: number
  total_sell_quantity: number
  ohlc: {
    open: number
    high: number
    low: number
    close: number
  }
}

export interface SearchResult {
  instrument_key: string
  exchange_token: string
  tradingsymbol: string
  name: string
  exchange: string
}
