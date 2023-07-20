import express from "express";
import { connect } from "mongoose";
import router from "./routes/internal_api";
const app = express();
const port = 5000;

app.use(router);

app.get("/", (req, res) => {
  res.send("Hello World!");
});

app.listen(port, () => {
  return console.log(`Express is listening at http://localhost:${port}`);
});

(async () => {
  await connect(
    "xxxxxxxx"
  );
  console.log("DB connected");
})();
