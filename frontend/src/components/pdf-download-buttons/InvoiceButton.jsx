import React from "react";
import axios from "axios";
import "../../styles/_buttons.scss";

const InvoiceButton = ({ order }) => {
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
  return (
    <div
      className="invoice-button-container"
      style={{
        display: "flex",
        flexDirection: "row",
        justifyContent: "center",
      }}
    >
      <button className="download-button" onClick={downloadInvoice}>
        Download Invoice
      </button>
    </div>
  );
};

export default InvoiceButton;
