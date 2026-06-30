# frayerjj-frontend

These are my basic scripts for extending Bootstrap 5, CKEditor, and the basic things that are in most of my apps.

You can install them with:

npm install frayerjj-frontend

## Entry Points

This package now exposes two frontend presets:

- Full (all features):

	```js
	import { init } from 'frayerjj-frontend/full';
	import 'frayerjj-frontend/styles/full';
	```

- Slim (core-only):

	```js
	import { init } from 'frayerjj-frontend/slim';
	import 'frayerjj-frontend/styles/slim';
	```

The default package root export remains available for backward compatibility.

## React Components

For apps already using React, this package now includes React-first versions of the most UI-heavy widgets.

```js
import { AutocompleteInput, HasManyField, LoadingOverlay, Wizard } from 'frayerjj-frontend/react';
import 'frayerjj-frontend/styles/full';
```

You can also import individual components:

```js
import { AutocompleteInput } from 'frayerjj-frontend/react/autocomplete';
import { HasManyField } from 'frayerjj-frontend/react/has-many';
import { LoadingOverlay } from 'frayerjj-frontend/react/loading';
import { Wizard } from 'frayerjj-frontend/react/wizard';
```

### AutocompleteInput

```js
<AutocompleteInput
	name="contact"
	fetchUri="/api/contacts"
	onSelect={item => setContact(item)}
	renderItem={item => `${item.last_name}, ${item.first_name}`}
/>
```

### HasManyField

```js
<HasManyField
	name="tags"
	options={tagOptions}
	selectedIds={selectedTags}
	onChange={setSelectedTags}
/>
```

### LoadingOverlay

```js
<LoadingOverlay active={isSaving} text="Saving" style="default" />
```

### Wizard

```js
<Wizard
	steps={[
		{ content: <StepOne /> },
		{ content: <StepTwo /> }
	]}
	validateStep={(index) => index !== 0 || isStepOneValid}
	onComplete={submitForm}
/>
```

## Migration Notes

- Existing DOM-based modules (`init`, `full`, `slim`) are unchanged.
- React components are additive so you can migrate per feature instead of all at once.
- Existing SCSS styles are reused.