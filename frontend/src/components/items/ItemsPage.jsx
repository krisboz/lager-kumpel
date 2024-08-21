import { useState, useEffect } from "react";
import ItemCard from "./ItemCard";
import NewItem from "./NewItem";
import ExpandedItem from "./ExpandedItem";
import ItemSearch from "./ItemSearch";

import itemService from "../../services/items";
import "../../styles/items/ItemsPage.scss";
import ItemsTable from "./ItemsTable";
import { CgAddR as AddButton, CgCloseR as CloseButton } from "react-icons/cg";
import "../../styles/_buttons.scss";

const ItemsPage = () => {
  const [items, setItems] = useState([]);
  const [selectedItem, setSelectedItem] = useState(null);
  const [itemQuery, setItemQuery] = useState(null);

  useEffect(() => {
    const fetchItems = async () => {
      try {
        const items = await itemService.getAll();
        console.log("lokki meee", items);
        setItems(items);
      } catch (error) {
        console.error("error getting items", error);
      }
    };

    const fetchItem = async (barcode) => {
      try {
        const item = await itemService.getAllContaining(barcode);
        setItems(item);
      } catch (error) {
        console.error("error getting item", error);
      }
    };

    switch (itemQuery) {
      case null:
        break;

      case "all":
        fetchItems();
        break;
      default:
        fetchItem(itemQuery);
    }
  }, [itemQuery]);

  return (
    <div className="items-page">
      <ItemSearch setQuery={setItemQuery} />

      <div className="items-container">
        <div className="heading-container">
          <h2>Items</h2>
        </div>
        <div className="new-item-outer-container">
          <NewItem setItems={setItems} />
        </div>

        <div className="functional-container">
          <ItemsTable items={items} blockDetailedView={false} />
        </div>
      </div>
    </div>
  );
};

export default ItemsPage;
