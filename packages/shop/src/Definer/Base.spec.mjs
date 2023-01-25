import assert from 'node:assert/strict';
import { describe, it } from 'mocha';

import * as Model from '../Model/index.mjs';
import * as Data from '../Data.mjs';
import { BaseDefiner } from './Base.mjs';

describe('::Definer::Base()', function () {
	it('should create a define().', function () {
		const define = BaseDefiner(() => {});

		assert.ok(typeof define === 'function');
	});

	it('should throw if bad factory.', function () {
		assert.throws(() => BaseDefiner(1), {
			name: 'TypeError',
			message: 'Invalid "factory", one "function" expected.',
		});
	});

	it('should throw if bad _constructor.', function () {
		assert.throws(() => BaseDefiner(() => {}, 1), {
			name: 'TypeError',
			message: 'Invalid "_constructor", one "function" expected.',
		});
	});

	const SAMPLE_OPTIONS = {
		name: 'Mock',
		updatable: true,
		deletable: true,
		creatable: true,
	};

	it('should define a Model.', function () {
		const Mock = Model.define({
			...SAMPLE_OPTIONS,
			base: BaseDefiner(),
		});

		const mock = new Mock();

		assert.ok(typeof mock.save === 'function');
	});

	it('should create a mock by _constructor().', function () {
		const Mock = Model.define({
			...SAMPLE_OPTIONS,
			Super: Date,
			base: BaseDefiner(() => {}, (data) => {
				assert.equal(data, null);

				return [0];
			}),
		});

		const mock = new Mock(null);

		assert.ok(typeof mock.save === 'function');
		assert.equal(mock.getTime(), 0);
	});

	it('should throw if bad <= _construtor().', function () {
		assert.throws(() => {
			const Mock = Model.define({
				...SAMPLE_OPTIONS,
				base: BaseDefiner(() => {}, () => null),
			});

			new Mock();
		}, {
			name: 'TypeError',
			message: 'Invalid "args <= _constructor()", one "array" expected.',
		});
	});

	describe('::Declarator', function () {
		describe('.notDestroyedRequired()', function () {
			it('should get self.', function () {
				Model.define({
					...SAMPLE_OPTIONS,
					base: BaseDefiner(({ Declare }) => {
						const any = Declare.Prototype.notDestroyedRequired(true);

						assert.equal(any, Declare.Prototype);
					}),
				});
			});

			it('should should throw if bad flag.', function () {
				assert.throws(() => {
					Model.define({
						...SAMPLE_OPTIONS,
						base: BaseDefiner(({ Declare }) => {
							Declare.Prototype.notDestroyedRequired(1);
						}),
					});
				}, {
					name: 'TypeError',
					message: 'Invalid "flag", one "boolean" expected.',
				});
			});
		});

		describe('.Value()', function () {
			it('should declare a prototype value.', function () {
				const Mock = Model.define({
					...SAMPLE_OPTIONS,
					base: BaseDefiner(({ Declare }) => {
						const ret = Declare.Prototype.Value('foo', 'bar');

						assert.equal(ret, Declare.Prototype);
					}),
				});

				const mock = new Mock();

				assert.equal(mock.foo, 'bar');
			});

			it('should throw if bad name.', function () {
				assert.throws(() => {
					Model.define({
						...SAMPLE_OPTIONS,
						base: BaseDefiner(({ Declare }) => {
							Declare.Prototype.Value(1);
						}),
					});
				}, {
					name: 'TypeError',
					message: 'Invalid "name", one "string" expected.',
				});
			});
		});

		describe('.Accessor()', function () {
			it('should throw if bad name,', function () {
				assert.throws(() => {
					Model.define({
						...SAMPLE_OPTIONS,
						base: BaseDefiner(({ Declare }) => {
							Declare.Prototype
								.Accessor(1);
						}),
					});
				}, {
					name: 'TypeError',
					message: 'Invalid "name", one "string" expected.',
				});
			});

			it('should throw if bad getter.', function () {
				assert.throws(() => {
					Model.define({
						...SAMPLE_OPTIONS,
						base: BaseDefiner(({ Declare }) => {
							Declare.Prototype
								.Accessor('foo', 1);
						}),
					});
				}, {
					name: 'TypeError',
					message: 'Invalid "getter", one "function" expected.',
				});
			});

			it('should throw if bad setter.', function () {
				assert.throws(() => {
					Model.define({
						...SAMPLE_OPTIONS,
						base: BaseDefiner(({ Declare }) => {
							Declare.Prototype
								.Accessor('foo', () => 'bar', 1);
						}),
					});
				}, {
					name: 'TypeError',
					message: 'Invalid "setter", one "function" expected.',
				});
			});

			it('should declare a unsafe accessor.', function () {
				const Mock = Model.define({
					...SAMPLE_OPTIONS,
					base: BaseDefiner(({ Declare }) => {
						Declare.Prototype
							.Accessor('foo', () => 'bar');
					}),
				});

				const mock = new Mock();

				Data.set(mock, {});
				assert.equal(mock.foo, 'bar');
				Data.set(mock, null);
				assert.equal(mock.foo, 'bar');
				mock.foo = 1;
			});

			it('should decalre a safe accessor.', function () {
				let flag = false;

				const Mock = Model.define({
					...SAMPLE_OPTIONS,
					base: BaseDefiner(({ Declare }) => {
						Declare.Prototype
							.notDestroyedRequired(true)
							.Accessor('foo', () => 'bar', () => flag = true);
					}),
				});

				const mock = new Mock();

				Data.set(mock, {});
				mock.foo = true;
				assert.equal(flag, true);

				Data.set(mock, null);

				assert.throws(() => mock.foo, {
					name: 'Error',
					message: 'The model instance has been destroyed.',
				});
			});
		});

		describe('.Method()', function () {
			it('should throw if bad name,', function () {
				assert.throws(() => {
					Model.define({
						...SAMPLE_OPTIONS,
						base: BaseDefiner(({ Declare }) => {
							Declare.Prototype
								.Method(1);
						}),
					});
				}, {
					name: 'TypeError',
					message: 'Invalid "name", one "string" expected.',
				});
			});

			it('should throw if bad fn.', function () {
				assert.throws(() => {
					Model.define({
						...SAMPLE_OPTIONS,
						base: BaseDefiner(({ Declare }) => {
							Declare.Prototype
								.Method('foo', 1);
						}),
					});
				}, {
					name: 'TypeError',
					message: 'Invalid "fn", one "function" expected.',
				});
			});

			it('should declare a unsafe method.', function () {
				let flag = false;

				const Mock = Model.define({
					...SAMPLE_OPTIONS,
					base: BaseDefiner(({ Declare }) => {
						Declare.Prototype
							.Method('foo', () => flag = true);
					}),
				});

				const mock = new Mock();

				Data.set(mock, {});
				mock.foo();
				assert.equal(flag, true);
				Data.set(mock, null);
				mock.foo();
			});

			it('should decalre a safe method.', function () {
				let flag = false;

				const Mock = Model.define({
					...SAMPLE_OPTIONS,
					base: BaseDefiner(({ Declare }) => {
						Declare.Prototype
							.notDestroyedRequired()
							.Method('foo', () => flag = true);
					}),
				});

				const mock = new Mock();

				Data.set(mock, {});
				mock.foo();
				assert.equal(flag, true);
				Data.set(mock, null);

				assert.throws(() => mock.foo(), {
					name: 'Error',
					message: 'The model instance has been destroyed.',
				});
			});
		});
	});
});
