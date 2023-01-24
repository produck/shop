import assert from 'node:assert/strict';
import { describe, it } from 'mocha';

import { AbstractModelClass } from './Abstract.mjs';

describe('::Model::AbstractModelClass()', function () {
	const SAMPLE_OPTIONS = {
		name: 'Mock',
		define: (Super) => class extends Super {},
		updatable: true,
		deletable: true,
		creatable: true,
	};

	it('should create a AbstractModel', function () {
		const AbstractMock = AbstractModelClass(Date, SAMPLE_OPTIONS);

		assert.equal(AbstractMock.name, 'AbstractMock');

		assert.ok(typeof AbstractMock._has === 'function');
		assert.ok(typeof AbstractMock._get === 'function');
		assert.ok(typeof AbstractMock._query === 'function');
		assert.ok(typeof AbstractMock._create === 'function');

		assert.ok(typeof AbstractMock.prototype._load === 'function');
		assert.ok(typeof AbstractMock.prototype._save === 'function');
		assert.ok(typeof AbstractMock.prototype._destroy === 'function');
	});

	it('should create a AbstractModel in un-CUD.', function () {
		const AbstractMock = AbstractModelClass(Date, {
			...SAMPLE_OPTIONS,
			updatable: false,
			deletable: false,
			creatable: false,
		});

		assert.equal(AbstractMock.name, 'AbstractMock');

		assert.ok(typeof AbstractMock._has === 'function');
		assert.ok(typeof AbstractMock._get === 'function');
		assert.ok(typeof AbstractMock._query === 'function');
		assert.ok(typeof AbstractMock._create !== 'function');

		assert.ok(typeof AbstractMock.prototype._load === 'function');
		assert.ok(typeof AbstractMock.prototype._save !== 'function');
		assert.ok(typeof AbstractMock.prototype._destroy !== 'function');
	});

	it('should not fix if correct name.', function () {
		const AbstractMock = AbstractModelClass(Date, {
			...SAMPLE_OPTIONS,
			define: (Super) => class AbstractMock extends Super {},
		});

		assert.equal(AbstractMock.name, 'AbstractMock');
	});

	it('should throw if bad AbstractModel.', function () {
		assert.throws(() => {
			AbstractModelClass(Date, {
				...SAMPLE_OPTIONS,
				define: () => [],
			});
		}, {
			name: 'TypeError',
			message: 'Invalid "AbstractModel <= define()", one "function" expected.',
		});
	});

	it('should throw if bad AbstractModel.', function () {
		assert.throws(() => {
			AbstractModelClass(Date, {
				...SAMPLE_OPTIONS,
				define: () => class AbstractMock {},
			});
		}, {
			name: 'TypeError',
			message: 'Invalid "AbstractModel <= define()", one "Class extends Date" expected.',
		});
	});

	describe('::AbstractModel', function () {
		const AbstractMock = AbstractModelClass(Date, SAMPLE_OPTIONS);

		for (const name of ['_has', '_get', '_query', '_create']) {
			describe(`::${name}()`, function () {
				it('should throw.', async function () {
					await assert.rejects(async () => AbstractMock[name](), {
						name: 'NotImplementedError',
						message: `Abstract member(${name}) is NOT implemented.`,
					});
				});
			});
		}

		for (const name of ['_load', '_save', '_destroy']) {
			describe(`.${name}()`, function () {
				it('should throw.', async function () {
					await assert.rejects(async () => new AbstractMock()[name](), {
						name: 'NotImplementedError',
						message: `Abstract member(${name}) is NOT implemented.`,
					});
				});
			});
		}

		it('should custom a abstract member.', async function () {
			const AbstractMock = AbstractModelClass(Date, {
				...SAMPLE_OPTIONS,
				define: (Super, { NAME, Assert }) => {
					return { [NAME]: class extends Super {
						_mock() {
							Assert.Implemented('_mock');
						}
					} }[NAME];
				},
			});

			await assert.rejects(async () => new AbstractMock()._mock(), {
				name: 'NotImplementedError',
				message: 'Abstract member(_mock) is NOT implemented.',
			});
		});
	});
});
