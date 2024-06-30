const ActionSelect = ({ handlerFunc }) => {
  return (
    <div className="action-select-container">
      <button name="ADD" onClick={(e) => handlerFunc(e)}>
        Add
      </button>
      <button name="MOVE" onClick={(e) => handlerFunc(e)}>
        Move
      </button>
      <button name="REMOVE" onClick={(e) => handlerFunc(e)}>
        Remove
      </button>
    </div>
  );
};

export default ActionSelect;
