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

	constructor(target) {
		this.#target = target;
	}

	Value(name, any) {
		assertMemberName(name);
		Utils.defineValueMember(this.#target, name, any);

		return this;
	}

	_Method(name, fn) {
		this.Value(name, fn);
	}

	Method(name, fn) {
		assertMemberName(name);
		assertFunctionArg(fn, 'fn');
		this._Method(name, fn);

		return this;
	}

	_Accessor(name, getter, setter) {
		Object.defineProperty(this.#target, name, {
			get: getter,
			set: setter,
		});
	}

	Accessor(name, getter, setter = () => {}) {
		assertMemberName(name);
		assertFunctionArg(getter, 'getter');
		assertFunctionArg(setter, 'setter');
		this._Accessor(name, getter, setter);

		return this;
	}
}

class PrototypeDeclarator extends Declarator {
	#notDestroyedRequired = false;

	notDestroyedRequired(flag = true) {
		if (!T.Native.Boolean(flag)) {
			U.throwError('flag', 'boolean');
		}

		this.#notDestroyedRequired = flag;

		return this;
	}

	_Method(name, fn) {
		return super._Method(name, this.#notDestroyedRequired ? wrap(fn) : fn);
	}

	_Accessor(name, getter, setter) {
		const final = this.#notDestroyedRequired
			? [wrap(getter), wrap(setter)]
			: [getter, setter];

		return super._Accessor(name, ...final);
	}
}

export function BaseDefiner(factory = () => {}, _constructor = () => []) {
	assertFunctionArg(factory, 'factory');
	assertFunctionArg(_constructor, '_constructor');

	return function defineBase(Abstract, { NAME, Throw }) {
		const BaseModel = { [NAME]: class extends Abstract {
			constructor(data) {
				const args = _constructor(data);

				if (!T.Helper.Array(args)) {
					U.throwError('args <= _constructor()', 'array');
				}

				super(...args);
			}
		} }[NAME];

		const Declare = {
			Prototype: new PrototypeDeclarator(BaseModel.prototype),
			Constructor: new Declarator(BaseModel),
		};

		factory({ Throw, Declare });

		return BaseModel;
	};
}
