import { MongoPowerPrice } from "../models/power_prices";
import { PriceDay } from "../types/prices";
import { MongoTransportPrice } from "../models/transport_prices";
import { ControllerInfo } from "../types/edge-controllers";

export async function check_price(
  day: Date,
  tomorrow: Date,
  month: number,
  hour: number,
  controller: ControllerInfo
): Promise<string> {
  const supplier_promise = MongoTransportPrice.findOne({
    _id: controller.supplier,
  });

  const pricing: PriceDay | null = await MongoPowerPrice.findOne({
    _id: {
      $gte: day.setHours(0, 0, 0, 0),
      $lt: tomorrow.setHours(0, 0, 0, 0),
    },
  }).lean();
  if (!pricing) {
    return Promise.reject("Price not found");
  }

  const supplier = await supplier_promise.lean();
  if (!supplier) {
    return Promise.reject("supplier not found");
  }
  let tarif = supplier.prices.winter;
  if (month > 3 && month < 10) {
    tarif = supplier.prices.summer;
  } // summer is defined to be between april and october - from "vores elnet", may be an idea to move it to db in case it is not the same for every supplier
  if (!tarif || typeof tarif == "boolean") {
    return Promise.reject("tarif error");
  }

  if (
    (pricing.hour_prices[hour].dkk_kwh + tarif[hour]) * 1.25 <
      controller.settings.price_threshold &&
    !controller.settings.no_start_hours.includes(hour)
  ) {
    return Promise.resolve("start");
  }
  return Promise.resolve("stop");
}

export async function check_alway_on_hours(
  hour: number,
  controller: ControllerInfo
): Promise<string> {

  if (controller.settings.always_on_hours.includes(hour)) {
    return Promise.resolve("start");
  }
  return Promise.reject("not in always_on_hours");
}
