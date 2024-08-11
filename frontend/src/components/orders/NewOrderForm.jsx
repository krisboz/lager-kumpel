import { useState, useEffect } from "react";
import orderService from "../../services/orders";
import itemService from "../../services/items";
import useNotificationStore from "../../zustand/useNotificationStore";
import "../../styles/orders/NewOrderForm.scss";
import ItemsTable from "../items/ItemsTable";
import { IoIosAddCircle as AddBtn } from "react-icons/io";

const ItemsForm = ({ setItems }) => {
  const setNotification = useNotificationStore(
    (state) => state.addNotification
  );
  const [addedItems, setAddedItems] = useState([]);
  const [barcode, setBarcode] = useState("");
  const [quantity, setQuantity] = useState(1);
  const [loading, setLoading] = useState(false);

  const handleAddItem = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const newItem = await itemService.getOneByBarcode(barcode);
      if (!newItem) {
        throw new Error("No item found");
      }
      console.log("NEW ITEM", { ...newItem, quantity: parseInt(quantity) });
      setAddedItems((prev) => [...prev, { ...newItem, quantity }]);
      setItems((prev) => [
        ...prev,
        { ...newItem, quantity: parseInt(quantity) },
      ]);
      setBarcode("");
      setLoading(false);
    } catch (error) {
      setNotification(error.message, "error");
      setLoading(false);
    }
  };
  return (
    <div className="items-form-container">
      <h4>Order Items</h4>

      <form className="items-form" onSubmit={handleAddItem}>
        <label>
          Quantity:
          <input
            type="number"
            value={quantity}
            onChange={(e) => setQuantity(e.target.value)}
          />
        </label>
        <label>
          Barcode:
          <input value={barcode} onChange={(e) => setBarcode(e.target.value)} />
        </label>

        <button type="submit" className="item-add-btn">
          <AddBtn />
        </button>
        {loading && <p>Loading...</p>}
      </form>
      <ItemsTable items={addedItems} />
    </div>
  );
};

const NewOrderForm = ({ setOrders, closeForm }) => {
  const setNotification = useNotificationStore(
    (state) => state.addNotification
  );
  const [firstName, setFirstName] = useState("Kristijan");
  const [lastName, setLastName] = useState("Bombinovic");

  const [items, setItems] = useState([]);

  const [street, setStreet] = useState("Japanska");
  const [houseNumber, setHouseNumber] = useState("25");
  const [zipCode, setZipCode] = useState("32100");
  const [city, setCity] = useState("Vinkovci");
  const [country, setCountry] = useState("Croatia");

  //customerName
  //items : [],
  //address - street + num, city, zip, country
  const handleCreateNewOrder = async (e) => {
    e.preventDefault();
    const newOrder = {
      customerName: `${firstName} ${lastName}`,
      items,
      address: {
        street,
        houseNumber,
        zipCode,
        city,
        country,
      },
    };
    try {
      const savedOrder = await orderService.postNewOrder(newOrder);
      setOrders((prev) => [...prev, savedOrder]);
      setNotification("Order created successfully");
      closeForm();
    } catch (error) {
      console.log("Error creating new order", error);
      setNotification(error.message, "error");
    }
  };

  return (
    <div className="order-forms-container">
      <button onClick={closeForm}>Close</button>
      <form
        className="order-form"
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
        }}
        onSubmit={handleCreateNewOrder}
      >
        <div className="new-order-form-section-container">
          <section>
            <h4>Personal Information</h4>
            <label>
              First name:
              <input
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
              />
            </label>

            <label>
              Last name:
              <input
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
              />
            </label>
          </section>

          <section>
            <h4>Shipping Information</h4>

            <label>
              Street:
              <input
                value={street}
                onChange={(e) => setStreet(e.target.value)}
              />
            </label>

            <label>
              House number:
              <input
                value={houseNumber}
                onChange={(e) => setHouseNumber(e.target.value)}
              />
            </label>

            <label>
              ZIP Code:
              <input
                value={zipCode}
                onChange={(e) => setZipCode(e.target.value)}
              />
            </label>

            <label>
              City:
              <input value={city} onChange={(e) => setCity(e.target.value)} />
            </label>

            <label>
              Country:
              <input
                value={country}
                onChange={(e) => setCountry(e.target.value)}
              />
            </label>
          </section>
        </div>

        <button type="submit">Submit Order</button>
      </form>
      <ItemsForm setItems={setItems} />
    </div>
  );
};

export default NewOrderForm;
