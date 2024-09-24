const itemsRouter = require("express").Router();
const Item = require("../models/items");
const helpers = require("../utils/helpers");

itemsRouter.get("/", async (request, response) => {
  const items = await Item.find({});
  response.json(items.length > 0 ? items : "No Items");
});

itemsRouter.get("/exact/:barcode", async (request, response) => {
  const barcode = request.params.barcode;
  try {
    const item = await Item.findOne({ barcode }).exec();
    console.log("SINGLE FETCHED ITEM: ", item);
    response.status(200).json(item);
  } catch (error) {
    console.log("error fetching an item", error.message, error.stack);
    response.status(500).send({ error: "Error fetching an item by barcode" });
  }
});

itemsRouter.get("/grouped_by_stock", async (request, response) => {
  try {
    // Fetch all items from the database
    const items = await Item.find({}).lean();

    let inStockCount = 0;
    let outOfStockCount = 0;
    const lowStockItems = [];

    // Loop through each item and categorize it based on its total quantity
    items.forEach((item) => {
      const totalQuantity = helpers.sumQuantities(item.locations); // Calculate the total quantity of the item

      if (totalQuantity === 0) {
        outOfStockCount++; // Count items that are out of stock
      } else if (totalQuantity < 15) {
        lowStockItems.push({ barcode: item.barcode }); // Collect barcode for low stock items
      } else {
        inStockCount++; // Count items that are in stock
      }
    });

    // Return the grouped results with counts and low stock items' barcodes
    response.status(200).json({
      inStockCount,
      outOfStockCount,
      lowStockItems, // Contains barcodes for items with quantity less than 15
    });
  } catch (error) {
    console.error("Error grouping items by stock level:", error);
    response.status(500).json({ error: "Error grouping items by stock level" });
  }
});

itemsRouter.get("/:barcode", async (request, response) => {
  const barcode = request.params.barcode;
  try {
    const items = await Item.find({
      barcode: { $regex: barcode },
    });
    response.json(items.length > 0 ? items : "No items found");
  } catch (error) {
    console.error(`error getting item ${barcode}`, error);
  }
});

itemsRouter.post("/", async (request, response) => {
  console.log("Request Body", request.body);
  const body = request.body;

  //TODO decode token for auth

  const item = new Item({
    barcode: body.barcode,
    cost: body.cost,
    name: body.name,
    price: body.price,
    photo: body.photo,
    quantity: body.quantity,
  });

  if (!body.barcode) {
    return response
      .status(400)
      .json({ error: "You have to add a serial code" });
  }

  try {
    const savedItem = await item.save();
    console.log("SAVED ITEM", savedItem);
    response.status(201).json(savedItem);
  } catch (error) {
    console.log("newly made error", error);
  }
});

module.exports = itemsRouter;
