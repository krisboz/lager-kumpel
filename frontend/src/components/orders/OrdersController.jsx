import { useState } from "react";
import orderService from "../../services/orders";
import NewOrderForm from "./NewOrderForm";
import "../../styles/_buttons.scss";

const OrdersController = ({ setOrders, setCurrentOrderQuery }) => {
  const [showNewOrderForm, setShowNewOrderForm] = useState(false);

  const toggleShowForm = (e) => {
    setShowNewOrderForm((prev) => !prev);
  };

  const fetchAll = async () => {
    try {
      const orders = await orderService.getAll();
      setOrders(orders);
      setCurrentOrderQuery("All orders");
    } catch (error) {
      console.log("Error fetching all orders", error.message, error);
    }
  };

  const fetchNotProcessed = async () => {
    try {
      const orders = await orderService.getNotProcessed();
      setOrders(orders);
      setCurrentOrderQuery("Not Processed");
    } catch (error) {
      console.log("Error getting unprocessed", error.message, error);
    }
  };

  const fetchNotInPicklist = async () => {
    try {
      const orders = orderService.getNotInPicklist();
      setOrders(orders);
      setCurrentOrderQuery("Not In Picklist");
    } catch (error) {
      console.log("Error getting not in picklist", error.message, error);
    }
  };
  return (
    <>
      {showNewOrderForm && (
        <NewOrderForm setOrders={setOrders} closeForm={toggleShowForm} />
      )}
      <div className="order-controls-container">
        <button className="action-button small" onClick={fetchAll}>
          Get All
        </button>
        <button className="action-button small" onClick={fetchNotInPicklist}>
          Get Not In Picklist
        </button>
        <button className="action-button small" onClick={fetchNotProcessed}>
          Get Not Processed
        </button>
        <button className="action-button small" onClick={toggleShowForm}>
          {showNewOrderForm ? `Hide Order Form` : `Submit Custom Order`}
        </button>
      </div>
    </>
  );
};

export default OrdersController;
