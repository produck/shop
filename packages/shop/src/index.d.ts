export namespace Abstract {
	interface Model {
		_reload(): Promise<any>;
		_update?(): Promise<void>;
		_destroy?(): Promise<void>;
	}

	interface ModelConstructor {
		_create?(): Promise<any>;
		_query(): Promise<any[]>;
		_has(): Promise<boolean>;
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

	interface Filter {
		// unique, all,
		name: string;
		data: any;
		order?: object;
		include?: Filter;
	}

	interface ModelConstructor extends Abstract.ModelConstructor {
		create?(): Promise<Model>;
		query(filter: Filter): Promise<Model[]>;
		has(): Promise<boolean>;
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
	custom: () => Proxy.ModelConstructor;
}

export function Custom(
	name: string,
	options: CustomOptions
): Proxy.ModelConstructor;
