import { Normalizer, P, PROPERTY, S } from '@produck/mold';

const ValuesSchema = S.Object({ [PROPERTY]: P.Any() });
const GettersSchema = S.Object({ [PROPERTY]: P.OrNull(P.Function(), true) });
const SettersSchema = S.Object({ [PROPERTY]: P.OrNull(P.Function(), true) });
const MethodsSchema = S.Object({ [PROPERTY]: P.OrNull(P.Function(), true) });

export const MemberSchema = S.Object({
	namer: P.Function(name => name),
	values: ValuesSchema,
	getters: GettersSchema,
	setters: SettersSchema,
	methods: MethodsSchema,
});

export const nameSchema = P.StringPattern(/^[A-Z][A-za-z0-9]*$/)('Any');

export const Schema = S.Object({
	name: nameSchema,
	Super: P.Function(Object),
	Prototype: MemberSchema,
	Static: MemberSchema,
});

export const normalize = Normalizer(Schema);
export const normalizeMember = Normalizer(MemberSchema);
