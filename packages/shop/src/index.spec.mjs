import assert from 'node:assert/strict';
import { it } from 'mocha';

import * as Shop from './index.mjs';

it('Shop::Examples', async function () {
	const flags = {
		abstract: {},
		base: {},
	};

	const FileMockArray = Shop.Entity.define({
		name: 'File',
		Model: Shop.Model.define({
			name: 'Mock',
			Super: Array,
			data: (_data) => {
				assert.ok(typeof _data.length === 'number');

				return _data;
			},
			abstract: Shop.Definer.Abstract({
				_bar: null,
			}, {
				_baz: () => { flags.baz = true; },
			}),
			base: Shop.Definer.Base(({ Declare, Throw }) => {
				Declare.Prototype
					.Method('foo', function () {
						flags.base;
					})
					.notDestroyedRequired()
					.Method('getBar', function () {
						return this._bar(9, Shop._(this).length);
					})
					.Accessor('qux', () => 123);

				assert.equal(Declare.Constructor.notDestroyedRequired, undefined);
			}, data => [data.length]),
			toJSON() {
				return {
					qux: this.qux,
				};
			},
			creatable: true,
			updatable: true,
			deletable: true,
		}),
		define: Shop.Definer.Custom({
			_bar(a, b) {
				return a + b;
			},
			_destroy() {},
		}),
	});

	assert.equal(FileMockArray._baz(), undefined);

	const mock = new FileMockArray({ length: 10 });

	assert.equal(mock.getBar(), 19);
	assert.equal(mock.length, 10);
	assert.equal(mock.qux, 123);
	assert.equal(JSON.stringify(mock), '{"qux":123}');

	await mock.destroy();

	assert.throws(() => mock.qux, {
		name: 'Error',
		message: 'The model instance has been destroyed.',
	});
});
