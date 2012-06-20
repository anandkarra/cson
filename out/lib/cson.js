// Generated by CoffeeScript 1.3.3
(function() {
  var CSON, coffee, fs, js2coffee, wait;

  coffee = require('coffee-script');

  js2coffee = require('js2coffee');

  fs = require('fs');

  wait = function(delay, fn) {
    return setTimeout(fn, delay);
  };

  CSON = {
    parseFile: function(filePath, next) {
      var result,
        _this = this;
      if (/\.(js|coffee)$/.test(filePath)) {
        try {
          result = require(filePath);
          next(null, result);
        } catch (err) {
          next(err, result);
        }
      } else if (/\.(json|cson)$/.test(filePath)) {
        fs.readFile(filePath, function(err, data) {
          var dataStr;
          if (err) {
            return next(err);
          }
          dataStr = data.toString();
          return _this.parse(dataStr, next);
        });
      } else {
        err = new Error("CSON.parseFile: Unknown extension type for " + filePath);
        next(err);
      }
      return this;
    },
    parseFileSync: function(filePath) {
      var data, dataStr, result;
      if (/\.(js|coffee)$/.test(filePath)) {
        try {
          result = require(filePath);
          return result;
        } catch (err) {
          return err;
        }
      } else if (/\.(json|cson)$/.test(filePath)) {
        data = fs.readFileSync(filePath);
        if (data instanceof Error) {
          result = data;
        } else {
          dataStr = data.toString();
          result = this.parseSync(dataStr);
        }
        return result;
      } else {
        err = new Error("CSON.parseFileSync: Unknown extension type for " + filePath);
        return err;
      }
    },
    parse: function(src, next) {
      var _this = this;
      wait(0, function() {
        var result;
        result = _this.parseSync(src);
        if (result instanceof Error) {
          return next(result);
        } else {
          return next(null, result);
        }
      });
      return this;
    },
    parseSync: function(src) {
      var result;
      try {
        result = JSON.parse(src);
      } catch (err) {
        try {
          result = coffee["eval"](src);
        } catch (err) {
          result = err;
        }
      }
      return result;
    },
    stringify: function(obj, next) {
      var _this = this;
      wait(0, function() {
        var result;
        result = _this.stringifySync(obj);
        if (result instanceof Error) {
          return next(result);
        } else {
          return next(null, result);
        }
      });
      return this;
    },
    stringifySync: function(obj) {
      var result, src;
      try {
        src = "var result = " + (JSON.stringify(obj));
        result = js2coffee.build(src);
        result = result.replace(/^\s*result\s*\=\s/, '');
        if (typeof obj === 'object') {
          if (!(obj instanceof Array)) {
            result = '{\n' + result + '\n}';
          }
        }
      } catch (err) {
        result = err;
      }
      return result;
    }
  };

  module.exports = CSON;

}).call(this);
