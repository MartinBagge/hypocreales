import "dotenv/config";

import express from "express";
import router from "./routes/internal_api";

import serverless from "serverless-http";

const app = express();

app.use(router);

app.get("/", (req, res) => {
  res.status(200).send("What are you doing here?");
});

if (process?.env?.TEST) {
  app.listen(50000);
}

export const handler = serverless(app);
