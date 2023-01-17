import assert from 'node:assert/strict';
import { describe } from 'mocha';

import { AbstractModelClass } from './Abstract.mjs';
import { BaseModelClass } from './Base.mjs';

import * as Model from './index.mjs';

describe('Shop::Entity::Model::BaseModelClass()', function () {
	const SAMPLE_OPTIONS = {
		name: 'Mock',
		define: (Abstract) => class extends Abstract {},
		Data: any => any,
		clone: data => Object.assign({}, data),
		updatable: true,
		deletable: true,
		creatable: true,
		Abstract: AbstractModelClass({
			name: 'Mock',
			Super: Date,
			define: (Super) => class extends Super {},
			updatable: true,
			deletable: true,
			creatable: true,
		}),
	};

	it('should create a BaseModel.', function () {
		const BaseMock = BaseModelClass(SAMPLE_OPTIONS);

		assert.equal(BaseMock.name, 'BaseMock');

		assert.ok(typeof BaseMock.has === 'function');
		assert.ok(typeof BaseMock.get === 'function');
		assert.ok(typeof BaseMock.query === 'function');
		assert.ok(typeof BaseMock.create === 'function');

		assert.ok(typeof BaseMock.prototype.load === 'function');
		assert.ok(typeof BaseMock.prototype.save === 'function');
		assert.ok(typeof BaseMock.prototype.destroy === 'function');
	});

	it('should create a BaseModel in un-CUD.', function () {
		const BaseMock = BaseModelClass({
			...SAMPLE_OPTIONS,
			creatable: false,
			updatable: false,
			deletable: false,
		});

		assert.equal(BaseMock.name, 'BaseMock');

		assert.ok(typeof BaseMock.has === 'function');
		assert.ok(typeof BaseMock.get === 'function');
		assert.ok(typeof BaseMock.query === 'function');
		assert.ok(typeof BaseMock.create !== 'function');

		assert.ok(typeof BaseMock.prototype.load === 'function');
		assert.ok(typeof BaseMock.prototype.save !== 'function');
		assert.ok(typeof BaseMock.prototype.destroy !== 'function');
	});

	it('should not fix if correct name.', function () {
		const BaseMock = BaseModelClass({
			...SAMPLE_OPTIONS,
			define: (Abstract) => class BaseMock extends Abstract {},
		});

		assert.equal(BaseMock.name, 'BaseMock');
	});

	it('should throw if bad BaseModel.', function () {
		assert.throws(() => {
			BaseModelClass({
				...SAMPLE_OPTIONS,
				define: () => [],
			});
		}, {
			name: 'TypeError',
			message: 'Invalid "BaseModel <= define()", one "function" expected.',
		});
	});

	it('should throw if bad BaseModel.', function () {
		assert.throws(() => {
			BaseModelClass({
				...SAMPLE_OPTIONS,
				define: () => class Foo {},
			});
		}, {
			name: 'TypeError',
			message: 'Invalid "BaseModel <= define()", one "Class extends AbstractMock" expected.',
		});
	});

	describe('::BaseModel', function () {
		describe('::has()', function () {
			it('should be true.', async function () {
				class CustomMock extends BaseModelClass(SAMPLE_OPTIONS) {
					static async _has() {
						return true;
					}
				}

				assert.equal(await CustomMock.has(), true);
			});

			it('should be false.', async function () {
				class CustomMock extends BaseModelClass(SAMPLE_OPTIONS) {
					static async _has() {
						return false;
					}
				}

				assert.equal(await CustomMock.has(), false);
			});

			it('should throw if bad _has().', async function () {
				class CustomMock extends BaseModelClass(SAMPLE_OPTIONS) {
					static async _has() {
						return null;
					}
				}

				await assert.rejects(() => CustomMock.has(), {
					name: 'MockImplementError',
					message: 'Bad Mock flag when has(), one boolean expected.',
				});
			});
		});

		describe('::get()', function () {
			it('should get a null.', async function () {
				class CustomMock extends BaseModelClass(SAMPLE_OPTIONS) {
					static async _get() {
						return null;
					}
				}

				assert.equal(await CustomMock.get({}), null);
			});

			it('should be a data.', async function () {
				const data = { foo: 'bar' };

				class CustomMock extends BaseModelClass(SAMPLE_OPTIONS) {
					static async _get() {
						return data;
					}
				}

				assert.ok(await CustomMock.get({}) instanceof CustomMock);
			});

			it('should be throw if bad data.', async function () {
				class CustomMock extends BaseModelClass({
					...SAMPLE_OPTIONS,
					Data: (flag) => {
						if (flag) {
							return {};
						}

						throw new Error('Foo');
					},
				}) {
					static async _get() {
						return false;
					}
				}

				await assert.rejects(() => CustomMock.get(true), {
					name: 'MockImplementError',
					message: 'Bad Mock data.',
				});
			});
		});

		describe('::create()', function () {
			it('should create a CustomModel.', async function () {
				const data = { foo: 'bar' };

				class CustomMock extends BaseModelClass(SAMPLE_OPTIONS) {
					static async _has() {
						return false;
					}

					static async _create() {
						return data;
					}
				}

				assert.ok(await CustomMock.create({}) instanceof CustomMock);
			});

			it('should throw if duplicated data.', async function () {
				class CustomMock extends BaseModelClass(SAMPLE_OPTIONS) {
					static async _has() {
						return true;
					}

					static async _create() {
						return {};
					}
				}

				await assert.rejects(() => CustomMock.create({}), {
					name: 'Error',
					message: 'Duplicated Mock data.',
				});
			});

			it('should throw if bad data.', async function () {
				class CustomMock extends BaseModelClass({
					...SAMPLE_OPTIONS,
					Data: (flag) => {
						if (flag) {
							return {};
						}

						throw new Error('Foo');
					},
				}) {
					static async _has() {
						return false;
					}

					static async _create() {
						return false;
					}
				}

				await assert.rejects(() => CustomMock.create(true), {
					name: 'MockImplementError',
					message: 'Bad Mock data.',
				});
			});
		});

		describe('::query()', function () {
			it('should get a empty [].', async function () {
				class CustomMock extends BaseModelClass(SAMPLE_OPTIONS) {
					static async _query() {
						return [];
					}
				}

				assert.deepEqual(await CustomMock.query({}), []);
			});

			it('should throw if bad result.', async function () {
				class CustomMock extends BaseModelClass(SAMPLE_OPTIONS) {
					static async _query() {
						return null;
					}
				}

				await assert.rejects(() => CustomMock.query({}), {
					name: 'MockImplementError',
					message: 'Bad Mock result when query(), one array expected.',
				});
			});

			it('should throw if bad result.', async function () {
				class CustomMock extends BaseModelClass({
					...SAMPLE_OPTIONS,
					Data: (_data) => {
						if (_data !== null) {
							return {};
						}

						throw new Error('Foo');
					},
				}) {
					static async _query() {
						return [{}, {}, null, {}];
					}
				}

				await assert.rejects(() => CustomMock.query({}), {
					name: 'MockImplementError',
					message: 'Bad Mock data at 2 in result.',
				});
			});
		});

		describe('::remove()', function () {
			it('should remove all in result.', async function () {
				class CustomMock extends BaseModelClass(SAMPLE_OPTIONS) {
					_destroy() {}

					static async _query() {
						return [{}, {}, {}];
					}
				}

				const removedList = await CustomMock.remove({});

				assert.equal(removedList.length, 3);
			});
		});

		describe('.isDestroyed', function () {

		});

		describe('.load()', function () {

		});

		describe('.save()', function () {

		});

		describe('.destroy()', function () {

		});
	});
});
