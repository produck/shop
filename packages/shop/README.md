## Three kinds of roles
- (**MD**) Model Designer
	* Define what data is.
	* Define what key in `Model.get()`, `Model.has()` is.
	* Define what filter in `Model.query()` is.
	* Define how data is transformed to origin constructor arguments.
	  - `options.origin()` is throwable.
	* Determine what operations(CRUD) COULD be used.
	- Provide documents about `key`, `data`, `filter` to **SD**, **MU**.
- (**SD**) Storage Accessor Designer
  * Extends a base Model to implement its storage.
	* Only prototype members `_load`, `_save`, `_destroy` COULD be overridden.
	* Only static members `_has`, `_get`, `_query` COULD be overridden.
	* All members are throwable.
	* Implement `key`, `data`, `filter`.
	* Transaction implementer.
- (**MU**) Model User
	* It COULD extend more members(methods, accessors, ...) of Model.
	* It SHOULD know creatable, mutable, deletable of a Model.

## Specification

### About model constructor
- Model constructor is immutable.
- A model instance is immutable.
- It SHOULD NOT apply directly.

### About data.
- `Model.data` is persistent.
- It means model has been destroyed if data is `null`.
  * It COULD be set null by SD directly.
  * It COULD be set null by calling `model.destroy()` by **MU**.

### About origin of model.
- Only defined only by MD.
- `Model.origin` is immutable and get a new one every time.
- Origin immutation WOULD NOT effect model data state.

### About CRUD.
- Every model COULD be retrieved.
- Only designed by MD.

### About key.
- Key definition is required but COULD be null.

### About filter.

## Discussion
- It SHOULD NOT proxy model.origin.
  - Proxy cause `origin#this` change in members.
