import { useState, useEffect } from "react";
import { GrRefresh } from "react-icons/gr";
import "../../styles/picklists/PicklistsPage.scss";

import picklistService from "../../services/picklists";
import PicklistCard from "./PicklistCard";

const PicklistsPage = () => {
  const [picklists, setPicklists] = useState([]);

  useEffect(() => {
    const fetchPicklists = async () => {
      const picklists = await picklistService.getAll();
      setPicklists(picklists);
    };
    fetchPicklists();
  }, []);

  const handleGetAll = async () => {
    const lookie = await picklistService.getAll();
    console.log(lookie);
  };

  const handleGeneratePicklists = async () => {
    try {
      await picklistService.generatePicklists();
    } catch (error) {
      console.error(
        "error in picklist generation in PicklistsPage component",
        error.message
      );
    }
  };
  return (
    <div className="picklists-page">
      <h2>Picklists</h2>
      <div className="controls-container">
        <button className="refresh-btn" onClick={handleGetAll}>
          <GrRefresh />
        </button>
        <button className="generate-btn" onClick={handleGeneratePicklists}>
          Generate Picklists
        </button>
      </div>

      <div className="picklists-container">
        {picklists.length === 0 ? (
          <h3>No picklists</h3>
        ) : (
          picklists.map((picklist) => (
            <PicklistCard key={picklist.picklistNumber} data={picklist} />
          ))
        )}
      </div>
    </div>
  );
};

export default PicklistsPage;
