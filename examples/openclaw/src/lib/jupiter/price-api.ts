import {
  createJupiterRetryPolicy,
  retryWithPolicy,
} from "../../utils/retry.ts";

const JUPITER_PRICE_BASE_URL = "https://lite-api.jup.ag";

export interface PriceQuote {
  usdPrice: number;
}

export interface PriceApi {
  getPrices(mints: string[]): Promise<Record<string, PriceQuote>>;
}

export function createPriceApi(fetcher: typeof fetch = fetch): PriceApi {
  return {
    getPrices: async (mints) => {
      const params = new URLSearchParams({ ids: mints.join(",") });
      const policy = createJupiterRetryPolicy({ label: "Jupiter Price API" });

      return await retryWithPolicy(async () => {
        const response = await fetcher(
          `${JUPITER_PRICE_BASE_URL}/price/v3?${params.toString()}`,
        );

        if (!response.ok) {
          throw new Error(`Price API request failed: HTTP_${response.status}`);
        }

        return await response.json() as Record<string, PriceQuote>;
      }, policy);
    },
  };
}
