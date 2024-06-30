import "../../styles/picklists/PicklistCard.scss";
import { Link } from "react-router-dom";
import picklistHelpers from "./helpers";

const PicklistCard = ({ data }) => {
  const completion = picklistHelpers.determineCompletionStatus(data.items);

  const generateClassName = () => {
    if (completion === 100) {
      return "done";
    } else if (completion > 0) {
      return "in-progress";
    } else {
      return "";
    }
  };

  return (
    <div className="picklist-card-container">
      <Link
        to={`/picklists/${data.picklistNumber}`}
        className={`picklist-card`}
      >
        <p>{data.picklistNumber}</p>
        <p className={`status ${generateClassName()}`}>
          {generateClassName() === "in-progress" && "In Progress"}
          {generateClassName() === "done" && "Finished"}
        </p>
        <p className="item-count">{data.items.length}</p>
      </Link>
      <div
        className="loading-bar"
        style={{
          width: `${completion}%`,
          backgroundColor: `${completion === 100 ? "green" : "blue"}`,
        }}
      ></div>
    </div>
  );
};

export default PicklistCard;
