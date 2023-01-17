import { Circ, P, S } from '@produck/mold';

export const Schema = Circ(Self => S.Object({
	options: P.Any(null),
	scope: P.OrNull(S.Object({
		model: P.String(),
		as: P.String(),
		filter: Self,
	}), false),
}));
