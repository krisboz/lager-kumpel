import { useState } from "react";
import useActionStore from "../../zustand/useActionStore";
import binService from "../../services/bins";
import useNotificationStore from "./../../zustand/useNotificationStore";
import { FiEdit3 as Edit } from "react-icons/fi";

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

  const [localOrigin, setLocalOrigin] = useState("");

  const handleOriginSubmit = async (e) => {
    e.preventDefault();

    if (!localOrigin) {
      setNotification("You need to scan a bin first!", "error");
      return;
    }

    try {
      const originToSet = await binService.getOneByName(localOrigin);
      console.log("ORIGIN TO SET", originToSet);

      if (originToSet.length > 0) {
        setOrigin(originToSet[0]);
        setLocalOrigin("");
        setNotification(`${originToSet[0].name} pinned as origin`);
      } else {
        setNotification(`Bin ${localOrigin} couldn't be found`, "error");
      }
    } catch (error) {
      setNotification(error.message, "error");
    }
  };

  if (origin.name) {
    return (
      <div style={{ display: "flex" }}>
        <p>{origin.name}</p>
        <button onClick={(e) => setOrigin("")}>
          <Edit />
        </button>
      </div>
    );
  }

  return (
    <form onSubmit={handleOriginSubmit}>
      Origin:
      <label>
        <input
          value={localOrigin}
          onChange={(e) => setLocalOrigin(e.target.value)}
        />
      </label>
      <button type="submit">Submit</button>
    </form>
  );
};

export default ItemBinScanner;
