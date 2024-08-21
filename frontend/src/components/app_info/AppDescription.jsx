import React from "react";

const AppDescription = () => {
  const containerStyle = {
    padding: "20px",
    fontFamily: "Arial, sans-serif",
    lineHeight: "1.6",
    color: "#333",
  };

  const sectionStyle = {
    marginBottom: "20px",
  };

  const titleStyle = {
    fontSize: "24px",
    fontWeight: "bold",
    marginBottom: "10px",
    color: "#2c3e50",
  };

  const subtitleStyle = {
    fontSize: "20px",
    fontWeight: "bold",
    marginBottom: "5px",
    color: "#34495e",
  };

  const textStyle = {
    marginBottom: "10px",
  };

  return (
    <div style={containerStyle}>
      <div style={titleStyle}>Lager Kumpel: E-commerce Backend System</div>
      <p style={textStyle}>
        Lager Kumpel is a comprehensive backend system designed for managing
        inventory and shipment processes for clothing stores. It assists in
        order processing, item picking, and shipping, ensuring efficiency and
        reducing errors.
      </p>

      <div style={sectionStyle}>
        <div style={subtitleStyle}>Bins</div>
        <p style={textStyle}>
          Manage storage bins where items are stored. Features include creating,
          searching, and fetching bins, viewing bins as lists or blobs with
          total quantities, and detailed item views within each bin.
        </p>
      </div>

      <div style={sectionStyle}>
        <div style={subtitleStyle}>Items</div>
        <p style={textStyle}>
          Manage inventory items. Features include creating, searching, fetching
          items, and adding new items to the inventory.
        </p>
      </div>

      <div style={sectionStyle}>
        <div style={subtitleStyle}>Actions</div>
        <p style={textStyle}>
          Manage item movements within bins with three actions: Add (adds items
          to a bin), Move (moves items between bins), and Remove (removes items
          from a bin). Barcode input fields/scanners streamline action
          execution.
        </p>
      </div>

      <div style={sectionStyle}>
        <div style={subtitleStyle}>Orders</div>
        <p style={textStyle}>
          Manage customer orders. Features include fetching all orders,
          unprocessed orders, orders not in picklists, submitting custom orders,
          and detailed order views. Track order status with `inPicklist` and
          `processed` fields.
        </p>
      </div>

      <div style={sectionStyle}>
        <div style={subtitleStyle}>Picklists</div>
        <p style={textStyle}>
          Generate and manage picklists for order fulfillment. Features include
          refreshing and generating picklists, listing picklists with detailed
          item pages, sorting items by bin for efficient picking, and scanning
          items to update shipping boxes and inventory.
        </p>
      </div>

      <div style={sectionStyle}>
        <div style={subtitleStyle}>Shipping Boxes</div>
        <p style={textStyle}>
          Manage shipment preparation. Features include viewing shipping box
          status, detailed item views within each box, downloading shipment
          labels and invoices, and closing out orders to update inventory and
          order status.
        </p>
      </div>
    </div>
  );
};

export default AppDescription;
