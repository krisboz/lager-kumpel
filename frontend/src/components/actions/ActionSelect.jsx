import useActionStore from "../../zustand/useActionStore";
import useNotificationStore from "../../zustand/useNotificationStore";
import "../../styles/actions2/ActionSelect.scss";

const ActionSelect = () => {
  const notifications = useNotificationStore((state) => state.notifications);
  const { action, setAction } = useActionStore();

  const handleChange = (event) => {
    setAction(event.target.value);
  };

  return (
    <>
      <div
        className={`action-display-container ${action} ${
          notifications.length > 0 &&
          notifications.filter((el) => el.type === "info").length > 0
            ? "blink"
            : ""
        }`}
      >
        <p className="action-display">{action.toUpperCase()}</p>
        <select value={action} onChange={handleChange}>
          <option value="">Choose Action</option>
          <option value="add">Add</option>
          <option value="move">Move</option>
          <option value="remove">Remove</option>
        </select>
      </div>
    </>
  );
};

export default ActionSelect;
