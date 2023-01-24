import assert from 'node:assert/strict';
import { describe, it } from 'mocha';

import * as Model from '../Model/index.mjs';
import { CustomModelClass } from './Custom.mjs';

describe('::Entity::CustomModelClass()', function () {
	const Mock = Model.define({
		name: 'Mock',
	});

	it('should create a CustomModel.', function () {
		const CustomModel = CustomModelClass('File', Mock, (Base) => {
			return class extends Base {};
		});

		assert.equal(CustomModel.name, 'FileMock');
	});

	it('should throw if bad CustomModel.', function () {
		assert.throws(() => CustomModelClass('File', Mock, () => {}), {
			name: 'TypeError',
			message: 'Invalid "CustomModel <= define()", one "function" expected.',
		});
	});

	it('should throw if bad CustomModel extends.', function () {
		assert.throws(() => CustomModelClass('File', Mock, () => class {}), {
			name: 'TypeError',
			message: 'Invalid "CustomModel <= define()", one "Class extends BaseMock" expected.',
		});
	});
});
