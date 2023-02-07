import { Schema } from '@produck/mold';

export type Data = any | null;

export type Constructor = abstract new (...args: any) => any

export namespace Abstract {
	interface Model {
		_load?(data: Data): Promise<Data>;
		_save?(data: Data): Promise<Data>;
		_destroy?(data: Data): Promise<Data>;
	}

	interface ModelConstructor<
		Super extends Constructor = ObjectConstructor
	> {
		new(): Model & InstanceType<Super>;
		_has(...args: any[]): Promise<boolean>;
		_get(...args: any[]): Promise<Data>;
		_query(...args: any[]): Promise<Data[]>;
		_create?(...args: any[]): Promise<Data>;
	}

	type CombinedModelConstructor<
		S extends Constructor
	> = ModelConstructor<S> & S;

	interface AssertNamespace {
		Implemented(name: string): void;
	}

	interface Context {
		NAME: string;
		Assert: AssertNamespace;
		defineAbstractMethod: (object: object, name: string) => void;
	}
}

export namespace Base {
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
		Super extends Constructor = Abstract.ModelConstructor
	> {
		new(): Model & InstanceType<Super>;
		readonly name: string;
		readonly symbol: symbol;
		has(...args: any[]): Promise<boolean>;
		get(...args: any[]): Promise<Model | null>;
		create?(...args: any[]): Promise<Model>;
		query(...args: any[]): Promise<Model[]>;
		remove?(...args: any[]): Promise<Model[]>;
	}

	type CombinedModelConstructor<
		S extends Constructor
	> = ModelConstructor<S> & S;

	interface ThrowNamespace {
		(message: string, ErrorConstructor?: ErrorConstructor): void;
		ImplementError(message: string, cause?: any): void;
	}

	interface Context {
		NAME: string;
		Throw: ThrowNamespace;
	}
}

export type AbstractDefiner<S, A> = (Super: S, context: Abstract.Context) => A;
export type BaseDefiner<A, B> = (Abstract: A, context: Base.Context) => B;

export module Options {
	interface Object<
		S extends Constructor = Constructor,
		A extends Constructor = Constructor,
		B extends Constructor = Constructor,
		AD extends AbstractDefiner<S, A> = () => A,
		BD extends BaseDefiner<A, B> = () => B,
	> {
		name: string;
		Super: S;
		data: <T>(_data: T) => T;
		abstract: AD;
		base: BD;
		toJSON: (this: Base.ModelConstructor) => any;
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

export module Options {
	export const Schema: Schema<Options.Object>;
	export function normalize(options: Options.Object): Options.Object;
}

export { defineModel as define };
export function isModel(model: any): boolean;
export function getModelName(model: any): string;
