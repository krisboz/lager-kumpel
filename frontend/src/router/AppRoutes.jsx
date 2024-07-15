import { Route, Routes } from "react-router-dom";
import Home from "../components/Home";
import BinsPage from "../components/bins/BinsPage";
import ItemsPage from "../components/items/ItemsPage";
import ActionPage from "../components/actions/ActionPage";
import PicklistsPage from "../components/picklists/PicklistsPage";
import PicklistPage from "./../components/picklists/PicklistPage";
import OrdersPage from "../components/orders/OrdersPage";
import BoxesPage from "../components/boxes/BoxesPage";

const AppRoutes = () => {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/bins" element={<BinsPage />} />
      <Route path="/items" element={<ItemsPage />} />
      <Route path="/actions" element={<ActionPage />} />
      <Route path="/picklists" element={<PicklistsPage />} />
      <Route path="/picklists/:picklistNumber" element={<PicklistPage />} />
      <Route path="/orders" element={<OrdersPage />} />
      <Route path="/boxes" element={<BoxesPage />} />
    </Routes>
  );
};

export default AppRoutes;
