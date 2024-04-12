import express from "express";
import cors from "cors";
import setupPaymentRoutes from "./payment.js";
import mongoDB from "./mongoDBQueries.js";

const app = express();
app.use(express.json());
app.use(cors({
    origin: 'https://shopping-page-client-cn8a6er1n-ntfvs-projects.vercel.app'
  }));
mongoDB(app);
setupPaymentRoutes(app);

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
