const allowedOrigins = [
  "http://localhost:5000",
  "http://localhost:5173",
  process.env.CLIENT_URL || "http://localhost:3000",
];

const corsOptions = {
  origin: (origin, callback) => {
    if (allowedOrigins.indexOf(origin) !== -1 || !origin) {
      callback(null, true);
    } else {
      callback(new Error("Not allowed by CORS"));
    }
  },
  credentials: true,
  optionsSuccessStatus: 200,
};

export default corsOptions;
