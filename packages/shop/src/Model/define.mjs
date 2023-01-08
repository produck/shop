import { P, PROPERTY, S } from '@produck/mold';

import * as BaseAbstract from './BaseAbstract/index.mjs';
import * as Descriptor from './Descriptor.mjs';
import { methods as NativeMethod } from './Native.mjs';

export function defineModel(_descriptor, factory) {
	const descriptor = Descriptor.normalize(_descriptor);
	const { name, Data, Super, Abstract, Base, Native } = descriptor;

	const PrototypeNative = {};
	const StaticNative = {};

	for (const name of Native.Prototype) {
		if (Native.Prototype[name]) {
			PrototypeNative[name] = NativeMethod[name];
		}
	}

	for (const name of Native.Static) {
		if (Native.Static[name]) {
			StaticNative[name] = NativeMethod[name];
		}
	}

	const Model = BaseAbstract.define({
		name,
		Super,
		Abstract: {
			Prototype: {
				...Abstract.Prototype, methods: {
					...PrototypeNative,
					...Abstract.Prototype.methods,
				},
			},
			Static: {
				...Abstract.Static, methods: {
					...StaticNative,
					...Abstract.Static.methods,
				},
			},
		},
		Base: {
			Prototype: {
				...Base.Prototype, methods: {
					...PrototypeNative,
					...Abstract.Prototype.methods,
				},
			},
			Static: {
				...Base.Static, methods: {
					...StaticNative,
					...Abstract.Static.methods,
				},
			},
		},
	});

	return Model;
}
