const sumQuantities = (items) => {
  return items.reduce((total, item) => {
    return total + (item.quantity || 0);
  }, 0);
};

const generateInvoice = (order) => {
  console.log("DATA FOR THE INVOICE", { order });
};

const generateShipmentLabel = (box) => {
  console.log("DATA FOR THE SHIPMENT LABEL", { box });
};

export default { sumQuantities, generateInvoice, generateShipmentLabel };
