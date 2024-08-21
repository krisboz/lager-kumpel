import "../../styles/items/ItemsTable.scss";
import { useState, useEffect } from "react";
import helpers from "../../utils/helpers";
import DetailedItem from "./DetailedItem";

import "../../styles/_buttons.scss";
const ItemsTable = ({ items, blockDetailedView }) => {
  const [selectedItem, setSelectedItem] = useState(null);

  if (items.length === 0) {
    return <h4>Search for an item</h4>;
  }

  console.log("table", items);

  const handleRowClick = (e, item) => {
    const clickedItem = items.find((item2) => item2.barcode === item.barcode);
    setSelectedItem(clickedItem);
    console.log(clickedItem);
  };

  const closeDetailedView = () => {
    setSelectedItem(null);
  };

  if (blockDetailedView) {
    return null;
  }
  return (
    <>
      {selectedItem && (
        <DetailedItem
          selectedItem={selectedItem}
          closeDetailedView={closeDetailedView}
        />
      )}
      <table className="items-table">
        <thead>
          <tr>
            <th>Photo</th>
            <th>Barcode</th>
            <th>Quantity</th>
            <th>Name</th>
            <th>Price</th>
          </tr>
        </thead>
        <tbody>
          {items.map((item, index) => (
            <tr key={index} onClick={(e) => handleRowClick(e, item)}>
              <td className="photo-field">
                {" "}
                <img src={item.photo} loading="lazy" />
              </td>
              <td className="barcode-field">{item.barcode}</td>
              <td>
                {item.quantity
                  ? item.quantity
                  : helpers.sumQuantities(item.locations)}
              </td>
              <td>{item.name}</td>
              {item.price ? <td>€{item.price},00</td> : <td>None</td>}
            </tr>
          ))}
        </tbody>
      </table>
    </>
  );
};

export default ItemsTable;
