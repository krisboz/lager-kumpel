import React from "react";
import ItemCard from "./../items/ItemCard";
import ItemsTable from "./../items/ItemsTable";

const ExpandedBlob = ({ binData }) => {
  console.log("BIN DATAAA: ", binData);
  return (
    <div>
      <h1>{binData.name}</h1>
      <ItemsTable items={binData.items} />
    </div>
  );
};

export default ExpandedBlob;
