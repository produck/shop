import { AbstractModel } from './Abstract.mjs';

class ShopError extends Error {
	get name() {
		return 'ShopError';
	}
}

const throwShopError = message => {
	throw new ShopError(message);
};

const { freeze } = Object;

export function defineModel(Origin, options) {
	const CLASS_NAME = `${Origin.name}Model`;

	const Assert = {
		Data: data => {
			if (!options.schema.data(data)) {
				throwShopError('Bad data.');
			}
		},
		Key: key => {
			if (!options.schema.key(key)) {
				throwShopError('Bad key.');
			}
		},
		Filter: filter => {
			if (!options.schema.filter(filter)) {
				throwShopError('Bad filter.');
			}
		},
	};

	function fromData(data) {
		Assert.Data(data);

		const origin = new Origin(...options.args(data));
		const model = new Model(origin);

		return model;
	}

	const Model = freeze({ [CLASS_NAME]: class extends AbstractModel {
		origin;

		#at = 0;
		#data = {};

		data = new Proxy(this.#data, {
			set(target, property, value) {
				target[property] = value;

				return true;
			},
		});

		get key() {
			return null;
		}

		get at() {
			return new Date(this.#at);
		}

		async save() {
			if (!options.mutable) {
				throwShopError('The model is NOT mutable.');
			}

			options.write(this.origin, this.#data);
			Assert.Data(this.#data);
			await this._save(this.#data);
			this.#at = Date.now();
		}

		async load() {
			await this._load(this.#data);
			Assert.Data(this.#data);
			options.read(this.origin, this.#data);
			this.#at = Date.now();
		}

		async destroy() {
			if (!options.deletable) {
				throwShopError('The model is NOT deletable.');
			}

			Assert.Data(this.#data);
			await this._save(this.#data);
		}

		isDestroyed() {

		}
		static async has(key) {
			Assert.Key(key);
			await this._has(key);
		}

		static async get(key) {
			Assert.Key(key);

			const data = await this._get(key);

			return fromData(data);
		}

		static async query(filter) {
			Assert.Filter(filter);

			const list = await this._query(filter);

			if (!Array.isArray(list)) {
				throwShopError('Bad data list as querying result.');
			}

			return list.map(data => fromData(data));
		}

		static async create(data) {
			if (!options.creatable) {
				throwShopError('The model is NOT creatable.');
			}

			const model = fromData(data);

			await model.save();
		}

		constructor(origin) {
			super();
			this.origin = origin;
			freeze(this);
		}
	} }[CLASS_NAME]);

	return Model;
}
