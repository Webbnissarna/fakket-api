import { stocks } from "../db.ts";
import { Stock } from "../db.types.ts";
import { checkDepth } from "../error.ts";
import { GQLError } from "https://deno.land/x/oak_graphql@0.6.3/mod.ts";
export function getHoldingStock(
  holdingStockId: string,
  depth: number
): Stock | null {
  if (!checkDepth(depth)) {
    return null;
    throw new GQLError(
      `Max query depth of ${Deno.env.get("MAX_QUERY_DEPTH")} reached.`
    );
  } else {
    const s = stocks.find((stock) => stock.id === holdingStockId);
    if (s) {
      const history = s.priceHistory.map((price) => {
        return { value: price.value, updateDate: new Date(price.updateDate) };
      });
      return {
        priceHistory: {
          history: history,
          ...calculateIntervals(history),
        },
        latestUpdate: s.priceHistory[0].updateDate,
        currency: s.currency,
        id: s.id,
      };
    } else return null;
  }
}
export function calculateIntervals(
  history: Array<{ value: number; updateDate: Date }>
) {
  const now = new Date();

  return {
    m1: null,
    m3: null,
    m6: null,
    m12: null,
    m24: null,
    m60: null,
    m120: null,
  };
}
