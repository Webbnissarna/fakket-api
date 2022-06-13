import { gql } from "https://deno.land/x/oak_graphql@0.6.3/mod.ts";

export type Stock = {
  id: string;
  latestUpdate: string;
  priceHistory: Array<number>;
};
export const GQLStock = gql`
  type Stock {
    id: String!
    latestUpdate: String!
    priceHistory: [Float!]!
  }
`;
export type Company = {
  name: string;
  industry: number;
  country: string;
  orgId: string;
  owners: Array<User>;
};
export const GQLCompany = gql`
  type Company {
    name: String!
    industry: Int!
    country: String!
    orgId: String!
    owners: [User!]!
  }
`;
export type Holding = {
  stockId: string;
  id: string;
  count: number;
  company: Company;
};
export const GQLHolding = gql`
  type Holding {
    company: Company!
    count: Int!
    stockId: String!
    id: String!
  }
`;
export type User = {
  name: string;
  holdings: Array<string>;
  id: string;
};
export const GQLUser = gql`
  type User {
    name: String!
    holdings: [Holding!]!
    id: String!
  }
`;
