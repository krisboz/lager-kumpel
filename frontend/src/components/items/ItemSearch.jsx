import { useState } from "react";

const ItemSearch = ({ setQuery }) => {
  const [inputValue, setInputValue] = useState("");
  const handleItemSearch = (event) => {
    event.preventDefault();
    setQuery(inputValue);
  };

  const handleAllSearch = (event) => {
    setQuery("all");
    setInputValue("");
  };
  return (
    <div className="searchbar-container">
      <form onSubmit={handleItemSearch}>
        <label>
          Search items:{" "}
          <input
            name="searchbar"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
          />
        </label>

        <button type="submit">Search</button>
        <button type="button" onClick={handleAllSearch}>
          Get All
        </button>
      </form>
    </div>
  );
};

export default ItemSearch;
