import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import picklistService from "../../services/picklists";
import "../../styles/picklists/PicklistPage.scss";
import useNotificationStore from "../../zustand/useNotificationStore";
import picklistHelpers from "./helpers";

const PicklistPage = () => {
  const setNotification = useNotificationStore(
    (state) => state.addNotification
  );

  const { navigate } = useNavigate();

  const { picklistNumber } = useParams();

  const [picklist, setPicklist] = useState(null);
  const [completion, setCompletion] = useState(0);
  const [currentItemIndex, setCurrentItemIndex] = useState(0);
  const [currentItemScan, setCurrentItemScan] = useState("");

  useEffect(() => {
    const fetchPicklist = async () => {
      console.log("fetching...");
      const picklist = await picklistService.getByNumber(picklistNumber);
      console.log("picklist...", picklist[0]);
      setPicklist(picklist[0]);
    };

    fetchPicklist();
  }, []);

  useEffect(() => {
    if (picklist) {
      const completion = picklistHelpers.determineCompletionStatus(
        picklist.items
      );
      setCompletion(completion);
      const completedItems = picklist.items.filter(
        (item) => item.isPicked === true
      );
    }
  }, [picklist]);

  const handleNext = () => {
    if (currentItemIndex < picklist.items.length - 1) {
      setCurrentItemIndex(currentItemIndex + 1);
    }
  };

  const handlePrev = () => {
    if (currentItemIndex > 0) {
      setCurrentItemIndex(currentItemIndex - 1);
    }
  };

  const handleJumpToIndex = () => {
    const userInput = prompt(
      "Enter item index (1 to " + picklist.items.length + "):"
    );
    const index = parseInt(userInput, 10) - 1;
    if (!isNaN(index) && index >= 0 && index < picklist.items.length) {
      setCurrentItemIndex(index);
    } else {
      alert(
        "Invalid index. Please enter a number between 1 and " +
          picklist.items.length
      );
    }
  };

  if (!picklist) {
    return <div>Loading...</div>;
  }
  const currentItem = picklist.items[currentItemIndex];

  const handlePick = async (event) => {
    if (currentItemScan !== currentItem.barcode) {
      setNotification("Wrong item scanned", "error");
      return;
    }
  };

  const handleItemPick = async (event) => {
    event.preventDefault();

    if (!currentItemScan || currentItemScan !== currentItem.barcode) {
      setNotification("Invalid scan", "error");
      return;
    }

    try {
      const result = await picklistService.pickItem(
        picklist.picklistNumber,
        currentItemScan
      );
      setPicklist(result);
      setCurrentItemScan("");
      console.log(picklist.items.length, currentItemIndex);

      if (picklist.items.length !== currentItemIndex + 1) {
        setCurrentItemIndex((prev) => prev + 1);
      }

      //TODOplay peep for good scan
    } catch (error) {
      console.error(error.message);
      setNotification(`Error picking item`, "error");
      //TODOplay peep for bad scan
    }
  };

  return (
    <div className="picklist-page">
      <div className="current-item-container">
        <div
          className={`${
            currentItem && currentItem.isPicked
              ? "top-item-info picked"
              : "top-item-info"
          }`}
        >
          <p className="current-item-location">
            {currentItem.location.toUpperCase()}
          </p>

          <div className="current-item-info">
            <p>
              Code: <br></br>
              <span>{currentItem.barcode}</span>
            </p>
            <p>
              Qty: <br></br>
              <span
                className={`${
                  currentItem.quantity > 1 ? "greater-quantity" : ""
                }`}
              >
                {currentItem.quantity}
              </span>
            </p>
          </div>
        </div>

        <img className="picklist-item-img" src={currentItem.photo}></img>
        <p>Picklist # {picklistNumber}</p>
      </div>
      <div className="navigation-controls">
        <button onClick={handlePrev} disabled={currentItemIndex === 0}>
          Previous
        </button>
        <p onClick={handleJumpToIndex}>
          {currentItemIndex + 1} / {picklist.items.length}
        </p>
        <button
          onClick={handleNext}
          disabled={currentItemIndex === picklist.items.length - 1}
        >
          Next
        </button>
      </div>

      <div className="picklist-scanner-container">
        {!currentItem.isPicked ? (
          <form onSubmit={handleItemPick}>
            <input
              value={currentItemScan}
              onChange={(e) => setCurrentItemScan(e.target.value)}
            ></input>
            <button type="submit">Submit</button>
          </form>
        ) : (
          <form className="non-interactive-form">
            <div className="already-picked-display">
              <p>Item Already Picked</p>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};

export default PicklistPage;
