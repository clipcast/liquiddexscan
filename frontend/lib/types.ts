export interface TokenInfo {
  name: string;
  symbol: string;
  deployer: string;
  address: string;
  block: string;
  age: string;
}

export interface PoolData {
  id: string;
  type: string;
  attributes: {
    name: string;
    base_token_price_usd: string;
    quote_token_price_usd: string;
    reserve_in_usd: string;
    volume_usd: { h1: string; h24: string };
    price_change_percentage: { m5: string; h1: string; h6: string; h24: string };
    transactions: { h1: { buys: number; sells: number }; h24: { buys: number; sells: number } };
  };
}
