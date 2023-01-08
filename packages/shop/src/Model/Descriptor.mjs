import { Normalizer, P, S } from '@produck/mold';
import * as BaseAbstract from './BaseAbstract/index.mjs';

const { ComponentSchemas } = BaseAbstract.Descriptor;

const NativeSchema = S.Object({
	Prototype: S.Object({
		reload: P.Boolean(true),
		update: P.Boolean(true),
		destroy: P.Boolean(true),
	}),
	Static: S.Object({
		create: P.Boolean(true),
		query: P.Boolean(true),
		has: P.Boolean(true),
		get: P.Boolean(true),
	}),
});

export const Schema = S.Object({
	name: BaseAbstract.Class.Descriptor.NameSchema,
	Data: P.Function(() => ({})),
	...ComponentSchemas,
	Native: NativeSchema,
});

export const normalize = Normalizer(Schema);
