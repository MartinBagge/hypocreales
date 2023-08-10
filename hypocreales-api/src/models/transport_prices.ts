import { Schema, model } from "mongoose";
import { TransportPrice } from "../types/prices";

const transportPriceSchema = new Schema<TransportPrice>({
  supplier: String,
  price_update: Date,
  prices: {
    summer: [Number],
    winter: [Number],
  },
});

export const MongoTransportPrice = model<TransportPrice>(
  "transport-prices",
  transportPriceSchema
);
