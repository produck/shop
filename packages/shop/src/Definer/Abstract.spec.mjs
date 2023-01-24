import assert from 'node:assert/strict';
import { describe, it } from 'mocha';

import * as Model from '../Model/index.mjs';
import { AbstractDefiner } from './Abstract.mjs';

describe('::Definer::Abstract()', function () {
	it('should create a define().', function () {
		const define = AbstractDefiner({
			_foo: null,
			_bar: () => {},
		});

		assert.ok(typeof define === 'function');
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
			abstract: AbstractDefiner({
				_foo: null,
				_bar: () => true,
			}, {
				_baz: null,
				_qux: () => true,
			}),
		});

		const mock = new Mock();

		assert.ok(Mock._qux());
		assert.ok(mock._bar());

		assert.throws(() => Mock._baz(), {
			name: 'NotImplementedError',
			message: 'Abstract member(_baz) is NOT implemented.',
		});

		assert.throws(() => mock._foo(), {
			name: 'NotImplementedError',
			message: 'Abstract member(_foo) is NOT implemented.',
		});
	});
});
