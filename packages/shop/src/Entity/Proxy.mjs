import * as Model from '../Model/index.mjs';

export function ProxyModelClass(Custom) {
	const CLASS_NAME = `${Custom.name}Proxy`;

	const Proxy = { [CLASS_NAME]: class extends Custom {
		constructor(data) {
			super(data);
			Model.Data.set(this, data);
		}
	} }[CLASS_NAME];

	Object.freeze(Proxy.prototype);

	return Object.freeze(Proxy);
}
