import { AbstractModelClass } from './Abstract.mjs';
import { BaseModelClass } from './Base.mjs';

import * as Options from './Options.mjs';
import * as Instance from './Instance.mjs';

const ModelRegistry = new WeakSet();

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
		clone: options.clone,
		...able,
	});

	Object.defineProperty(Base.prototype, 'toJson', {
		writable: false,
		value: function toJsonProxy() {
			return options.toJson(this, Instance.get(this).data);
		},
	});

	ModelRegistry.add(Base);

	return Base;
}

export const isBase = any => ModelRegistry.has(any);
export { Instance, Options };
