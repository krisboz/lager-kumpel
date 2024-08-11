const boxesRouter = require("express").Router();
const Box = require("../models/orderBoxes");

// showallboxes
//  get a single box
// scan an item into a box
// finishOrder (??)

boxesRouter.get("/", async (request, response) => {
  try {
    const boxes = await Box.find({});
    response.json(boxes);
  } catch (error) {
    console.log("error fetching boxes", error);
    response.status(500).send({ error: "Error fetching boxes" });
  }
});

boxesRouter.get("/:boxNumber", async (request, response) => {
  try {
    const box = await Box.find({ number: request.params.boxNumber });
    response.json(box);
  } catch (error) {
    console.log(`No box with number ${request.params.boxNumber} found`, error);
    response
      .status(500)
      .send({ error: `No box with number ${request.params.boxNumber} found` });
  }
});

boxesRouter.post("/", async (request, response) => {
  const body = request.body;
  console.log("New Box Data", request.body);
  const box = new Box({
    number: body.number,
  });
  try {
    const savedBox = await box.save();
    console.log("SAVED box: ", savedBox);
    response.status(201).json(savedBox);
  } catch (error) {
    console.log("error creating a box", error.message, error.stack);
    response.status(500).send({ error: "Error creating a box" });
  }
});

boxesRouter.put("/:boxNumber/reset", async (request, response) => {
  try {
    const box = await Box.findOne({ number: request.params.boxNumber });
    if (!box) {
      return response.status(404).send({
        error: `No box with number ${request.params.boxNumber} found`,
      });
    }

    box.scannedItems = [];
    box.order = null;
    const resetBox = await box.save();
    response.status(201).json(resetBox);
  } catch (error) {
    console.log(
      `Error resetting box with number ${request.params.boxNumber}`,
      error
    );
    response.status(500).send({ error: "Error resetting the box" });
  }
});

//Add item to box
/**
 * /api/boxes/orderNumber/barcode/quantity
 * if there is a box with the orderNumber
 *  add to it's scanned items with jsut barcode and quantity
 *
 * else find the first free box (scannedItems.length===0)
 *  *  populate the customerInfo and items
 *  add to scannedItems
 */

module.exports = boxesRouter;
