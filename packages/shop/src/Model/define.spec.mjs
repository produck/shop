import assert from 'node:assert/strict';
import { defineModel, isModel, getModelName } from './define.mjs';

describe('Shop::Entity::Model', function () {
	describe('::defineModel()', function () {
		it('should create a BaseModel.', function () {
			const BaseMock = defineModel({ name: 'Mock' });

			assert.equal(BaseMock.name, 'BaseMock');
		});

		describe('.toJson()', function () {
			it('should be {}.', function () {
				const BaseMock = defineModel({ name: 'Mock' });

				assert.equal(JSON.stringify(new BaseMock()), '{}');
			});
		});
	});

	describe('::isModel()', function () {
		it('should be true.', function () {
			const BaseMock = defineModel({ name: 'Mock' });

			assert.equal(isModel(BaseMock), true);
		});

		it('should be false.', function () {
			assert.equal(isModel(class A {}), false);
		});
	});

	describe('::getModelName()', function () {
		it('should get a name of a model.', function () {
			const BaseMock = defineModel({ name: 'Mock' });

			assert.equal(getModelName(BaseMock), 'Mock');
		});

		it('should throw if bad model.', function () {
			assert.throws(() => {
				getModelName(class {});
			}, {
				name: 'TypeError',
				message: 'Invalid "model", one "Model" expected.',
			});
		});
	});
});
