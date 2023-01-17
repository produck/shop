import { T, U } from '@produck/mold';

import * as Utils from './Utils.mjs';
import * as Instance from './Instance.mjs';

function ThrowNamespace(name) {
	const namespace = function Throw(message, ErrorConstructor = Error) {
		throw new ErrorConstructor(message);
	};

	const ERROR_CLASS_NAME = `${name}ImplementError`;

	const ImplementError = { [ERROR_CLASS_NAME]: class extends Error {
		name = ERROR_CLASS_NAME;
	} }[ERROR_CLASS_NAME];

	namespace.ImplementError = (message, cause) => {
		throw new ImplementError(message, { cause });
	};

	return Object.freeze(namespace);
}

export function BaseModelClass({
	name, Abstract, define, Data, clone, updatable, deletable, creatable,
}) {
	const CLASS_NAME = `Base${name}`;
	const Throw = ThrowNamespace(name);

	const injection = Object.freeze({
		Throw, Data, clone,
		Private: model => Instance.get(model),
		NAME: CLASS_NAME,
	});

	const BaseModel = define(Abstract, injection);

	if (!T.Native.Function(BaseModel)) {
		U.throwError('BaseModel <= define()', 'function');
	}

	if (!Object.prototype.isPrototypeOf.call(Abstract, BaseModel)) {
		U.throwError('BaseModel <= define()', `Class extends ${Abstract.name}`);
	}

	Utils.fixClassName(BaseModel, CLASS_NAME);

	const ensureData = data => {
		try {
			return Data(data);
		} catch (cause) {
			Throw.ImplementError(`Bad ${name} data.`, cause);
		}
	};

	Utils.defineValueMember(BaseModel, 'has', async function has(_data) {
		const data = Data(_data);
		const _flag = await this._has(data);

		if (typeof _flag !== 'boolean') {
			Throw.ImplementError(`Bad ${name} flag when has(), one boolean expected.`);
		}

		return _flag;
	});

	Utils.defineValueMember(BaseModel, 'get', async function get(_data) {
		const data = Data(_data);
		const incomingData = await this._get(data);

		if (incomingData === null) {
			return null;
		}

		return new this(ensureData(incomingData));
	});

	if (creatable) {
		Utils.defineValueMember(BaseModel, 'create', async function create(_data) {
			const data = Data(_data);

			if (await this.has(data)) {
				Throw(`Duplicated ${name} data.`);
			}

			return new this(ensureData(await this._create(data)));
		});
	}

	const ensureDataInResult = (_data, index) => {
		try {
			return Data(_data);
		} catch (cause) {
			Throw.ImplementError(`Bad ${name} data at ${index} in result.`, cause);
		}
	};

	Utils.defineValueMember(BaseModel, 'query', async function query(filter) {
		const _result = await this._query(filter);

		if (!T.Helper.Array(_result)) {
			Throw.ImplementError(`Bad ${name} result when query(), one array expected.`);
		}

		const result = _result.map(ensureDataInResult);

		return result.map(data => new this(data));
	});

	if (deletable) {
		const callDestroy = model => model.destroy;

		Utils.defineValueMember(BaseModel, 'remove', async function remove(filter) {
			const modelList = await this.query(filter);

			await Promise.all(modelList.map(callDestroy));

			return modelList;
		});
	}

	const { prototype } = BaseModel;

	const ensureCopy = data => {
		try {
			return Data(data);
		} catch (cause) {
			Throw.ImplementError(`Bad ${name} data copy.`, cause);
		}
	};

	Utils.defineValueMember(prototype, 'load', async function load() {
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
		Utils.defineValueMember(prototype, 'save', async function save() {
			const instance = Instance.get(this);
			const copy = ensureCopy(clone(instance.data));
			const data = ensureData(await this._save(copy));

			instance.data = data;

			return this;
		});
	}

	if (deletable) {
		Utils.defineValueMember(prototype, 'destroy', async function destroy() {
			const instance = Instance.get(this);
			const copy = ensureCopy(clone(instance.data));

			await this._destroy(copy);
			instance.data = null;

			return this;
		});
	}

	return BaseModel;
}
