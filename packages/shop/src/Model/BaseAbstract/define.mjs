import * as Descriptor from './Descriptor.mjs';
import { AbstractClass } from './Abstract.mjs';
import { BaseClass } from './Base.mjs';

export function defineBaseAbstact(_descriptor) {
	const descriptor = Descriptor.normalize(_descriptor);
	const { name, Super, Abstract, Base } = descriptor;

	const CustomAbstract = AbstractClass({ name, Super, ...Abstract });
	const CustomBase = BaseClass({ name, Super: CustomAbstract, ...Base });

	return CustomBase;
}
