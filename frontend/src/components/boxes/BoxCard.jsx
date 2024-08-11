import React, { useEffect, useState } from "react";
import helpers from "../../utils/helpers";
import {
  LuPackageOpen as BoxOpen,
  LuPackage as BoxClosed,
} from "react-icons/lu";
import "../../styles/boxes/BoxCard.scss";

const BoxCard = ({ box, handleBoxClick, boxToView }) => {
  const [boxComplete, setBoxComplete] = useState(0);

  const adjustBoxComplete = () => {
    if (!box.scannedItems) {
      setBoxComplete(0);
      return;
    }
    if (box.scannedItems.length === 0) {
      setBoxComplete(0);
    } else if (
      box.scannedItems.length > 0 &&
      helpers.sumQuantities(box.scannedItems) ===
        helpers.sumQuantities(box.order.items)
    ) {
      setBoxComplete(box.number);
    } else {
      setBoxComplete(0);
    }
  };

  useEffect(() => {
    adjustBoxComplete();
  }, [boxToView]);

  return (
    <div
      key={box.number} // Add key for unique identification
      className={`box-icon`}
      onClick={(e) => handleBoxClick(e, box.number)}
      style={
        boxComplete === box.number
          ? { backgroundColor: "green", borderColor: "green" }
          : null
      }
    >
      {boxComplete === box.number ? <BoxClosed /> : <BoxOpen />}

      {box.number}
    </div>
  );
};

export default BoxCard;
