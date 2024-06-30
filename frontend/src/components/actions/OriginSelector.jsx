import { useState } from "react";
import { FiEdit3 as Edit } from "react-icons/fi";

const OriginSelector = (origin, handleOriginSubmit, resetOrigin) => {
  const [originIntermediary, setOriginIntermediary] = useState("");

  if (!origin) {
    return (
      <form onSubmit={(e) => handleOriginSubmit(e, originIntermediary)}>
        <label>
          Origin:
          <input
            name="origin"
            onChange={(e) => setOriginIntermediary(e.target.value)}
            value={originIntermediary}
          />
        </label>
        <button type="submit">Submit</button>
      </form>
    );
  }
  return (
    <div>
      <p>
        Origin: {origin.name}{" "}
        <button onClick={resetOrigin}>
          <Edit />
        </button>
      </p>
    </div>
  );
};

export default OriginSelector;
