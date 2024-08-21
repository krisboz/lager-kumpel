import React from "react";

const Tutorial = () => {
  const containerStyle = {
    padding: "20px",
    fontFamily: "Arial, sans-serif",
    lineHeight: "1.6",
    color: "#333",
    maxWidth: "800px",
    margin: "0 auto",
    backgroundColor: "#f9f9f9",
    borderRadius: "8px",
    boxShadow: "0 0 10px rgba(0, 0, 0, 0.1)",
  };

  const stepStyle = {
    marginBottom: "20px",
    padding: "10px",
    backgroundColor: "#fff",
    borderRadius: "5px",
    boxShadow: "0 0 5px rgba(0, 0, 0, 0.1)",
  };

  const titleStyle = {
    fontSize: "24px",
    fontWeight: "bold",
    marginBottom: "20px",
    color: "#2c3e50",
    textAlign: "center",
  };

  const stepTitleStyle = {
    fontSize: "20px",
    fontWeight: "bold",
    marginBottom: "10px",
    color: "#34495e",
  };

  const textStyle = {
    marginBottom: "10px",
  };

  const scannerStyle = {
    display: "inline-block",
    margin: "0 5px",
    padding: "3px 7px",
    backgroundColor: "#3498db",
    color: "#fff",
    borderRadius: "3px",
  };

  return (
    <div style={containerStyle}>
      <div style={titleStyle}>Lager Kumpel: Let's Process an Order!</div>

      <div style={stepStyle}>
        <div style={stepTitleStyle}>Step 1: New Order Received</div>
        <p style={textStyle}>
          An order has just been placed on your webshop. Head over to the{" "}
          <strong>Orders</strong> section to view the new order.
        </p>
      </div>

      <div style={stepStyle}>
        <div style={stepTitleStyle}>Step 2: Generate Picklist</div>
        <p style={textStyle}>
          In the <strong>Orders</strong> section, find orders that are not yet
          in a picklist. Click the <strong>Generate Picklist</strong> button to
          create a new picklist for these orders.
        </p>
      </div>

      <div style={stepStyle}>
        <div style={stepTitleStyle}>Step 3: Start Picking</div>
        <p style={textStyle}>
          Go to the <strong>Picklists</strong> section and select your newly
          generated picklist. The items are sorted by bin for efficient picking.
          Take your mobile scanner and a shopping cart or basket.
        </p>
        <p style={textStyle}>
          <span style={scannerStyle}>Scan</span> the bin to set it as the
          origin. Then, <span style={scannerStyle}>scan</span> the items to add
          them to the cart. Continue through the warehouse until all items are
          picked.
        </p>
      </div>

      <div style={stepStyle}>
        <div style={stepTitleStyle}>Step 4: Move to Shipping Box</div>
        <p style={textStyle}>
          With all items picked, go to the shipping area. Scan the picked items
          into the appropriate shipping boxes using your scanner. The system
          will update the inventory and the picklist automatically.
        </p>
      </div>

      <div style={stepStyle}>
        <div style={stepTitleStyle}>Step 5: Prepare for Shipping</div>
        <p style={textStyle}>
          In the <strong>Shipping Boxes</strong> section, view the status of
          each shipping box. When a box is complete, click on it to download the
          shipment label and invoice.
        </p>
        <p style={textStyle}>
          <span style={scannerStyle}>Print</span> the documents and attach them
          to the package. Then, click <strong>Close Out Order</strong> to mark
          the order as processed.
        </p>
      </div>

      <div style={stepStyle}>
        <div style={stepTitleStyle}>Done!</div>
        <p style={textStyle}>
          The order is now processed and ready for shipment. Lager Kumpel
          ensures that every step is tracked and streamlined, thanks to the use
          of scanners for accurate and efficient inventory management.
        </p>
      </div>
    </div>
  );
};

export default Tutorial;
