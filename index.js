"use strict";

const SingleEntryPlugin = require("webpack/lib/SingleEntryPlugin");
const path = require("path");
const loaderUtils = require("loader-utils");

module.exports = function() {};
module.exports.pitch = function(request) {
  if(!this.webpack) throw new Error("Only usable with webpack");
  const callback = this.async();
  const query = loaderUtils.parseQuery(this.query);
  const filename = loaderUtils.interpolateName(this, query.name || "[hash].dw.js", {
    context: query.context || this.options.context,
    regExp: query.regExp
  });
  const outputOptions = {
    filename: filename,
    chunkFilename: "[id]." + filename,
    namedChunkFilename: null
  };
  const chunkCompiler = this._compilation.createChildCompiler("chunk", outputOptions);
  chunkCompiler.apply(new SingleEntryPlugin(this.context, "!!" + request, "main"));
  const subCache = "subcache " + __dirname + " " + request;
  chunkCompiler.plugin("compilation", function(compilation) {
    if(compilation.cache) {
      if(!compilation.cache[subCache])
        compilation.cache[subCache] = {};
      compilation.cache = compilation.cache[subCache];
    }
  });
  chunkCompiler.runAsChild(function(err, entries, compilation) {
    if(err) return callback(err);
    if (entries[0]) {
      const file = entries[0].files[0];
      const path = `__webpack_public_path__ + '/${file}`;
      const fn = `module.exports = function() {
        return document.write('<script src='+${path} type="text/javascript"><\\/script>');
      }`;
      return callback(null, fn);
    } else {
      return callback(null, null);
    }
  });
};
