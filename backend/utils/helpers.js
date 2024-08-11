const sumQuantities = (array) => {
  return array.reduce((total, item) => {
    return total + (item.quantity || 0);
  }, 0);
};

module.exports = {
  sumQuantities,
};
