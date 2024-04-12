import express from "express";
import cors from "cors";
import setupPaymentRoutes from "./payment.js";
import mongoDB from "./mongoDBQueries.js";
import helmet from "helmet";

const app = express();

const corsOptions = {
    origin: "https://shopping-page-client.vercel.app", 
    methods: "GET, POST, PUT, DELETE, OPTIONS", 
    allowedHeaders: "Content-Type, Authorization", 
    credentials: true, 
    optionsSuccessStatus: 200 
};

app.use(express.json());
app.use(cors(corsOptions));

app.use(helmet({
    contentSecurityPolicy: {
        directives: {
            defaultSrc: ["'self'"],
            scriptSrc: ["'self'", "'unsafe-inline'", "https://js.stripe.com"],
            connectSrc: ["'self'", "https://api.example.com"],
            imgSrc: ["'self'", "data:"],
            styleSrc: ["'self'", "'unsafe-inline'"],
        },
    },
}));

app.options('*', cors(corsOptions));

mongoDB(app);
setupPaymentRoutes(app);

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
