import { useState } from "react";
import useActionStore from "../../zustand/useActionStore";
import binService from "../../services/bins";
import useNotificationStore from "../../zustand/useNotificationStore";
import actionUtils from "../../utils/actionUtils";

const ItemBinScanner = () => {
  const {
    action,
    origin,
    scannedItems,
    setAction,
    setOrigin,
    setScannedItems,
  } = useActionStore();

  const setNotification = useNotificationStore(
    (state) => state.addNotification
  );

  const [localQuantity, setLocalQuantity] = useState(1);
  const [localBarcode, setLocalBarcode] = useState("");

  const resetScanner = () => {
    setLocalQuantity(1);
    setLocalBarcode("");
  };

  const handleSelectionScan = async (event) => {
    event.preventDefault();

    try {
      const isBin = await binService.getOneByName(localBarcode);

      const scanRes = await actionUtils.processScan(
        { localBarcode, localQuantity },
        {
          action,
          origin,
          scannedItems,
          setters: { setAction, setOrigin, setScannedItems, setNotification },
        },

        isBin
      );

      scanRes && setNotification(scanRes.message, scanRes.type);
      resetScanner();
    } catch (error) {
      console.error(error);
      setNotification(error.message, "error");
      resetScanner();
    }
  };

  return (
    <form onSubmit={handleSelectionScan}>
      <label>
        Quantity:
        <br></br>
        <input
          type="number"
          value={localQuantity}
          onChange={(e) => setLocalQuantity(e.target.value)}
        />
      </label>
      <label>
        Barcode:
        <br></br>
        <input
          value={localBarcode}
          onChange={(e) => setLocalBarcode(e.target.value)}
        />
      </label>
      <button type="submit">Submit</button>
    </form>
  );
};

export default ItemBinScanner;
