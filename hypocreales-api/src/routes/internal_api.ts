import { Router } from "express";
import axios from "axios";
import { DataPull, Price } from "../types/prices";
import { MongoPrice } from "../models/prices";
const router = Router();

router.get("/pull", async (req, res) => {
  const today = new Date();
  const tomorrow = new Date(today);
  tomorrow.setDate(tomorrow.getDate() + 1);
  const price = await axios.get(
    `https://www.elprisenligenu.dk/api/v1/prices/${tomorrow.getFullYear()}/${
      tomorrow.getMonth() < 10 ? "0" : ""
    }${tomorrow.getMonth()}-${
      tomorrow.getDay() < 10 ? "0" : ""
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
      date: new Date().setHours(0, 0, 0, 0),
      hour_prices: prices,
    });
    await mongoprice.save();
  }
  res.status(200).send("pulled data");
});

router.get("/start/:mac", (req, res) => {
    const mac = req.params.mac
});

export default router;
