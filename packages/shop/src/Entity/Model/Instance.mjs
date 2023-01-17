const InstanceRegistry = new WeakMap();

export class ModelInstanceMember {
	data = null;
}

/** @return {ModelInstanceMember} */
export const get = model => InstanceRegistry.get(model);

export const set = (model, data) => {
	InstanceRegistry.set(model, new ModelInstanceMember(data));
};
