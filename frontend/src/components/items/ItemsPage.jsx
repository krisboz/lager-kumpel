import { useState, useEffect } from "react";
import ItemCard from "./ItemCard";
import NewItem from "./NewItem";
import ExpandedItem from "./ExpandedItem";
import ItemSearch from "./ItemSearch";

import itemService from "../../services/items";
import "../../styles/items/ItemsPage.scss";
import ItemsTable from "./ItemsTable";

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
      <div className="left">
        <ItemSearch setQuery={setItemQuery} />

        <div className="items-container">
          <h2>
            Items
            <NewItem setItems={setItems} />
          </h2>

          <ItemsTable items={items} />
        </div>
      </div>
    </div>
  );
};

export default ItemsPage;
