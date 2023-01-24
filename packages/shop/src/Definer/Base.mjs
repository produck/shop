import { T, U } from '@produck/mold';

import * as Utils from '../Utils.mjs';

function wrap(fn) {
	return function (...args) {
		if (this.isDestroyed) {
			throw new Error('The model instance has been destroyed.');
		}

		return fn.call(this, ...args);
	};
}

function assertMemberName(any) {
	if (!T.Native.String(any)) {
		U.throwError('name', 'string');
	}
}

function assertFunctionArg(any, role) {
	if (!T.Native.Function(any)) {
		U.throwError(role, 'function');
	}
}

class Declarator {
	#target = null;
	#notDestroyedRequired = false;

	constructor(target) {
		this.#target = target;
	}

	notDestroyedRequired(flag = true) {
		if (!T.Native.Boolean(flag)) {
			U.throwError('flag', 'boolean');
		}

		this.#notDestroyedRequired = flag;

		return this;
	}

	Value(name, any) {
		assertMemberName(name);
		Utils.defineValueMember(this.#target, name, any);

		return this;
	}

	#SafeMethod(name, fn) {
		this.Value(name, wrap(fn));
	}

	#UnsafeMethod(name, fn) {

		this.Value(name, fn);
	}

	Method(name, fn) {
		assertMemberName(name);
		assertFunctionArg(fn, 'fn');

		if (this.#notDestroyedRequired) {
			this.#SafeMethod(name, fn);
		} else {
			this.#UnsafeMethod(name, fn);
		}

		return this;
	}

	#SafeAccessor(name, getter, setter) {
		Object.defineProperty(this.#target, name, {
			get: wrap(getter),
			set: wrap(setter),
		});
	}

	#UnsafeAccessor(name, getter, setter) {
		Object.defineProperty(this.#target, name, {
			get: getter,
			set: setter,
		});
	}

	Accessor(name, getter, setter = () => {}) {
		assertMemberName(name);
		assertFunctionArg(getter, 'getter');
		assertFunctionArg(setter, 'setter');

		if (this.#notDestroyedRequired) {
			this.#SafeAccessor(name, getter, setter);
		} else {
			this.#UnsafeAccessor(name, getter, setter);
		}

		return this;
	}
}

export function BaseDefiner(factory) {
	if (!T.Native.Function(factory)) {
		U.throwError('factory', 'function');
	}

	return function defineBase(Abstract, { NAME, Throw }) {
		const BaseModel = { [NAME]: class extends Abstract {} }[NAME];

		const Declare = {
			Prototype: new Declarator(BaseModel.prototype),
			Constructor: new Declarator(BaseModel),
		};

		factory({ Throw, Declare });

		return BaseModel;
	};
}
