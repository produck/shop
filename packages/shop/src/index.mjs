import { throwShopError } from './Error.mjs';
import { AbstractModel } from './Abstract.mjs';

function OperationNotSupported() {
	throwShopError('Operation is NOT supported.');
}

export function defineModel(Origin, options) {
	const MODEL_CLASS_NAME = `${Origin.name}Model`;

	const Assert = Object.freeze({
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
	});

	const Model = { [MODEL_CLASS_NAME]: class extends AbstractModel {
		get key() {
			const key = options.key(this.data);

			Assert.Key(key);

			return key;
		}

		get origin() {
			return options.origin(this.data);
		}

		async save() {
			Assert.Data(this.data);
			await super.save();
		}

		async load() {
			await super.load();
			Assert.Data(this.data);
		}

		static async has(key) {
			Assert.Key(key);

			const flag = await this._has(key);

			if (typeof flag !== 'boolean') {
				throwShopError('Bad flag.');
			}

			return flag;
		}

		static async get(key) {
			Assert.Key(key);

			const data = await this._get(key);

			if (data === null) {
				return null;
			}

			Assert.Data(data);

			return new this(data);
		}

		static async query(filter) {
			Assert.Filter(filter);

			const list = await this._query(filter);

			if (!Array.isArray(list)) {
				throwShopError('Bad data list as querying result.');
			}

			return list.map(data => {
				Assert.Data(data);

				return new this(data);
			});
		}

		static async create(data) {
			Assert.Data(data);

			return await super.create(data);
		}
	} }[MODEL_CLASS_NAME];

	if (!options.creatable) {
		Model.create = OperationNotSupported;
	}

	if (!options.mutable) {
		Model.prototype.save = OperationNotSupported;
	}

	if (!options.deletable) {
		Model.prototype.destroy = OperationNotSupported;
	}

	return Object.freeze(Model);
}
