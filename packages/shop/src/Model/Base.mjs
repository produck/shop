import { T, U } from '@produck/mold';

import * as Utils from '../Utils.mjs';
import { _, set as setData } from '../Data.mjs';

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

export function BaseModelClass(Abstract, {
	name, define, Data, updatable, deletable, creatable,
}) {
	const CLASS_NAME = `Base${name}`;
	const Throw = ThrowNamespace(name);

	const BaseModel = define(Abstract, { Throw, NAME: CLASS_NAME });

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

	Utils.defineValueMember(BaseModel, 'has', async function has(...args) {
		const _flag = await this._has(...args);

		if (typeof _flag !== 'boolean') {
			Throw.ImplementError(`Bad ${name} flag when has(), one boolean expected.`);
		}

		return _flag;
	});

	Utils.defineValueMember(BaseModel, 'get', async function get(...args) {
		const _data = await this._get(...args);

		return _data === null ? null : new this(ensureData(_data));
	});

	if (creatable) {
		Utils.defineValueMember(BaseModel, 'create', async function create(...args) {
			return new this(ensureData(await this._create(...args)));
		});
	}

	const ensureDataInResult = (_data, index) => {
		try {
			return Data(_data);
		} catch (cause) {
			Throw.ImplementError(`Bad ${name} data at ${index} in result.`, cause);
		}
	};

	Utils.defineValueMember(BaseModel, 'query', async function query(...args) {
		const _result = await this._query(...args);

		if (!T.Helper.Array(_result)) {
			Throw.ImplementError(`Bad ${name} result when query(), one array expected.`);
		}

		const result = _result.map(ensureDataInResult);

		return result.map(data => new this(data));
	});

	if (deletable) {
		const callDestroy = model => model.destroy();

		Utils.defineValueMember(BaseModel, 'remove', async function remove(...args) {
			const modelList = await this.query(...args);

			await Promise.all(modelList.map(callDestroy));

			return modelList;
		});
	}

	const { prototype } = BaseModel;

	function defineMethod(methodName, method) {
		const proxy = { [methodName]: function (...args) {
			if (this.isDestroyed) {
				Throw(`The ${name} instance is destroyed.`);
			}

			return method.call(this, ...args);
		} }[methodName];

		Utils.defineValueMember(prototype, methodName, proxy);
	}

	Object.defineProperty(prototype, 'isDestroyed', {
		get: function isDestroyed() {
			return _(this) === null;
		},
	});

	defineMethod('load', async function () {
		const _data = await this._load(_(this));
		const data = _data === null ? null : ensureData(_data);

		setData(this, data);

		return this;
	});

	if (updatable) {
		defineMethod('save', async function () {
			const _data = await this._save(_(this));
			const data = _data === null ? null : ensureData(_data);

			setData(this, data);

			return this;
		});
	}

	if (deletable) {
		defineMethod('destroy', async function () {
			await this._destroy(_(this));
			setData(this, null);

			return this;
		});
	}

	return BaseModel;
}
