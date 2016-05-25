# sync-loader

Load a chunk with document.write. This builds a chunk and document.writes it.
Pretty much copied from [worker-loader](https://github.com/webpack/worker-loader).

```js
require('sync!jquery')();
```

Only use this if you have very strange requirements.

# License

MIT (http://www.opensource.org/licenses/mit-license.php)
