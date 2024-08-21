import React from "react";
import ItemsTable from "../items/ItemsTable";
import "../../styles/orders/OrderDisplay.scss";
import InvoiceButton from "../pdf-download-buttons/InvoiceButton";
import NewOrderForm from "./NewOrderForm";

const OrderDisplay = ({ order }) => {
  return (
    <article className="order-display">
      <div className="order-forms-container">
        <h2>Order {`#${order.orderNumber}`}</h2>
        <div
          className="order-form"
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
          }}
        >
          <div className="new-order-form-section-container">
            <section>
              <h4>Personal Information</h4>
              <label>
                Name: <p>{order.customerName}</p>
              </label>
            </section>

            <section>
              <h4>Shipping Information</h4>

              <label>
                Street:
                <p>{order.address.street}</p>
              </label>

              <label>
                House no.:
                <p>{order.address.houseNumber}</p>
              </label>

              <label>
                ZIP Code:
                <p>{order.address.zipCode}</p>
              </label>

              <label>
                City:
                <p>{order.address.city}</p>
              </label>

              <label>
                Country:
                <p>{order.address.country}</p>
              </label>
            </section>
          </div>
        </div>

        <div className="items-form-container">
          <h4>Ordered Items</h4>
        </div>
        <div style={{ pointerEvents: "none", width: "100%" }}>
          <ItemsTable items={order.items} />
        </div>
      </div>
      <InvoiceButton order={order} />
    </article>
  );
};

export default OrderDisplay;
