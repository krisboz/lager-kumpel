import ItemCard from "./../items/ItemCard";

const BinsList = ({ bins }) => {
  return (
    <div className="bins-container">
      {bins.length > 0
        ? bins.map((bin) => (
            <div key={bin.id}>
              <h3>{bin.name}</h3>
              <h5>Items</h5>
              {bin.items.map((item, index) => (
                <ItemCard item={item} />
              ))}
            </div>
          ))
        : null}
    </div>
  );
};

export default BinsList;
