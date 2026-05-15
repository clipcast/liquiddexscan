const API = "/api/v1";

export async function fetchNewTokens() {
  const res = await fetch(`${API}/new`);
  return res.json();
}

export async function fetchTopPairs() {
  const res = await fetch(`${API}/base/pairs?view=top`);
  return res.json();
}

export async function fetchOHLCV(address: string, tf = "1h") {
  const res = await fetch(`${API}/base/pool/${address}/ohlcv?tf=${tf}`);
  return res.json();
}

export async function fetchTrades(address: string) {
  const res = await fetch(`${API}/base/pool/${address}/trades`);
  return res.json();
}
