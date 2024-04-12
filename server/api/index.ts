import dotenv from "dotenv";
dotenv.config();
import express from "express";
import cors from "cors";
import setupPaymentRoutes from "./payment.js";
import mongoDB from "./mongoDBQueries.js";
import helmet from "helmet";

const app = express();


app.use(express.json());
app.use(cors({
  origin: '*',
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true
}));

// app.use(
//   helmet({
//     contentSecurityPolicy: {
//       directives: {
//         defaultSrc: ["'self'"],
//         scriptSrc: ["'self'", "'unsafe-inline'", "https://js.stripe.com"],
//         connectSrc: ["'self'", "https://api.example.com"],
//         imgSrc: ["'self'", "data:"],
//         styleSrc: ["'self'", "'unsafe-inline'"],
//       },
//     },
//   })
// );

mongoDB(app);
setupPaymentRoutes(app);

app.get("/", (req, res) => {
  res.send("Hello, World!");
});

app.get("/ala", (req, res) => {
  res.send("Hello, World ala!");
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
