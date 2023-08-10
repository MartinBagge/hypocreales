import { Schema, model } from "mongoose";
import { ControllerInfo } from "../types/edge-controllers";

const controllerSchema = new Schema<ControllerInfo>({
  _id: String, // mac
  settings: {
    price_threshold: Number,
    no_start_hours: [Number],
  },
  supplier: { type: Schema.Types.ObjectId, ref: "MongoTransportPrice" },
});

export const MongoController = model<ControllerInfo>(
  "controller",
  controllerSchema
);
