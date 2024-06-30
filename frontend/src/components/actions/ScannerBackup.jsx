import { useState } from "react";
import Banner from "./Banner";
import useNotificationStore from "../../zustand/useNotificationStore";
import binService from "../../services/bins";
import OriginSelector from "./OriginSelector";

const Scanner = () => {
  const setNotification = useNotificationStore(
    (state) => state.addNotification
  );
  const [action, setAction] = useState(null);

  const [origin, setOrigin] = useState([]);
  const [originIntermediary, setOriginIntermediary] = useState("");
  const [currentCode, setCurrentCode] = useState("");
  const [currentQuantity, setCurrentQuantity] = useState(1);
  const [scannedItems, setScannedItems] = useState([]);

  const handleActionSelect = (event) => {
    setAction(event.target.name);
  };

  const handleOriginSubmit = async (e, originIntermediary) => {
    e.preventDefault();

    try {
      const originToSet = await binService.getOneByName(originIntermediary);
      console.log("ORIGIN TO SET", originToSet);

      if (originToSet.length > 0) {
        setOrigin(originToSet[0]);
        setNotification(`${originToSet[0].name} pinned as origin`);
      } else {
        setNotification(`Bin ${originIntermediary} couldn't be found`, "error");
      }
    } catch (error) {
      setNotification(error.message, "error");
    }
  };

  const resetOrigin = () => {
    setOrigin([]);
  };

  const resetFields = (notification) => {
    setNotification(`${notification}`);
    setScannedItems([]);
    setCurrentCode("");
    setCurrentQuantity(1);
  };

  const addToScannedItems = () => {
    //Updates the scannedItems state so that if the new value is already
    //in the state it sums the quantites
    //otherwise it appends it to the end
    const newItem = { barcode: currentCode, quantity: +currentQuantity };

    setScannedItems((prev) => {
      const index = prev.findIndex((item) => item.barcode === newItem.barcode);

      if (currentCode !== "") {
        if (index !== -1) {
          return prev.map((item, i) =>
            index === i
              ? { ...item, quantity: item.quantity + newItem.quantity }
              : item
          );
        } else {
          return [...prev, newItem];
        }
      } else {
        setNotification("You need to scan an item first", "error");
        return;
      }
    });
  };

  const handleSelectionScan = async (event) => {
    event.preventDefault();
    //otherFunction(...,...,...,...)
    const binResponse = await binService.getOneByName(currentCode);
    if (!binResponse || binResponse.length === 0) {
      //They've scanned an item
      if (origin.length === 0 && action === "ADD") {
        //It's an add we're checking for errors later on as a group
        addToScannedItems();
        return;
      } else {
        const index = origin.items.findIndex(
          (item) => item.barcode === currentCode
        );
        if (index === -1) {
          //if not in origin just throw error
          setNotification(
            `Bin ${origin.name} doesn't include that item`,
            "error"
          );
          return;
        }
        //if in origin add to scanned items
        addToScannedItems();
        return;
      }
    } else {
      if (scannedItems.length === 0) {
        setNotification("You need to scan at least one item first", "error");
        setCurrentCode("");
        return;
      }
      if (origin.length === 0 && action === "ADD") {
        //its an ADD
        try {
          const response = await binService.addItemsToBin(
            currentCode,
            scannedItems
          );
          if (!response) {
            setNotification("Error adding items to bin", "error");
            return;
          }
          console.log("Successful add to a bin, response:", response);
          setNotification(
            `${scannedItems.length} items added to ${currentCode}`
          );
          setScannedItems([]);
          setCurrentCode("");
          setCurrentQuantity(1);
          return;
        } catch (error) {
          setNotification(error.message, "error");
          return;
        }
      }
      if (action === "MOVE") {
        try {
          if (origin.length === 0) {
            setNotification("You need to set the origin bin first", "error");
            return;
          }
          if (origin.name === currentCode) {
            setNotification("You can add only to other bins", "error");
            return;
          }
          const response = await binService.moveItemBins(
            origin.name,
            scannedItems,
            currentCode
          );
          console.log("successful move", response);

          resetFields(
            `${currentQuantity} items moved from ${origin.name} to ${currentCode}`
          );
          return;
        } catch (error) {
          setNotification(error.message, "error");
          return;
        }
      }
      if (type === "REMOVE") {
        if (origin.name !== currentCode) {
          setNotification(
            "If you want to confirm scan the original bin again",
            "warning"
          );
          return;
        }
        try {
          const response = await binService.removeItemsFromBin(
            origin.name,
            scannedItems
          );
          console.log("successful remove", response);
          resetFields(`${currentQuantity} items removed from ${origin.name}`);
          return;
        } catch (error) {
          setNotification(error.message, "error");
          return;
        }
      }
    }
  };

  const origin2 = (
    <form onSubmit={handleOriginSubmit}>
      <label>
        Origin:
        <input
          name="origin"
          onChange={(e) => setOriginIntermediary(e.target.value)}
          value={originIntermediary}
        />
      </label>
      <button type="submit">Submit</button>
    </form>
  );

  if (!action) {
    return (
      <>
        <Banner />
      </>
    );
  }

  if (action === "ADD") {
    <>
      <Banner action={action} handleActionSelect={() => handleActionSelect} />
      <form onSubmit={handleSelectionScan}>
        <label>
          Quantity:{" "}
          <input
            type="number"
            value={currentQuantity}
            onChange={(e) => setCurrentQuantity(e.target.value)}
            name="quantity-input"
          />
        </label>
        <label>
          Item/Bin Code:{" "}
          <input
            name="code-input"
            value={currentCode}
            onChange={(e) => setCurrentCode(e.target.value)}
          />
        </label>
        <br></br>
        <button type="submit">Submit</button>
      </form>
    </>;
  }

  if (action === "MOVE" || action === "REMOVE") {
    if (!origin) {
      return (
        <>
          <Banner action={action} handleActionSelect={handleActionSelect} />
          <OriginSelector
            origin={origin}
            handleOriginSubmit={handleOriginSubmit}
            resetOrigin={resetOrigin}
          />
          <form onSubmit={handleSelectionScan}>
            <label>
              Quantity:{" "}
              <input
                type="number"
                value={currentQuantity}
                onChange={(e) => setCurrentQuantity(e.target.value)}
                name="quantity-input"
              />
            </label>
            <label>
              Item/Bin Code:{" "}
              <input
                name="code-input"
                value={currentCode}
                onChange={(e) => setCurrentCode(e.target.value)}
              />
            </label>
            <br></br>
            <button type="submit">Submit</button>
          </form>
        </>
      );
    }

    return (
      <>
        <Banner action={action} handleActionSelect={handleActionSelect} />
        <OriginSelector />
        <form onSubmit={handleSelectionScan}>
          <label>
            Quantity:{" "}
            <input
              type="number"
              value={currentQuantity}
              onChange={(e) => setCurrentQuantity(e.target.value)}
              name="quantity-input"
            />
          </label>
          <label>
            Item/Bin Code:{" "}
            <input
              name="code-input"
              value={currentCode}
              onChange={(e) => setCurrentCode(e.target.value)}
            />
          </label>
          <br></br>
          <button type="submit">Submit</button>
        </form>
      </>
    );
  }
};

export default Scanner;
