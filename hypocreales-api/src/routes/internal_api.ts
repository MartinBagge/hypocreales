import { Router } from "express";
import axios from "axios";
import { DataPull, PriceDay, Price } from "../types/prices";
import { MongoPowerPrice } from "../models/power_prices";
import { ControllerInfo, ControllerLog } from "../types/edge-controllers";
import {
  MongoController,
  MongoControllerLog,
} from "../models/edge-controllers";
import { MongoTransportPrice } from "../models/transport_prices";
import { check_price, check_alway_on_hours } from "../utils/activation_checks";
import * as mongoose from "mongoose";

async function mongo_connect() {
  if (mongoose.connection?.readyState == 1) {
    return;
  }
  await mongoose.connect(process?.env?.MONGO_URL ?? "");
  return;
}

const router = Router();

router.get("/pull", async (req, res) => {
  try {
    await mongo_connect();
  } catch (e: any) {
    res
      .status(500)
      .send(`\n mongo... \n ${e.message}  \n  ${process?.env?.MONGO_URL} \n`);
    return;
  }
  try {
    console.log("before price get");
    const today = new Date();
    const tomorrow = new Date(today);
    tomorrow.setDate(today.getDate() + 1);
    const url = `https://www.elprisenligenu.dk/api/v1/prices/${tomorrow.getFullYear()}/${
      tomorrow.getMonth() + 1 < 10 ? "0" : ""
    }${tomorrow.getMonth() + 1}-${
      tomorrow.getDate() < 10 ? "0" : ""
    }${tomorrow.getDate()}_DK1.json`;
    const price = await axios.get(url);
    if (price.status >= 200 && price.status < 300) {
      const data = price.data as [DataPull];
      let prices: Price[] = [];
      data.forEach((d) => {
        prices.push({
          dkk_kwh: d.DKK_per_kWh,
          time_start: d.time_start,
          time_end: d.time_end,
        });
      });
      if (!prices) {
        res.status(500).send(`no data     ${data}`);
        return;
      }
      console.log("saving to mongo");
      const mongoprice = new MongoPowerPrice({
        _id: tomorrow.setHours(12, 0, 0, 0),
        hour_prices: prices,
      });
      await mongoprice.save();
    }
    res.status(200).send(`pulled data`);
  } catch (e: any) {
    res.status(500).send(`something went wrong  ${e.message}`);
  }
  return;
});

router.get("/activate/hexmac/:mac", async (req, res) => {
  await mongo_connect();
  const mac = req.params.mac;
  const controller: ControllerInfo | null = await MongoController.findOne({
    "_id.mac": mac,
  }).lean();
  if (!controller) {
    res.status(400).send("mac not found");
    return;
  }
  //async as we want this to run while we get prices
  const supplier_promise = MongoTransportPrice.findOne({
    _id: controller.supplier,
  });

  const day = new Date();
  const tomorrow = new Date(day);
  tomorrow.setDate(day.getDate() + 1);
  const time_res = await axios.get(
    "http://worldtimeapi.org/api/timezone/Europe/Berlin"
  );
  const datetime = time_res.data.datetime.split("T");
  const month = parseInt(datetime[0].split("-")[1]);
  const hour = parseInt(datetime[1].split(":")[0]);

  await check_alway_on_hours(hour, controller)
    .then((val: string) => {
      res.status(200).send({ state: val });
      return;
    })
    .catch(() => {
      check_price(day, tomorrow, month, hour, controller)
        .then((val: string) => {
          res.status(200).send({ state: val });
          return;
        })
        .catch((error: string) => {
          res.status(500).send({ error });
          return;
        });
      return;
    });

  return;
});

router.post("/log/heartbeat", async (req, res) => {
  try {
    await mongo_connect();
    const data: ControllerLog = req.body;
    if (!(await MongoController.exists({ "_id.mac": data.mac }))) {
      res.status(400).send("mac does not exist");
      return;
    }

    const log = new MongoControllerLog(data);

    await log.save();

    res.status(200).send("log created");
  } catch (e: any) {
    res.status(500).send("nope not working");
    console.log(e);
  }
  return;
});

export default router;
