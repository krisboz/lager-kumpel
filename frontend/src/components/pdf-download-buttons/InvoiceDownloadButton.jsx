import React from "react";
import axios from "axios";

const InvoiceDownloadButton = ({ order }) => {
  const downloadInvoice = async () => {
    try {
      const response = await axios.post(
        "http://localhost:3003/api/pdf/invoice",
        { order },
        {
          responseType: "blob",
        }
      );

      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", `invoice-${order.orderNumber}.pdf`);
      document.body.appendChild(link);
      link.click();
    } catch (error) {
      console.error("Error downloading invoice:", error);
    }
  };

  const downloadShipmentLabel = async () => {
    try {
      const response = await axios.post(
        "http://localhost:3003/api/pdf/shipment-label",
        { order },
        {
          responseType: "blob",
        }
      );

      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", `shipment-label-${order.orderNumber}.pdf`);
      document.body.appendChild(link);
      link.click();
    } catch (error) {
      console.error("Error downloading shipment label:", error);
    }
  };

  return (
    <>
      {" "}
      <button onClick={downloadShipmentLabel}>Download Shipment Label</button>
      <button onClick={downloadInvoice}>Download Invoice</button>
    </>
  );
};

export default InvoiceDownloadButton;
