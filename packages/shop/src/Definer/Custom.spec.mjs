import assert from 'node:assert/strict';
import { describe, it } from 'mocha';

import * as Model from '../Model/index.mjs';
import * as Entity from '../Entity/index.mjs';
import { CustomDefiner } from './Custom.mjs';

const SAMPLE_OPTIONS = {
	name: 'Mock',
	updatable: true,
	deletable: true,
	creatable: true,
};

describe('::Definer::Custom()', function () {
	it('should create a define()', function () {
		const define = CustomDefiner();

		assert.ok(typeof define === 'function');
	});

	it('should implement a member.', async function () {
		let flag = false;

		const FooMock = Entity.define({
			name: 'Foo',
			Model: Model.define(SAMPLE_OPTIONS),
			define: CustomDefiner({
				_save() {
					flag = true;
				},
			}),
		});

		const mock = new FooMock({});

		await mock.save();
		assert.equal(flag, true);
	});

	it('should throw if NOT declared member.', function () {
		assert.throws(() => {
			Entity.define({
				name: 'Foo',
				Model: Model.define(SAMPLE_OPTIONS),
				define: CustomDefiner({
					_foo() {},
				}),
			});
		}, {
			name: 'Error',
			message: 'The member(_foo) is NOT declared.',
		});
	});
});
