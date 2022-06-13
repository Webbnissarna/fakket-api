import { Application, Router } from "https://deno.land/x/oak@v10.5.1/mod.ts";

import {
  applyGraphQL,
  gql,
} from "https://deno.land/x/oak_graphql@0.6.3/mod.ts";

import { users, stocks, holdings, companies } from "./db/db.ts";
import { GQLCompany, GQLHolding, GQLStock, GQLUser } from "./db/db.types.ts";

const app = new Application();

app.use(async (ctx, next) => {
  await next();
  const rt = ctx.response.headers.get("X-Response-Time");
  console.log(`${ctx.request.method} ${ctx.request.url} - ${rt}`);
});
app.use(async (ctx, next) => {
  const start = Date.now();
  await next();
  const ms = Date.now() - start;
  ctx.response.headers.set("X-Response-Time", `${ms}ms`);
});

const types = gql`
  ${GQLCompany},
  ${GQLHolding},
  ${GQLStock},
  ${GQLUser}
  type Query {
    getUser(id: String!): User
    getUsers(limit: Int!): [User]!
    getStock(id: String!): Stock
    getStocks(limit: Int!): [Stock]!
  }
`;

function getUserHoldings(userHoldings: Array<string>) {
  return userHoldings
    .map((holding) => {
      return holdings.find((allHoldings) => allHoldings.id === holding);
    })
    .filter((holding) => holding !== undefined)
    .map((holding) => {
      return {
        ...holding,
        company:
          companies.find((company) => company.orgId === holding?.company) ??
          null,
      };
    });
}

const resolvers = {
  Query: {
    getUser: (_: unknown, { id }: { id: string }) => {
      const potentialUser = users.find((user) => user.id === id);
      if (potentialUser) {
        return {
          ...potentialUser,
          holdings: getUserHoldings(potentialUser.holdings),
        };
      }
      return null;
    },
    getUsers: (_: unknown, { limit }: { limit: number }) => {
      const usersWithHoldings = users.slice(0, limit).map((user) => {
        const userHoldings = getUserHoldings(user.holdings);
        return {
          ...user,
          holdings: userHoldings,
        };
      });

      return usersWithHoldings;
    },
    getStock: (_: unknown, { id }: { id: string }) => {
      const potentialStock = stocks.find((stock) => stock.id === id);
      return potentialStock ? potentialStock : null;
    },
    getStocks: (_: unknown, { limit }: { limit: number }) => {
      return stocks.slice(0, limit);
    },
  },
};

const GraphQLService = await applyGraphQL<Router>({
  Router,
  typeDefs: types,
  resolvers: resolvers,
  context: (ctx) => {
    // User context
    return { user: "admin" };
  },
});

app.use(GraphQLService.routes(), GraphQLService.allowedMethods());

console.log("Server start");
await app.listen({ port: 8080 });
