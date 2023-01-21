import assert from 'node:assert/strict';
import { describe, it } from 'mocha';

import * as Model from '../Model/index.mjs';
import { defineEntity, isEntity } from './define.mjs';

describe('Shop::Entity::define()', function () {
	const BaseMock = Model.define({ name: 'Mock' });

	const SAMPLE = {
		name: 'File',
		Model: BaseMock,
		define: (Base, { NAME }) => {
			return { [NAME]: class extends Base {} }[NAME];
		},
	};

	describe('::define()', function () {
		it('should create a ProxyModelClass.', function () {
			const FileMockProxy = defineEntity(SAMPLE);

			assert.equal(FileMockProxy.name, 'FileMockProxy');
		});
	});

	describe('::isEntiry', function () {
		it('should be true.', function () {
			const FileMockProxy = defineEntity(SAMPLE);

			assert.equal(isEntity(FileMockProxy), true);
		});

		it('should be false.', function () {
			assert.equal(isEntity(class {}), false);
		});
	});
});
