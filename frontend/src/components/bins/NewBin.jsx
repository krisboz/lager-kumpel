import "../../styles/items/NewItem.scss";
import binService from "../../services/bins";
import { useState } from "react";

const NewItem = () => {
  const [isExpanded, setIsExpanded] = useState(false);

  const handleSubmit = async (event) => {
    event.preventDefault();

    const name = event.target.name.value;

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
    return <button onClick={toggleIsExpanded}>Add New!</button>;
  }

  return (
    <form onSubmit={handleSubmit} className="item-input-form">
      <label>
        Name:
        <input name="name" required={true} />
      </label>

      <button type="submit">Submit</button>
      <button onClick={toggleIsExpanded}>Close Form</button>
    </form>
  );
};

export default NewItem;
