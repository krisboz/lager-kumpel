import "../../styles/bins/BinBlobs.scss";
import { useState } from "react";
import ExpandedBlob from "./ExpandedBlob";
import Collapsible from "react-collapsible";

const BinBlobs = ({ bins }) => {
  const [expandedBlob, setExpandedBlob] = useState(null);

  const handleExpandBlob = (e, bin) => {
    setExpandedBlob(bin);
  };

  return (
    <>
      <div className="blobs-container" key={Math.random() * 10000}>
        {bins.map((bin) => (
          <div
            className="blob"
            key={bin._id}
            onClick={(e) => handleExpandBlob(e, bin)}
          >
            <p className="name">{bin.name.toUpperCase()}</p>

            <p>Items: {bin.items.length}</p>
            <p>
              Quantity:{" "}
              {bin.items
                .map((item) => item.quantity)
                .reduce(
                  (accumulator, currentValue) => accumulator + currentValue,
                  0
                )}
            </p>
          </div>
        ))}
      </div>
      {expandedBlob ? <ExpandedBlob binData={expandedBlob} /> : null}
    </>
  );
};

export default BinBlobs;
