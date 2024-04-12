import express from "express";
import setupPaymentRoutes from "./payment.js";
import mongoDB from "./mongoDBQueries.js";

const app = express();

app.use(express.json());

mongoDB(app);
setupPaymentRoutes(app);

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
