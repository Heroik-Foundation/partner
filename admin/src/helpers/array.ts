export function filterArrayByDateRange(
  startDate?: Date,
  endDate?: Date,
  array?: any[]
) {
  const startTimestamp = startDate ? new Date(startDate).getTime() : Date.now();
  const endTimestamp = endDate ? new Date(endDate).getTime() : Date.now();

  return array?.filter((item) => {
    const createdAtTimestamp = new Date(item.createdAt).getTime();
    return (
      createdAtTimestamp >= startTimestamp && createdAtTimestamp <= endTimestamp
    );
  });
}

export function filterEventArrayByDateRange(
  startDate?: Date,
  endDate?: Date,
  array?: any[]
) {
  const startTimestamp = startDate ? new Date(startDate).getTime() : Date.now();
  const endTimestamp = endDate ? new Date(endDate).getTime() : Date.now();

  return array?.filter((item) => {
    const createdAtTimestamp = new Date(item?.updatedAt).getTime();
    return (
      createdAtTimestamp >= startTimestamp && createdAtTimestamp <= endTimestamp
    );
  });
}

export function findObjectById(array: any[], targetId: number | string) {
  return array.find((obj) => obj._id === targetId);
}

export function removeObjectById(array: any[], idToRemove: number | string) {
  return array.filter((obj) => obj._id !== idToRemove);
}
