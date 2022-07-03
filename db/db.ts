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
    priceHistory: [
      { value: 60, updateDate: "2022-05-20T10:48:03.692Z" },
      { value: 68, updateDate: "2022-05-19T10:48:03.692Z" },
      { value: 45, updateDate: "2022-05-18T10:48:03.692Z" },
      { value: 57, updateDate: "2022-05-17T10:48:03.692Z" },
      { value: 67, updateDate: "2022-05-16T10:48:03.692Z" },
      { value: 56, updateDate: "2022-05-15T10:48:03.692Z" },
    ],
    currency: "SEK",
    id: "S078121",
  },
  {
    priceHistory: [
      { value: 40, updateDate: "2022-05-20T10:48:03.692Z" },
      { value: 43, updateDate: "2022-05-19T10:48:03.692Z" },
      { value: 41, updateDate: "2022-05-18T10:48:03.692Z" },
      { value: 35, updateDate: "2022-05-17T10:48:03.692Z" },
      { value: 37, updateDate: "2022-05-16T10:48:03.692Z" },
      { value: 34, updateDate: "2022-05-15T10:48:03.692Z" },
    ],
    currency: "SEK",
    id: "S078365",
  },
];
export const Prices = [
  { value: 60, updateDate: "2022-05-20T10:48:03.692Z", stockId: "S078121" },
  { value: 68, updateDate: "2022-05-19T10:48:03.692Z", stockId: "S078121" },
  { value: 45, updateDate: "2022-05-18T10:48:03.692Z", stockId: "S078121" },
  { value: 57, updateDate: "2022-05-17T10:48:03.692Z", stockId: "S078121" },
  { value: 67, updateDate: "2022-05-16T10:48:03.692Z", stockId: "S078121" },
  { value: 56, updateDate: "2022-05-15T10:48:03.692Z", stockId: "S078121" },
];
