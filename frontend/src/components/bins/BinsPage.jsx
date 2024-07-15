import { useState, useEffect } from "react";
import binService from "../../services/bins";
import BinBlobs from "./BinBlobs";
import BinsList from "./BinsList";
import NewBin from "./NewBin";
import "../../styles/bins/BinsPage.scss";

const BinsPage = () => {
  const [binQuery, setBinQuery] = useState("");
  const [bins, setBins] = useState([]);
  const [view, setView] = useState("list");
  const [loading, setLoading] = useState(false);

  const handleBinSearch = async (event) => {
    event.preventDefault();
    try {
      setLoading(true);
      const bin = binService.getOneByName(binQuery);
      setBins([bin]);
      setLoading(false);
    } catch (error) {
      console.error(error);
      setLoading(false);
    }
  };

  const handleGetAll = async (event) => {
    try {
      setLoading(true);
      const bins = await binService.getAll();
      setBins(bins);
      setLoading(false);
    } catch (error) {
      setLoading(false);

      console.error("error getting bins", error);
    }
  };

  return (
    <div className="bins-page">
      <div className="search-container">
        <input />
        <NewBin />
        <form onSubmit={handleBinSearch}>
          <input
            value={binQuery}
            onChange={(e) => setBinQuery(e.value)}
          ></input>
          <button type="submit">Search</button>
          <button type="button" onClick={handleGetAll}>
            Get All
          </button>
        </form>
      </div>

      <div className="view-changer">
        <select value={view} onChange={(e) => setView(e.target.value)}>
          <option value="blob">Blob</option>
          <option value="list">List</option>
        </select>
      </div>
      {bins && (
        <>
          {view === "blob" ? (
            <BinBlobs bins={bins} />
          ) : (
            <BinsList bins={bins} />
          )}
        </>
      )}
    </div>
  );
};

export default BinsPage;
