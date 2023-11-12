const path = require("path");
const express = require("express");
const dotenv = require("dotenv").config();
const cors = require("cors");
const morgan = require("morgan");

const { errorHandler } = require("./middleware/errorMiddleware");
const connectDB = require("./config/db");
const port = 3000;

connectDB();

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cors());
app.use(morgan("tiny"));

app.options("*", cors());

app.use("/api/users", require("./routes/userRoutes"));
app.use("/api/child", require("./routes/childRoutes"));
app.use("/api/task", require("./routes/taskRoutes"));
app.use("/api/goal", require("./routes/goalRoutes"));
app.use("/api/requesttask", require("./routes/requestTaskRoutes"));

app.use(errorHandler);

app.listen(port, () => console.log(`Server started on port ${port}`));
