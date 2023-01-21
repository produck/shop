import { Normalizer, P, PROPERTY, S, T, U } from '@produck/mold';

import * as Utils from '../Utils.mjs';

const FieldSchema = S.Object({
	accessor: S.Object({
		[PROPERTY]: S.Object({
			get: P.OrNull(P.Function()),
			set: P.OrNull(P.Function()),
		}),
	}),
	values: S.Object({ [PROPERTY]: P.Any() }),
});

const Schema = S.Object({
	prototype: FieldSchema,
	constructor: FieldSchema,
});

const normalize = Normalizer(Schema);

function defineMember(target, options) {
	const { accessor, values } = options;

	for (const name in values) {
		Utils.defineValueMember(target, name, values[name]);
	}

	for (const name in accessor) {
		const { get, set } = accessor[name];

		Object.defineProperty(target, name, {
			get: get === null ? undefined : get,
			set: set === null ? undefined : set,
		});
	}
}

export function BaseDefiner(provide) {
	if (!T.Native.Function(provide)) {
		U.throwError('provide', 'function');
	}

	return function defineBase(Abstract, { NAME, Throw }) {
		const _options = provide(Throw);
		const { prototype, constructor } = normalize(_options);

		const BaseModel = { [NAME]: class extends Abstract {} }[NAME];

		defineMember(BaseModel.prototype, prototype);
		defineMember(BaseModel, constructor);

		return BaseModel;
	};
}
