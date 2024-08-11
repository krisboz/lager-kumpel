const express = require("express");
const React = require("react");
const { renderToStream } = require("@react-pdf/renderer");
const Invoice = require("../pdf-templates/Invoice");
const ShipmentLabel = require("../pdf-templates/ShipmentLabel"); // Import the ShipmentLabel component
const fs = require("fs");
const path = require("path");
const tmp = require("tmp");

const pdfsRouter = express.Router();

pdfsRouter.post("/invoice", async (req, res) => {
  try {
    const { order } = req.body;
    const invoiceElement = React.createElement(Invoice, { order });

    // Render React component to PDF stream
    const pdfStream = await renderToStream(invoiceElement);

    // Create a temporary file to save the PDF
    const tempFile = tmp.fileSync({ postfix: ".pdf" });

    // Pipe the PDF stream to the temporary file
    const writeStream = fs.createWriteStream(tempFile.name);
    pdfStream.pipe(writeStream);

    // Once the stream is finished, send the file
    writeStream.on("finish", () => {
      res.setHeader("Content-Type", "application/pdf");
      res.setHeader(
        "Content-Disposition",
        `attachment; filename=invoice-${order.orderNumber}.pdf`
      );
      fs.createReadStream(tempFile.name).pipe(res);
    });

    // Clean up the temporary file
    writeStream.on("end", () => {
      fs.unlinkSync(tempFile.name);
    });
  } catch (error) {
    console.error("Error generating PDF:", error);
    res.status(500).send("Error generating PDF");
  }
});

pdfsRouter.post("/shipment-label", async (req, res) => {
  try {
    const { order } = req.body;
    const shipmentLabelElement = React.createElement(ShipmentLabel, {
      order,
    });

    // Render React component to PDF stream
    const pdfStream = await renderToStream(shipmentLabelElement);

    // Create a temporary file to save the PDF
    const tempFile = tmp.fileSync({ postfix: ".pdf" });

    // Pipe the PDF stream to the temporary file
    const writeStream = fs.createWriteStream(tempFile.name);
    pdfStream.pipe(writeStream);

    // Once the stream is finished, send the file
    writeStream.on("finish", () => {
      res.setHeader("Content-Type", "application/pdf");
      res.setHeader(
        "Content-Disposition",
        `attachment; filename=shipment-label-${order.orderNumber}.pdf`
      );
      fs.createReadStream(tempFile.name).pipe(res);
    });

    // Clean up the temporary file
    writeStream.on("end", () => {
      fs.unlinkSync(tempFile.name);
    });
  } catch (error) {
    console.error("Error generating PDF:", error);
    res.status(500).send("Error generating PDF");
  }
});

module.exports = pdfsRouter;
