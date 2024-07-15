const express = require("express");
const config = require("./utils/config");
const itemsRouter = require("./controllers/items");
const binsRouter = require("./controllers/bins");
const customerOrdersRouter = require("./controllers/customerOrders");
const picklistsRouter = require("./controllers/picklists");
const boxesRouter = require("./controllers/orderBoxes");
const app = express();
const cors = require("cors");
require("express-async-errors");
const logger = require("./utils/logger");
const middleware = require("./utils/middleware");
const mongoose = require("mongoose");

mongoose.set("strictQuery", false);
logger.info("Connecting to MongoDB...");

mongoose
  .connect(config.MONGODB_URI)
  .then(() => {
    logger.info("Connected to MongoDB!");
  })
  .catch((error) => {
    logger.error("Error connecting to MongoDB: ", error.message);
  });

//TODO Check how express async errors work

app.use(cors());
app.use(express.json());
app.use(middleware.requestLogger);
//app.use(middleware.tokenExtractor);
//ADD ROUTERS
app.use("/api/items", itemsRouter);
app.use("/api/bins", binsRouter);
app.use("/api/orders", customerOrdersRouter);
app.use("/api/picklists", picklistsRouter);
app.use("/api/boxes", boxesRouter);

app.use(middleware.unknownEndpoint);
app.use(middleware.errorHandler);

module.exports = app;
