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