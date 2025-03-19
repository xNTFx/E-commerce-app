import dotenv from "dotenv";

dotenv.config();

import cors from "cors";

const allowedOrigins =
  process.env.NODE_ENV === "development"
    ? [
        "http://localhost:5173",
        "https://e-commerce-app.pawelsobon.pl",
        "https://www.e-commerce-app.pawelsobon.pl",
      ]
    : [
        "https://e-commerce-app.pawelsobon.pl",
        "https://www.e-commerce-app.pawelsobon.pl",
      ];

export const corsOptions = {
  origin: (
    origin: string | undefined,
    callback: (err: Error | null, allow?: boolean) => void
  ) => {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error("Unauthorized origin"));
    }
  },
  credentials: true,
};
