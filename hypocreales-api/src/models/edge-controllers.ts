import { Schema, model, Types } from "mongoose";
import { ControllerInfo } from "../types/edge-controllers";


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

export const MongoController = model<ControllerInfo>("Controller", controllerSchema);
