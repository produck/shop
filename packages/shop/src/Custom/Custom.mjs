import * as Registry from '../Registry.mjs';
import * as Model from '../Model/Model.mjs';

function CustomModelClass(name, Base, define) {
	const CLASS_NAME = `${name}${Base.name}`;

	const Custom = define(Base, {
		CLASS_NAME,
	});

	return Custom;
}

function ProxyModelClass(name, Custom) {
	const CLASS_NAME = `${name}${Custom.name}Proxy`;

	const Proxy = { [CLASS_NAME]: class extends Custom {
		constructor(data) {
			super(data);
			Registry.Data.set(this, data);
		}
	} }[CLASS_NAME];

	return Proxy;
}

class CustomModelProxyPrivateMember {
	#CustomModelProxy = null;
	#association = new Map();

	constructor(CustomModelProxy) {
		this.#CustomModelProxy = CustomModelProxy;
	}

	To(target, as) {
		const table = this.#association.has(target)
			? this.#association.get(target)
			: this.#association.set(target, {}).get(target);

		if (Object.hasOwn(table, as)) {
			throw new Error();
		}

		table[as] = true;
	}
}

export function define(name, _options) {
	if (!Model.isBase(options.Base)) {
		throw new Error();
	}

	const Custom = CustomModelClass(name, options.Base, options.custom);
	const Proxy = ProxyModelClass(name, Custom);

	Registry.Custom.set(Proxy, new CustomModelProxyPrivateMember(Proxy));

	return Proxy;
}

export const is = any => Registry.Custom.has(any);
