import "../../styles/items/NewItem.scss";
import binService from "../../services/bins";
import { useState } from "react";
import { CgAddR as AddButton, CgCloseR as CloseButton } from "react-icons/cg";
import "../../styles/_buttons.scss";
import useNotificationStore from "../../zustand/useNotificationStore";

const NewItem = () => {
  const setNotification = useNotificationStore(
    (state) => state.addNotification
  );

  const [isExpanded, setIsExpanded] = useState(false);

  const handleSubmit = async (event) => {
    event.preventDefault();

    const name = event.target.name.value;

    if (!name || name.length === 0) {
      setNotification("Name must not be omitted", "error");
    }
    const content = { name };
    const newItem = await binService.createNew(content);
    event.target.name.value = "";
    console.log(newItem);
  };

  const toggleIsExpanded = (event) => {
    setIsExpanded((prev) => !prev);
  };
  /**
     *  barcode: item.barcode,
        cost: item.cost,
        name: item.name,
        description: item.description,
        price: item.price,
        date: item.date,
        photo: item.photo,
     */

  if (!isExpanded) {
    return (
      <button className="svg-button action-button" onClick={toggleIsExpanded}>
        <AddButton />
      </button>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="item-input-form">
      <div className="close-button-container">
        <button
          className="svg-button action-button"
          type="button"
          onClick={toggleIsExpanded}
        >
          <CloseButton />
        </button>
      </div>

      <h3>Create new bin</h3>

      <input name="name" placeholder="New bin name..." required={true} />

      <button className="action-button" type="submit">
        Submit
      </button>
    </form>
  );
};

export default NewItem;
