import { T, U } from '@produck/mold';
import * as Model from '../Model/index.mjs';
import * as Utils from '../Utils.mjs';

export function CustomModelClass(name, Base, define) {
	const CLASS_NAME = `${name}${Model.getModelName(Base)}`;
	const CustomModel = define(Base, { NAME: CLASS_NAME });

	if (!T.Native.Function(CustomModel)) {
		U.throwError('CustomModel <= define()', 'function');
	}

	if (!Object.prototype.isPrototypeOf.call(Base, CustomModel)) {
		U.throwError('CustomModel <= define()', `Class extends ${Base.name}`);
	}

	Utils.defineValueMember(CustomModel, 'name', CLASS_NAME);

	Utils.defineValueMember(CustomModel, 'isEntityOf', function isEntityOf(Model) {
		return Model === Base;
	});

	return CustomModel;
}
