import { Normalizer, P, PROPERTY, S } from '@produck/mold';

import * as Utils from '../Utils.mjs';

const MemberSchema = P.OrNull(P.Function());
const FieldSchema = S.Object({ [PROPERTY]: MemberSchema });
const normalize = Normalizer(FieldSchema);

export function AbstractDefiner(_prototype = {}, _constructor = {}) {
	const prototype = normalize(_prototype);
	const constructor = normalize(_constructor);

	return function defineAbstract(Super, { NAME, defineAbstractMethod }) {
		const AbstractModel = { [NAME]: class extends Super {} }[NAME];

		function defineMember(target, options) {
			for (const name in options) {
				const method = options[name];

				if (method === null) {
					defineAbstractMethod(target, name);
				} else {
					Utils.defineValueMember(target, name, method);
				}
			}
		}

		defineMember(AbstractModel.prototype, prototype);
		defineMember(AbstractModel, constructor);

		return AbstractModel;
	};
}
