import React from "react";
import { Link } from "react-router-dom";

const Home = () => {
  return (
    <div
      style={{
        display: "grid",
        placeContent: "center",
      }}
    >
      <div
        className="temp-links-container"
        style={{
          display: "flex",
          justifyContent: "center",
          gap: "1rem",
        }}
      >
        <Link to="/bins">Bins</Link>
        <Link to="/items">Items</Link>
        <Link to="/actions">Actions</Link>
        <Link to="/orders">Orders</Link>

        <Link to="/picklists">Picklists</Link>
      </div>
    </div>
  );
};

export default Home;
