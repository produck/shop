import { T, U } from '@produck/mold';
import * as Model from './Model/index.mjs';

import { CustomModelClass } from './Custom.mjs';
import { ProxyModelClass } from './Proxy.mjs';

const EntityRegistry = new WeakMap();

export function defineEntity(name, ModelClass, define) {
	if (!T.Native.String(name)) {
		U.throwError('name', 'string');
	}

	if (!Model.isModel(ModelClass)) {
		U.throwError('ModelClass', 'Class <= Model.define()');
	}

	if (!T.Native.Function(define)) {
		U.throwError('define', 'function');
	}

	const Custom = CustomModelClass(name, ModelClass, define);
	const Proxy = ProxyModelClass(name, Custom);

	EntityRegistry.set(Proxy, {});

	return Proxy;
}

export const isEntity = any => EntityRegistry.has(any);
