import { Application, Router } from "https://deno.land/x/oak@v10.5.1/mod.ts";

import {
  applyGraphQL,
  gql,
} from "https://deno.land/x/oak_graphql@0.6.3/mod.ts";

import { dotEnvConfig } from "./deps.ts";

import { stocks } from "./db/db.ts";
import { getHoldingStock } from "./db/stock/stock.ts";
import { getUser, getUsers } from "./db/user/user.ts";
import {
  GQLCompany,
  GQLHolding,
  GQLStock,
  GQLUser,
  GQLPriceHistory,
  GQLPrice,
} from "./db/db.types.gql.ts";

dotEnvConfig({ export: true, safe: true, allowEmptyValues: true });

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
  ${GQLPrice}
  ${GQLPriceHistory}
  type Query {
    getUser(id: String!): User
    getUsers(limit: Int!): [User]!
    getStock(id: String!): Stock
    getStocks(limit: Int!): [Stock]!
  }
`;

const resolvers = {
  Query: {
    getUser: (_: unknown, { id }: { id: string }) => {
      return getUser(id, 0);
    },
    getUsers: (_: unknown, { limit }: { limit: number }) => {
      return getUsers(limit, 0);
    },
    getStock: (_: unknown, { id }: { id: string }) => {
      const potentialStock = getHoldingStock(id, 0);
      return potentialStock ? potentialStock : null;
    },
    getStocks: (_: unknown, { limit }: { limit: number }) => {
      const potStocks = stocks
        .slice(0, limit)
        .map((stock) => getHoldingStock(stock.id, 0));
      console.log(potStocks);
      return potStocks;
    },
  },
};

const GraphQLService = await applyGraphQL<Router>({
  Router,
  typeDefs: types,
  resolvers: resolvers,
  context: () => {
    return { user: "admin" };
  },
});

app.use(GraphQLService.routes(), GraphQLService.allowedMethods());

console.log("Server start");
await app.listen({ port: 8080 });
