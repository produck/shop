import { T, U } from '@produck/mold';
import * as Descriptor from './Descriptor.mjs';

function implemented(type, name) {
	throw new Error(`${type} '.${name}()' MUST be implemented.`);
}

function setup(_object, _descriptor) {
	const descriptor = Descriptor.normalizeMember(_descriptor);
	const { namer, values, getters, setters, methods } = descriptor;

	for (const _name in values) {
		Object.defineProperty(_object, namer(_name), { value: values[_name] });
	}

	for (const _name in methods) {
		const method = methods[_name];
		const name = namer(_name);

		_object[name] = method === null ? () => implemented('Method', name) : method;
	}

	for (const _name in getters) {
		const getter = getters[_name];
		const name = namer(_name);

		const finalGetter = getter === null
			? () => implemented('Getter', name)
			: function getter() {
				return getter(this);
			};

		Object.defineProperty(_object, name, { get: finalGetter });
	}

	for (const _name in setters) {
		const setter = setters[_name];
		const name = namer(_name);

		const finalSetter = setter === null
			? () => implemented('Setter', name)
			: function setter(value) {
				setter(this, value);
			};

		Object.defineProperty(_object, namer(_name), { set: finalSetter });
	}
}

function assertClass(any) {
	if (!T.Native.Function(any)) {
		U.throwError('Class', 'Function');
	}
}

export function setupPrototype(Class, _descriptor) {
	assertClass(Class);
	setup(Class.prototype, _descriptor);
}

export function setupStatic(Class, _descriptor) {
	assertClass(Class);
	setup(Class, _descriptor);
}

export {
	setup as Prototype,
	setupStatic as Static,
};
