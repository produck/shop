import * as Class from './Class/index.mjs';

export function BaseClass(_descriptor) {
	const descriptor = Class.Descriptor.normalize(_descriptor);
	const { name, Super, Prototype, Static } = descriptor;
	const CLASS_NAME = `Base${name}`;

	const BaseClass = { [CLASS_NAME]: class extends Super {
		#data = {};
	} }[CLASS_NAME];

	Class.Setup.Prototype(BaseClass, { ...Prototype });
	Class.Setup.Static(BaseClass, { ...Static });

	return BaseClass;
}
