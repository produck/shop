import { T, U } from '@produck/mold';

import * as Utils from './Utils.mjs';

class NotImplementedError extends Error {
	name = 'NotImplementedError';
}

function assertImplemented(name) {
	throw new NotImplementedError(`Abstract member(${name}) is NOT implemented.`);
}

function AssertNamespace() {
	return Object.freeze({
		Implemented: assertImplemented,
	});
}

export function AbstractModelClass(Super, {
	name, define, updatable, deletable, creatable,
}) {
	const CLASS_NAME = `Abstract${name}`;
	const Assert = AssertNamespace();
	const injection = Object.freeze({ NAME: CLASS_NAME, Assert });

	const AbstractModel = define(Super, injection);

	if (!T.Native.Function(AbstractModel)) {
		U.throwError('AbstractModel <= define()', 'function');
	}

	if (!Object.prototype.isPrototypeOf.call(Super, AbstractModel)) {
		U.throwError('AbstractModel <= define()', `Class extends ${Super.name}`);
	}

	function defineAbstractMethod(object, name) {
		const method = { [name]: function () {
			Assert.Implemented(name);
		} }[name];

		Utils.defineValueMember(object, name, method);
	}

	Utils.fixClassName(AbstractModel, CLASS_NAME);

	if (!Object.hasOwn(AbstractModel, '_has')) {
		defineAbstractMethod(AbstractModel, '_has');
	}

	if (!Object.hasOwn(AbstractModel, '_get')) {
		defineAbstractMethod(AbstractModel, '_get');
	}

	if (!Object.hasOwn(AbstractModel, '_query')) {
		defineAbstractMethod(AbstractModel, '_query');
	}

	if (creatable && !Object.hasOwn(AbstractModel, '_create')) {
		defineAbstractMethod(AbstractModel, '_create');
	}

	const { prototype } = AbstractModel;

	if (!Object.hasOwn(prototype, '_load')) {
		defineAbstractMethod(prototype, '_load');
	}

	if (updatable && !Object.hasOwn(prototype, '_save')) {
		defineAbstractMethod(prototype, '_save');
	}

	if (deletable && !Object.hasOwn(prototype, '_destroy')) {
		defineAbstractMethod(prototype, '_destroy');
	}

	return AbstractModel;
}
