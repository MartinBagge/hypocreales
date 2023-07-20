import { Schema, model } from "mongoose";
import { Price, PriceDay } from "../types/prices";

const priceSchema = new Schema<PriceDay>({
  date: Date,
  hour_prices: {
    dkk_kwh: Number,
    time_start: Date,
    time_end: Date,
  },
});
export const MongoPrice = model<PriceDay>("Price", priceSchema);