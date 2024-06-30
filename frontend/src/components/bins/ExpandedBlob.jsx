import React from "react";
import ItemCard from "./../items/ItemCard";

const ExpandedBlob = ({ binData }) => {
  return (
    <div>
      <h1>{binData.name}</h1>
      {binData.items.map((item) => (
        <ItemCard item={item} />
      ))}
    </div>
  );
};

export default ExpandedBlob;
