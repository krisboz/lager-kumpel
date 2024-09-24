const sumQuantities = (array) => {
  return array.reduce((total, item) => {
    return total + (item.quantity || 0);
  }, 0);
};

// Helper function to get date ranges for today, this month, and this year
const getDateRange = (filter) => {
  const now = new Date();
  let startDate, endDate;

  if (filter === "today") {
    startDate = new Date(now.setHours(0, 0, 0, 0)); // Start of today
    endDate = new Date(now.setHours(23, 59, 59, 999)); // End of today
  } else if (filter === "month") {
    startDate = new Date(now.getFullYear(), now.getMonth(), 1); // Start of this month
    endDate = new Date(
      now.getFullYear(),
      now.getMonth() + 1,
      0,
      23,
      59,
      59,
      999
    ); // End of this month
  } else if (filter === "year") {
    startDate = new Date(now.getFullYear(), 0, 1); // Start of this year
    endDate = new Date(now.getFullYear(), 11, 31, 23, 59, 59, 999); // End of this year
  }

  return { startDate, endDate };
};

const sumOrderRevenue = (items) => {
  const totalRevenue = items.reduce((total, item) => {
    return total + (item.price || 0); // Sum up the price of each item
  }, 0);

  const totalCost = items.reduce((total, item) => {
    console.log(item.cost);
    return total + (item.cost || 0); // Sum up the cost of each item
  }, 0);

  console.log({ totalRevenue, totalCost });

  return { totalRevenue, totalCost };
};

module.exports = {
  sumQuantities,
  getDateRange,
  sumOrderRevenue,
};
