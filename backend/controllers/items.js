const itemsRouter = require("express").Router();
const Item = require("../models/items");

itemsRouter.get("/", async (request, response) => {
  const items = await Item.find({});
  response.json(items.length > 0 ? items : "No Items");
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
