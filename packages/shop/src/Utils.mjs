export function defineValueMember(object, name, value) {
	Object.defineProperty(object, name, { value });
}

export const fixClassName = (Class, expectedName) => {
	if (Class.name === expectedName) {
		return;
	}

	defineValueMember(Class, 'name', expectedName);
};
