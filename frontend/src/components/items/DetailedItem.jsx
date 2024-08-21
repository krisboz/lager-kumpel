import { useState, useEffect } from "react";
import helpers from "../../utils/helpers";
import "../../styles/items/DetailedItem.scss";
import "../../styles/_buttons.scss";

import { CgCloseR as CloseButton } from "react-icons/cg";

const DetailedItem = ({ selectedItem, closeDetailedView }) => {
  return (
    <div className="detailed-item-popup">
      <div className="close-button-container" style={{ width: "50vw" }}>
        <button
          className="action-button svg-button"
          onClick={closeDetailedView}
        >
          <CloseButton />
        </button>
      </div>

      <div className="item-content-container">
        <div className="detailed-image-container">
          <img src={selectedItem.photo} loading="lazy" />
        </div>
        <div className="detailed-item-data">
          <p className="detailed-item-name">{selectedItem.name}</p>
          <p>{selectedItem.barcode}</p>
          {selectedItem.locations.length > 0 && (
            <p>In Stock: {helpers.sumQuantities(selectedItem.locations)}</p>
          )}
        </div>
        <div className="detailed-item-locations">
          {selectedItem.locations &&
            selectedItem.locations.map((location) => (
              <div>
                <p>
                  {location.location}: {location.quantity}
                </p>
              </div>
            ))}
        </div>
      </div>
    </div>
  );
};

export default DetailedItem;
