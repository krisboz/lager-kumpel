import React from "react";
import { Link } from "react-router-dom";
import AppDescription from "./app_info/AppDescription";
import Tutorial from "./app_info/Tutorial";

const Home = () => {
  return (
    <div
      style={{
        display: "grid",
        placeContent: "center",
        paddingTop: "8%",
      }}
    >
      <Tutorial />
    </div>
  );
};

export default Home;
