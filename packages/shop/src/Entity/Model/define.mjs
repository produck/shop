import { AbstractModelClass } from './Abstract.mjs';
import { BaseModelClass } from './Base.mjs';
import * as Options from './Options.mjs';
import * as Utils from './Utils.mjs';

const ModelRegistry = new WeakMap();

export function defineModel(_options) {
	const options = Options.normalize(_options);
	const { Super, data, abstract, base, toJSON: _toJSON, ...shared } = options;

	const Abstract = AbstractModelClass(Super, { ...shared, define: abstract });
	const Base = BaseModelClass(Abstract, { ...shared, define: base, Data: data });

	Utils.defineValueMember(Base.prototype, 'toJSON', function toJSON() {
		return _toJSON.call(this);
	});

	ModelRegistry.set(Base, options);

	return Base;
}

export const isModel = any => ModelRegistry.has(any);
