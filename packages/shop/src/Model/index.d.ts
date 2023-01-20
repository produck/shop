type Data = any | null;
type Filter = any;

type Constructor = abstract new (...args: any) => any

declare namespace Abstract {
	interface Model {
		_load?(data: Data): Promise<Data>;
		_save?(data: Data): Promise<Data>;
		_destroy?(data: Data): Promise<Data>;
	}

	interface ModelConstructor<
		Super extends Constructor
	> {
		new (): Model & InstanceType<Super>;
		_has(data: Data): Promise<boolean>;
		_get(data: Data): Promise<Data>;
		_query(filter: any): Promise<Data[]>;
		_create?(data: Data): Promise<Data>;
	}

	type CombinedModelConstructor<
		S extends Constructor
	> = ModelConstructor<S> & S;
}

declare namespace Base {
	interface Model {
		readonly isDirty: boolean;
		readonly isDestroyed: boolean;
		load(): Promise<this>;

		/**
		 * Save model
		 */
		save?(): Promise<this>;
		destroy?(): Promise<this>;
	}

	interface ModelConstructor<
		Super extends Constructor
	> {
		new (): Model & InstanceType<Super>;
		readonly name: string;
		readonly symbol: symbol;
		has(_data: Data): Promise<boolean>;
		get(_data: Data): Promise<Model>;
		create?(_data: Data): Promise<Model>;
		query(filter: Filter): Promise<Model[]>;
		remove?(filter: Filter): Promise<Model[]>;
	}

	type CombinedModelConstructor<
		S extends Constructor
	> = ModelConstructor<S> & S;
}

export module Options {
	interface Object<
		S extends Constructor,
		A extends Constructor,
		B extends Constructor,
		AD extends (Super: S) => A,
		BD extends (Abstract: A) => B
	> {
		name: string;
		Super: S;
		data: <T>(_data: T) => T;
		abstract: AD;
		base: BD;
		creatable: boolean;
		updatable: boolean;
		deletable: boolean;
	}
}

export function defineModel<
	S extends Constructor,
	A extends Abstract.CombinedModelConstructor<S>,
	B extends Base.CombinedModelConstructor<A>,
	DA extends (Super: S) => A,
	DB extends (Abstract: A) => B
>(
	_options: Options.Object<S, A, B, DA, DB>
): B;

export module Data {

}

export module Options {

}

export { defineModel as define };
export function isModel(model: any): boolean;
export function getModelName(model: any): string;
