export const BASE_DESCRIPTOR = {
	configurable: false,
	writable: false,
	enumerable: false,
};

export function defineMember(object, name, method) {
	Object.defineProperty(object, name, {
		...BASE_DESCRIPTOR,
		value: method,
	});
}

export const fixClassName = (Class, expectedName) => {
	if (Class.name === expectedName) {
		return;
	}

	defineMember(Class, 'name', expectedName);
};
