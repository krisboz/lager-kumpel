import React from "react";
import { FaWarehouse as LagerLogo } from "react-icons/fa6";

import "../styles/Logo.scss";

const Logo = () => {
  return (
    <div className="logo-container">
      <div className="logo-wrapper">
        <LagerLogo />
      </div>
      <p>ager Kumpel</p>
    </div>
  );
};

export default Logo;
