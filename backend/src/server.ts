import express from "express";
import cors from "cors";
import apiRouter from "./api.js";

const app = express();
const PORT = parseInt(process.env.PORT || "3001");

app.use(cors());
app.use(express.json());
app.use("/api/v1", apiRouter);

app.get("/health", (_req, res) => {
  res.json({ status: "ok", service: "liquiddexscan-backend" });
});

app.listen(PORT, () => {
  console.log(`LiquidDexScan API running on :${PORT}`);
});
