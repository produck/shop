const DataStore = new WeakMap();
export const _ = model => DataStore.get(model);
export const set = (model, data) => DataStore.set(model, data);
