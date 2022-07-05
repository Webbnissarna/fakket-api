export type Stock = {
  companyName: string,
  priceHistory: number[],
  currentPrice: number,
  currency: string,
  country: string,
  id: string,
  latestUpdate: string,
  industry: number,
}

export type User = {
  id: string
  name: string
  holdings: Stock['id'][]
}

export const users: User[] = [
  {
    id: "X1231296A",
    name: "André Åström 1",
    holdings: ["S078121"],
  },
  {
    id: "X1231296B",
    name: "André Åström 2",
    holdings: ["S078121"],
  },
  {
    id: "X1231296C",
    name: "André Åström 3",
    holdings: ["S078121"],
  },
  {
    id: "X1231296D",
    name: "André Åström 4",
    holdings: ["S078365"],
  },
  {
    id: "X1231296E",
    name: "André Åström 5",
    holdings: ["S078121", "S078365"],
  },
  {
    id: "X1231296F",
    name: "André Åström 6",
    holdings: ["S078121"],
  },
  {
    id: "X1231296G",
    name: "André Åström 7",
    holdings: ["S078121"],
  },
  {
    id: "X1231296H",
    name: "André Åström 8",
    holdings: ["S078121", "S078365"],
  },
  {
    id: "X1231296I",
    name: "André Åström 9",
    holdings: ["S078365"],
  },
  {
    id: "X1231296J",
    name: "André Åström 10",
    holdings: [{
      companyName: "Future infinite",
      priceHistory: [10000, 9650, 9320, 6432, 8921, 11921],
      currentPrice: 11921,
      currency: "SEK",
      country: "Sweden",
      id: "S078121",
      latestUpdate: "2022-05-15T10:41:37.604Z",
      industry: 0,
      owner: this
    }],
  },
  {
    id: "X1231296K",
    name: "André Åström 11",
    holdings: [{
      companyName: "Future infinite",
      priceHistory: [10000, 9650, 9320, 6432, 8921, 11921],
      currentPrice: 11921,
      currency: "SEK",
      country: "Sweden",
      id: "S078121",
      latestUpdate: "2022-05-15T10:41:37.604Z",
      industry: 0,
    }],
  },
];
export const stocks: Stock[] = [
  {
    companyName: "Future infinite",
    priceHistory: [10000, 9650, 9320, 6432, 8921, 11921],
    currentPrice: 11921,
    currency: "SEK",
    country: "Sweden",
    id: "S078121",
    latestUpdate: "2022-05-15T10:41:37.604Z",
    industry: 0,
  },
  {
    companyName: "Food for All",
    priceHistory: [10000, 11021, 12001, 10021, 11921, 12876],
    currentPrice: 12876,
    currency: "SEK",
    country: "Sweden",
    id: "S078365",
    latestUpdate: "2022-05-15T10:48:03.692Z",
    industry: 1,
  },
];
