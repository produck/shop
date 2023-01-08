import * as Class from './Class/index.mjs';

const ABSTRACT_NAMER = name => `_${name}`;
const DESCRIPTOR = { namer: ABSTRACT_NAMER };

const PRESET_METHODS = {
	_reload: () => {},
	_destroy: () => {},
	_update: () => {},
};

export function defineAbstractClass(_descriptor) {
	const descriptor = Class.Descriptor.normalize(_descriptor);
	const { name, Super, Prototype, Static } = descriptor;

	const CLASS_NAME = `Abstract${name}`;

	const AbstractClass = {
		[CLASS_NAME]: class extends Super {},
	}[CLASS_NAME];

	Class.Setup.Prototype(AbstractClass, { ...Prototype, ...DESCRIPTOR });
	Class.Setup.Static(AbstractClass, { ...Static, ...DESCRIPTOR });

	return AbstractClass;
}
