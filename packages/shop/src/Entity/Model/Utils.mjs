export const BASE_DESCRIPTOR = {
	configurable: false,
	writable: false,
	enumerable: false,
};

export function defineValueMember(object, name, method) {
	Object.defineProperty(object, name, {
		...BASE_DESCRIPTOR,
		value: method,
	});
}

export const fixClassName = (Class, expectedName) => {
	if (Class.name === expectedName) {
		return;
	}

	defineValueMember(Class, 'name', expectedName);
};
