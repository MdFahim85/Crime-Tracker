const express = require("express");
const dotenv = require("dotenv").config();
const port = process.env.PORT;
const app = express();
const { errorHandler } = require("./Middlewares/errorMiddleware");
const { connectDB } = require("./config/dbConfig");

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
connectDB();

app.use("/api", require("./Routes/reportRoute"));
app.use("/api", require("./Routes/userRoute"));

app.use(errorHandler);
app.listen(port, () => console.log(`Listeing to port ${port} `));
