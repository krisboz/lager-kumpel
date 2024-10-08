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
   * 
   * {action !== "add" && <Origin />}
      {action !== "add" && origin && <ItemBinScanner />}
      {action === "add" && !origin && <ItemBinScanner />}
   */
  if (!action) {
    return null;
  }
  if (action === "add") {
    return (
      <div className="scanner-container">
        <ItemBinScanner />
      </div>
    );
  }

  return (
    <div className="scanner-container">
      {origin.length > 0 ? (
        <Origin />
      ) : (
        <>
          <Origin /> <ItemBinScanner />
        </>
      )}
    </div>
  );
};

export default Scanner;
