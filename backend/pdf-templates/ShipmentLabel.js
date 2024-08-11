const React = require("react");
const {
  Document,
  Page,
  Text,
  View,
  StyleSheet,
} = require("@react-pdf/renderer");

// Define styles
const styles = StyleSheet.create({
  page: {
    flexDirection: "column",
    backgroundColor: "white",
    padding: "5%",
    fontSize: "10px",
    width: "385px",
    height: "793px",
  },
  header: {
    marginBottom: 10,
    borderBottom: "1px solid black",
    paddingBottom: 10,
  },
  section: {
    marginBottom: 10,
    borderBottom: "1px solid black",
  },
  sectionLast: {
    marginBottom: 5,
    border: "none",
  },
  boldText: {
    fontWeight: "bold",
  },
  barcode: {
    fontFamily: "Courier",
    fontSize: "14px",
  },
});

// Shipment label component
const ShipmentLabel = ({ order }) =>
  React.createElement(
    Document,
    null,
    React.createElement(
      Page,
      { size: "A7", style: styles.page },
      React.createElement(
        View,
        { style: styles.header },
        React.createElement(
          Text,
          { style: styles.boldText },
          "A Shipment Service"
        ),
        React.createElement(Text, null, "Shipment Label")
      ),
      React.createElement(
        View,
        { style: styles.section },
        React.createElement(Text, { style: styles.boldText }, "From:"),
        React.createElement(Text, null, `Company Name`),
        React.createElement(Text, null, `Calle Street 35`),
        React.createElement(Text, null, `12345 Ciudad de City`),
        React.createElement(Text, null, `The World`)
      ),
      React.createElement(
        View,
        { style: styles.section },
        React.createElement(Text, { style: styles.boldText }, "To:"),
        React.createElement(Text, null, `${order.customerName}`),
        React.createElement(
          Text,
          null,
          `${order.address.street} ${order.address.houseNumber}`
        ),
        React.createElement(
          Text,
          null,
          `${order.address.zipCode} ${order.address.city}`
        ),
        React.createElement(Text, null, `${order.address.country}`)
      ),
      React.createElement(
        View,
        { style: styles.section },
        React.createElement(
          Text,
          { style: styles.boldText },
          "Shipment Details:"
        ),
        React.createElement(Text, null, `Weight: 5 kg`)
      ),
      React.createElement(
        View,
        { style: styles.section },
        React.createElement(
          Text,
          { style: styles.boldText },
          "Tracking Number:"
        ),
        React.createElement(Text, { style: styles.barcode }, "567437642791259")
      ),
      React.createElement(
        View,
        { style: styles.sectionLast },
        React.createElement(Text, { style: styles.boldText }, "Service Type:"),
        React.createElement(Text, null, "Standard")
      )
    )
  );

module.exports = ShipmentLabel;
