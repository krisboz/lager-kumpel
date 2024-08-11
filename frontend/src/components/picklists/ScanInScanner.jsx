import { useState } from "react";
import "../../styles/picklists/ScanInScanner.scss";
import picklistService from "../../services/picklists";
import useNotificationStore from "../../zustand/useNotificationStore";

const ScanInScanner = ({ picklist, close }) => {
  const [currentScan, setCurrentScan] = useState("");
  const [quantity, setQuantity] = useState(1);
  const [scannedItem, setScannedItem] = useState(null);
  const [assignedBox, setAssignedBox] = useState(null);
  const setNotification = useNotificationStore(
    (state) => state.addNotification
  );

  /**
   * when barcode is submitted
   * remove from lagerplace done
   * remove item from picklist done
   *
   * add to appropriate box
   *
   */
  const resetScannedInfo = () => {
    setScannedItem(null);
    setAssignedBox(null);
  };
  const scanIn = async (event) => {
    event.preventDefault();
    try {
      const scannedItem = await picklistService.scanInItem(
        picklist.picklistNumber,
        currentScan,
        quantity
      );
      setScannedItem(scannedItem.item);
      setAssignedBox(scannedItem.box.number);
      setCurrentScan("");
      console.log({ scannedItem });
    } catch (error) {
      console.error("Error scanning in", error);
      setNotification(error.message, "error");
    }
  };
  return (
    <>
      <form className="scan-in-form" onSubmit={scanIn}>
        <div className="scanner">
          <input
            value={currentScan}
            onChange={(e) => setCurrentScan(e.target.value)}
          />

          <button type="submit">Submit</button>
        </div>

        <button type="button" className="pick-button" onClick={() => close()}>
          Pick
        </button>
      </form>

      <div className="scan-info-container">
        {assignedBox && (
          <div className="scan-box-container">
            <h1 className="assigned-box-number">{assignedBox}</h1>
          </div>
        )}
        {scannedItem && (
          <div className="scan-item-container">
            <p>{scannedItem.barcode}</p>
            <img src={scannedItem.photo} loading="lazy" />
          </div>
        )}
      </div>
    </>
  );
};

export default ScanInScanner;
