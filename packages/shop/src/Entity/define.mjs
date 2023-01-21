import * as Options from './Options.mjs';
import { CustomModelClass } from './Custom.mjs';
import { ProxyModelClass } from './Proxy.mjs';

const EntityRegistry = new WeakMap();

export function defineEntity(_options) {
	const options = Options.normalize(_options);
	const { name, Model, define } = options;

	const Custom = CustomModelClass(name, Model, define);
	const Proxy = ProxyModelClass(Custom);

	EntityRegistry.set(Proxy, {});

	return Proxy;
}

export const isEntity = any => EntityRegistry.has(any);
