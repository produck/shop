import * as Class from './Class/index.mjs';

const ABSTRACT_MEMBER_NAMER = name => `_${name}`;
const DESCRIPTOR = { namer: ABSTRACT_MEMBER_NAMER };

export function AbstractClass(_descriptor) {
	const descriptor = Class.Descriptor.normalize(_descriptor);
	const { name, Super, Prototype, Static } = descriptor;

	const CLASS_NAME = `Abstract${name}`;
	const AbstractClass = { [CLASS_NAME]: class extends Super {} }[CLASS_NAME];

	Class.Setup.Prototype(AbstractClass, { ...Prototype, ...DESCRIPTOR });
	Class.Setup.Static(AbstractClass, { ...Static, ...DESCRIPTOR });

	return AbstractClass;
}
