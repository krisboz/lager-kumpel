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

  const populatedItems = actionUtils.populateScannedItems(scannedItems, origin);

  const deleteScannedItems = (e) => {
    setScannedItems([]);
  };

  return (
    <div className="scanned-items-container">
      <button type="button" onClick={deleteScannedItems}>
        Delete Scanned Items
      </button>
      {scannedItems.map((item) => {
        const populated = populatedItems
          ? populatedItems.find((item2) => item2.barcode === item.barcode)
          : null;

        return (
          <div key={item.barcode} className="scanned-item">
            {populated && populated.photo ? (
              <img src={populated.photo} alt="Scanned item" />
            ) : null}
            <p>{item.barcode}</p>
            <p>{item.quantity}</p>
          </div>
        );
      })}
    </div>
  );
};

export default ScannedItems;
