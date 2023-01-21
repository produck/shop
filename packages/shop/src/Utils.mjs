export const BASE_DESCRIPTOR = {
	configurable: false,
	enumerable: false,
};

export function defineValueMember(object, name, value) {
	Object.defineProperty(object, name, {
		...BASE_DESCRIPTOR,
		value: value,
	});
}

export const fixClassName = (Class, expectedName) => {
	if (Class.name === expectedName) {
		return;
	}

	defineValueMember(Class, 'name', expectedName);
};
