export function AbstractClass(name, options, Super, Factory) {
	const CLASS_NAME = `Abstract${name}`;
	const Abstract = { [CLASS_NAME]: class extends Super {} }[CLASS_NAME];

	return Factory(Super);
}

export function BaseClass() {

}

export function CustomClass() {

}


export {
	AbstractClass as Abstract,
	BaseClass as Base,
	CustomClass as Custom,
};
