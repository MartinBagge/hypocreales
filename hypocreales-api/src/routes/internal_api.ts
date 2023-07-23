import { Router } from "express";
import axios from "axios";
import { DataPull, PriceDay, Price } from "../types/prices";
import { MongoPrice } from "../models/prices";
import { ControllerInfo } from "../types/edge-controllers";
import { MongoController } from "../models/edge-controllers";
import * as mongoose from "mongoose";

async function mongo_connect() {
  if (mongoose.connection.readyState == 1) {
    return;
  }
  await mongoose.connect(process?.env?.MONGO ?? "");
  return;
}


const router = Router();

router.get("/pull", async (req, res) => {
  try {
    await mongo_connect();
    const today = new Date();
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);
    const price = await axios.get(
      `https://www.elprisenligenu.dk/api/v1/prices/${tomorrow.getFullYear()}/${tomorrow.getMonth() < 10 ? "0" : ""
      }${tomorrow.getMonth()}-${tomorrow.getDay() < 10 ? "0" : ""
      }${tomorrow.getDay()}_DK1.json`
    );
    console.log("just pulled data");
    if (price.status == 200) {
      const data = price.data as [DataPull];
      const prices: Price[] = [];
      data.forEach((d) => {
        prices.push({
          dkk_kwh: d.DKK_per_kWh,
          time_start: d.time_start,
          time_end: d.time_end,
        });
      });
      const mongoprice = new MongoPrice({
        _id: { date: new Date().setHours(0, 0, 0, 0) },
        hour_prices: prices,
      });
      await mongoprice.save();
    }
    res.status(200).send("pulled data");
  } catch (e: any){
    res.status(500).send("something went wrong   " + e.message);
  }
});

router.get("/start/:mac", async (req, res) => {
  await mongo_connect();
  const mac = req.params.mac;
  const controller: ControllerInfo | null = await MongoController.findOne({
    "_id.mac": mac,
  }).lean();
  if (!controller) {
    res.status(400).send("mac not found");
    return;
  }
  const thresh = controller.settings.price_threshold;
  const day = new Date();
  const hour = day.getHours();
  const pricing: PriceDay | null = await MongoPrice.findOne({
    "_id.date": day.setHours(0, 0, 0, 0),
  }).lean();
  if (!pricing) {
    res.status(500).send("price not found");
    return;
  }
  if (pricing.hour_prices[hour].dkk_kwh < thresh) {
    res.status(200).send("true");
    return;
  }
  res.status(200).send("false");
  return;
});

export default router;
