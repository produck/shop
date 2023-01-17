import { P, S } from '@produck/mold';

export const Schema = S.Object({
	name: P.StringPattern(/^[0-9A-Z][0-9A-Za-z]*$/),
});
