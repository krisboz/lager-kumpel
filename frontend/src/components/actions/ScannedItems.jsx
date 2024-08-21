import useActionStore from "../../zustand/useActionStore";
import actionUtils from "../../utils/actionUtils";
import "../../styles/actions2/ScannedItems.scss";
import "../../styles/_buttons.scss";

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
    return (
      <div className="scanned-items-container">
        <h4>No items scanned</h4>
      </div>
    );
  }

  const deleteScannedItems = (e) => {
    setScannedItems([]);
  };

  return (
    <div className="scanned-items-container">
      <button
        type="button"
        className="action-button delete-button"
        onClick={deleteScannedItems}
      >
        Delete Scanned Items
      </button>
      {scannedItems.map((item) => {
        return (
          <div key={item.barcode} className="scanned-item">
            <img src={item.photo} alt="Scanned item" />

            <p>{item.barcode}</p>
            <p>{item.quantity}</p>
          </div>
        );
      })}
    </div>
  );
};

export default ScannedItems;
