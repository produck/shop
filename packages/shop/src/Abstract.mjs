const ImplError = class ShopNotImplementedError extends Error {
	get name() {
		return 'ShopNotImplementedError';
	}
};

function assertImplemented(name) {
	throw new ImplError(`Abstract member(${name}) is NOT implemented.`);
}

export class AbstractModel {
	static async get() {
		return null;
	}

	static async _has(key) {
		return await this.get(key) === null;
	}

	static _get() {
		assertImplemented('_get');
	}

	static _query() {
		assertImplemented('_query');
	}

	_load() {
		assertImplemented('_load');
	}

	_save() {
		assertImplemented('_save');
	}
}
