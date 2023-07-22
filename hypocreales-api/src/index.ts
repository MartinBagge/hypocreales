import "dotenv/config";

import express from "express";
import { connect } from "mongoose";
import router from "./routes/internal_api";

import serverless from "serverless-http";

const app = express();
const port = process?.env?.PORT ?? 5000;

app.use(router);

app.get("/", (req, res) => {
  res.send("What are you doing here?");
});

if (process?.env?.ENVIRONMENT == "production") {
  exports.handler = serverless(app);
} else {
  app.listen(port, () => {
    return console.log(`Express is listening at http://localhost:${port}`);
  });
}

(async () => {
  await connect(process?.env?.MONGO ?? "");
  console.log("DB connected");
})();
