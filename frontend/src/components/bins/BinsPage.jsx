import { useState, useEffect } from "react";
import binService from "../../services/bins";
import BinBlobs from "./BinBlobs";
import BinsList from "./BinsList";
import NewBin from "./NewBin";
import "../../styles/bins/BinsPage.scss";
import { CgSearch as SearchButton } from "react-icons/cg";
import useNotificationStore from "../../zustand/useNotificationStore";
import "../../styles/_buttons.scss";
import { IoGrid as Blob, IoList as List } from "react-icons/io5";

const BinsPage = () => {
  const setNotification = useNotificationStore(
    (state) => state.addNotification
  );

  const [binQuery, setBinQuery] = useState("");
  const [bins, setBins] = useState([]);
  const [view, setView] = useState("list");
  const [loading, setLoading] = useState(false);

  const handleSetBinQuery = (e) => {
    setBinQuery(e.target.value);
  };

  const handleBinSearch = async (event) => {
    event.preventDefault();
    try {
      setLoading(true);
      const bin = await binService.getOneByName(binQuery);
      console.log("BIIIIIN:", { binQuery, bin });
      if (!bin[0].name) {
        setNotification("Bin not found", "error");
        return;
      }
      setBins(bin);
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
      <h1>Bins</h1>
      <div className="search-container">
        <div className="new-bin-container">
          <NewBin />
        </div>
        <form className="bin-search-form" onSubmit={handleBinSearch}>
          <input
            placeholder="Bin name..."
            value={binQuery}
            onChange={handleSetBinQuery}
          ></input>
          <button type="submit" className="svg-button action-button">
            <SearchButton />
          </button>
        </form>
        <button type="button" className="action-button" onClick={handleGetAll}>
          Get All
        </button>
      </div>

      <div className="view-changer">
        View:{" "}
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
