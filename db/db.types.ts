export type Price = {
  value: number;
  updateDate: Date;
};

export type Stock = {
  id: string;
  latestUpdate: string;
  currency: string;
  priceHistory: {
    history: Array<Price>;
    m1: number | null;
    m3: number | null;
    m6: number | null;
    m12: number | null;
    m24: number | null;
    m60: number | null;
    m120: number | null;
  };
};

export type Company = {
  name: string;
  industry: number;
  country: string;
  orgId: string;
  owners: Array<User | null>;
};

export type Holding = {
  stock: Stock | null;
  id: string;
  count: number;
  company: Company | null;
};

export type User = {
  name: string;
  holdings: Array<Holding | null>;
  id: string;
};
