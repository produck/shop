import * as Utils from './Utils.mjs';

function assertImplemented(name) {
	throw new Error(`Member '.${name}()' MUST be implemented.`);
}

function AssertNamespace() {
	return Object.freeze({
		Implemented: assertImplemented,
	});
}

function normalizeAbstract(_Abstract) {
	return _Abstract;
}

export function AbstractModelClass({
	name, Super, define, updatable, deletable, creatable,
}) {
	const CLASS_NAME = `Abstract${name}`;
	const Assert = AssertNamespace();
	const injection = Object.freeze({ NAME: CLASS_NAME, Assert });

	const AbstractModel = normalizeAbstract(define(Super, injection));

	function defineAbstractMethod(object, name) {
		const method = { [name]: function () {
			Assert.Implemented(name);
		} }[name];

		Utils.defineValueMember(object, name, method);
	}

	Utils.fixClassName(AbstractModel, CLASS_NAME);

	if (!Object.hasOwn(AbstractModel, '_has')) {
		Utils.defineValueMember(AbstractModel, '_has', function _has(data) {
			return this._get(data) !== null;
		});
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
