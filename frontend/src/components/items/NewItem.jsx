import "../../styles/items/NewItem.scss";
import useItemStore from "../../zustand/useItemStore";
import itemService from "../../services/items";
import { useState } from "react";
import { CgAddR as AddButton, CgCloseR as CloseButton } from "react-icons/cg";
import "../../styles/_buttons.scss";

const NewItem = ({ setItems }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const createItem = useItemStore((state) => state.createItem);
  const clearInputFields = (event) => {
    event.target.barcode.value = "";
    event.target.cost.value = "";
    event.target.name.value = "";
    event.target.description.value = "";
    event.target.price.value = "";
    event.target.photo.value = "";
  };
  const handleSubmit = async (event) => {
    event.preventDefault();

    const barcode = event.target.barcode.value;
    const cost = parseFloat(event.target.cost.value);
    const name = event.target.name.value;
    const description = event.target.description.value;
    const price = parseFloat(event.target.price.value);
    const photo = event.target.photo.value;

    const content = { barcode, cost, name, description, price, photo };
    const newItem = await itemService.createNew(content);
    clearInputFields(event);
    setItems((prev) => [...prev, newItem]);
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
      <button onClick={toggleIsExpanded} className="svg-button action-button">
        <AddButton />
      </button>
    );
  }

  return (
    <>
      <div className="item-input-button-container">
        <button
          onClick={toggleIsExpanded}
          type="button"
          className="svg-button action-button"
        >
          <CloseButton />
        </button>
      </div>

      <form onSubmit={handleSubmit} className="new-item-input-form">
        <div className="new-item-form-header-container">
          <h3>Add new item</h3>
        </div>
        <label>
          Barcode:
          <input name="barcode" required={true} />
        </label>
        <label>
          Cost:
          <input name="cost" type="float" />
        </label>
        <label>
          Name:
          <input name="name" />
        </label>
        <label>
          Description:
          <input name="description" />
        </label>
        <label>
          Price:
          <input name="price" />
        </label>

        <label>
          Photo:
          <input name="photo" />
        </label>

        <div className="submit-new-item-button">
          <button className="action-button submit-new-item-btn" type="submit">
            Submit
          </button>
        </div>
      </form>
    </>
  );
};

export default NewItem;
