import { P, S } from '@produck/mold';
import * as Class from './Class/index.mjs';

export const AbstractSchema = S.Object({
	Class: Class.Descriptor,
	Preset: {},
});

export const BaseSchema = S.Object({
	Class: Class.Descriptor,
	Data: P.Function(() => ({})),
});

export const Schema = S.Object({

});
