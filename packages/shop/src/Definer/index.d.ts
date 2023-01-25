import * as Model from '../Model';
import * as Entity from '../Entity';

declare module AbstractModule {
	interface Field {
		[key: string]: Function | null;
	}

	export function AbstractDefiner(
		prototype?: Field,
		contructor?: Field
	): Model.AbstractDefiner<Object, Model.Abstract.ModelConstructor>
}

declare module BaseModule {
	interface Decalrator {
		notDestroyedRequired(flag: boolean): this;
		Value(name: string, any: any): this;
		Method(name: string, fn: Function): this;
		Accessor(name: string, getter: Function, setter?: Function): this;
	}

	interface DeclareNamespace {
		Prototype: Decalrator;
		Constructor: Decalrator;
	}

	interface Context {
		Throw: Model.Base.ThrowNamespace;
		Declare: DeclareNamespace;
	}

	type Factory = (context: Context) => void;

	export function BaseDefiner(
		factory?: Factory,
		_constructor?: (data: any) => any[]
	): Model.BaseDefiner<
		Model.Abstract.ModelConstructor,
		Model.Base.ModelConstructor
	>;
}

declare module CustomModule {
	interface Field {
		[key: string]: Function;
	}

	export function CustomDefiner(
		prototype?: Field,
		contructor?: Field
	): Entity.CustomDefiner;
}

export const Abstract: typeof AbstractModule.AbstractDefiner;
export const Base: typeof BaseModule.BaseDefiner;
export const Custom: typeof CustomModule.CustomDefiner;
