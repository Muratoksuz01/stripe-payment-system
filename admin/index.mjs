import express from "express";
import rateLimit from "express-rate-limit";
import "dotenv/config";
import cors from "cors";
import { fileURLToPath } from "url";
import path from "path";
import { readdirSync } from "fs";
const app = express();
const limiter = rateLimit({
  windowMs: 5 * 60 * 1000, // 15 dk max 10 istek izin ver 
  max: 100,
  message: "Too many requests",
});
app.use(limiter);

const port = process.env.PORT || 8000;
app.use(cors({
  origin: "http://localhost:5173"
}));
app.use(express.json());

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const routesPath = path.resolve(__dirname, "./routes");
const routeFiles = readdirSync(routesPath);
routeFiles.map(async (file) => {
  const routeModule = await import(`./routes/${file}`);
  app.use("/", routeModule.default);
});

app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "index.html"));
});

app.listen(port, () => {
  console.log(`Server is running on ${port}`);
});
