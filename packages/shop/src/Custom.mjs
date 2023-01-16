import * as Registry from './Registry.mjs';
import * as Model from './Model.mjs';

export function define(name, Base, _options) {
	if (!Model.isBase(Base)) {
		throw new Error();
	}
}

export const isCustom = any => Registry.Custom.has(any);
