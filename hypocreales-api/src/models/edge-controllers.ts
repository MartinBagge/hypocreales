import { Schema, model } from "mongoose";
import { ControllerInfo, ControllerLog } from "../types/edge-controllers";

const controllerSchema = new Schema<ControllerInfo>({
  _id: String, // mac
  settings: {
    price_threshold: Number,
    no_start_hours: [Number],
  },
  supplier: { type: Schema.Types.ObjectId, ref: "MongoTransportPrice" },
});

const logSchema = new Schema<ControllerLog>({
  mac: String,
  status_code: Number,
  msg: String,
});

export const MongoController = model<ControllerInfo>(
  "controller",
  controllerSchema
);

export const MongoControllerLog = model<ControllerLog>(
  "controllerLog",
  logSchema
);
