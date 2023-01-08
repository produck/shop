import * as Class from './Class/index.mjs';

export function defineAbstractClass(_descriptor) {
	const descriptor = Class.Descriptor.normalize(_descriptor);
	const { name, Abstract, Prototype, Static } = descriptor;

	const CLASS_NAME = `Base${name}`;

	const BaseClass = {
		[CLASS_NAME]: class extends Abstract {
			#data = {};
		},
	}[CLASS_NAME];

	Class.Setup.Prototype(BaseClass, { ...Prototype });
	Class.Setup.Static(BaseClass, { ...Static });

	return BaseClass;
}
