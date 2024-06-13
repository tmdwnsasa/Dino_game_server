const items = {};

export const createItem = (uuid) => {
  items[uuid] = [];
};

export const getItem = (uuid) => {
  return items[uuid];
};

export const setItem = (uuid, id) => {
  return items[uuid].push({ id });
};

export const clearItem = (uuid) => {
  return (items[uuid] = []);
};
