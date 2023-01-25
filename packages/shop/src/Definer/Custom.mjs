import { Normalizer, P, PROPERTY, S } from '@produck/mold';

import * as Utils from '../Utils.mjs';

const FieldSchema = S.Object({ [PROPERTY]: P.Function() });
const normalize = Normalizer(FieldSchema);

function implement(targetField, options) {
	for (const name in options) {
		if (targetField[name] === undefined) {
			throw new Error(`The member(${name}) is NOT declared.`);
		}

		Utils.defineValueMember(targetField, name, options[name]);
	}
}

export function CustomDefiner(_prototype = {}, _constructor = {}) {
	const prototype = normalize(_prototype);
	const constructor = normalize(_constructor);

	return function defineCustom(Base, { NAME }) {
		const CustomModel = { [NAME]: class extends Base {} }[NAME];

		implement(CustomModel.prototype, prototype);
		implement(CustomModel, constructor);

		return CustomModel;
	};
}
