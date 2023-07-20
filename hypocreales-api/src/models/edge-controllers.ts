import { Schema, model, Types } from "mongoose";
import { Price, PriceDay } from "../types/prices";
import { ControllerInfo } from "../types/edge-controllers";

const priceSchema = new Schema<PriceDay>({
  _id: Types.ObjectId,
  date: Date,
  hour_prices: {
    dkk_kwh: Number,
    time_start: Date,
    time_end: Date,
  },
});

const controllerSchema = new Schema<ControllerInfo>({
  _id: {
    mac: String,
    user_id: Types.ObjectId,
  },
  settings: {
    price_threshold: Number,
    no_start_hours: [Number],
  }
})

export const MongoPrice = model<PriceDay>("Price", priceSchema);
export const MongoController = model<ControllerInfo>("Controller", controllerSchema);
