import { Types } from "mongoose";

export type ControllerInfo = {
  _id: string; // mac
  settings: {
    price_threshold: number;
    no_start_hours: [number];
    always_on_hours: [number];
  };
  supplier: Types.ObjectId;
};

export type ControllerLog = {
  _id?: Types.ObjectId;
  mac: string;
  status_code: number;
  msg: string;
};
