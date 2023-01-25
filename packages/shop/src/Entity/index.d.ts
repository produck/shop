import { Schema } from '@produck/mold';
import * as Model from '../Model';

export namespace Custom {
	interface Model extends Model.Base.Model {

	}

	interface ModelConstructor extends Model.Base.ModelConstructor {
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

interface Context {
	NAME: string;
}

export type CustomDefiner = (
	Base: Model.Constructor,
	context: Context
) => Model.Constructor

export module Options {
	interface Object {
		name: string;
		Model: Model.Constructor;
		define: CustomDefiner;
	}

	export const Schema: Schema<Object>;
	export function normalize(options: Object): Object;
}

export function isEntity(any: any): boolean;
export function defineEntity(options: Options.Object): Proxy.ModelConstructor;
export { defineEntity as define };
