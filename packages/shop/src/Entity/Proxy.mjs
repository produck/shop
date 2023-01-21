import * as Data from '../Data.mjs';

export function ProxyModelClass(Custom) {
	const CLASS_NAME = `${Custom.name}Proxy`;

	const Proxy = { [CLASS_NAME]: class extends Custom {
		constructor(data) {
			super(data);
			Data.set(this, data);
		}
	} }[CLASS_NAME];

	Object.freeze(Proxy.prototype);

	return Object.freeze(Proxy);
}
