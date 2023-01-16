interface FilterOptions {
	unique?: boolean;
	data?: any;
	[key: string]: any;
}

interface Filter {
	options?: FilterOptions;
	scope?: FilterScope;
}

interface FilterScope {
	model: string;
	as: string;
	filter: Filter;
}

export namespace Abstract {
	interface Model {
		_reload(): Promise<any>;
		_update?(): Promise<void>;
		_destroy?(): Promise<void>;
	}

	interface ModelConstructor {
		_create?(data: any): Promise<any>;
		_query(filter: Filter): Promise<any[]>;
		_has(filter: Filter): Promise<boolean>;
	}
}

export namespace Base {
	interface Model extends Abstract.Model {
		readonly isDirty: boolean;
		readonly isDestroyed: boolean;
		reload(): Promise<this>;
		update?(): Promise<this>;
		destroy?(): Promise<this>;
	}

	interface ModelConstructor extends Abstract.ModelConstructor {
		readonly name: string;
		readonly symbol: symbol;
		create?(): Promise<Model>;
		query(filter: Filter): Promise<Model[]>;
		has(data: any): Promise<boolean>;
		get(data: any): Promise<Model>;
	}
}

export namespace Custom {
	interface Model extends Base.Model {

	}

	interface ModelConstructor extends Base.ModelConstructor {
		new (data: any): Model;
	}
}

export namespace Proxy {
	interface Model extends Custom.Model {

	}

	interface ModelConstructor extends Custom.ModelConstructor {
		new (data: any): Model;
	}
}

interface ModelOptions {
	super: Function;
	data: () => void;
	abstract: () => Abstract.ModelConstructor;
	base: () => Base.ModelConstructor;
	toJson: () => any;
}

export function Model(
	name: string,
	options: ModelOptions
): Base.ModelConstructor;

interface CustomOptions {
	base: Function,
	custom: () => Proxy.ModelConstructor;
}

export function Custom(
	name: string,
	options: CustomOptions
): Proxy.ModelConstructor;
