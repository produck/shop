import * as Utils from './Utils.mjs';
import * as Instance from './Instance.mjs';

function ThrowNamespace(name) {
	const namespace = function Throw(message, ErrorConstructor = Error) {
		throw new ErrorConstructor(message);
	};

	const ERROR_CLASS_NAME = `${name}ImplementError`;

	const ImplementError = {
		[ERROR_CLASS_NAME]: class extends Error {
			name = ERROR_CLASS_NAME;
		},
	}[ERROR_CLASS_NAME];

	namespace.ImplementError = (message, cause) => {
		throw new ImplementError(message, { cause });
	};

	return Object.freeze(namespace);
}

function normalizeBase(_Base) {

	return _Base;
}

export function BaseModelClass({
	name, Abstract, define, Data, clone, updatable, deletable, creatable,
}) {
	const CLASS_NAME = `Base${name}`;
	const Throw = ThrowNamespace();
	const injection = Object.freeze({ NAME: CLASS_NAME, Throw });

	const ensureDataInResult = (_data, index) => {
		try {
			return Data(_data);
		} catch (cause) {
			Throw.ImplementError(`Bad ${name} data at ${index} in result.`, cause);
		}
	};

	const ensureData = data => {
		try {
			return Data(data);
		} catch (cause) {
			Throw.ImplementError(`Bad ${name} data.`, cause);
		}
	};

	const ensureCopy = data => {
		try {
			return Data(data);
		} catch (cause) {
			Throw.ImplementError(`Bad ${name} data copy.`, cause);
		}
	};

	const BaseModel = normalizeBase(define(Abstract, injection));

	Utils.fixClassName(BaseModel, CLASS_NAME);

	Utils.defineMember(BaseModel, 'query', async function query(filter) {
		const _result = await this._query(filter);

		if (!Array.isArray(_result)) {
			Throw.ImplementError(`Bad ${name} result when query(), one array expected.`);
		}

		const result = _result.map(ensureDataInResult);

		return result.map(data => new this(data));
	});

	Utils.defineMember(BaseModel, 'has', async function has(data) {
		const _flag = await this._has(data);

		if (typeof _flag !== 'boolean') {
			Throw.ImplementError(`Bad ${name} flag when has(), one boolean expected.`);
		}

		return _flag;
	});

	Utils.defineMember(BaseModel, 'get', async function get(data) {
		const _data = await this._get(data);

		if (_data === null) {
			return null;
		}

		return new this(ensureData(_data));
	});

	if (creatable) {
		Utils.defineMember(BaseModel, 'create', async function create(data) {
			return new this(ensureData(await this._create(data)));
		});
	}

	if (deletable) {
		const callDestroy = model => model.destroy;

		Utils.defineMember(BaseModel, 'remove', async function remove(filter) {
			const modelList = await this.query(filter);

			await Promise.all(modelList.map(callDestroy));

			return modelList;
		});
	}

	const { prototype } = BaseModel;

	Utils.defineMember(prototype, 'load', async function load() {
		const instance = Instance.get(this);
		const copy = ensureCopy(clone(instance.data));
		const data = ensureData(await this._load(copy));

		instance.data = data;

		return this;
	});

	Object.defineProperty(prototype, 'isDestroyed', {
		get: function isDestroyed() {
			return Instance.get(this).data === null;
		},
	});

	if (updatable) {
		Utils.defineMember(prototype, 'save', async function save() {
			const instance = Instance.get(this);
			const copy = ensureCopy(clone(instance.data));
			const data = ensureData(await this._save(copy));

			instance.data = data;

			return this;
		});
	}

	if (deletable) {
		Utils.defineMember(prototype, 'destroy', async function destroy() {
			const instance = Instance.get(this);
			const copy = ensureCopy(clone(instance.data));

			await this._destroy(copy);
			instance.data = null;

			return this;
		});
	}

	return BaseModel;
}
