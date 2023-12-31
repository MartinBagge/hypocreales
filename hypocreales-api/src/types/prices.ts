export type DataPull = {
  DKK_per_kWh: number;
  EUR_per_kWh: number;
  EXR: number;
  time_start: Date;
  time_end: Date;
};

export type Price = {
  dkk_kwh: number;
  time_start: Date;
  time_end: Date;
};

export type TransportPrice = {
  supplier: string;
  price_update: Date;
  prices: {
    summer: [number];
    winter: [number];
  };
};

export type PriceDay = {
  _id: Date;
  hour_prices: [Price];
};
