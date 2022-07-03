import { gql } from "https://deno.land/x/oak_graphql@0.6.3/mod.ts";

export const GQLUser = gql`
  type User {
    name: String!
    holdings: [Holding!]
    id: String!
  }
`;
export const GQLPriceHistory = gql`
  type PriceHistory {
    history: [Price!]
    m1: Float
    m3: Float
    m6: Float
    m12: Float
    m24: Float
    m60: Float
    m120: Float
  }
`;
export const GQLHolding = gql`
  type Holding {
    company: Company
    count: Int!
    stock: Stock!
    id: String!
  }
`;
export const GQLCompany = gql`
  type Company {
    name: String!
    industry: Int!
    country: String!
    orgId: String!
    owners: [User!]!
  }
`;
export const GQLStock = gql`
  type Stock {
    id: String!
    latestUpdate: String!
    currency: String!
    priceHistory: PriceHistory!
  }
`;
export const GQLPrice = gql`
  type Price {
    value: Float!
    updateDate: String!
  }
`;
