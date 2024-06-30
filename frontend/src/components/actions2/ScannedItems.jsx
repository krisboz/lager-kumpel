import useActionStore from "../../zustand/useActionStore";
import actionUtils from "../../utils/actionUtils";
import "../../styles/actions2/ScannedItems.scss";

const ScannedItems = () => {
  const {
    action,
    origin,
    scannedItems,
    setAction,
    setOrigin,
    setScannedItems,
  } = useActionStore();

  if (scannedItems.length === 0) {
    return <h4>No items scanned</h4>;
  }

  /**
   *     <div className="scanned-items-container">
      {scannedItems.map((item) => {
        const populated = actionUtils
          .populateScannedItems(scannedItems, origin)
          .find((item2) => item2.barcode === item.barcode);
        console.log("POPULATED: ", populated);
        return (
          <div key={item.barcode} className="scanned-item">
            {" "}
            <img src={populated.photo}></img>
            <p>{item.barcode}</p> <p>{item.quantity}</p>{" "}
          </div>
        );
      })}
    </div>
   */

  return (
    <div className="scanned-items-container">
      {scannedItems.map((item) => {
        const populated = actionUtils
          .populateScannedItems(scannedItems, origin)
          .find((item2) => item2.barcode === item.barcode);
        console.log("POPULATED: ", populated);
        return (
          <div key={item.barcode} className="scanned-item">
            {" "}
            <img src={populated.photo}></img>
            <p>{item.barcode}</p> <p>{item.quantity}</p>{" "}
          </div>
        );
      })}
    </div>
  );
};

export default ScannedItems;
