import { Types } from "mongoose";

export type ControllerInfo = {
  _id: string; // mac
  settings: {
    price_threshold: number;
    no_start_hours: [number];
  };
  supplier: Types.ObjectId;
};
