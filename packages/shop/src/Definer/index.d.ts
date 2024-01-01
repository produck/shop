import * as Model from '../Model';
import * as Entity from '../Entity';

declare module AbstractModel {
	interface Field {
		[key: string]: Function | null;
	}

	export function AbstractDefiner(
		prototype?: Field,
		contructor?: Field
	): Model.AbstractDefiner<Object, Model.Abstract.ModelConstructor>
}

type MemberFunction = (this: Model.Base.Model, ...args: any[]) => any;

declare module BaseModel {
	interface Declarator {
		Value(name: string, any: any): this;
		Method(name: string, fn: MemberFunction): this;

		Accessor(
			name: string,
			getter: MemberFunction,
			setter?: MemberFunction
		): this;
	}

	interface PrototypeDeclarator extends Declarator {
		notDestroyedRequired(flag: boolean): this;
	}

	interface DeclareNamespace {
		Prototype: PrototypeDeclarator;
		Constructor: Declarator;
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

declare module CustomModel {
	interface Field {
		[key: string]: Function;
	}

	interface PrototypeField {
		_load: (data: Model.Data) => Promise<Model.Data>;
		_save?: (data: Model.Data) => Promise<Model.Data>;
		_destroy?: (data: Model.Data) => Promise<void>;
	}

	interface ConstructorField {
		_has: (...args: any[]) => Promise<boolean>;
		_get: (...args: any[]) => Promise<Model.Data>;
		_query: (...args: any[]) => Promise<Model.Data[]>;
		_create?: (...args: any[]) => Promise<Model.Data>;
	}

	export function CustomDefiner(
		prototype?: Field & PrototypeField,
		contructor?: Field & ConstructorField
	): Entity.CustomDefiner;
}

export const Abstract: typeof AbstractModel.AbstractDefiner;
export const Base: typeof BaseModel.BaseDefiner;
export const Custom: typeof CustomModel.CustomDefiner;
