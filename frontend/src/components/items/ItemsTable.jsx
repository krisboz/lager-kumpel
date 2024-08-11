import "../../styles/items/ItemsTable.scss";
import helpers from "../../utils/helpers";
const ItemsTable = ({ items }) => {
  if (items.length === 0) {
    return <h4>Search for an item</h4>;
  }

  console.log("table", items);
  return (
    <table className="items-table">
      <thead>
        <tr>
          <th>Barcode</th>
          <th>Quantity</th>
          <th>Name</th>
          <th>Price</th>
        </tr>
      </thead>
      <tbody>
        {items.map((item, index) => (
          <tr key={index}>
            <td>{item.barcode}</td>
            <td>
              {item.quantity ? item.quantity : helpers.sumQuantities(items)}
            </td>
            <td>{item.name}</td>
            <td>€{item.price},00</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
};

export default ItemsTable;
