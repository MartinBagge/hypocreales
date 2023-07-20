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

export type PriceDay = {
  _id: string;
  date: Date;
  hour_prices: [Price];
};
