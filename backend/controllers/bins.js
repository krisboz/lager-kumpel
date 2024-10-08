const binsRouter = require("express").Router();
const Bin = require("../models/bins");
const transactions = require("../utils/transactions");

binsRouter.get("/", async (request, response) => {
  const bins = await Bin.find({});
  response.json(bins);
});

binsRouter.get("/:name", async (request, response) => {
  const name = request.params.name;

  const bin = await Bin.find({ name });
  response.json(bin);
});

binsRouter.post("/", async (request, response) => {
  const body = request.body;

  const bin = new Bin({
    name: body.name,
    items: [],
  });

  if (!body.name) {
    return response.status(400).json({ error: "You need to add a name" });
  }

  try {
    const savedBin = await bin.save();
    console.log("saved bin", savedBin);
    response.status(201).json(savedBin);
  } catch (error) {
    console.log("error posting a new bin", error.message, error.stack);
    response.status(500).json({ error: error.message });
  }
});

binsRouter.put("/:name/addItem", async (request, response) => {
  const body = request.body;
  console.log("BOD", body);

  try {
    const savedBin = await transactions.addItemToBin(body, request.params.name);
    response.json(savedBin);
  } catch (error) {
    console.log("should be there", error);
    response.status(500).json({ error: error.message });
  }
});

binsRouter.put("/:name/moveItems", async (request, response) => {
  const body = request.body;
  try {
    const result = await transactions.moveItemBins(
      body.itemsData,
      request.params.name,
      body.targetLocation
    );
    response.json(result);
  } catch (error) {
    console.log("should be there", error);
    response.status(500).json({ error: error.message });
  }
});

binsRouter.delete("/:name/removeItem", async (request, response) => {
  const body = request.body;
  console.log("FORM THE BACKEND", request.dy);
  try {
    const savedBin = await transactions.removeItemFromBin(
      body,
      request.params.name
    );
    response.json(savedBin);
  } catch (error) {
    console.error(error);
    response.status(500).json({ error: error.message });
  }
});

binsRouter.delete("/:id", async (request, response) => {
  try {
    const itemToDelete = await Bin.findByIdAndDelete(request.params.id);
    console.log(itemToDelete);
    response.status(204).end();
  } catch (error) {
    return error.message;
  }
});

module.exports = binsRouter;
