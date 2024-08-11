import ItemCard from "./../items/ItemCard";
import ItemsTable from "./../items/ItemsTable";

const BinsList = ({ bins }) => {
  return (
    <div className="bins-container">
      {bins.length > 0
        ? bins.map((bin) => (
            <div key={bin.id}>
              <h1>{bin.name.toUpperCase()}</h1>
              <ItemsTable items={bin.items} />
            </div>
          ))
        : null}
    </div>
  );
};

export default BinsList;
