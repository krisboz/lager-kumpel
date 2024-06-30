import ActionSelect from "./ActionSelect";

const Banner = ({ action, handleActionSelect }) => {
  if (!action) {
    return (
      <div className="action-select-container">
        <button name="ADD" onClick={(e) => handleActionSelect(e)}>
          Add
        </button>
        <button name="MOVE" onClick={(e) => handleActionSelect(e)}>
          Move
        </button>
        <button name="REMOVE" onClick={(e) => handleActionSelect(e)}>
          Remove
        </button>
      </div>
    );
  }
  return (
    <div className={`action-banner ${action.toLowerCase()}`}>
      {" "}
      <p>{action}</p>
      <div className="action-select-container">
        <button name="ADD" onClick={(e) => handleActionSelect(e)}>
          Add
        </button>
        <button name="MOVE" onClick={(e) => handleActionSelect(e)}>
          Move
        </button>
        <button name="REMOVE" onClick={(e) => handleActionSelect(e)}>
          Remove
        </button>
      </div>
    </div>
  );
};

export default Banner;
