const determineCompletionStatus = (items) => {
  if (items) {
    const completedItems = items.filter((item) => item.isPicked === true);
    const completionPercent = (completedItems.length / items.length) * 100;
    console.log({ completionPercent, completedItems });

    return completionPercent;
  }
};

export default {
  determineCompletionStatus,
};
