class ShopModel {
	#association = {};
	#registry = {};

	#Abstract = Object;
	#Base = Object;
	#Custom = Object;

	constructor(registry, Abstract, Base, Custom) {
		this.#registry = registry;

		this.#Abstract = Abstract;
		this.#Base = Base;
		this.#Custom = Custom;
	}

	ToOne(Model, name) {

	}

	ToMany(Model, name) {

	}
}

export { ShopModel as Model };
