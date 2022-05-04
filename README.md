# modernlog
## Usage
```js
const { patch } = require("modernlog")
patch()

console.log("e")
```
OR, if you don't want to modify the console object
```js
const logger = require("modernlog")

logger.log("e")
```
