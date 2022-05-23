import { Application, Router } from "https://deno.land/x/oak@v10.5.1/mod.ts";

import {
  applyGraphQL,
  gql,
} from "https://deno.land/x/oak_graphql@0.6.3/mod.ts";

import { users, stocks } from "./db.ts";

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
  type Stock {
    companyName: String
    priceHistory: [Int]
    country: String
    id: String
    latestUpdate: String
    industry: Int
    currentPrice: Int
    currency: String
  }
  type User {
    holdings: [Stock]
    name: String
    id: String
  }
  type Query {
    getUser(id: String!): User
    getUsers: [User]
    getStock(id: String!): Stock
    getStocks: [Stock]
  }
`;

const resolvers = {
  Query: {
    getUser: (_: unknown, { id }: { id: string }, context: unknown) => {
      console.log("id", id, context);
    },
    getUsers: () => {
      return users;
    },
    getStock: (_: unknown, { id }: { id: string }) => {
      const filteredStocks = stocks.filter((stockA) => stockA.id === id);
      if (filteredStocks.length > 0) {
        return filteredStocks[0];
      } else {
        return null;
      }
    },
    getStocks: () => {
      return stocks;
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
