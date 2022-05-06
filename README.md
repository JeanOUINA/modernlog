# modernlog

## Usage

```js
const logger = require("modernlog/patch");

console.log("e"); // modern
```

OR, if you don't want to patch the console object

```js
const logger = require("modernlog");

logger.log("e"); // modern
```

OR, if you want to patch the console object but revert the changes

```js
const logger = require("modernlog/patch");

console.log("e"); // modern

logger.unpatch();

console.log("e"); // normal

logger.patch();

console.log("e"); // modern
```

## Options

Applies to ``logger.*`` and ``console.*`` if patched.

```js
logger.log("e"); // modern
```

```js
logger.options.filename = true;
logger.log("e"); // modern with caller file name
```

```js
logger.options.extraSpaces = 1;
logger.log("e"); // modern with one newline at the end
```

```js
logger.options.filename = true;
logger.options.extraSpaces = 1337420;

logger.options.ignoreOptions = true;
logger.log("e"); // modern
```
