const picklistsRouter = require("express").Router();
const Picklist = require("../models/picklists");
const transactions = require("../utils/transactions");
const picklistTransactions = require("../utils/transactions2/picklists");

picklistsRouter.get("/", async (request, response) => {
  try {
    const picklists = await Picklist.find({});
    response.status(200).json(picklists);
  } catch (error) {
    console.error("Error fetching picklists:", error.message, error.stack);
    response.status(500).json({ error: "Error fetching picklists" });
  }
});

picklistsRouter.get("/:picklistNumber", async (request, response) => {
  const picklistNumber = request.params.picklistNumber;
  try {
    const picklist = await Picklist.find({ picklistNumber });
    response.status(200).json(picklist);
  } catch (error) {
    console.error(
      `Error fetching picklist no. ${picklistNumber}:`,
      error.message,
      error.stack
    );
    response.status(500).json({ error: "Error fetching picklist by number" });
  }
});

picklistsRouter.post("/", async (request, response) => {
  const body = request.body;
  console.log("BODY", body);

  try {
    if (body.orders.length === 0) {
      throw new Error("No orders submitted");
    }
    if (body.items.length === 0) {
      throw new Error("No items submitted");
    }
    const picklist = new Picklist({
      orders: body.orders,
      items: body.items,
    });
    const savedPicklist = await picklist.save();
    console.log("SAVED picklist: ", savedPicklist);
    response.status(201).json(savedPicklist);
  } catch (error) {
    console.log("error creating picklist", error);
  }
});

picklistsRouter.patch(
  "/:picklistNumber/pick/:barcode",
  async (request, response) => {
    const { picklistNumber, barcode } = request.params;
    try {
      const picklist = await Picklist.findOne({ picklistNumber });
      if (!picklist) {
        return response.status(404).json({ error: "Picklist not found" });
      }

      const item = picklist.items.find((item) => item.barcode === barcode);
      if (!item) {
        return response.status(404).json({ error: "Item not found" });
      }

      item.isPicked = true;
      await picklist.save();

      response.status(200).json(picklist);
    } catch (error) {
      console.error(
        `Error updating item with barcode ${barcode} in picklist no. ${picklistNumber}:`,
        error.message,
        error.stack
      );
      response.status(500).json({ error: "Error updating item in picklist" });
    }
  }
);

picklistsRouter.patch("/:picklistNumber", async (request, response) => {
  const picklistNumber = request.params.picklistNumber;

  const { orderNumber, barcode } = request.body;

  try {
    // Find the picklist by picklistNumber
    const picklist = await Picklist.findOne({ picklistNumber });

    if (!picklist) {
      return response.status(404).json({ message: "Picklist not found" });
    }

    // Find the item within the picklist
    const item = picklist.items.find(
      (item) => item.orderNumber === orderNumber && item.barcode === barcode
    );

    if (!item) {
      return response
        .status(404)
        .json({ message: "Item not found in picklist" });
    }

    // Update the isScanned property to true
    item.isScanned = true;

    // Save the updated picklist
    await picklist.save();

    response
      .status(200)
      .json({ message: "Item scanned successfully", picklist });
  } catch (error) {
    console.error(error);
    response.status(500).json({ message: "An error occurred", error });
  }
});

picklistsRouter.delete("/:picklistNumber", async (request, response) => {
  const picklistNumber = request.params.picklistNumber;

  try {
    const picklist = await picklistTransactions.deletePicklist(picklistNumber);
    if (!picklist) {
      return response.status(404).json({ message: "Picklist not found" });
    }

    response.status(200).json({
      message: `Picklist #${picklistNumber} deleted successfully`,
    });
  } catch (error) {
    console.error("Error deleting picklist:", error.message);
    response
      .status(500)
      .json({ message: "Error deleting picklist", error: error.message });
  }
});

picklistsRouter.delete(
  "/:picklistNumber/:barcode/:quantity",
  async (request, response) => {
    const picklistNumber = request.params.picklistNumber;
    const item = {
      barcode: request.params.barcode,
      quantity: parseInt(request.params.quantity),
    };

    try {
      const picklist = await picklistTransactions.scanInItem(
        picklistNumber,
        item.barcode,
        item.quantity
      );

      response.json(picklist);
    } catch (error) {
      console.error(error);
      response.status(500).json({ message: error.message, error });
    }
  }
);

module.exports = picklistsRouter;
