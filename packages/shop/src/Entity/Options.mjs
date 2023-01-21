import { S, P, Normalizer } from '@produck/mold';

export const Schema = S.Object({
	name: P.StringPattern(/^[0-9A-Z][0-9a-zA-Z]*$/)(),
	Model: P.Function(),
	define: P.Function(),
});

export const normalize = Normalizer(Schema);
