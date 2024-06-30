import NewItem from "./components/items/NewItem";
import "./App.css";
import ItemsPage from "./components/items/ItemsPage";
import BinsPage from "./components/bins/BinsPage";
import itemService from "./services/items";
import { useEffect, useState } from "react";
import AppRoutes from "./router/AppRoutes";
import Navbar from "./components/Navbar";
import Notification from "./components/Notification";

function App() {
  return (
    <>
      <Notification />
      <Notification />
      <AppRoutes />
    </>
  );
}

export default App;
