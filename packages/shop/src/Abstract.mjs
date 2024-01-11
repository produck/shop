import { throwShopError } from './Error.mjs';

function assertImplemented(name) {
	throwShopError(`Member(${name}) is NOT implemented.`);
}

const MODEL_MEMBER_NAMES = ['load', 'save', 'destroy'];

export class AbstractModel {
	static async _has(key) {
		return await this.get(key) === null;
	}

	static async _get() {
		assertImplemented('static _get');
	}

	static async _query() {
		assertImplemented('static _query');
	}

	_load() {
		assertImplemented('_load');
	}

	_save() {
		assertImplemented('_save');
	}

	_destroy() {
		assertImplemented('_destroy');
	}

	#data;

	#empty = () => {
		if (this.#data === null) {
			throwShopError('The model instance data has been empty.');
		}

		this.#data = null;
	};

	static async get() {
		return null;
	}

	static async query() {
		return [];
	}

	static async create(data) {
		const model = new this(data);

		await model.save();

		return model;
	}

	async load() {
		await this._load(this.data, this.#empty);
	}

	async save() {
		await this._save(this.data, this.#empty);
	}

	async destroy() {
		await this._destroy(this.data);
		this.#empty();
	}

	constructor(data) {
		this.#data = data;
		Object.freeze(this);
	}

	get data() {
		return this.#data;
	}

	get isDestroyed() {
		return this.data === null;
	}
}

export function EnsureNotDestroyed(prototype, name) {
	const member = prototype[name];

	prototype[name] = function ensureNotDestroyed(...args) {
		if (!this.isDestroyed) {
			throwShopError('The model instance has been destroyed.');
		}

		return member.apply(this, args);
	};
}

for (const name of MODEL_MEMBER_NAMES) {
	EnsureNotDestroyed(AbstractModel.prototype, name);
}
