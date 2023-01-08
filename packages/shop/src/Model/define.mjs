import { P, PROPERTY, S } from '@produck/mold';
import * as Descriptor from './Descriptor.mjs';

function AbstractModelClass(name, Super = Object) {
	const CLASS_NAME = `Abstract${name}`;

	return { [CLASS_NAME]: class extends Object {
		_Instance = null;
	} }[CLASS_NAME];
}

function BaseModelClass(name, AbstracModel, descriptor) {
	const CLASS_NAME = `Base${name}`;

	return { [CLASS_NAME]: class extends AbstracModel {

	} }[CLASS_NAME];
}

export function defineModel(_descriptor) {
	const descriptor = Descriptor.normalize(_descriptor);
	const AbstractModel = AbstractModelClass(descriptor.name);
	const BaseModel = BaseModelClass(descriptor.name);

	function define(_options) {

	}

	const Association = {};

	function hasOne() {

	}

	function hasMany() {

	}

	return Object.freeze({ define });
}
