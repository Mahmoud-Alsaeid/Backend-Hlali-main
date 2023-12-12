const path = require("path");
const express = require("express");
const dotenv = require("dotenv").config();
const cors = require("cors");
const morgan = require("morgan");

const { errorHandler } = require("./middleware/errorMiddleware");
const connectDB = require("./config/db");
const { getNotifications, deleteNotification } = require("./controllers/requestTaskController");
const {getTransactionHistories} = require('./controllers/transaction-history');
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
app.use("/api/transaction", require("./routes/TransactionRoutes"));
app.get('/api/notifications', getNotifications);
app.delete('/api/notifications/:id', deleteNotification);
app.get('/api/transaction-hisories', getTransactionHistories)


app.use(errorHandler);

app.listen(port, () => console.log(`Server started on port ${port}`));
