import { users, holdings } from "../db.ts";
import { getHoldingStock } from "../stock/stock.ts";
import { getCompany } from "../company/company.ts";
import { Holding } from "../db.types.ts";
import { checkDepth } from "../error.ts";
import { GQLError } from "https://deno.land/x/oak_graphql@0.6.3/mod.ts";
export function getUser(userId: string, depth: number) {
  if (!checkDepth(depth)) {
    throw new GQLError(
      `Max query depth of ${Deno.env.get("MAX_QUERY_DEPTH")} reached.`
    );
  } else {
    const potentialUser = users.find((user) => user.id === userId);
    if (potentialUser) {
      return {
        ...potentialUser,
        holdings: getUserHoldings(potentialUser.holdings, depth),
      };
    }
    return null;
  }
}

export function getUsers(limit: number, depth: number) {
  if (!checkDepth(depth)) {
    throw new GQLError(
      `Max query depth of ${Deno.env.get("MAX_QUERY_DEPTH")} reached.`
    );
  } else {
    const usersWithHoldings = users.slice(0, limit).map((user) => {
      const userHoldings = getUserHoldings(user.holdings, depth);
      return {
        ...user,
        holdings: userHoldings,
      };
    });

    return usersWithHoldings;
  }
}

function getUserHoldings(
  userHoldings: Array<string>,
  depth: number
): Array<Holding | null> {
  if (checkDepth(depth)) {
    throw new GQLError(
      `Max query depth of ${Deno.env.get("MAX_QUERY_DEPTH")} reached.`
    );
  } else {
    return userHoldings
      .map((holding) => {
        return holdings.find((allHoldings) => allHoldings.id === holding);
      })
      .filter((holding) => holding !== undefined)
      .map((holding) => {
        if (!holding) {
          return null;
        }
        return {
          ...holding,
          stock: getHoldingStock(holding.stockId, depth),
          company: getCompany(holding.company, depth),
        };
      });
  }
}
