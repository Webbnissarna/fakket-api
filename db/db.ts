import { Client } from "https://deno.land/x/postgres@v0.15.0/mod.ts";
import { Stock, User } from "./db.types.ts";

export function addStock(stock: Stock) {
  console.log(stock);
  const client = new Client();
  client.end();
}
export function addUser(user: User) {
  console.log(user);
}

// MOCK
export const users = [
  {
    id: "X1231296A",
    name: "André Åström",
    holdings: ["H31239013"],
  },
];
export const holdings = [
  {
    company: "890123-7421",
    count: 5,
    stockId: "S078121",
    id: "H31239013",
  },
];
export const companies = [
  {
    name: "Future infinite",
    country: "Sweden",
    orgId: "890123-7421",
    industry: 0,
    owners: ["X1231296A"],
  },
  {
    name: "Food for All",
    country: "Sweden",
    orgId: "138314-8542",
    industry: 1,
    owners: [],
  },
];
export const stocks = [
  {
    priceHistory: [10000, 9650, 9320, 6432, 8921, 11921],
    currency: "SEK",
    id: "S078121",
    latestUpdate: "2022-05-15T10:41:37.604Z",
  },
  {
    priceHistory: [10000, 11021, 12001, 10021, 11921, 12876],
    currency: "SEK",
    id: "S078365",
    latestUpdate: "2022-05-15T10:48:03.692Z",
  },
];
