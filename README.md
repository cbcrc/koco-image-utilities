# koco-image-utilities
Image helper utilities.

## Installation

```bash
bower install koco-image-utilities
```

## Usage with KOCO

This is a shared module that is used in many other module. The convention is to configure an alias in the `require.configs.js` with the name `string-utilties` like so:

```javascript
paths: {
  ...
  'image-utilities': 'bower_components/koco-image-utilities/src/image-utilities'
  ...
}
```