import { T, U } from '@produck/mold';
import * as Model from './Model/index.mjs';

export function CustomModelClass(name, BaseModel, define) {
	const CLASS_NAME = `${name}${Model.getModelName(BaseModel)}`;
	const CustomModel = define(BaseModel, { NAME: CLASS_NAME });

	if (!T.Native.Function(CustomModel)) {
		U.throwError('CustomModel <= define()', 'function');
	}

	if (!Object.prototype.isPrototypeOf.call(BaseModel, CustomModel)) {
		U.throwError('CustomModel <= define()', `Class extends ${BaseModel.name}`);
	}

	Model.Utils.defineValueMember(CustomModel, 'name', CLASS_NAME);

	return CustomModel;
}
