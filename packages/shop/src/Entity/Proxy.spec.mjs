import assert from 'node:assert/strict';
import { describe, it } from 'mocha';

import * as Model from '../Model/index.mjs';
import { CustomModelClass } from './Custom.mjs';
import { ProxyModelClass } from './Proxy.mjs';

describe('Shop::Entity::ProxyModelClass()', function () {
	const BaseMock = Model.define({ name: 'Mock' });

	const CustomMock = CustomModelClass('File', BaseMock, (Base) => {
		return class extends Base {};
	});

	it('should create a ProxyModel.', function () {
		const FileMockProxy = ProxyModelClass(CustomMock);

		assert.equal(FileMockProxy.name, 'FileMockProxy');
	});

	describe('::CustomModelProxy', function () {
		it('should create a mock with data.', function () {
			const FileMockProxy = ProxyModelClass(CustomMock);
			const mock = new FileMockProxy({ foo: 'bar' });

			assert.deepEqual(Model.Data._(mock), { foo: 'bar' });
		});
	});
});
