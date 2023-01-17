import * as Registry from './Registry.mjs';
import { AbstractModelClass } from './Abstract.mjs';
import { BaseModelClass } from './Base.mjs';
import * as Options from './Options.mjs';

export function define(name, _options) {
	const options = Options.normalize(_options);
	const { creatable, updatable, deletable } = options;
	const able = { creatable, updatable, deletable };

	const Abstract = AbstractModelClass({
		name,
		Super: options.super,
		define: options.abstract,
		...able,
	});

	const Base = BaseModelClass({
		name,
		Abstract,
		define: options.base,
		Data: options.data,
		...able,
	});

	Object.defineProperty(Base.prototype, 'toJson', {
		writable: false,
		value: function toJsonProxy() {
			return options.toJson(this, Registry.Instance.get(this));
		},
	});

	Registry.Model.add(Base);

	return Base;
}

export const isBase = any => Registry.Model.has(any);
export { Registry };
