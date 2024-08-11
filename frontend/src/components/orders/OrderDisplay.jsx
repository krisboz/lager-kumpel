import React from "react";
import ItemsTable from "../items/ItemsTable";
import "../../styles/orders/OrderDisplay.scss";
import InvoiceButton from "../pdf-download-buttons/InvoiceButton";

const OrderDisplay = ({ order }) => {
  return (
    <article className="order-display">
      <p>Order Number: {order.orderNumber}</p>
      <div className="customer-info-container">
        <h3>Customer Info</h3>
        <p>Name: {order.customerName}</p>
        <div className="address-container">
          <h4>Shipping Address</h4>
          <p>
            {order.address.street}, {order.address.houseNumber}
          </p>
          <p>
            {order.address.zipCode}, {order.address.city}
          </p>
          <p> {order.address.country}</p>
        </div>
      </div>
      <div className="items-container">
        <ItemsTable items={order.items} />
      </div>
      <InvoiceButton order={order} />
    </article>
  );
};

export default OrderDisplay;
