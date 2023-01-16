import * as Registry from './Registry.mjs';

function AbstractModelClass(name, Super, Member) {
	const CLASS_NAME = `Abstract${name}Model`;
	const Abstract = { [CLASS_NAME]: class extends Super {} }[CLASS_NAME];
	const members = Member();

}

function BaseModelClass(name, Abstract, Member) {
	const CLASS_NAME = `Base${name}Model`;
	const Base = { [CLASS_NAME]: class extends Abstract {} }[CLASS_NAME];
	const members = Member();

}

export function define(name, _options) {
	const Abstract = AbstractModelClass(name, options.Super, options.abstract);
	const Base = BaseModelClass(name, Abstract, options.base);

	Registry.Model.add(Base);

	return Base;
}

export const isBase = (any) => Registry.Model.has(any);
