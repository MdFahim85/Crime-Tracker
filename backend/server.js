const express = require("express");
require("dotenv").config();
const port = process.env.PORT || 4000;
const app = express();
const { errorHandler } = require("./Middlewares/errorMiddleware");
const { connectDB } = require("./config/dbConfig");
const cors = require("cors");
const path = require("path");

app.use(
  cors({
    origin:
      process.env.NODE_ENV === "production"
        ? "https://crime-tracker.onrender.com"
        : "http://localhost:5173",
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH"],
    credentials: true,
  })
);

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
connectDB();

app.use("/api", require("./Routes/reportRoute"));
app.use("/api", require("./Routes/userRoute"));
app.use("/api", require("./Routes/regionRoute"));
app.use("/api", require("./Routes/notificationRoute"));

app.use(errorHandler);

if (process.env.NODE_ENV === "production") {
  const __dirname = path.resolve();
  app.use(express.static(path.join(__dirname, "frontend/dist")));

  app.get("*catchall", (req, res) =>
    res.sendFile(path.resolve(__dirname, "frontend", "dist", "index.html"))
  );
}
app.listen(port, () => console.log(`Listeing to port ${port} `));
