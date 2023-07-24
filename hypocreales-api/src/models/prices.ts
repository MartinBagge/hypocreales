import { Schema, model } from "mongoose";
import { PriceDay } from "../types/prices";

const priceSchema = new Schema<PriceDay>({
  _id: {
    date: Date,
  },
  hour_prices: {
    dkk_kwh: Number,
    time_start: Date,
    time_end: Date,
  },
});

export const MongoPrice = model<PriceDay>("Price", priceSchema);
