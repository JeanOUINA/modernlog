# modernlog

## Usage

```js
const logger = require("modernlog/dist/autopatch");

console.log("e")
```

OR, if you don't want to patch the console object

```js
const logger = require("modernlog")

logger.log("e")
```

OR, if you want to patch the console object but revert the changes

```js
const logger = require("modernlog/dist/autopatch")

console.log("e"); // modern

logger.unpatch();

console.log("e"); // normal
```
