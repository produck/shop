import { T, U } from '@produck/mold';

import * as Lower from './Lower.mjs';

function Throw(message) {
	throw new Error(message);
}

export class ShopRegistry {
	#map = new Map();

	define(name, options, Abstract, Base, Custom, Super) {
		//TODO validate params

		const _Abstract = Lower.Abstract(name, options, Super, Abstract);

		//TODO assert _Abstract

		const _Base = Lower.Base(name, options, _Abstract, Base);

		//TODO assert _Base

		const _Custom = Lower.Custom(name, options, _Base, Custom);

		//TODO assert _Custom

		const CLASS_NAME = `${_Custom.name}Model`;

		const ModelClass = { [CLASS_NAME]: class extends _Custom {
			#data = null;
			#isNew = true;

			constructor(data) {
				super();
				this.#data = data;
			}

			static build(data) {
				return new this(data, true);
			}
		} }[CLASS_NAME];

		this.#map.set(name, ModelClass);

		return ModelClass;
	}

	Model(name) {
		if (!T.Native.String(name)) {
			U.throwError('name', 'string');
		}

		if (!this.#map.has(name)) {
			Throw(`Undefined Model(${name}).`);
		}

		return this.#map.get(name);
	}
}
