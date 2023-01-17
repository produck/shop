interface Filter {
	options?: any;
	scope?: FilterScope;
}

interface FilterScope {
	model: string;
	as: string;
	filter: Filter;
}

type Data = any | null;

export namespace Abstract {
	interface Model {
		_load?(data: Data): Promise<Data>;
		_save?(data: Data): Promise<Data>;
		_destroy?(data: Data): Promise<Data>;
	}

	interface ModelConstructor {
		_has(data: Data): Promise<boolean>;
		_get(data: Data): Promise<Data>;
		_query(filter: Filter): Promise<Data[]>;
		_create?(data: Data): Promise<Data>;
	}
}

export namespace Base {
	interface Model extends Abstract.Model {
		readonly isDirty: boolean;
		readonly isDestroyed: boolean;
		load(): Promise<this>;
		save?(): Promise<this>;
		destroy?(): Promise<this>;
	}

	interface ModelConstructor extends Abstract.ModelConstructor {
		readonly name: string;
		readonly symbol: symbol;
		has(data: Data): Promise<boolean>;
		get(data: Data): Promise<Model>;
		create?(data: Data): Promise<Model>;
		query(filter: Filter): Promise<Model[]>;
		remove?(filter: Filter): Promise<Model[]>;
	}
}

export namespace Custom {
	interface Model extends Base.Model {

	}

	interface ModelConstructor extends Base.ModelConstructor {
		new(data: any): Model;
	}
}

export namespace Proxy {
	interface Model extends Custom.Model {

	}

	interface ModelConstructor extends Custom.ModelConstructor {
		new(data: any): Model;
	}
}

interface ModelOptions {
	name: string,
	super: Function;
	data: () => void;
	abstract: () => Abstract.ModelConstructor;
	base: () => Base.ModelConstructor;
	toJson: (self: Base.Model, data: any) => any;
}

export function Model(options: ModelOptions): Base.ModelConstructor;

interface CustomOptions {
	name: string;
	base: Function;
	custom: () => Proxy.ModelConstructor;
}

export function Custom(options: CustomOptions): Proxy.ModelConstructor;
