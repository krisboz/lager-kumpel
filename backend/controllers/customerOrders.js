const customerOrdersRouter = require("express").Router();
const Order = require("../models/customerOrders");
const Item = require("../models/items");

customerOrdersRouter.get("/", async (request, response) => {
  try {
    const orders = await Order.find({});
    response.json(orders);
  } catch (error) {
    console.log("error fetching orders", error);
    response.status(500).send({ error: "Error fetching orders" });
  }
});

customerOrdersRouter.get("/unprocessed", async (request, response) => {
  try {
    const orders = await Order.find({ processed: false });
    response.status(200).json(orders);
  } catch (error) {
    console.error(
      "Error fetching unprocessed orders:",
      error.message,
      error.stack
    );
    response.status(500).json({ error: "Error fetching unprocessed orders" });
  }
});

customerOrdersRouter.get("/processed", async (request, response) => {
  try {
    const orders = await Order.find({ processed: true });
    response.status(200).json(orders);
  } catch (error) {
    console.error(
      "Error fetching processed orders:",
      error.message,
      error.stack
    );
    response.status(500).json({ error: "Error fetching processed orders" });
  }
});

customerOrdersRouter.get("/in_picklist", async (request, response) => {
  try {
    console.log("GET /in_picklist called");
    const orders = await Order.find({ inPicklist: true });
    console.log("Orders in picklist fetched:", orders);
    response.status(200).json(orders);
  } catch (error) {
    console.error(
      "Error fetching orders in picklist:",
      error.message,
      error.stack
    );
    response.status(500).json({ error: "Error fetching orders in picklist" });
  }
});

customerOrdersRouter.get("/not_in_picklist", async (request, response) => {
  try {
    const orders = await Order.find({ inPicklist: false });
    response.status(200).json(orders);
    return orders;
  } catch (error) {
    console.error(
      "Error fetching not in picklist orders:",
      error.message,
      error.stack
    );
    response
      .status(500)
      .json({ error: "Error fetching not in picklist orders" });
  }
});

customerOrdersRouter.get("/:orderNo", async (request, response) => {
  const orderNo = request.params.orderNo;
  try {
    const orders = await Order.find({ orderNumber: orderNo });
    response.status(200).json(orders);
  } catch (error) {
    console.error(
      "Error fetching unprocessed orders:",
      error.message,
      error.stack
    );
    response.status(500).json({ error: "Error fetching unprocessed orders" });
  }
});

/***NEW POST  */

// POST method for creating orders with populated item details
//and to check the stock availability

customerOrdersRouter.post("/", async (request, response) => {
  const { customerName, items, address } = request.body;

  try {
    // Fetch detailed item information
    const detailedItems = await Promise.all(
      items.map(async (item) => {
        const itemDetails = await Item.findOne({
          barcode: item.barcode,
        }).lean();
        return {
          name: itemDetails.name,
          barcode: item.barcode,
          quantity: item.quantity,
          photo: itemDetails.photo,
          price: itemDetails.price,
          locations: itemDetails.locations,
        };
      })
    );

    // Fetch non-processed orders
    const nonProcessedOrders = await Order.find({ processed: false }).lean();

    // Calculate committed stock from non-processed orders
    const committedStock = {};

    nonProcessedOrders.forEach((order) => {
      order.items.forEach((item) => {
        if (!committedStock[item.barcode]) {
          committedStock[item.barcode] = 0;
        }
        committedStock[item.barcode] += item.quantity;
      });
    });

    console.log("Committed Stock: ", JSON.stringify(committedStock, null, 2));

    // Check stock availability for new order
    for (const item of detailedItems) {
      const itemDetails = await Item.findOne({ barcode: item.barcode }).lean();

      // Calculate total available stock for the item across all locations
      let totalAvailableStock = 0;
      itemDetails.locations.forEach((location) => {
        const committedQuantity = committedStock[item.barcode] || 0;
        totalAvailableStock += location.quantity;
      });

      totalAvailableStock -= committedStock[item.barcode] || 0;

      console.log(
        `LOOKIE { totalAvailableStock: ${totalAvailableStock}, itemQ: ${item.quantity} }`
      );

      // Check if total available stock is sufficient for the new order
      if (totalAvailableStock < item.quantity) {
        return response
          .status(400)
          .json({ error: `Insufficient stock for item ${item.barcode}` });
      }
    }

    // Construct the order with populated item details
    const order = new Order({
      customerName,
      items: detailedItems,
      address,
    });

    // Save the populated order to the database
    const savedOrder = await order.save();
    console.log("SAVED ORDER: ", JSON.stringify(savedOrder, null, 2));
    response.status(201).json(savedOrder);
  } catch (error) {
    console.log("error creating order", error);
    response.status(500).send({ error: "Error creating order" });
  }
});

customerOrdersRouter.patch(
  "/:orderNumber/processed",
  async (request, response) => {
    const orderNumber = request.params.orderNumber;
    const { processed } = request.body;

    try {
      const updatedOrder = await Order.findOneAndUpdate(
        { orderNumber: orderNumber }, // Filter criteria
        { $set: { processed: true } }, // Update operation
        { new: true } // Options: return the updated document
      );

      if (!updatedOrder) {
        return response.status(404).json({ error: "Order not found" });
      }

      response.status(200).json(updatedOrder);
    } catch (error) {
      console.error("Error updating order:", error.message, error.stack);
      response.status(500).json({ error: "Error updating order" });
    }
  }
);

customerOrdersRouter.patch(
  "/:orderNumber/in_picklist",
  async (request, response) => {
    const orderNumber = request.params.orderNumber;
    const { inPicklist } = request.body;

    try {
      const updatedOrder = await Order.findOneAndUpdate(
        { orderNumber },
        { $set: { inPicklist: true } }, // Update operation
        { new: true }
      );
      if (!updatedOrder) {
        return response.status(404).json({ error: "Order not found" });
      }
      response.status(200).json(updatedOrder);
    } catch (error) {
      console.error("Error updating order:", error.message, error.stack);
      response.status(500).json({ error: "Error updating order" });
    }
  }
);

module.exports = customerOrdersRouter;
