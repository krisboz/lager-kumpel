import "../../styles/items/ExpandedItem.scss";

const ExpandedItem = ({ item }) => {
  console.log(item.locations);
  if (item) {
    return (
      <div className="expanded-item">
        <div className="photo-container">
          <img src={item.photo} alt="item photo" />
        </div>
        <p>{item.barcode}</p>
        <p>{item.name}</p>

        <div className="locations-container">
          <h4>Locations</h4>
          <table>
            <thead>
              <tr>
                <th>Location</th>
                <th>Quantity</th>
              </tr>
            </thead>
            <tbody>
              {item.locations.map(({ location, quantity }) => (
                <tr key={location}>
                  <td>{location}</td>
                  <td>{quantity}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    );
  }
};

export default ExpandedItem;
