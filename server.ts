import { Application, Router } from "https://deno.land/x/oak@v10.5.1/mod.ts";

import {
  applyGraphQL,
  gql,
} from "https://deno.land/x/oak_graphql@0.6.4/mod.ts";

import * as base64 from "https://deno.land/x/base64to@v1.0.0/mod.ts";

import { users, stocks } from "./db.ts";

import type { UserData, StockData } from './db.ts';

type Stock = StockData

type User = Omit<UserData, 'holdings'> & {
  holdings: Stock[]
}

type ConnectionCursor = string;


const PREFIX = 'arrayconnection:';

function offsetToCursor(offset: number): ConnectionCursor {
  return base64.encode64(PREFIX + offset.toString());
}

/**
 * Extracts the offset from the cursor string.
 */
 export function cursorToOffset(cursor: ConnectionCursor): number {
  return parseInt(base64.decode64ToString(cursor).substring(PREFIX.length), 10);
}

/**
 * Given an optional cursor and a default offset, returns the offset
 * to use; if the cursor contains a valid offset, that will be used,
 * otherwise it will be the default.
 */
 export function getOffsetWithDefault(
  cursor: ConnectionCursor | null | undefined,
  defaultOffset: number,
): number {
  if (typeof cursor !== 'string') {
    return defaultOffset;
  }
  const offset = cursorToOffset(cursor);
  return isNaN(offset) ? defaultOffset : offset;
}

/**
 * A type describing the arguments a connection field receives in GraphQL.
 */
 export interface ConnectionArguments {
  before?: ConnectionCursor | null;
  after?: ConnectionCursor | null;
  first?: number | null;
  last?: number | null;
}

interface ArraySliceMetaInfo {
  sliceStart: number;
  arrayLength: number;
}

/**
 * A type designed to be exposed as a `Edge` over GraphQL.
 */
 export interface Edge<T> {
  node: T;
  cursor: ConnectionCursor;
}

/**
 * A type designed to be exposed as `PageInfo` over GraphQL.
 */
 export interface PageInfo {
  startCursor: ConnectionCursor | null;
  endCursor: ConnectionCursor | null;
  hasPreviousPage: boolean;
  hasNextPage: boolean;
}

/**
 * A type designed to be exposed as a `Connection` over GraphQL.
 */
 export interface Connection<T> {
  edges: Array<Edge<T>>;
  pageInfo: PageInfo;
}

/**
 * Given a slice (subset) of an array, returns a connection object for use in
 * GraphQL.
 *
 * This function is similar to `connectionFromArray`, but is intended for use
 * cases where you know the cardinality of the connection, consider it too large
 * to materialize the entire array, and instead wish pass in a slice of the
 * total result large enough to cover the range specified in `args`.
 */
 export function connectionFromArraySlice<T>(
  arraySlice: ReadonlyArray<T>,
  args: ConnectionArguments,
  meta: ArraySliceMetaInfo,
): Connection<T> {
  const { after, before, first, last } = args;
  const { sliceStart, arrayLength } = meta;
  const sliceEnd = sliceStart + arraySlice.length;

  let startOffset = Math.max(sliceStart, 0);
  let endOffset = Math.min(sliceEnd, arrayLength);

  const afterOffset = getOffsetWithDefault(after, -1);
  if (0 <= afterOffset && afterOffset < arrayLength) {
    startOffset = Math.max(startOffset, afterOffset + 1);
  }

  const beforeOffset = getOffsetWithDefault(before, endOffset);
  if (0 <= beforeOffset && beforeOffset < arrayLength) {
    endOffset = Math.min(endOffset, beforeOffset);
  }

  if (typeof first === 'number') {
    if (first < 0) {
      throw new Error('Argument "first" must be a non-negative integer');
    }

    endOffset = Math.min(endOffset, startOffset + first);
  }
  if (typeof last === 'number') {
    if (last < 0) {
      throw new Error('Argument "last" must be a non-negative integer');
    }

    startOffset = Math.max(startOffset, endOffset - last);
  }

  // If supplied slice is too large, trim it down before mapping over it.
  const slice = arraySlice.slice(
    startOffset - sliceStart,
    endOffset - sliceStart,
  );

  const edges = slice.map((value, index) => ({
    cursor: offsetToCursor(startOffset + index),
    node: value,
  }));

  const firstEdge = edges[0];
  const lastEdge = edges[edges.length - 1];
  const lowerBound = after != null ? afterOffset + 1 : 0;
  const upperBound = before != null ? beforeOffset : arrayLength;
  return {
    edges,
    pageInfo: {
      startCursor: firstEdge ? firstEdge.cursor : null,
      endCursor: lastEdge ? lastEdge.cursor : null,
      hasPreviousPage:
        typeof last === 'number' ? startOffset > lowerBound : false,
      hasNextPage: typeof first === 'number' ? endOffset < upperBound : false,
    },
  };
}

/**
 * A simple function that accepts an array and connection arguments, and returns
 * a connection object for use in GraphQL. It uses array offsets as pagination,
 * so pagination will only work if the array is static.
 */
 export function connectionFromArray<T>(
  data: ReadonlyArray<T>,
  args: ConnectionArguments,
): Connection<T> {
  return connectionFromArraySlice(data, args, {
    sliceStart: 0,
    arrayLength: data.length,
  });
}

enum OrderByDirection {
  ASC = "ASC",
  DESC = "DESC",
}

type OrderByArgs = {
  direction: OrderByDirection[]
  field: string[]
}

export type ConnectionArgs<T> = {
  after?: string
  before: never
  first: number
  last: never
  orderBy?: OrderByArgs
  where?: T
} | {
  after: never
  before?: string
  first: never
  last: number
  orderBy?: OrderByArgs
  where?: T
}

type WhereArgs = {
  contains: string
  eq: string
  endsWith: string
  gt: number
  gte: number
  in: string[]
  lt: number
  lte: number
  nin: string[]
  not: string
  startsWith: string
}

type UserWhereInput = {
  id?: WhereArgs
}

type StockWhereInput = {
  id?: WhereArgs
}

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
  enum OrderByDirection {
    ASC
    DESC
  }

  input WhereFilterInput {
    contains: String
    eq: String
    endsWith: String
    gt: Int
    gte: Int
    in: [String]
    lt: Int
    lte: Int
    nin: [String]
    not: String
    startsWith: String
  }

  enum UserOrderByField {
    name
  }

  input UserOrderByInput {
    direction: [OrderByDirection] = DESC
    field: [UserOrderByField!]
  }

  input UserWhereInput {
    id: WhereFilterInput
  }

  enum StockOrderByField {
    companyName
  }

  input StockOrderByInput {
    direction: [OrderByDirection] = DESC
    field: [UserOrderByField!]
  }

  input StockWhereInput {
    id: WhereFilterInput
  }

  type PageInfo {
    count: Int
    endCursor: String
    hasNextPage: Boolean!
    hasPreviousPage: Boolean!
    startCursor: String
  }

  type UserEdge  {
    cursor: String!
    node: User!
  }

  type UserEdgeConnection {
    edges: [UserEdge]
    nodes: [User]
    pageInfo: PageInfo!
    totalCount: Int!
  }

  type StockEdge  {
    cursor: String!
    node: Stock!
  }

  type StockEdgeConnection {
    edges: [StockEdge]
    nodes: [Stock]
    pageInfo: PageInfo!
    totalCount: Int!
  }

  type Stock {
    companyName: String
    priceHistory: [Int]
    country: String
    id: String
    latestUpdate: String
    industry: Int
    currentPrice: Int
    currency: String
    owner: UserEdgeConnection!
  }

  type User {
    holdings: StockEdgeConnection!
    name: String
    id: String
  }

  type Query {
    getUser(id: String!): User
    getUsers: [User]
    users(
      after: String = "",
      before: String = "",
      first: Int = 10,
      last: Int,
      orderBy: UserOrderByInput,
      where: UserWhereInput
    ): UserEdgeConnection!
    getStock(id: String!): Stock
    getStocks: [Stock]
    stocks(
      after: String = "",
      before: String = "",
      first: Int = 10,
      last: Int,
      orderBy: StockOrderByInput,
      where: StockWhereInput
    ): StockEdgeConnection!
  }
`;

const resolvers = {
  Query: {
    getUser: (_: unknown, { id }: { id: string }, context: unknown) => {
      console.log("id", id, context);
      resolveTheUser(uid)
    },
    getUsers: () => {
      return users;
    },
    users: (source: unknown, args: ConnectionArgs<UserWhereInput>, context: unknown) => {
      console.log({args})

      const { after, first } = args

      const totalCount = users.length;

      const data = users.map(user => {
        const userStocks = stocks.filter(stock => user.holdings.includes(stock.id));
        const finalStocks = userStocks.map(stock => {
          const usersWithStock = users.filter(user => user.holdings.includes(stock.id));
          return Object.assign({}, stock, {
            owner: connectionFromArray(usersWithStock, {})
          })
        })
        return Object.assign({}, user, {
          holdings: connectionFromArray(finalStocks, {})
        })
      })

      const { edges, pageInfo } = connectionFromArray(
        data,
        {
          after,
          first,
        }
      );
      // const offset = after ? cursorToOffset(after) + 1 : 0
      // const { edges, pageInfo } = connectionFromArraySlice(
      //   users,
      //   {
      //     after,
      //     first,
      //   },
      //   {
      //     sliceStart: offset,
      //     arrayLength: totalCount,
      //   }
      // );

      const nodes = edges.map(({ node }) => node)

      return {
        edges,
        nodes,
        pageInfo: {
          ...pageInfo,
          count: edges.length || 0
        },
        totalCount,
      }
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
    stocks: (source: unknown, args: ConnectionArgs<StockWhereInput>, context: unknown) => {
      console.log({args})

      const { after, first } = args

      const data = stocks as Stock[];
      const totalCount = stocks.length;

      const { edges, pageInfo } = connectionFromArray(
        data,
        {
          after,
          first,
        }
      );
      // const offset = after ? cursorToOffset(after) + 1 : 0
      // const { edges, pageInfo } = connectionFromArraySlice(
      //   users,
      //   {
      //     after,
      //     first,
      //   },
      //   {
      //     sliceStart: offset,
      //     arrayLength: totalCount,
      //   }
      // );

      const nodes = edges.map(({ node }) => node)

      return {
        edges,
        nodes,
        pageInfo: {
          ...pageInfo,
          count: edges.length || 0
        },
        totalCount,
      }
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
