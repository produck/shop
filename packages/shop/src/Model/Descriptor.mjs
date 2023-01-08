import { Normalizer, P, PROPERTY, S } from '@produck/mold';

const GettersSchema = S.Object({ [PROPERTY]: P.Function() });
const MethodsSchema = S.Object({ [PROPERTY]: P.OrNull(P.Function()) });

const MemberDescriptorSchema = S.Object({
	getters: GettersSchema,
	methods: MethodsSchema,
});

const ClassDescriptorSchema = S.Object({
	Prototype: MemberDescriptorSchema,
	Static: MemberDescriptorSchema,
});

export const Schema = S.Object({
	name: P.StringPattern(/^[A-Z][A-za-z0-9]*$/),
	Super: P.Function(Object),
	Abstract: ClassDescriptorSchema,
	Base: ClassDescriptorSchema,
	Filter: S.Object(),
});

export const normalize = Normalizer(Schema);
