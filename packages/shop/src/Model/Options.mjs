import { Normalizer, P, S } from '@produck/mold';

const NameSchema = P.StringPattern(/^[0-9A-Z][0-9a-zA-Z]*$/)();

function DefaultClass(Super, { NAME }) {
	return { [NAME]: class extends Super {} }[NAME];
}

function DefaultToJson() {
	return {};
}

export const Schema = S.Object({
	name: NameSchema,
	Super: P.Function(Object),
	data: P.Function(_data => _data),
	abstract: P.Function(DefaultClass),
	base: P.Function(DefaultClass),
	toJSON: P.Function(DefaultToJson),
	creatable: P.Boolean(false),
	updatable: P.Boolean(false),
	deletable: P.Boolean(false),
});

export const normalize = Normalizer(Schema);
