const stages = {};

export const createStage = (uuid) => {
  stages[uuid] = [];
};

export const getStage = (uuid) => {
  return stages[uuid];
};

export const setStage = (uuid, id, timeStamp) => {
  return stages[uuid].push({ id, timeStamp });
};

export const clearStage = (uuid) => {
  return (stages[uuid] = []);
};
