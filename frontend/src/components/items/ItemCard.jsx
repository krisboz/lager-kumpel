import "../../styles/items/ItemCard.scss";
import { useLocation } from "react-router-dom";
import { RiEyeCloseLine as Closed, RiEye2Line as Open } from "react-icons/ri";

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
        {!location.pathname.includes("bins") ||
          (!location.pathname.includes("boxes") && (
            <button
              className="select-button"
              onClick={handleSelectedItemChange}
            >
              <Closed />
            </button>
          ))}
      </div>
      <div className="info">
        <p>{item.barcode}</p>
        <p>{item.quantity}</p>
      </div>
      <div className="quantity">
        <p>{item.name}</p>
      </div>
    </div>
  );
};

export default ItemCard;
