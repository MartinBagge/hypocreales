export type ControllerInfo = {
  _id: {
    mac: string,
    user_id: string
  }
  settings: {
    price_threshold: number;
    no_start_hours: [number];
  };
};
