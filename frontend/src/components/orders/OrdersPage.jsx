import { useState, useEffect } from "react";
import NewOrderForm from "./NewOrderForm";
import "../../styles/orders/OrdersPage.scss";
import orderService from "../../services/orders";
import OrderDisplay from "./OrderDisplay";
import OrdersController from "./OrdersController";

const OrdersPage = () => {
  const [orders, setOrders] = useState([]);
  const [currentOrderQuery, setCurrentOrderQuery] = useState(null);
  const [showNewOrderForm, setShowNewOrderForm] = useState(false);
  const [orderToDisplay, setOrderToDisplay] = useState(null);

  useEffect(() => {
    const fetchAllOrders = async () => {
      try {
        const fetchedOrders = await orderService.getNotInPicklist();
        setOrders(fetchedOrders);
        console.log("IMMA ORDERS", fetchedOrders);
      } catch (error) {
        console.log("error fetching orders", error);
      }
    };
    fetchAllOrders();
  }, []);

  const handleDisplayOrder = (event, order) => {
    if (!orderToDisplay) {
      setOrderToDisplay(order);
    } else {
      console.log("There is one to display already");
      if (orderToDisplay.orderNumber === order.orderNumber) {
        console.log("it's the same");
        setOrderToDisplay(null);
      } else if (orderToDisplay.orderNumber !== order.orderNumber) {
        setOrderToDisplay(order);
      }
    }
  };

  return (
    <>
      <main className="orders-page">
        <div className="orders-style-wrapper">
          <h2>Customer Orders</h2>
          <div className="order-cards-container">
            {orders && orders.length > 0 ? (
              orders.map((order) => (
                <button
                  className="show-order-btn"
                  onClick={(e) => handleDisplayOrder(e, order)}
                  key={order.orderNumber}
                >
                  {order.orderNumber}
                </button>
              ))
            ) : (
              <p>No Avilable Orders</p>
            )}
          </div>
        </div>

        <section className="orders-container">
          <OrdersController
            setOrders={setOrders}
            setCurrentOrderQuery={setCurrentOrderQuery}
          />
          {orders.length > 0 && (
            <h2>
              {currentOrderQuery}: {orders.length}
            </h2>
          )}

          {orderToDisplay && <OrderDisplay order={orderToDisplay} />}
        </section>
      </main>
    </>
  );
};

export default OrdersPage;
