import { Normalizer, P, S } from '@produck/mold';
import * as Class from './Class/index.mjs';

const { FieldsSchemas, SuperSchema, NameSchema } = Class.Descriptor;

export const ComponentSchemas = {
	Super: SuperSchema,
	Abstract: S.Object(FieldsSchemas),
	Base: S.Object(FieldsSchemas),
};

export const Schema = S.Object({
	name: NameSchema,
	...ComponentSchemas,
});

export const normalize = Normalizer(Schema);
