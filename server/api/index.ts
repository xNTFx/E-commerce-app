import dotenv from "dotenv";

dotenv.config();

import express from "express";
import cors from "cors";
import { connectDB } from "./config/database";
import { corsOptions } from "./config/corsConfig";
import routes from "./Routes/routes";
import setupPaymentRoutes from "./payment";

const app = express();
app.use(cors(corsOptions));
app.use(express.json());

connectDB();

app.use("/", routes);
setupPaymentRoutes(app);

app.get("/", (req, res) => {
  res.send("Hello, World!");
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.info(`Server running on port ${PORT}`));
