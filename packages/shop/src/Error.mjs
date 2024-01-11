class ShopError extends Error {
	get name() {
		return 'ShopError';
	}
}

export const throwShopError = message => {
	throw new ShopError(message);
};
