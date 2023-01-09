export module Model {
	export interface NativeFlagGroup {
		reload: boolean;
		update: boolean;
		destroy: boolean;

		has: boolean;
		get: boolean;
		query: boolean;
		build: boolean;
		create: boolean;
		truncate: boolean;
	}

	export type NativeMemberMame = keyof NativeFlagGroup;

	export interface Options {
		Data: () => void;
		native: NativeFlagGroup;
	}
}

type Class = abstract new (...args: any) => any;

declare namespace Lower {
	namespace Abstract {
		interface AssertGroup {
			NotImplemented: (name: string) => void;
		}

		interface Injection {
			name: string;
			Assert: AssertGroup;
		}

		type Factory = (Super: Class, injection: Injection) => Class;
	}

	namespace Base {
		interface ThrowGroup {
			(message: string, ErrorClass?: typeof Error): void;
			Implementation: (message: string) => void;
		}

		interface Injection {
			name: string;
			Data: <T>(data: T) => T;
			Throw: ThrowGroup
		}

		type Factory = (Abstract: Class, injection: Injection) => Class;
	}

	namespace Custom {

		type Factory = () => {};
	}
}

declare namespace Higher {
	namespace Abstract {

		type Define = () => Lower.Abstract.Factory;
	}

	namespace Base {

		type Define = () => Lower.Base.Factory;
	}

	namespace Custom {

		type Define = () => Lower.Custom.Factory;
	}
}

export class ShopRegistry {
	define(
		name: string,
		options: Model.Options,
		abstract: Lower.Abstract.Factory,
		base: Lower.Base.Factory,
		custom: Lower.Custom.Factory,
		Super: Class,
	): Model.Model;

	Model(name: string): Model.Model;
}

export const Abstract: Higher.Abstract.Define;
export const Base: Higher.Base.Define;
export const Custom: Higher.Custom.Define;
export { Abstract as A, Base as B, Custom as C }

export { ShopRegistry as Registry }
