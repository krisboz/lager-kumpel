import React from "react";
import { Link } from "react-router-dom";
import "../styles/Navbar.scss";
import Logo from "./Logo";

const Navbar = () => {
  return (
    <nav className="nav-wrapper" style={{}}>
      <Link to="/">
        {" "}
        <Logo />
      </Link>

      <Link to="/bins">Bins</Link>
      <Link to="/items">Items</Link>
      <Link to="/actions">Actions</Link>
      <Link to="/orders">Orders</Link>

      <Link to="/picklists">Picklists</Link>
      <Link to="/boxes">Shipping boxes</Link>
    </nav>
  );
};

export default Navbar;
