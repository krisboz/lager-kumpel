import "../../styles/items/ItemCard.scss";
import { useLocation } from "react-router-dom";

const ItemCard = ({ item, setState }) => {
  const location = useLocation();

  //TODO Because of something here the item has to be accessed as item.item
  console.log("ITEM", item);

  const handleSelectedItemChange = (event) => {
    setState(item);
  };

  return (
    <div className="item-card">
      <div className="photo-container">
        <img src={item.photo} loading="lazy" />
        {!location.pathname.includes("bins") && (
          <button className="select-button" onClick={handleSelectedItemChange}>
            View
          </button>
        )}
      </div>
      <div className="info">
        <p>{item.name}</p>
        <p>{item.barcode}</p>
      </div>
      <div className="quantity">
        <p>Quantity</p>
        <p>{item.quantity}</p>
      </div>
    </div>
  );
};

export default ItemCard;
