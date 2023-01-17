import * as Registry from './Registry.mjs';

export class ModelInstanceMember {
	data = null;
}

/** @return {ModelInstanceMember} */
export const get = model => Registry.Instance.get(model);

export const set = (model, data) => {
	Registry.Instance.set(model, new ModelInstanceMember(data));
};
