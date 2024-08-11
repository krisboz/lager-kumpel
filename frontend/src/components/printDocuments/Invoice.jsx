import React from "react";
import { Page, Text, View, Document, StyleSheet } from "@react-pdf/renderer";

// Create styles
const styles = StyleSheet.create({
  page: {
    width: "100%",
    height: "auto",
    flexDirection: "row",
    backgroundColor: "#E4E4E4",
  },
  section: {
    margin: 10,
    padding: 10,
    flexGrow: 1,
  },
});

// Create Document Component
const Invoice = ({ order }) => (
  <Document>
    <Page size="A4" style={styles.page}>
      <View style={styles.section}>
        <Text>Order no.{order.orderNumber}</Text>
      </View>
      <View style={styles.section}>
        <Text>{order.customerName}</Text>
        <Text>
          {order.address.street} {order.address.houseNumber}
        </Text>
        <Text>
          {order.address.zipCode} {order.address.city}
        </Text>
        <Text>{order.address.country}</Text>
      </View>
    </Page>
  </Document>
);

export default Invoice;
