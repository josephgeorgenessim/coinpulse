'use server';

import qs from 'query-string';

const BASE_URL = process.env.COINGECKO_BASE_URL;
const API_KEY = process.env.COINGECKO_API_KEY;

if (!BASE_URL) {
  throw new Error('could not find COINGECKO_BASE_URL');
}

if (!API_KEY) {
  throw new Error('could not find COINGECKO_API_KEY');
}

export async function fetcher<T>(
  endpoint: string,
  params?: QueryParams,
  revalidate?: 60
): Promise<T> {
  const url = qs.stringifyUrl(
    {
      url: `${BASE_URL}/${endpoint}`,
      query: params,
    },
    { skipEmptyString: true, skipNull: true }
  );

  const res = await fetch(url, {
    headers: {
      'x-cg-demo-api-key': API_KEY,
      'Content-Type': 'application/json',
    } as Record<string, string>,
    next: { revalidate },
  });

  if (!res.ok) {
    const errorBody: CoinGeckoErrorBody = await res.json().catch(() => ({}));
    throw new Error(
      `API error: ${res.status} ${errorBody.error || res.statusText}`
    );
  }

  return res.json();
}
