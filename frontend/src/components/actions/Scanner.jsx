import React from "react";
import useActionStore from "../../zustand/useActionStore";
import Origin from "./Origin";
import ItemBinScanner from "./ItemBinScanner";

import "../../styles/actions2/Scanner.scss";

const Scanner = () => {
  const {
    action,
    origin,
    scannedItems,
    setAction,
    setOrigin,
    setScannedItems,
  } = useActionStore();

  /**
   * scannedItems
   * setScannedItems
   *
   * if action
   */
  if (!action) {
    return null;
  }
  return (
    <div className="scanner-container">
      {action !== "add" && <Origin />}
      <ItemBinScanner />
    </div>
  );
};

export default Scanner;
