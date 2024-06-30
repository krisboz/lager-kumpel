import React from "react";
import { Link } from "react-router-dom";
import "../styles/Navbar.scss";

const Navbar = () => {
  return (
    <nav>
      <Link to={"/"}>
        {" "}
        <h3>Lager Kumpel</h3>
      </Link>
      <Link to={"/bins"}>Bins</Link>
      <Link to={"/items"}>Items</Link>
      <Link to={"/actions"}>Actions</Link>
      <Link to={"/picklists"}>Picklists</Link>
      <Link to={"/orders"}>Orders</Link>
    </nav>
  );
};

export default Navbar;
