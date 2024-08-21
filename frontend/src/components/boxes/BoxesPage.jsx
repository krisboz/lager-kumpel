import { useEffect, useState } from "react";
import boxesService from "../../services/boxes";
import orderService from "../../services/orders";
import "../../styles/boxes/BoxesPage.scss";
import ItemCard from "../items/ItemCard";
import helpers from "../../utils/helpers";
import BoxCard from "./BoxCard";
import Invoice from "../printDocuments/Invoice";
import { PDFViewer } from "@react-pdf/renderer";
import ReactPDF from "@react-pdf/renderer";
import InvoiceDownloadButton from "../pdf-download-buttons/InvoiceDownloadButton";

//TODO Take out renderListItem into it's own component
// and make items clickable for a detailed view
const BoxesPage = () => {
  const [boxes, setBoxes] = useState([]);
  const [boxToView, setBoxToView] = useState(null);

  useEffect(() => {
    //TODO This is too much calls but can't figure out
    //how to reset the full background color of a box card
    const fetchBoxes = async () => {
      const boxes = await boxesService.getAll();
      setBoxes(boxes);
    };

    fetchBoxes();
  }, [boxToView]);

  const handleBoxClick = (event, number) => {
    const box = boxes.find((box) => box.number === number);
    if (box) {
      setBoxToView(box);
    } else {
      setBoxToView(null);
    }
  };

  const renderListItem = (item) => {
    return (
      <div className="list-item" key={`${item.barcode}${Math.random() * 1000}`}>
        <img src={item.photo} loading="lazy" />
        <p className="list-sub list-barcode">{item.barcode}</p>
        <p className="list-sub list-quantity">{item.quantity}</p>
        <p className="list-sub list-name">{item.name}</p>
      </div>
    );
  };

  const closeOrder = async (box) => {
    try {
      //reset the box, patchprocessed,
      await orderService.patchProcessed(box.order.orderNumber);
      const resetedBox = await boxesService.resetBox(box.number);
      setBoxToView({ ...resetedBox });
      setBoxes((prev) => [...prev, resetedBox]);
    } catch (error) {
      console.error("error closing order", error.message, error.stack);
    }
  };

  const handleCloseOrder = async (e) => {
    const items = boxToView.order.items;
    const scannedItems = boxToView.scannedItems;

    if (scannedItems.length < items.length) {
      if (
        window.confirm(
          "Not all items have been scanned, are you sure you want to continue regardless?"
        )
      ) {
        //function To do something
        console.log("DO IT ");

        try {
          await closeOrder(boxToView);
        } catch (error) {
          console.log("ERROR closing out", error.message, error.stack);
        }

        return;
      } else {
        //dont want it
        console.log("DON'T WANT IT");
        return;
      }
    }
    console.log("DO IT");
    try {
      await closeOrder(boxToView);
    } catch (error) {
      console.log("ERROR closing out", error.message, error.stack);
    }
    return;
  };

  return (
    <main className="boxes-page">
      <div className="scrolling-section">
        <h2>Shipping Boxes</h2>
        <div className="boxes-list">
          {boxes.map((box, index) => (
            <BoxCard
              box={box}
              boxToView={boxToView}
              key={index}
              handleBoxClick={(e) => handleBoxClick(e, box.number)}
            />
          ))}
        </div>
      </div>

      {boxToView && (
        <div className="box-details scrolling-section">
          <h1 className="box-display"> {boxToView.number}</h1>

          <div className="items-containers">
            <div className="unscanned-items">
              <p>Remaining Items</p>
              {boxToView.order && boxToView.order.items.length > 0 ? (
                boxToView.order.items.map((item) => (
                  <div key={item.barcode}>
                    {" "}
                    {/* Checks if box.scannedItems contains the item
                      and renders only if the item has not yet been scanned
                     */}
                    {!boxToView.scannedItems.find(
                      (item2) => item2.barcode === item.barcode
                    )
                      ? renderListItem(item)
                      : null}
                  </div>
                ))
              ) : (
                <p>No remaining items.</p>
              )}
            </div>

            {/**
                  For each scanned item finds it in the box.order.items and renders accordingly
                 */}
            <div className="scanned-items">
              <p>Scanned Items</p>
              {boxToView.scannedItems && boxToView.scannedItems.length > 0 ? (
                boxToView.scannedItems.map((item) =>
                  renderListItem(
                    boxToView.order.items.find(
                      (item2) => item2.barcode === item.barcode
                    )
                  )
                )
              ) : (
                <p>No scanned items.</p>
              )}
            </div>
          </div>
        </div>
      )}
      {boxToView && boxToView.scannedItems.length > 0 && (
        <div className="close-order-btn-container">
          <InvoiceDownloadButton order={boxToView.order} />
          <button onClick={handleCloseOrder}>Close Out The Order</button>
        </div>
      )}
    </main>
  );
};

export default BoxesPage;
