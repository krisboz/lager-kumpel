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
    fontSize: "12px",
  },
  header: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 20,
  },
  logoSection: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "flex-start",
  },
  customerSection: {
    border: "1px solid #100b54",
    borderRadius: 5,
    margin: "5% 0 5% 0",
    padding: "10px",
  },
  table: {
    display: "table",
    width: "auto",
    borderStyle: "solid",
    borderWidth: 1,
    borderColor: "#100b54",
    marginBottom: 20,
  },
  tableRow: {
    flexDirection: "row",
  },
  tableColHeaderLarge: {
    width: "35%",
    borderStyle: "solid",
    borderWidth: 1,
    borderColor: "#100b54",
    backgroundColor: "#100b54",
    color: "white",
    padding: 5,
    textAlign: "center",
  },
  tableColHeaderSmall: {
    width: "15%",
    borderStyle: "solid",
    borderWidth: 1,
    borderColor: "#100b54",
    backgroundColor: "#100b54",
    color: "white",
    padding: 5,
    textAlign: "center",
  },
  tableColLarge: {
    width: "35%",
    borderStyle: "solid",
    borderWidth: 1,
    borderColor: "#100b54",
    padding: 2,
    textAlign: "center",
  },
  tableColSmall: {
    width: "15%",
    borderStyle: "solid",
    borderWidth: 1,
    borderColor: "#100b54",
    padding: 2,
    textAlign: "center",
  },
  totalRow: {
    flexDirection: "row",
    justifyContent: "flex-end",
    padding: 10,
    borderTop: "1px solid #100b54",
  },
  totalText: {
    fontWeight: "bold",
  },
});

// Invoice component
const InvoiceComponent = ({ order }) => {
  const total = order.items.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );

  return React.createElement(
    Document,
    null,
    React.createElement(
      Page,
      { size: "A4", style: styles.page },
      React.createElement(
        View,
        { style: styles.logoSection },
        React.createElement(Text, null, `Company Name`)
      ),
      React.createElement(
        View,
        { style: styles.customerSection },
        React.createElement(
          Text,
          null,
          `Invoice for Order no.${order.orderNumber}`
        ),
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
        { style: styles.table },
        React.createElement(
          View,
          { style: styles.tableRow },
          React.createElement(
            Text,
            { style: styles.tableColHeaderLarge },
            "Barcode"
          ),
          React.createElement(
            Text,
            { style: styles.tableColHeaderLarge },
            "Name"
          ),
          React.createElement(
            Text,
            { style: styles.tableColHeaderSmall },
            "Quantity"
          ),
          React.createElement(
            Text,
            { style: styles.tableColHeaderSmall },
            "Price"
          )
        ),
        order.items.map((item, index) =>
          React.createElement(
            View,
            { style: styles.tableRow, key: index },
            React.createElement(
              Text,
              { style: styles.tableColLarge },
              item.barcode
            ),
            React.createElement(
              Text,
              { style: styles.tableColLarge },
              item.name
            ),
            React.createElement(
              Text,
              { style: styles.tableColSmall },
              item.quantity
            ),
            React.createElement(
              Text,
              { style: styles.tableColSmall },
              `€${item.price.toFixed(2)}`
            )
          )
        )
      ),
      React.createElement(
        View,
        { style: styles.totalRow },
        React.createElement(
          Text,
          { style: styles.totalText },
          `Total: $${total.toFixed(2)}`
        )
      )
    )
  );
};

module.exports = InvoiceComponent;
