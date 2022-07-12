import { g as createApp, r as ref, i as onMounted, j as h, f as resolveDirective, w as withDirectives, k as reactive } from "./runtime-dom.esm-bundler.3037667d.js";
/**
 * @license AngularJS v1.8.3
 * (c) 2010-2020 Google LLC. http://angularjs.org
 * License: MIT
 */
(function(window2) {
  var minErrConfig = {
    objectMaxDepth: 5,
    urlErrorParamsEnabled: true
  };
  function errorHandlingConfig(config) {
    if (isObject(config)) {
      if (isDefined(config.objectMaxDepth)) {
        minErrConfig.objectMaxDepth = isValidObjectMaxDepth(config.objectMaxDepth) ? config.objectMaxDepth : NaN;
      }
      if (isDefined(config.urlErrorParamsEnabled) && isBoolean(config.urlErrorParamsEnabled)) {
        minErrConfig.urlErrorParamsEnabled = config.urlErrorParamsEnabled;
      }
    } else {
      return minErrConfig;
    }
  }
  function isValidObjectMaxDepth(maxDepth) {
    return isNumber(maxDepth) && maxDepth > 0;
  }
  function minErr(module, ErrorConstructor) {
    ErrorConstructor = ErrorConstructor || Error;
    var url = "https://errors.angularjs.org/1.8.3/";
    var regex = url.replace(".", "\\.") + "[\\s\\S]*";
    var errRegExp = new RegExp(regex, "g");
    return function() {
      var code = arguments[0], template = arguments[1], message = "[" + (module ? module + ":" : "") + code + "] ", templateArgs = sliceArgs(arguments, 2).map(function(arg) {
        return toDebugString(arg, minErrConfig.objectMaxDepth);
      }), paramPrefix, i;
      message += template.replace(/\{\d+\}/g, function(match) {
        var index = +match.slice(1, -1);
        if (index < templateArgs.length) {
          return templateArgs[index].replace(errRegExp, "");
        }
        return match;
      });
      message += "\n" + url + (module ? module + "/" : "") + code;
      if (minErrConfig.urlErrorParamsEnabled) {
        for (i = 0, paramPrefix = "?"; i < templateArgs.length; i++, paramPrefix = "&") {
          message += paramPrefix + "p" + i + "=" + encodeURIComponent(templateArgs[i]);
        }
      }
      return new ErrorConstructor(message);
    };
  }
  var REGEX_STRING_REGEXP = /^\/(.+)\/([a-z]*)$/;
  var VALIDITY_STATE_PROPERTY = "validity";
  var hasOwnProperty = Object.prototype.hasOwnProperty;
  var lowercase = function(string) {
    return isString(string) ? string.toLowerCase() : string;
  };
  var uppercase = function(string) {
    return isString(string) ? string.toUpperCase() : string;
  };
  var msie, jqLite, jQuery, slice = [].slice, splice = [].splice, push = [].push, toString = Object.prototype.toString, getPrototypeOf = Object.getPrototypeOf, ngMinErr = minErr("ng"), angular2 = window2.angular || (window2.angular = {}), angularModule, uid = 0;
  msie = window2.document.documentMode;
  function isArrayLike(obj) {
    if (obj == null || isWindow(obj))
      return false;
    if (isArray(obj) || isString(obj) || jqLite && obj instanceof jqLite)
      return true;
    var length = "length" in Object(obj) && obj.length;
    return isNumber(length) && (length >= 0 && length - 1 in obj || typeof obj.item === "function");
  }
  function forEach(obj, iterator, context) {
    var key2, length;
    if (obj) {
      if (isFunction(obj)) {
        for (key2 in obj) {
          if (key2 !== "prototype" && key2 !== "length" && key2 !== "name" && obj.hasOwnProperty(key2)) {
            iterator.call(context, obj[key2], key2, obj);
          }
        }
      } else if (isArray(obj) || isArrayLike(obj)) {
        var isPrimitive = typeof obj !== "object";
        for (key2 = 0, length = obj.length; key2 < length; key2++) {
          if (isPrimitive || key2 in obj) {
            iterator.call(context, obj[key2], key2, obj);
          }
        }
      } else if (obj.forEach && obj.forEach !== forEach) {
        obj.forEach(iterator, context, obj);
      } else if (isBlankObject(obj)) {
        for (key2 in obj) {
          iterator.call(context, obj[key2], key2, obj);
        }
      } else if (typeof obj.hasOwnProperty === "function") {
        for (key2 in obj) {
          if (obj.hasOwnProperty(key2)) {
            iterator.call(context, obj[key2], key2, obj);
          }
        }
      } else {
        for (key2 in obj) {
          if (hasOwnProperty.call(obj, key2)) {
            iterator.call(context, obj[key2], key2, obj);
          }
        }
      }
    }
    return obj;
  }
  function forEachSorted(obj, iterator, context) {
    var keys = Object.keys(obj).sort();
    for (var i = 0; i < keys.length; i++) {
      iterator.call(context, obj[keys[i]], keys[i]);
    }
    return keys;
  }
  function reverseParams(iteratorFn) {
    return function(value, key2) {
      iteratorFn(key2, value);
    };
  }
  function nextUid() {
    return ++uid;
  }
  function setHashKey(obj, h2) {
    if (h2) {
      obj.$$hashKey = h2;
    } else {
      delete obj.$$hashKey;
    }
  }
  function baseExtend(dst, objs, deep) {
    var h2 = dst.$$hashKey;
    for (var i = 0, ii = objs.length; i < ii; ++i) {
      var obj = objs[i];
      if (!isObject(obj) && !isFunction(obj))
        continue;
      var keys = Object.keys(obj);
      for (var j = 0, jj = keys.length; j < jj; j++) {
        var key2 = keys[j];
        var src = obj[key2];
        if (deep && isObject(src)) {
          if (isDate(src)) {
            dst[key2] = new Date(src.valueOf());
          } else if (isRegExp(src)) {
            dst[key2] = new RegExp(src);
          } else if (src.nodeName) {
            dst[key2] = src.cloneNode(true);
          } else if (isElement(src)) {
            dst[key2] = src.clone();
          } else {
            if (key2 !== "__proto__") {
              if (!isObject(dst[key2]))
                dst[key2] = isArray(src) ? [] : {};
              baseExtend(dst[key2], [src], true);
            }
          }
        } else {
          dst[key2] = src;
        }
      }
    }
    setHashKey(dst, h2);
    return dst;
  }
  function extend(dst) {
    return baseExtend(dst, slice.call(arguments, 1), false);
  }
  function merge(dst) {
    return baseExtend(dst, slice.call(arguments, 1), true);
  }
  function toInt(str) {
    return parseInt(str, 10);
  }
  var isNumberNaN = Number.isNaN || function isNumberNaN2(num) {
    return num !== num;
  };
  function inherit(parent, extra) {
    return extend(Object.create(parent), extra);
  }
  function noop() {
  }
  noop.$inject = [];
  function identity($) {
    return $;
  }
  identity.$inject = [];
  function valueFn(value) {
    return function valueRef() {
      return value;
    };
  }
  function hasCustomToString(obj) {
    return isFunction(obj.toString) && obj.toString !== toString;
  }
  function isUndefined(value) {
    return typeof value === "undefined";
  }
  function isDefined(value) {
    return typeof value !== "undefined";
  }
  function isObject(value) {
    return value !== null && typeof value === "object";
  }
  function isBlankObject(value) {
    return value !== null && typeof value === "object" && !getPrototypeOf(value);
  }
  function isString(value) {
    return typeof value === "string";
  }
  function isNumber(value) {
    return typeof value === "number";
  }
  function isDate(value) {
    return toString.call(value) === "[object Date]";
  }
  function isArray(arr) {
    return Array.isArray(arr) || arr instanceof Array;
  }
  function isError(value) {
    var tag = toString.call(value);
    switch (tag) {
      case "[object Error]":
        return true;
      case "[object Exception]":
        return true;
      case "[object DOMException]":
        return true;
      default:
        return value instanceof Error;
    }
  }
  function isFunction(value) {
    return typeof value === "function";
  }
  function isRegExp(value) {
    return toString.call(value) === "[object RegExp]";
  }
  function isWindow(obj) {
    return obj && obj.window === obj;
  }
  function isScope(obj) {
    return obj && obj.$evalAsync && obj.$watch;
  }
  function isFile(obj) {
    return toString.call(obj) === "[object File]";
  }
  function isFormData(obj) {
    return toString.call(obj) === "[object FormData]";
  }
  function isBlob(obj) {
    return toString.call(obj) === "[object Blob]";
  }
  function isBoolean(value) {
    return typeof value === "boolean";
  }
  function isPromiseLike(obj) {
    return obj && isFunction(obj.then);
  }
  var TYPED_ARRAY_REGEXP = /^\[object (?:Uint8|Uint8Clamped|Uint16|Uint32|Int8|Int16|Int32|Float32|Float64)Array]$/;
  function isTypedArray(value) {
    return value && isNumber(value.length) && TYPED_ARRAY_REGEXP.test(toString.call(value));
  }
  function isArrayBuffer(obj) {
    return toString.call(obj) === "[object ArrayBuffer]";
  }
  var trim = function(value) {
    return isString(value) ? value.trim() : value;
  };
  var escapeForRegexp = function(s) {
    return s.replace(/([-()[\]{}+?*.$^|,:#<!\\])/g, "\\$1").replace(/\x08/g, "\\x08");
  };
  function isElement(node) {
    return !!(node && (node.nodeName || node.prop && node.attr && node.find));
  }
  function makeMap(str) {
    var obj = {}, items = str.split(","), i;
    for (i = 0; i < items.length; i++) {
      obj[items[i]] = true;
    }
    return obj;
  }
  function nodeName_(element) {
    return lowercase(element.nodeName || element[0] && element[0].nodeName);
  }
  function includes(array, obj) {
    return Array.prototype.indexOf.call(array, obj) !== -1;
  }
  function arrayRemove(array, value) {
    var index = array.indexOf(value);
    if (index >= 0) {
      array.splice(index, 1);
    }
    return index;
  }
  function copy(source, destination, maxDepth) {
    var stackSource = [];
    var stackDest = [];
    maxDepth = isValidObjectMaxDepth(maxDepth) ? maxDepth : NaN;
    if (destination) {
      if (isTypedArray(destination) || isArrayBuffer(destination)) {
        throw ngMinErr("cpta", "Can't copy! TypedArray destination cannot be mutated.");
      }
      if (source === destination) {
        throw ngMinErr("cpi", "Can't copy! Source and destination are identical.");
      }
      if (isArray(destination)) {
        destination.length = 0;
      } else {
        forEach(destination, function(value, key2) {
          if (key2 !== "$$hashKey") {
            delete destination[key2];
          }
        });
      }
      stackSource.push(source);
      stackDest.push(destination);
      return copyRecurse(source, destination, maxDepth);
    }
    return copyElement(source, maxDepth);
    function copyRecurse(source2, destination2, maxDepth2) {
      maxDepth2--;
      if (maxDepth2 < 0) {
        return "...";
      }
      var h2 = destination2.$$hashKey;
      var key2;
      if (isArray(source2)) {
        for (var i = 0, ii = source2.length; i < ii; i++) {
          destination2.push(copyElement(source2[i], maxDepth2));
        }
      } else if (isBlankObject(source2)) {
        for (key2 in source2) {
          destination2[key2] = copyElement(source2[key2], maxDepth2);
        }
      } else if (source2 && typeof source2.hasOwnProperty === "function") {
        for (key2 in source2) {
          if (source2.hasOwnProperty(key2)) {
            destination2[key2] = copyElement(source2[key2], maxDepth2);
          }
        }
      } else {
        for (key2 in source2) {
          if (hasOwnProperty.call(source2, key2)) {
            destination2[key2] = copyElement(source2[key2], maxDepth2);
          }
        }
      }
      setHashKey(destination2, h2);
      return destination2;
    }
    function copyElement(source2, maxDepth2) {
      if (!isObject(source2)) {
        return source2;
      }
      var index = stackSource.indexOf(source2);
      if (index !== -1) {
        return stackDest[index];
      }
      if (isWindow(source2) || isScope(source2)) {
        throw ngMinErr("cpws", "Can't copy! Making copies of Window or Scope instances is not supported.");
      }
      var needsRecurse = false;
      var destination2 = copyType(source2);
      if (destination2 === void 0) {
        destination2 = isArray(source2) ? [] : Object.create(getPrototypeOf(source2));
        needsRecurse = true;
      }
      stackSource.push(source2);
      stackDest.push(destination2);
      return needsRecurse ? copyRecurse(source2, destination2, maxDepth2) : destination2;
    }
    function copyType(source2) {
      switch (toString.call(source2)) {
        case "[object Int8Array]":
        case "[object Int16Array]":
        case "[object Int32Array]":
        case "[object Float32Array]":
        case "[object Float64Array]":
        case "[object Uint8Array]":
        case "[object Uint8ClampedArray]":
        case "[object Uint16Array]":
        case "[object Uint32Array]":
          return new source2.constructor(copyElement(source2.buffer), source2.byteOffset, source2.length);
        case "[object ArrayBuffer]":
          if (!source2.slice) {
            var copied = new ArrayBuffer(source2.byteLength);
            new Uint8Array(copied).set(new Uint8Array(source2));
            return copied;
          }
          return source2.slice(0);
        case "[object Boolean]":
        case "[object Number]":
        case "[object String]":
        case "[object Date]":
          return new source2.constructor(source2.valueOf());
        case "[object RegExp]":
          var re = new RegExp(source2.source, source2.toString().match(/[^/]*$/)[0]);
          re.lastIndex = source2.lastIndex;
          return re;
        case "[object Blob]":
          return new source2.constructor([source2], { type: source2.type });
      }
      if (isFunction(source2.cloneNode)) {
        return source2.cloneNode(true);
      }
    }
  }
  function simpleCompare(a, b) {
    return a === b || a !== a && b !== b;
  }
  function equals(o1, o2) {
    if (o1 === o2)
      return true;
    if (o1 === null || o2 === null)
      return false;
    if (o1 !== o1 && o2 !== o2)
      return true;
    var t1 = typeof o1, t2 = typeof o2, length, key2, keySet;
    if (t1 === t2 && t1 === "object") {
      if (isArray(o1)) {
        if (!isArray(o2))
          return false;
        if ((length = o1.length) === o2.length) {
          for (key2 = 0; key2 < length; key2++) {
            if (!equals(o1[key2], o2[key2]))
              return false;
          }
          return true;
        }
      } else if (isDate(o1)) {
        if (!isDate(o2))
          return false;
        return simpleCompare(o1.getTime(), o2.getTime());
      } else if (isRegExp(o1)) {
        if (!isRegExp(o2))
          return false;
        return o1.toString() === o2.toString();
      } else {
        if (isScope(o1) || isScope(o2) || isWindow(o1) || isWindow(o2) || isArray(o2) || isDate(o2) || isRegExp(o2))
          return false;
        keySet = createMap();
        for (key2 in o1) {
          if (key2.charAt(0) === "$" || isFunction(o1[key2]))
            continue;
          if (!equals(o1[key2], o2[key2]))
            return false;
          keySet[key2] = true;
        }
        for (key2 in o2) {
          if (!(key2 in keySet) && key2.charAt(0) !== "$" && isDefined(o2[key2]) && !isFunction(o2[key2]))
            return false;
        }
        return true;
      }
    }
    return false;
  }
  var csp = function() {
    if (!isDefined(csp.rules)) {
      var ngCspElement = window2.document.querySelector("[ng-csp]") || window2.document.querySelector("[data-ng-csp]");
      if (ngCspElement) {
        var ngCspAttribute = ngCspElement.getAttribute("ng-csp") || ngCspElement.getAttribute("data-ng-csp");
        csp.rules = {
          noUnsafeEval: !ngCspAttribute || ngCspAttribute.indexOf("no-unsafe-eval") !== -1,
          noInlineStyle: !ngCspAttribute || ngCspAttribute.indexOf("no-inline-style") !== -1
        };
      } else {
        csp.rules = {
          noUnsafeEval: noUnsafeEval(),
          noInlineStyle: false
        };
      }
    }
    return csp.rules;
    function noUnsafeEval() {
      try {
        new Function("");
        return false;
      } catch (e) {
        return true;
      }
    }
  };
  var jq = function() {
    if (isDefined(jq.name_))
      return jq.name_;
    var el;
    var i, ii = ngAttrPrefixes.length, prefix, name;
    for (i = 0; i < ii; ++i) {
      prefix = ngAttrPrefixes[i];
      el = window2.document.querySelector("[" + prefix.replace(":", "\\:") + "jq]");
      if (el) {
        name = el.getAttribute(prefix + "jq");
        break;
      }
    }
    return jq.name_ = name;
  };
  function concat(array1, array2, index) {
    return array1.concat(slice.call(array2, index));
  }
  function sliceArgs(args, startIndex) {
    return slice.call(args, startIndex || 0);
  }
  function bind(self, fn) {
    var curryArgs = arguments.length > 2 ? sliceArgs(arguments, 2) : [];
    if (isFunction(fn) && !(fn instanceof RegExp)) {
      return curryArgs.length ? function() {
        return arguments.length ? fn.apply(self, concat(curryArgs, arguments, 0)) : fn.apply(self, curryArgs);
      } : function() {
        return arguments.length ? fn.apply(self, arguments) : fn.call(self);
      };
    } else {
      return fn;
    }
  }
  function toJsonReplacer(key2, value) {
    var val = value;
    if (typeof key2 === "string" && key2.charAt(0) === "$" && key2.charAt(1) === "$") {
      val = void 0;
    } else if (isWindow(value)) {
      val = "$WINDOW";
    } else if (value && window2.document === value) {
      val = "$DOCUMENT";
    } else if (isScope(value)) {
      val = "$SCOPE";
    }
    return val;
  }
  function toJson(obj, pretty) {
    if (isUndefined(obj))
      return void 0;
    if (!isNumber(pretty)) {
      pretty = pretty ? 2 : null;
    }
    return JSON.stringify(obj, toJsonReplacer, pretty);
  }
  function fromJson(json) {
    return isString(json) ? JSON.parse(json) : json;
  }
  var ALL_COLONS = /:/g;
  function timezoneToOffset(timezone, fallback) {
    timezone = timezone.replace(ALL_COLONS, "");
    var requestedTimezoneOffset = Date.parse("Jan 01, 1970 00:00:00 " + timezone) / 6e4;
    return isNumberNaN(requestedTimezoneOffset) ? fallback : requestedTimezoneOffset;
  }
  function addDateMinutes(date, minutes) {
    date = new Date(date.getTime());
    date.setMinutes(date.getMinutes() + minutes);
    return date;
  }
  function convertTimezoneToLocal(date, timezone, reverse) {
    reverse = reverse ? -1 : 1;
    var dateTimezoneOffset = date.getTimezoneOffset();
    var timezoneOffset = timezoneToOffset(timezone, dateTimezoneOffset);
    return addDateMinutes(date, reverse * (timezoneOffset - dateTimezoneOffset));
  }
  function startingTag(element) {
    element = jqLite(element).clone().empty();
    var elemHtml = jqLite("<div></div>").append(element).html();
    try {
      return element[0].nodeType === NODE_TYPE_TEXT ? lowercase(elemHtml) : elemHtml.match(/^(<[^>]+>)/)[1].replace(/^<([\w-]+)/, function(match, nodeName) {
        return "<" + lowercase(nodeName);
      });
    } catch (e) {
      return lowercase(elemHtml);
    }
  }
  function tryDecodeURIComponent(value) {
    try {
      return decodeURIComponent(value);
    } catch (e) {
    }
  }
  function parseKeyValue(keyValue) {
    var obj = {};
    forEach((keyValue || "").split("&"), function(keyValue2) {
      var splitPoint, key2, val;
      if (keyValue2) {
        key2 = keyValue2 = keyValue2.replace(/\+/g, "%20");
        splitPoint = keyValue2.indexOf("=");
        if (splitPoint !== -1) {
          key2 = keyValue2.substring(0, splitPoint);
          val = keyValue2.substring(splitPoint + 1);
        }
        key2 = tryDecodeURIComponent(key2);
        if (isDefined(key2)) {
          val = isDefined(val) ? tryDecodeURIComponent(val) : true;
          if (!hasOwnProperty.call(obj, key2)) {
            obj[key2] = val;
          } else if (isArray(obj[key2])) {
            obj[key2].push(val);
          } else {
            obj[key2] = [obj[key2], val];
          }
        }
      }
    });
    return obj;
  }
  function toKeyValue(obj) {
    var parts = [];
    forEach(obj, function(value, key2) {
      if (isArray(value)) {
        forEach(value, function(arrayValue) {
          parts.push(encodeUriQuery(key2, true) + (arrayValue === true ? "" : "=" + encodeUriQuery(arrayValue, true)));
        });
      } else {
        parts.push(encodeUriQuery(key2, true) + (value === true ? "" : "=" + encodeUriQuery(value, true)));
      }
    });
    return parts.length ? parts.join("&") : "";
  }
  function encodeUriSegment(val) {
    return encodeUriQuery(val, true).replace(/%26/gi, "&").replace(/%3D/gi, "=").replace(/%2B/gi, "+");
  }
  function encodeUriQuery(val, pctEncodeSpaces) {
    return encodeURIComponent(val).replace(/%40/gi, "@").replace(/%3A/gi, ":").replace(/%24/g, "$").replace(/%2C/gi, ",").replace(/%3B/gi, ";").replace(/%20/g, pctEncodeSpaces ? "%20" : "+");
  }
  var ngAttrPrefixes = ["ng-", "data-ng-", "ng:", "x-ng-"];
  function getNgAttribute(element, ngAttr) {
    var attr, i, ii = ngAttrPrefixes.length;
    for (i = 0; i < ii; ++i) {
      attr = ngAttrPrefixes[i] + ngAttr;
      if (isString(attr = element.getAttribute(attr))) {
        return attr;
      }
    }
    return null;
  }
  function allowAutoBootstrap(document2) {
    var script = document2.currentScript;
    if (!script) {
      return true;
    }
    if (!(script instanceof window2.HTMLScriptElement || script instanceof window2.SVGScriptElement)) {
      return false;
    }
    var attributes = script.attributes;
    var srcs = [attributes.getNamedItem("src"), attributes.getNamedItem("href"), attributes.getNamedItem("xlink:href")];
    return srcs.every(function(src) {
      if (!src) {
        return true;
      }
      if (!src.value) {
        return false;
      }
      var link = document2.createElement("a");
      link.href = src.value;
      if (document2.location.origin === link.origin) {
        return true;
      }
      switch (link.protocol) {
        case "http:":
        case "https:":
        case "ftp:":
        case "blob:":
        case "file:":
        case "data:":
          return true;
        default:
          return false;
      }
    });
  }
  var isAutoBootstrapAllowed = allowAutoBootstrap(window2.document);
  function angularInit(element, bootstrap2) {
    var appElement, module, config = {};
    forEach(ngAttrPrefixes, function(prefix) {
      var name = prefix + "app";
      if (!appElement && element.hasAttribute && element.hasAttribute(name)) {
        appElement = element;
        module = element.getAttribute(name);
      }
    });
    forEach(ngAttrPrefixes, function(prefix) {
      var name = prefix + "app";
      var candidate;
      if (!appElement && (candidate = element.querySelector("[" + name.replace(":", "\\:") + "]"))) {
        appElement = candidate;
        module = candidate.getAttribute(name);
      }
    });
    if (appElement) {
      if (!isAutoBootstrapAllowed) {
        window2.console.error("AngularJS: disabling automatic bootstrap. <script> protocol indicates an extension, document.location.href does not match.");
        return;
      }
      config.strictDi = getNgAttribute(appElement, "strict-di") !== null;
      bootstrap2(appElement, module ? [module] : [], config);
    }
  }
  function bootstrap(element, modules, config) {
    if (!isObject(config))
      config = {};
    var defaultConfig = {
      strictDi: false
    };
    config = extend(defaultConfig, config);
    var doBootstrap = function() {
      element = jqLite(element);
      if (element.injector()) {
        var tag = element[0] === window2.document ? "document" : startingTag(element);
        throw ngMinErr("btstrpd", "App already bootstrapped with this element '{0}'", tag.replace(/</, "&lt;").replace(/>/, "&gt;"));
      }
      modules = modules || [];
      modules.unshift(["$provide", function($provide) {
        $provide.value("$rootElement", element);
      }]);
      if (config.debugInfoEnabled) {
        modules.push(["$compileProvider", function($compileProvider) {
          $compileProvider.debugInfoEnabled(true);
        }]);
      }
      modules.unshift("ng");
      var injector = createInjector(modules, config.strictDi);
      injector.invoke([
        "$rootScope",
        "$rootElement",
        "$compile",
        "$injector",
        function bootstrapApply(scope, element2, compile, injector2) {
          scope.$apply(function() {
            element2.data("$injector", injector2);
            compile(element2)(scope);
          });
        }
      ]);
      return injector;
    };
    var NG_ENABLE_DEBUG_INFO = /^NG_ENABLE_DEBUG_INFO!/;
    var NG_DEFER_BOOTSTRAP = /^NG_DEFER_BOOTSTRAP!/;
    if (window2 && NG_ENABLE_DEBUG_INFO.test(window2.name)) {
      config.debugInfoEnabled = true;
      window2.name = window2.name.replace(NG_ENABLE_DEBUG_INFO, "");
    }
    if (window2 && !NG_DEFER_BOOTSTRAP.test(window2.name)) {
      return doBootstrap();
    }
    window2.name = window2.name.replace(NG_DEFER_BOOTSTRAP, "");
    angular2.resumeBootstrap = function(extraModules) {
      forEach(extraModules, function(module) {
        modules.push(module);
      });
      return doBootstrap();
    };
    if (isFunction(angular2.resumeDeferredBootstrap)) {
      angular2.resumeDeferredBootstrap();
    }
  }
  function reloadWithDebugInfo() {
    window2.name = "NG_ENABLE_DEBUG_INFO!" + window2.name;
    window2.location.reload();
  }
  function getTestability(rootElement) {
    var injector = angular2.element(rootElement).injector();
    if (!injector) {
      throw ngMinErr("test", "no injector found for element argument to getTestability");
    }
    return injector.get("$$testability");
  }
  var SNAKE_CASE_REGEXP = /[A-Z]/g;
  function snake_case(name, separator) {
    separator = separator || "_";
    return name.replace(SNAKE_CASE_REGEXP, function(letter, pos) {
      return (pos ? separator : "") + letter.toLowerCase();
    });
  }
  var bindJQueryFired = false;
  function bindJQuery() {
    var originalCleanData;
    if (bindJQueryFired) {
      return;
    }
    var jqName = jq();
    jQuery = isUndefined(jqName) ? window2.jQuery : !jqName ? void 0 : window2[jqName];
    if (jQuery && jQuery.fn.on) {
      jqLite = jQuery;
      extend(jQuery.fn, {
        scope: JQLitePrototype.scope,
        isolateScope: JQLitePrototype.isolateScope,
        controller: JQLitePrototype.controller,
        injector: JQLitePrototype.injector,
        inheritedData: JQLitePrototype.inheritedData
      });
    } else {
      jqLite = JQLite;
    }
    originalCleanData = jqLite.cleanData;
    jqLite.cleanData = function(elems) {
      var events;
      for (var i = 0, elem; (elem = elems[i]) != null; i++) {
        events = (jqLite._data(elem) || {}).events;
        if (events && events.$destroy) {
          jqLite(elem).triggerHandler("$destroy");
        }
      }
      originalCleanData(elems);
    };
    angular2.element = jqLite;
    bindJQueryFired = true;
  }
  function UNSAFE_restoreLegacyJqLiteXHTMLReplacement() {
    JQLite.legacyXHTMLReplacement = true;
  }
  function assertArg(arg, name, reason) {
    if (!arg) {
      throw ngMinErr("areq", "Argument '{0}' is {1}", name || "?", reason || "required");
    }
    return arg;
  }
  function assertArgFn(arg, name, acceptArrayAnnotation) {
    if (acceptArrayAnnotation && isArray(arg)) {
      arg = arg[arg.length - 1];
    }
    assertArg(isFunction(arg), name, "not a function, got " + (arg && typeof arg === "object" ? arg.constructor.name || "Object" : typeof arg));
    return arg;
  }
  function assertNotHasOwnProperty(name, context) {
    if (name === "hasOwnProperty") {
      throw ngMinErr("badname", "hasOwnProperty is not a valid {0} name", context);
    }
  }
  function getter(obj, path, bindFnToScope) {
    if (!path)
      return obj;
    var keys = path.split(".");
    var key2;
    var lastInstance = obj;
    var len = keys.length;
    for (var i = 0; i < len; i++) {
      key2 = keys[i];
      if (obj) {
        obj = (lastInstance = obj)[key2];
      }
    }
    if (!bindFnToScope && isFunction(obj)) {
      return bind(lastInstance, obj);
    }
    return obj;
  }
  function getBlockNodes(nodes) {
    var node = nodes[0];
    var endNode = nodes[nodes.length - 1];
    var blockNodes;
    for (var i = 1; node !== endNode && (node = node.nextSibling); i++) {
      if (blockNodes || nodes[i] !== node) {
        if (!blockNodes) {
          blockNodes = jqLite(slice.call(nodes, 0, i));
        }
        blockNodes.push(node);
      }
    }
    return blockNodes || nodes;
  }
  function createMap() {
    return /* @__PURE__ */ Object.create(null);
  }
  function stringify(value) {
    if (value == null) {
      return "";
    }
    switch (typeof value) {
      case "string":
        break;
      case "number":
        value = "" + value;
        break;
      default:
        if (hasCustomToString(value) && !isArray(value) && !isDate(value)) {
          value = value.toString();
        } else {
          value = toJson(value);
        }
    }
    return value;
  }
  var NODE_TYPE_ELEMENT = 1;
  var NODE_TYPE_ATTRIBUTE = 2;
  var NODE_TYPE_TEXT = 3;
  var NODE_TYPE_COMMENT = 8;
  var NODE_TYPE_DOCUMENT = 9;
  var NODE_TYPE_DOCUMENT_FRAGMENT = 11;
  function setupModuleLoader(window3) {
    var $injectorMinErr2 = minErr("$injector");
    var ngMinErr2 = minErr("ng");
    function ensure(obj, name, factory) {
      return obj[name] || (obj[name] = factory());
    }
    var angular3 = ensure(window3, "angular", Object);
    angular3.$$minErr = angular3.$$minErr || minErr;
    return ensure(angular3, "module", function() {
      var modules = {};
      return function module(name, requires, configFn) {
        var info = {};
        var assertNotHasOwnProperty2 = function(name2, context) {
          if (name2 === "hasOwnProperty") {
            throw ngMinErr2("badname", "hasOwnProperty is not a valid {0} name", context);
          }
        };
        assertNotHasOwnProperty2(name, "module");
        if (requires && modules.hasOwnProperty(name)) {
          modules[name] = null;
        }
        return ensure(modules, name, function() {
          if (!requires) {
            throw $injectorMinErr2("nomod", "Module '{0}' is not available! You either misspelled the module name or forgot to load it. If registering a module ensure that you specify the dependencies as the second argument.", name);
          }
          var invokeQueue = [];
          var configBlocks = [];
          var runBlocks = [];
          var config = invokeLater("$injector", "invoke", "push", configBlocks);
          var moduleInstance = {
            _invokeQueue: invokeQueue,
            _configBlocks: configBlocks,
            _runBlocks: runBlocks,
            info: function(value) {
              if (isDefined(value)) {
                if (!isObject(value))
                  throw ngMinErr2("aobj", "Argument '{0}' must be an object", "value");
                info = value;
                return this;
              }
              return info;
            },
            requires,
            name,
            provider: invokeLaterAndSetModuleName("$provide", "provider"),
            factory: invokeLaterAndSetModuleName("$provide", "factory"),
            service: invokeLaterAndSetModuleName("$provide", "service"),
            value: invokeLater("$provide", "value"),
            constant: invokeLater("$provide", "constant", "unshift"),
            decorator: invokeLaterAndSetModuleName("$provide", "decorator", configBlocks),
            animation: invokeLaterAndSetModuleName("$animateProvider", "register"),
            filter: invokeLaterAndSetModuleName("$filterProvider", "register"),
            controller: invokeLaterAndSetModuleName("$controllerProvider", "register"),
            directive: invokeLaterAndSetModuleName("$compileProvider", "directive"),
            component: invokeLaterAndSetModuleName("$compileProvider", "component"),
            config,
            run: function(block) {
              runBlocks.push(block);
              return this;
            }
          };
          if (configFn) {
            config(configFn);
          }
          return moduleInstance;
          function invokeLater(provider, method, insertMethod, queue) {
            if (!queue)
              queue = invokeQueue;
            return function() {
              queue[insertMethod || "push"]([provider, method, arguments]);
              return moduleInstance;
            };
          }
          function invokeLaterAndSetModuleName(provider, method, queue) {
            if (!queue)
              queue = invokeQueue;
            return function(recipeName, factoryFunction) {
              if (factoryFunction && isFunction(factoryFunction))
                factoryFunction.$$moduleName = name;
              queue.push([provider, method, arguments]);
              return moduleInstance;
            };
          }
        });
      };
    });
  }
  function shallowCopy(src, dst) {
    if (isArray(src)) {
      dst = dst || [];
      for (var i = 0, ii = src.length; i < ii; i++) {
        dst[i] = src[i];
      }
    } else if (isObject(src)) {
      dst = dst || {};
      for (var key2 in src) {
        if (!(key2.charAt(0) === "$" && key2.charAt(1) === "$")) {
          dst[key2] = src[key2];
        }
      }
    }
    return dst || src;
  }
  function serializeObject(obj, maxDepth) {
    var seen = [];
    if (isValidObjectMaxDepth(maxDepth)) {
      obj = angular2.copy(obj, null, maxDepth);
    }
    return JSON.stringify(obj, function(key2, val) {
      val = toJsonReplacer(key2, val);
      if (isObject(val)) {
        if (seen.indexOf(val) >= 0)
          return "...";
        seen.push(val);
      }
      return val;
    });
  }
  function toDebugString(obj, maxDepth) {
    if (typeof obj === "function") {
      return obj.toString().replace(/ \{[\s\S]*$/, "");
    } else if (isUndefined(obj)) {
      return "undefined";
    } else if (typeof obj !== "string") {
      return serializeObject(obj, maxDepth);
    }
    return obj;
  }
  var version = {
    full: "1.8.3",
    major: 1,
    minor: 8,
    dot: 3,
    codeName: "ultimate-farewell"
  };
  function publishExternalAPI(angular3) {
    extend(angular3, {
      "errorHandlingConfig": errorHandlingConfig,
      "bootstrap": bootstrap,
      "copy": copy,
      "extend": extend,
      "merge": merge,
      "equals": equals,
      "element": jqLite,
      "forEach": forEach,
      "injector": createInjector,
      "noop": noop,
      "bind": bind,
      "toJson": toJson,
      "fromJson": fromJson,
      "identity": identity,
      "isUndefined": isUndefined,
      "isDefined": isDefined,
      "isString": isString,
      "isFunction": isFunction,
      "isObject": isObject,
      "isNumber": isNumber,
      "isElement": isElement,
      "isArray": isArray,
      "version": version,
      "isDate": isDate,
      "callbacks": { $$counter: 0 },
      "getTestability": getTestability,
      "reloadWithDebugInfo": reloadWithDebugInfo,
      "UNSAFE_restoreLegacyJqLiteXHTMLReplacement": UNSAFE_restoreLegacyJqLiteXHTMLReplacement,
      "$$minErr": minErr,
      "$$csp": csp,
      "$$encodeUriSegment": encodeUriSegment,
      "$$encodeUriQuery": encodeUriQuery,
      "$$lowercase": lowercase,
      "$$stringify": stringify,
      "$$uppercase": uppercase
    });
    angularModule = setupModuleLoader(window2);
    angularModule("ng", ["ngLocale"], [
      "$provide",
      function ngModule($provide) {
        $provide.provider({
          $$sanitizeUri: $$SanitizeUriProvider
        });
        $provide.provider("$compile", $CompileProvider).directive({
          a: htmlAnchorDirective,
          input: inputDirective,
          textarea: inputDirective,
          form: formDirective,
          script: scriptDirective,
          select: selectDirective,
          option: optionDirective,
          ngBind: ngBindDirective,
          ngBindHtml: ngBindHtmlDirective,
          ngBindTemplate: ngBindTemplateDirective,
          ngClass: ngClassDirective,
          ngClassEven: ngClassEvenDirective,
          ngClassOdd: ngClassOddDirective,
          ngCloak: ngCloakDirective,
          ngController: ngControllerDirective,
          ngForm: ngFormDirective,
          ngHide: ngHideDirective,
          ngIf: ngIfDirective,
          ngInclude: ngIncludeDirective,
          ngInit: ngInitDirective,
          ngNonBindable: ngNonBindableDirective,
          ngPluralize: ngPluralizeDirective,
          ngRef: ngRefDirective,
          ngRepeat: ngRepeatDirective,
          ngShow: ngShowDirective,
          ngStyle: ngStyleDirective,
          ngSwitch: ngSwitchDirective,
          ngSwitchWhen: ngSwitchWhenDirective,
          ngSwitchDefault: ngSwitchDefaultDirective,
          ngOptions: ngOptionsDirective,
          ngTransclude: ngTranscludeDirective,
          ngModel: ngModelDirective,
          ngList: ngListDirective,
          ngChange: ngChangeDirective,
          pattern: patternDirective,
          ngPattern: patternDirective,
          required: requiredDirective,
          ngRequired: requiredDirective,
          minlength: minlengthDirective,
          ngMinlength: minlengthDirective,
          maxlength: maxlengthDirective,
          ngMaxlength: maxlengthDirective,
          ngValue: ngValueDirective,
          ngModelOptions: ngModelOptionsDirective
        }).directive({
          ngInclude: ngIncludeFillContentDirective,
          input: hiddenInputBrowserCacheDirective
        }).directive(ngAttributeAliasDirectives).directive(ngEventDirectives);
        $provide.provider({
          $anchorScroll: $AnchorScrollProvider,
          $animate: $AnimateProvider,
          $animateCss: $CoreAnimateCssProvider,
          $$animateJs: $$CoreAnimateJsProvider,
          $$animateQueue: $$CoreAnimateQueueProvider,
          $$AnimateRunner: $$AnimateRunnerFactoryProvider,
          $$animateAsyncRun: $$AnimateAsyncRunFactoryProvider,
          $browser: $BrowserProvider,
          $cacheFactory: $CacheFactoryProvider,
          $controller: $ControllerProvider,
          $document: $DocumentProvider,
          $$isDocumentHidden: $$IsDocumentHiddenProvider,
          $exceptionHandler: $ExceptionHandlerProvider,
          $filter: $FilterProvider,
          $$forceReflow: $$ForceReflowProvider,
          $interpolate: $InterpolateProvider,
          $interval: $IntervalProvider,
          $$intervalFactory: $$IntervalFactoryProvider,
          $http: $HttpProvider,
          $httpParamSerializer: $HttpParamSerializerProvider,
          $httpParamSerializerJQLike: $HttpParamSerializerJQLikeProvider,
          $httpBackend: $HttpBackendProvider,
          $xhrFactory: $xhrFactoryProvider,
          $jsonpCallbacks: $jsonpCallbacksProvider,
          $location: $LocationProvider,
          $log: $LogProvider,
          $parse: $ParseProvider,
          $rootScope: $RootScopeProvider,
          $q: $QProvider,
          $$q: $$QProvider,
          $sce: $SceProvider,
          $sceDelegate: $SceDelegateProvider,
          $sniffer: $SnifferProvider,
          $$taskTrackerFactory: $$TaskTrackerFactoryProvider,
          $templateCache: $TemplateCacheProvider,
          $templateRequest: $TemplateRequestProvider,
          $$testability: $$TestabilityProvider,
          $timeout: $TimeoutProvider,
          $window: $WindowProvider,
          $$rAF: $$RAFProvider,
          $$jqLite: $$jqLiteProvider,
          $$Map: $$MapProvider,
          $$cookieReader: $$CookieReaderProvider
        });
      }
    ]).info({ angularVersion: "1.8.3" });
  }
  JQLite.expando = "ng339";
  var jqCache = JQLite.cache = {}, jqId = 1;
  JQLite._data = function(node) {
    return this.cache[node[this.expando]] || {};
  };
  function jqNextId() {
    return ++jqId;
  }
  var DASH_LOWERCASE_REGEXP = /-([a-z])/g;
  var MS_HACK_REGEXP = /^-ms-/;
  var MOUSE_EVENT_MAP = { mouseleave: "mouseout", mouseenter: "mouseover" };
  var jqLiteMinErr = minErr("jqLite");
  function cssKebabToCamel(name) {
    return kebabToCamel(name.replace(MS_HACK_REGEXP, "ms-"));
  }
  function fnCamelCaseReplace(all, letter) {
    return letter.toUpperCase();
  }
  function kebabToCamel(name) {
    return name.replace(DASH_LOWERCASE_REGEXP, fnCamelCaseReplace);
  }
  var SINGLE_TAG_REGEXP = /^<([\w-]+)\s*\/?>(?:<\/\1>|)$/;
  var HTML_REGEXP = /<|&#?\w+;/;
  var TAG_NAME_REGEXP = /<([\w:-]+)/;
  var XHTML_TAG_REGEXP = /<(?!area|br|col|embed|hr|img|input|link|meta|param)(([\w:-]+)[^>]*)\/>/gi;
  var wrapMap = {
    thead: ["table"],
    col: ["colgroup", "table"],
    tr: ["tbody", "table"],
    td: ["tr", "tbody", "table"]
  };
  wrapMap.tbody = wrapMap.tfoot = wrapMap.colgroup = wrapMap.caption = wrapMap.thead;
  wrapMap.th = wrapMap.td;
  var wrapMapIE9 = {
    option: [1, '<select multiple="multiple">', "</select>"],
    _default: [0, "", ""]
  };
  for (var key in wrapMap) {
    var wrapMapValueClosing = wrapMap[key];
    var wrapMapValue = wrapMapValueClosing.slice().reverse();
    wrapMapIE9[key] = [wrapMapValue.length, "<" + wrapMapValue.join("><") + ">", "</" + wrapMapValueClosing.join("></") + ">"];
  }
  wrapMapIE9.optgroup = wrapMapIE9.option;
  function jqLiteIsTextNode(html) {
    return !HTML_REGEXP.test(html);
  }
  function jqLiteAcceptsData(node) {
    var nodeType = node.nodeType;
    return nodeType === NODE_TYPE_ELEMENT || !nodeType || nodeType === NODE_TYPE_DOCUMENT;
  }
  function jqLiteHasData(node) {
    for (var key2 in jqCache[node.ng339]) {
      return true;
    }
    return false;
  }
  function jqLiteBuildFragment(html, context) {
    var tmp, tag, wrap, finalHtml, fragment = context.createDocumentFragment(), nodes = [], i;
    if (jqLiteIsTextNode(html)) {
      nodes.push(context.createTextNode(html));
    } else {
      tmp = fragment.appendChild(context.createElement("div"));
      tag = (TAG_NAME_REGEXP.exec(html) || ["", ""])[1].toLowerCase();
      finalHtml = JQLite.legacyXHTMLReplacement ? html.replace(XHTML_TAG_REGEXP, "<$1></$2>") : html;
      if (msie < 10) {
        wrap = wrapMapIE9[tag] || wrapMapIE9._default;
        tmp.innerHTML = wrap[1] + finalHtml + wrap[2];
        i = wrap[0];
        while (i--) {
          tmp = tmp.firstChild;
        }
      } else {
        wrap = wrapMap[tag] || [];
        i = wrap.length;
        while (--i > -1) {
          tmp.appendChild(window2.document.createElement(wrap[i]));
          tmp = tmp.firstChild;
        }
        tmp.innerHTML = finalHtml;
      }
      nodes = concat(nodes, tmp.childNodes);
      tmp = fragment.firstChild;
      tmp.textContent = "";
    }
    fragment.textContent = "";
    fragment.innerHTML = "";
    forEach(nodes, function(node) {
      fragment.appendChild(node);
    });
    return fragment;
  }
  function jqLiteParseHTML(html, context) {
    context = context || window2.document;
    var parsed;
    if (parsed = SINGLE_TAG_REGEXP.exec(html)) {
      return [context.createElement(parsed[1])];
    }
    if (parsed = jqLiteBuildFragment(html, context)) {
      return parsed.childNodes;
    }
    return [];
  }
  function jqLiteWrapNode(node, wrapper) {
    var parent = node.parentNode;
    if (parent) {
      parent.replaceChild(wrapper, node);
    }
    wrapper.appendChild(node);
  }
  var jqLiteContains = window2.Node.prototype.contains || function(arg) {
    return !!(this.compareDocumentPosition(arg) & 16);
  };
  function JQLite(element) {
    if (element instanceof JQLite) {
      return element;
    }
    var argIsString;
    if (isString(element)) {
      element = trim(element);
      argIsString = true;
    }
    if (!(this instanceof JQLite)) {
      if (argIsString && element.charAt(0) !== "<") {
        throw jqLiteMinErr("nosel", "Looking up elements via selectors is not supported by jqLite! See: http://docs.angularjs.org/api/angular.element");
      }
      return new JQLite(element);
    }
    if (argIsString) {
      jqLiteAddNodes(this, jqLiteParseHTML(element));
    } else if (isFunction(element)) {
      jqLiteReady(element);
    } else {
      jqLiteAddNodes(this, element);
    }
  }
  function jqLiteClone(element) {
    return element.cloneNode(true);
  }
  function jqLiteDealoc(element, onlyDescendants) {
    if (!onlyDescendants && jqLiteAcceptsData(element))
      jqLite.cleanData([element]);
    if (element.querySelectorAll) {
      jqLite.cleanData(element.querySelectorAll("*"));
    }
  }
  function isEmptyObject(obj) {
    var name;
    for (name in obj) {
      return false;
    }
    return true;
  }
  function removeIfEmptyData(element) {
    var expandoId = element.ng339;
    var expandoStore = expandoId && jqCache[expandoId];
    var events = expandoStore && expandoStore.events;
    var data = expandoStore && expandoStore.data;
    if ((!data || isEmptyObject(data)) && (!events || isEmptyObject(events))) {
      delete jqCache[expandoId];
      element.ng339 = void 0;
    }
  }
  function jqLiteOff(element, type, fn, unsupported) {
    if (isDefined(unsupported))
      throw jqLiteMinErr("offargs", "jqLite#off() does not support the `selector` argument");
    var expandoStore = jqLiteExpandoStore(element);
    var events = expandoStore && expandoStore.events;
    var handle = expandoStore && expandoStore.handle;
    if (!handle)
      return;
    if (!type) {
      for (type in events) {
        if (type !== "$destroy") {
          element.removeEventListener(type, handle);
        }
        delete events[type];
      }
    } else {
      var removeHandler = function(type2) {
        var listenerFns = events[type2];
        if (isDefined(fn)) {
          arrayRemove(listenerFns || [], fn);
        }
        if (!(isDefined(fn) && listenerFns && listenerFns.length > 0)) {
          element.removeEventListener(type2, handle);
          delete events[type2];
        }
      };
      forEach(type.split(" "), function(type2) {
        removeHandler(type2);
        if (MOUSE_EVENT_MAP[type2]) {
          removeHandler(MOUSE_EVENT_MAP[type2]);
        }
      });
    }
    removeIfEmptyData(element);
  }
  function jqLiteRemoveData(element, name) {
    var expandoId = element.ng339;
    var expandoStore = expandoId && jqCache[expandoId];
    if (expandoStore) {
      if (name) {
        delete expandoStore.data[name];
      } else {
        expandoStore.data = {};
      }
      removeIfEmptyData(element);
    }
  }
  function jqLiteExpandoStore(element, createIfNecessary) {
    var expandoId = element.ng339, expandoStore = expandoId && jqCache[expandoId];
    if (createIfNecessary && !expandoStore) {
      element.ng339 = expandoId = jqNextId();
      expandoStore = jqCache[expandoId] = { events: {}, data: {}, handle: void 0 };
    }
    return expandoStore;
  }
  function jqLiteData(element, key2, value) {
    if (jqLiteAcceptsData(element)) {
      var prop;
      var isSimpleSetter = isDefined(value);
      var isSimpleGetter = !isSimpleSetter && key2 && !isObject(key2);
      var massGetter = !key2;
      var expandoStore = jqLiteExpandoStore(element, !isSimpleGetter);
      var data = expandoStore && expandoStore.data;
      if (isSimpleSetter) {
        data[kebabToCamel(key2)] = value;
      } else {
        if (massGetter) {
          return data;
        } else {
          if (isSimpleGetter) {
            return data && data[kebabToCamel(key2)];
          } else {
            for (prop in key2) {
              data[kebabToCamel(prop)] = key2[prop];
            }
          }
        }
      }
    }
  }
  function jqLiteHasClass(element, selector) {
    if (!element.getAttribute)
      return false;
    return (" " + (element.getAttribute("class") || "") + " ").replace(/[\n\t]/g, " ").indexOf(" " + selector + " ") > -1;
  }
  function jqLiteRemoveClass(element, cssClasses) {
    if (cssClasses && element.setAttribute) {
      var existingClasses = (" " + (element.getAttribute("class") || "") + " ").replace(/[\n\t]/g, " ");
      var newClasses = existingClasses;
      forEach(cssClasses.split(" "), function(cssClass) {
        cssClass = trim(cssClass);
        newClasses = newClasses.replace(" " + cssClass + " ", " ");
      });
      if (newClasses !== existingClasses) {
        element.setAttribute("class", trim(newClasses));
      }
    }
  }
  function jqLiteAddClass(element, cssClasses) {
    if (cssClasses && element.setAttribute) {
      var existingClasses = (" " + (element.getAttribute("class") || "") + " ").replace(/[\n\t]/g, " ");
      var newClasses = existingClasses;
      forEach(cssClasses.split(" "), function(cssClass) {
        cssClass = trim(cssClass);
        if (newClasses.indexOf(" " + cssClass + " ") === -1) {
          newClasses += cssClass + " ";
        }
      });
      if (newClasses !== existingClasses) {
        element.setAttribute("class", trim(newClasses));
      }
    }
  }
  function jqLiteAddNodes(root, elements) {
    if (elements) {
      if (elements.nodeType) {
        root[root.length++] = elements;
      } else {
        var length = elements.length;
        if (typeof length === "number" && elements.window !== elements) {
          if (length) {
            for (var i = 0; i < length; i++) {
              root[root.length++] = elements[i];
            }
          }
        } else {
          root[root.length++] = elements;
        }
      }
    }
  }
  function jqLiteController(element, name) {
    return jqLiteInheritedData(element, "$" + (name || "ngController") + "Controller");
  }
  function jqLiteInheritedData(element, name, value) {
    if (element.nodeType === NODE_TYPE_DOCUMENT) {
      element = element.documentElement;
    }
    var names = isArray(name) ? name : [name];
    while (element) {
      for (var i = 0, ii = names.length; i < ii; i++) {
        if (isDefined(value = jqLite.data(element, names[i])))
          return value;
      }
      element = element.parentNode || element.nodeType === NODE_TYPE_DOCUMENT_FRAGMENT && element.host;
    }
  }
  function jqLiteEmpty(element) {
    jqLiteDealoc(element, true);
    while (element.firstChild) {
      element.removeChild(element.firstChild);
    }
  }
  function jqLiteRemove(element, keepData) {
    if (!keepData)
      jqLiteDealoc(element);
    var parent = element.parentNode;
    if (parent)
      parent.removeChild(element);
  }
  function jqLiteDocumentLoaded(action, win) {
    win = win || window2;
    if (win.document.readyState === "complete") {
      win.setTimeout(action);
    } else {
      jqLite(win).on("load", action);
    }
  }
  function jqLiteReady(fn) {
    function trigger() {
      window2.document.removeEventListener("DOMContentLoaded", trigger);
      window2.removeEventListener("load", trigger);
      fn();
    }
    if (window2.document.readyState === "complete") {
      window2.setTimeout(fn);
    } else {
      window2.document.addEventListener("DOMContentLoaded", trigger);
      window2.addEventListener("load", trigger);
    }
  }
  var JQLitePrototype = JQLite.prototype = {
    ready: jqLiteReady,
    toString: function() {
      var value = [];
      forEach(this, function(e) {
        value.push("" + e);
      });
      return "[" + value.join(", ") + "]";
    },
    eq: function(index) {
      return index >= 0 ? jqLite(this[index]) : jqLite(this[this.length + index]);
    },
    length: 0,
    push,
    sort: [].sort,
    splice: [].splice
  };
  var BOOLEAN_ATTR = {};
  forEach("multiple,selected,checked,disabled,readOnly,required,open".split(","), function(value) {
    BOOLEAN_ATTR[lowercase(value)] = value;
  });
  var BOOLEAN_ELEMENTS = {};
  forEach("input,select,option,textarea,button,form,details".split(","), function(value) {
    BOOLEAN_ELEMENTS[value] = true;
  });
  var ALIASED_ATTR = {
    "ngMinlength": "minlength",
    "ngMaxlength": "maxlength",
    "ngMin": "min",
    "ngMax": "max",
    "ngPattern": "pattern",
    "ngStep": "step"
  };
  function getBooleanAttrName(element, name) {
    var booleanAttr = BOOLEAN_ATTR[name.toLowerCase()];
    return booleanAttr && BOOLEAN_ELEMENTS[nodeName_(element)] && booleanAttr;
  }
  function getAliasedAttrName(name) {
    return ALIASED_ATTR[name];
  }
  forEach({
    data: jqLiteData,
    removeData: jqLiteRemoveData,
    hasData: jqLiteHasData,
    cleanData: function jqLiteCleanData(nodes) {
      for (var i = 0, ii = nodes.length; i < ii; i++) {
        jqLiteRemoveData(nodes[i]);
        jqLiteOff(nodes[i]);
      }
    }
  }, function(fn, name) {
    JQLite[name] = fn;
  });
  forEach({
    data: jqLiteData,
    inheritedData: jqLiteInheritedData,
    scope: function(element) {
      return jqLite.data(element, "$scope") || jqLiteInheritedData(element.parentNode || element, ["$isolateScope", "$scope"]);
    },
    isolateScope: function(element) {
      return jqLite.data(element, "$isolateScope") || jqLite.data(element, "$isolateScopeNoTemplate");
    },
    controller: jqLiteController,
    injector: function(element) {
      return jqLiteInheritedData(element, "$injector");
    },
    removeAttr: function(element, name) {
      element.removeAttribute(name);
    },
    hasClass: jqLiteHasClass,
    css: function(element, name, value) {
      name = cssKebabToCamel(name);
      if (isDefined(value)) {
        element.style[name] = value;
      } else {
        return element.style[name];
      }
    },
    attr: function(element, name, value) {
      var ret;
      var nodeType = element.nodeType;
      if (nodeType === NODE_TYPE_TEXT || nodeType === NODE_TYPE_ATTRIBUTE || nodeType === NODE_TYPE_COMMENT || !element.getAttribute) {
        return;
      }
      var lowercasedName = lowercase(name);
      var isBooleanAttr = BOOLEAN_ATTR[lowercasedName];
      if (isDefined(value)) {
        if (value === null || value === false && isBooleanAttr) {
          element.removeAttribute(name);
        } else {
          element.setAttribute(name, isBooleanAttr ? lowercasedName : value);
        }
      } else {
        ret = element.getAttribute(name);
        if (isBooleanAttr && ret !== null) {
          ret = lowercasedName;
        }
        return ret === null ? void 0 : ret;
      }
    },
    prop: function(element, name, value) {
      if (isDefined(value)) {
        element[name] = value;
      } else {
        return element[name];
      }
    },
    text: function() {
      getText.$dv = "";
      return getText;
      function getText(element, value) {
        if (isUndefined(value)) {
          var nodeType = element.nodeType;
          return nodeType === NODE_TYPE_ELEMENT || nodeType === NODE_TYPE_TEXT ? element.textContent : "";
        }
        element.textContent = value;
      }
    }(),
    val: function(element, value) {
      if (isUndefined(value)) {
        if (element.multiple && nodeName_(element) === "select") {
          var result = [];
          forEach(element.options, function(option) {
            if (option.selected) {
              result.push(option.value || option.text);
            }
          });
          return result;
        }
        return element.value;
      }
      element.value = value;
    },
    html: function(element, value) {
      if (isUndefined(value)) {
        return element.innerHTML;
      }
      jqLiteDealoc(element, true);
      element.innerHTML = value;
    },
    empty: jqLiteEmpty
  }, function(fn, name) {
    JQLite.prototype[name] = function(arg1, arg2) {
      var i, key2;
      var nodeCount = this.length;
      if (fn !== jqLiteEmpty && isUndefined(fn.length === 2 && (fn !== jqLiteHasClass && fn !== jqLiteController) ? arg1 : arg2)) {
        if (isObject(arg1)) {
          for (i = 0; i < nodeCount; i++) {
            if (fn === jqLiteData) {
              fn(this[i], arg1);
            } else {
              for (key2 in arg1) {
                fn(this[i], key2, arg1[key2]);
              }
            }
          }
          return this;
        } else {
          var value = fn.$dv;
          var jj = isUndefined(value) ? Math.min(nodeCount, 1) : nodeCount;
          for (var j = 0; j < jj; j++) {
            var nodeValue = fn(this[j], arg1, arg2);
            value = value ? value + nodeValue : nodeValue;
          }
          return value;
        }
      } else {
        for (i = 0; i < nodeCount; i++) {
          fn(this[i], arg1, arg2);
        }
        return this;
      }
    };
  });
  function createEventHandler(element, events) {
    var eventHandler = function(event, type) {
      event.isDefaultPrevented = function() {
        return event.defaultPrevented;
      };
      var eventFns = events[type || event.type];
      var eventFnsLength = eventFns ? eventFns.length : 0;
      if (!eventFnsLength)
        return;
      if (isUndefined(event.immediatePropagationStopped)) {
        var originalStopImmediatePropagation = event.stopImmediatePropagation;
        event.stopImmediatePropagation = function() {
          event.immediatePropagationStopped = true;
          if (event.stopPropagation) {
            event.stopPropagation();
          }
          if (originalStopImmediatePropagation) {
            originalStopImmediatePropagation.call(event);
          }
        };
      }
      event.isImmediatePropagationStopped = function() {
        return event.immediatePropagationStopped === true;
      };
      var handlerWrapper = eventFns.specialHandlerWrapper || defaultHandlerWrapper;
      if (eventFnsLength > 1) {
        eventFns = shallowCopy(eventFns);
      }
      for (var i = 0; i < eventFnsLength; i++) {
        if (!event.isImmediatePropagationStopped()) {
          handlerWrapper(element, event, eventFns[i]);
        }
      }
    };
    eventHandler.elem = element;
    return eventHandler;
  }
  function defaultHandlerWrapper(element, event, handler) {
    handler.call(element, event);
  }
  function specialMouseHandlerWrapper(target, event, handler) {
    var related = event.relatedTarget;
    if (!related || related !== target && !jqLiteContains.call(target, related)) {
      handler.call(target, event);
    }
  }
  forEach({
    removeData: jqLiteRemoveData,
    on: function jqLiteOn(element, type, fn, unsupported) {
      if (isDefined(unsupported))
        throw jqLiteMinErr("onargs", "jqLite#on() does not support the `selector` or `eventData` parameters");
      if (!jqLiteAcceptsData(element)) {
        return;
      }
      var expandoStore = jqLiteExpandoStore(element, true);
      var events = expandoStore.events;
      var handle = expandoStore.handle;
      if (!handle) {
        handle = expandoStore.handle = createEventHandler(element, events);
      }
      var types = type.indexOf(" ") >= 0 ? type.split(" ") : [type];
      var i = types.length;
      var addHandler = function(type2, specialHandlerWrapper, noEventListener) {
        var eventFns = events[type2];
        if (!eventFns) {
          eventFns = events[type2] = [];
          eventFns.specialHandlerWrapper = specialHandlerWrapper;
          if (type2 !== "$destroy" && !noEventListener) {
            element.addEventListener(type2, handle);
          }
        }
        eventFns.push(fn);
      };
      while (i--) {
        type = types[i];
        if (MOUSE_EVENT_MAP[type]) {
          addHandler(MOUSE_EVENT_MAP[type], specialMouseHandlerWrapper);
          addHandler(type, void 0, true);
        } else {
          addHandler(type);
        }
      }
    },
    off: jqLiteOff,
    one: function(element, type, fn) {
      element = jqLite(element);
      element.on(type, function onFn() {
        element.off(type, fn);
        element.off(type, onFn);
      });
      element.on(type, fn);
    },
    replaceWith: function(element, replaceNode) {
      var index, parent = element.parentNode;
      jqLiteDealoc(element);
      forEach(new JQLite(replaceNode), function(node) {
        if (index) {
          parent.insertBefore(node, index.nextSibling);
        } else {
          parent.replaceChild(node, element);
        }
        index = node;
      });
    },
    children: function(element) {
      var children = [];
      forEach(element.childNodes, function(element2) {
        if (element2.nodeType === NODE_TYPE_ELEMENT) {
          children.push(element2);
        }
      });
      return children;
    },
    contents: function(element) {
      return element.contentDocument || element.childNodes || [];
    },
    append: function(element, node) {
      var nodeType = element.nodeType;
      if (nodeType !== NODE_TYPE_ELEMENT && nodeType !== NODE_TYPE_DOCUMENT_FRAGMENT)
        return;
      node = new JQLite(node);
      for (var i = 0, ii = node.length; i < ii; i++) {
        var child = node[i];
        element.appendChild(child);
      }
    },
    prepend: function(element, node) {
      if (element.nodeType === NODE_TYPE_ELEMENT) {
        var index = element.firstChild;
        forEach(new JQLite(node), function(child) {
          element.insertBefore(child, index);
        });
      }
    },
    wrap: function(element, wrapNode) {
      jqLiteWrapNode(element, jqLite(wrapNode).eq(0).clone()[0]);
    },
    remove: jqLiteRemove,
    detach: function(element) {
      jqLiteRemove(element, true);
    },
    after: function(element, newElement) {
      var index = element, parent = element.parentNode;
      if (parent) {
        newElement = new JQLite(newElement);
        for (var i = 0, ii = newElement.length; i < ii; i++) {
          var node = newElement[i];
          parent.insertBefore(node, index.nextSibling);
          index = node;
        }
      }
    },
    addClass: jqLiteAddClass,
    removeClass: jqLiteRemoveClass,
    toggleClass: function(element, selector, condition) {
      if (selector) {
        forEach(selector.split(" "), function(className) {
          var classCondition = condition;
          if (isUndefined(classCondition)) {
            classCondition = !jqLiteHasClass(element, className);
          }
          (classCondition ? jqLiteAddClass : jqLiteRemoveClass)(element, className);
        });
      }
    },
    parent: function(element) {
      var parent = element.parentNode;
      return parent && parent.nodeType !== NODE_TYPE_DOCUMENT_FRAGMENT ? parent : null;
    },
    next: function(element) {
      return element.nextElementSibling;
    },
    find: function(element, selector) {
      if (element.getElementsByTagName) {
        return element.getElementsByTagName(selector);
      } else {
        return [];
      }
    },
    clone: jqLiteClone,
    triggerHandler: function(element, event, extraParameters) {
      var dummyEvent, eventFnsCopy, handlerArgs;
      var eventName = event.type || event;
      var expandoStore = jqLiteExpandoStore(element);
      var events = expandoStore && expandoStore.events;
      var eventFns = events && events[eventName];
      if (eventFns) {
        dummyEvent = {
          preventDefault: function() {
            this.defaultPrevented = true;
          },
          isDefaultPrevented: function() {
            return this.defaultPrevented === true;
          },
          stopImmediatePropagation: function() {
            this.immediatePropagationStopped = true;
          },
          isImmediatePropagationStopped: function() {
            return this.immediatePropagationStopped === true;
          },
          stopPropagation: noop,
          type: eventName,
          target: element
        };
        if (event.type) {
          dummyEvent = extend(dummyEvent, event);
        }
        eventFnsCopy = shallowCopy(eventFns);
        handlerArgs = extraParameters ? [dummyEvent].concat(extraParameters) : [dummyEvent];
        forEach(eventFnsCopy, function(fn) {
          if (!dummyEvent.isImmediatePropagationStopped()) {
            fn.apply(element, handlerArgs);
          }
        });
      }
    }
  }, function(fn, name) {
    JQLite.prototype[name] = function(arg1, arg2, arg3) {
      var value;
      for (var i = 0, ii = this.length; i < ii; i++) {
        if (isUndefined(value)) {
          value = fn(this[i], arg1, arg2, arg3);
          if (isDefined(value)) {
            value = jqLite(value);
          }
        } else {
          jqLiteAddNodes(value, fn(this[i], arg1, arg2, arg3));
        }
      }
      return isDefined(value) ? value : this;
    };
  });
  JQLite.prototype.bind = JQLite.prototype.on;
  JQLite.prototype.unbind = JQLite.prototype.off;
  function $$jqLiteProvider() {
    this.$get = function $$jqLite() {
      return extend(JQLite, {
        hasClass: function(node, classes) {
          if (node.attr)
            node = node[0];
          return jqLiteHasClass(node, classes);
        },
        addClass: function(node, classes) {
          if (node.attr)
            node = node[0];
          return jqLiteAddClass(node, classes);
        },
        removeClass: function(node, classes) {
          if (node.attr)
            node = node[0];
          return jqLiteRemoveClass(node, classes);
        }
      });
    };
  }
  function hashKey(obj, nextUidFn) {
    var key2 = obj && obj.$$hashKey;
    if (key2) {
      if (typeof key2 === "function") {
        key2 = obj.$$hashKey();
      }
      return key2;
    }
    var objType = typeof obj;
    if (objType === "function" || objType === "object" && obj !== null) {
      key2 = obj.$$hashKey = objType + ":" + (nextUidFn || nextUid)();
    } else {
      key2 = objType + ":" + obj;
    }
    return key2;
  }
  var nanKey = /* @__PURE__ */ Object.create(null);
  function NgMapShim() {
    this._keys = [];
    this._values = [];
    this._lastKey = NaN;
    this._lastIndex = -1;
  }
  NgMapShim.prototype = {
    _idx: function(key2) {
      if (key2 !== this._lastKey) {
        this._lastKey = key2;
        this._lastIndex = this._keys.indexOf(key2);
      }
      return this._lastIndex;
    },
    _transformKey: function(key2) {
      return isNumberNaN(key2) ? nanKey : key2;
    },
    get: function(key2) {
      key2 = this._transformKey(key2);
      var idx = this._idx(key2);
      if (idx !== -1) {
        return this._values[idx];
      }
    },
    has: function(key2) {
      key2 = this._transformKey(key2);
      var idx = this._idx(key2);
      return idx !== -1;
    },
    set: function(key2, value) {
      key2 = this._transformKey(key2);
      var idx = this._idx(key2);
      if (idx === -1) {
        idx = this._lastIndex = this._keys.length;
      }
      this._keys[idx] = key2;
      this._values[idx] = value;
    },
    delete: function(key2) {
      key2 = this._transformKey(key2);
      var idx = this._idx(key2);
      if (idx === -1) {
        return false;
      }
      this._keys.splice(idx, 1);
      this._values.splice(idx, 1);
      this._lastKey = NaN;
      this._lastIndex = -1;
      return true;
    }
  };
  var NgMap = NgMapShim;
  var $$MapProvider = [function() {
    this.$get = [function() {
      return NgMap;
    }];
  }];
  var ARROW_ARG = /^([^(]+?)=>/;
  var FN_ARGS = /^[^(]*\(\s*([^)]*)\)/m;
  var FN_ARG_SPLIT = /,/;
  var FN_ARG = /^\s*(_?)(\S+?)\1\s*$/;
  var STRIP_COMMENTS = /((\/\/.*$)|(\/\*[\s\S]*?\*\/))/mg;
  var $injectorMinErr = minErr("$injector");
  function stringifyFn(fn) {
    return Function.prototype.toString.call(fn);
  }
  function extractArgs(fn) {
    var fnText = stringifyFn(fn).replace(STRIP_COMMENTS, ""), args = fnText.match(ARROW_ARG) || fnText.match(FN_ARGS);
    return args;
  }
  function anonFn(fn) {
    var args = extractArgs(fn);
    if (args) {
      return "function(" + (args[1] || "").replace(/[\s\r\n]+/, " ") + ")";
    }
    return "fn";
  }
  function annotate(fn, strictDi, name) {
    var $inject, argDecl, last;
    if (typeof fn === "function") {
      if (!($inject = fn.$inject)) {
        $inject = [];
        if (fn.length) {
          if (strictDi) {
            if (!isString(name) || !name) {
              name = fn.name || anonFn(fn);
            }
            throw $injectorMinErr("strictdi", "{0} is not using explicit annotation and cannot be invoked in strict mode", name);
          }
          argDecl = extractArgs(fn);
          forEach(argDecl[1].split(FN_ARG_SPLIT), function(arg) {
            arg.replace(FN_ARG, function(all, underscore, name2) {
              $inject.push(name2);
            });
          });
        }
        fn.$inject = $inject;
      }
    } else if (isArray(fn)) {
      last = fn.length - 1;
      assertArgFn(fn[last], "fn");
      $inject = fn.slice(0, last);
    } else {
      assertArgFn(fn, "fn", true);
    }
    return $inject;
  }
  function createInjector(modulesToLoad, strictDi) {
    strictDi = strictDi === true;
    var INSTANTIATING = {}, providerSuffix = "Provider", path = [], loadedModules = new NgMap(), providerCache = {
      $provide: {
        provider: supportObject(provider),
        factory: supportObject(factory),
        service: supportObject(service),
        value: supportObject(value),
        constant: supportObject(constant),
        decorator
      }
    }, providerInjector = providerCache.$injector = createInternalInjector(providerCache, function(serviceName, caller) {
      if (angular2.isString(caller)) {
        path.push(caller);
      }
      throw $injectorMinErr("unpr", "Unknown provider: {0}", path.join(" <- "));
    }), instanceCache = {}, protoInstanceInjector = createInternalInjector(instanceCache, function(serviceName, caller) {
      var provider2 = providerInjector.get(serviceName + providerSuffix, caller);
      return instanceInjector.invoke(provider2.$get, provider2, void 0, serviceName);
    }), instanceInjector = protoInstanceInjector;
    providerCache["$injector" + providerSuffix] = { $get: valueFn(protoInstanceInjector) };
    instanceInjector.modules = providerInjector.modules = createMap();
    var runBlocks = loadModules(modulesToLoad);
    instanceInjector = protoInstanceInjector.get("$injector");
    instanceInjector.strictDi = strictDi;
    forEach(runBlocks, function(fn) {
      if (fn)
        instanceInjector.invoke(fn);
    });
    instanceInjector.loadNewModules = function(mods) {
      forEach(loadModules(mods), function(fn) {
        if (fn)
          instanceInjector.invoke(fn);
      });
    };
    return instanceInjector;
    function supportObject(delegate) {
      return function(key2, value2) {
        if (isObject(key2)) {
          forEach(key2, reverseParams(delegate));
        } else {
          return delegate(key2, value2);
        }
      };
    }
    function provider(name, provider_) {
      assertNotHasOwnProperty(name, "service");
      if (isFunction(provider_) || isArray(provider_)) {
        provider_ = providerInjector.instantiate(provider_);
      }
      if (!provider_.$get) {
        throw $injectorMinErr("pget", "Provider '{0}' must define $get factory method.", name);
      }
      return providerCache[name + providerSuffix] = provider_;
    }
    function enforceReturnValue(name, factory2) {
      return function enforcedReturnValue() {
        var result = instanceInjector.invoke(factory2, this);
        if (isUndefined(result)) {
          throw $injectorMinErr("undef", "Provider '{0}' must return a value from $get factory method.", name);
        }
        return result;
      };
    }
    function factory(name, factoryFn, enforce) {
      return provider(name, {
        $get: enforce !== false ? enforceReturnValue(name, factoryFn) : factoryFn
      });
    }
    function service(name, constructor) {
      return factory(name, ["$injector", function($injector) {
        return $injector.instantiate(constructor);
      }]);
    }
    function value(name, val) {
      return factory(name, valueFn(val), false);
    }
    function constant(name, value2) {
      assertNotHasOwnProperty(name, "constant");
      providerCache[name] = value2;
      instanceCache[name] = value2;
    }
    function decorator(serviceName, decorFn) {
      var origProvider = providerInjector.get(serviceName + providerSuffix), orig$get = origProvider.$get;
      origProvider.$get = function() {
        var origInstance = instanceInjector.invoke(orig$get, origProvider);
        return instanceInjector.invoke(decorFn, null, { $delegate: origInstance });
      };
    }
    function loadModules(modulesToLoad2) {
      assertArg(isUndefined(modulesToLoad2) || isArray(modulesToLoad2), "modulesToLoad", "not an array");
      var runBlocks2 = [], moduleFn;
      forEach(modulesToLoad2, function(module) {
        if (loadedModules.get(module))
          return;
        loadedModules.set(module, true);
        function runInvokeQueue(queue) {
          var i, ii;
          for (i = 0, ii = queue.length; i < ii; i++) {
            var invokeArgs = queue[i], provider2 = providerInjector.get(invokeArgs[0]);
            provider2[invokeArgs[1]].apply(provider2, invokeArgs[2]);
          }
        }
        try {
          if (isString(module)) {
            moduleFn = angularModule(module);
            instanceInjector.modules[module] = moduleFn;
            runBlocks2 = runBlocks2.concat(loadModules(moduleFn.requires)).concat(moduleFn._runBlocks);
            runInvokeQueue(moduleFn._invokeQueue);
            runInvokeQueue(moduleFn._configBlocks);
          } else if (isFunction(module)) {
            runBlocks2.push(providerInjector.invoke(module));
          } else if (isArray(module)) {
            runBlocks2.push(providerInjector.invoke(module));
          } else {
            assertArgFn(module, "module");
          }
        } catch (e) {
          if (isArray(module)) {
            module = module[module.length - 1];
          }
          if (e.message && e.stack && e.stack.indexOf(e.message) === -1) {
            e = e.message + "\n" + e.stack;
          }
          throw $injectorMinErr("modulerr", "Failed to instantiate module {0} due to:\n{1}", module, e.stack || e.message || e);
        }
      });
      return runBlocks2;
    }
    function createInternalInjector(cache, factory2) {
      function getService(serviceName, caller) {
        if (cache.hasOwnProperty(serviceName)) {
          if (cache[serviceName] === INSTANTIATING) {
            throw $injectorMinErr("cdep", "Circular dependency found: {0}", serviceName + " <- " + path.join(" <- "));
          }
          return cache[serviceName];
        } else {
          try {
            path.unshift(serviceName);
            cache[serviceName] = INSTANTIATING;
            cache[serviceName] = factory2(serviceName, caller);
            return cache[serviceName];
          } catch (err) {
            if (cache[serviceName] === INSTANTIATING) {
              delete cache[serviceName];
            }
            throw err;
          } finally {
            path.shift();
          }
        }
      }
      function injectionArgs(fn, locals, serviceName) {
        var args = [], $inject = createInjector.$$annotate(fn, strictDi, serviceName);
        for (var i = 0, length = $inject.length; i < length; i++) {
          var key2 = $inject[i];
          if (typeof key2 !== "string") {
            throw $injectorMinErr("itkn", "Incorrect injection token! Expected service name as string, got {0}", key2);
          }
          args.push(locals && locals.hasOwnProperty(key2) ? locals[key2] : getService(key2, serviceName));
        }
        return args;
      }
      function isClass(func) {
        if (msie || typeof func !== "function") {
          return false;
        }
        var result = func.$$ngIsClass;
        if (!isBoolean(result)) {
          result = func.$$ngIsClass = /^class\b/.test(stringifyFn(func));
        }
        return result;
      }
      function invoke(fn, self, locals, serviceName) {
        if (typeof locals === "string") {
          serviceName = locals;
          locals = null;
        }
        var args = injectionArgs(fn, locals, serviceName);
        if (isArray(fn)) {
          fn = fn[fn.length - 1];
        }
        if (!isClass(fn)) {
          return fn.apply(self, args);
        } else {
          args.unshift(null);
          return new (Function.prototype.bind.apply(fn, args))();
        }
      }
      function instantiate(Type, locals, serviceName) {
        var ctor = isArray(Type) ? Type[Type.length - 1] : Type;
        var args = injectionArgs(Type, locals, serviceName);
        args.unshift(null);
        return new (Function.prototype.bind.apply(ctor, args))();
      }
      return {
        invoke,
        instantiate,
        get: getService,
        annotate: createInjector.$$annotate,
        has: function(name) {
          return providerCache.hasOwnProperty(name + providerSuffix) || cache.hasOwnProperty(name);
        }
      };
    }
  }
  createInjector.$$annotate = annotate;
  function $AnchorScrollProvider() {
    var autoScrollingEnabled = true;
    this.disableAutoScrolling = function() {
      autoScrollingEnabled = false;
    };
    this.$get = ["$window", "$location", "$rootScope", function($window, $location, $rootScope) {
      var document2 = $window.document;
      function getFirstAnchor(list) {
        var result = null;
        Array.prototype.some.call(list, function(element) {
          if (nodeName_(element) === "a") {
            result = element;
            return true;
          }
        });
        return result;
      }
      function getYOffset() {
        var offset = scroll.yOffset;
        if (isFunction(offset)) {
          offset = offset();
        } else if (isElement(offset)) {
          var elem = offset[0];
          var style = $window.getComputedStyle(elem);
          if (style.position !== "fixed") {
            offset = 0;
          } else {
            offset = elem.getBoundingClientRect().bottom;
          }
        } else if (!isNumber(offset)) {
          offset = 0;
        }
        return offset;
      }
      function scrollTo(elem) {
        if (elem) {
          elem.scrollIntoView();
          var offset = getYOffset();
          if (offset) {
            var elemTop = elem.getBoundingClientRect().top;
            $window.scrollBy(0, elemTop - offset);
          }
        } else {
          $window.scrollTo(0, 0);
        }
      }
      function scroll(hash) {
        hash = isString(hash) ? hash : isNumber(hash) ? hash.toString() : $location.hash();
        var elm;
        if (!hash)
          scrollTo(null);
        else if (elm = document2.getElementById(hash))
          scrollTo(elm);
        else if (elm = getFirstAnchor(document2.getElementsByName(hash)))
          scrollTo(elm);
        else if (hash === "top")
          scrollTo(null);
      }
      if (autoScrollingEnabled) {
        $rootScope.$watch(function autoScrollWatch() {
          return $location.hash();
        }, function autoScrollWatchAction(newVal, oldVal) {
          if (newVal === oldVal && newVal === "")
            return;
          jqLiteDocumentLoaded(function() {
            $rootScope.$evalAsync(scroll);
          });
        });
      }
      return scroll;
    }];
  }
  var $animateMinErr = minErr("$animate");
  var ELEMENT_NODE = 1;
  var NG_ANIMATE_CLASSNAME = "ng-animate";
  function mergeClasses(a, b) {
    if (!a && !b)
      return "";
    if (!a)
      return b;
    if (!b)
      return a;
    if (isArray(a))
      a = a.join(" ");
    if (isArray(b))
      b = b.join(" ");
    return a + " " + b;
  }
  function extractElementNode(element) {
    for (var i = 0; i < element.length; i++) {
      var elm = element[i];
      if (elm.nodeType === ELEMENT_NODE) {
        return elm;
      }
    }
  }
  function splitClasses(classes) {
    if (isString(classes)) {
      classes = classes.split(" ");
    }
    var obj = createMap();
    forEach(classes, function(klass) {
      if (klass.length) {
        obj[klass] = true;
      }
    });
    return obj;
  }
  function prepareAnimateOptions(options) {
    return isObject(options) ? options : {};
  }
  var $$CoreAnimateJsProvider = function() {
    this.$get = noop;
  };
  var $$CoreAnimateQueueProvider = function() {
    var postDigestQueue = new NgMap();
    var postDigestElements = [];
    this.$get = [
      "$$AnimateRunner",
      "$rootScope",
      function($$AnimateRunner, $rootScope) {
        return {
          enabled: noop,
          on: noop,
          off: noop,
          pin: noop,
          push: function(element, event, options, domOperation) {
            if (domOperation) {
              domOperation();
            }
            options = options || {};
            if (options.from) {
              element.css(options.from);
            }
            if (options.to) {
              element.css(options.to);
            }
            if (options.addClass || options.removeClass) {
              addRemoveClassesPostDigest(element, options.addClass, options.removeClass);
            }
            var runner = new $$AnimateRunner();
            runner.complete();
            return runner;
          }
        };
        function updateData(data, classes, value) {
          var changed = false;
          if (classes) {
            classes = isString(classes) ? classes.split(" ") : isArray(classes) ? classes : [];
            forEach(classes, function(className) {
              if (className) {
                changed = true;
                data[className] = value;
              }
            });
          }
          return changed;
        }
        function handleCSSClassChanges() {
          forEach(postDigestElements, function(element) {
            var data = postDigestQueue.get(element);
            if (data) {
              var existing = splitClasses(element.attr("class"));
              var toAdd = "";
              var toRemove = "";
              forEach(data, function(status, className) {
                var hasClass = !!existing[className];
                if (status !== hasClass) {
                  if (status) {
                    toAdd += (toAdd.length ? " " : "") + className;
                  } else {
                    toRemove += (toRemove.length ? " " : "") + className;
                  }
                }
              });
              forEach(element, function(elm) {
                if (toAdd) {
                  jqLiteAddClass(elm, toAdd);
                }
                if (toRemove) {
                  jqLiteRemoveClass(elm, toRemove);
                }
              });
              postDigestQueue.delete(element);
            }
          });
          postDigestElements.length = 0;
        }
        function addRemoveClassesPostDigest(element, add, remove) {
          var data = postDigestQueue.get(element) || {};
          var classesAdded = updateData(data, add, true);
          var classesRemoved = updateData(data, remove, false);
          if (classesAdded || classesRemoved) {
            postDigestQueue.set(element, data);
            postDigestElements.push(element);
            if (postDigestElements.length === 1) {
              $rootScope.$$postDigest(handleCSSClassChanges);
            }
          }
        }
      }
    ];
  };
  var $AnimateProvider = ["$provide", function($provide) {
    var provider = this;
    var classNameFilter = null;
    var customFilter = null;
    this.$$registeredAnimations = /* @__PURE__ */ Object.create(null);
    this.register = function(name, factory) {
      if (name && name.charAt(0) !== ".") {
        throw $animateMinErr("notcsel", "Expecting class selector starting with '.' got '{0}'.", name);
      }
      var key2 = name + "-animation";
      provider.$$registeredAnimations[name.substr(1)] = key2;
      $provide.factory(key2, factory);
    };
    this.customFilter = function(filterFn) {
      if (arguments.length === 1) {
        customFilter = isFunction(filterFn) ? filterFn : null;
      }
      return customFilter;
    };
    this.classNameFilter = function(expression) {
      if (arguments.length === 1) {
        classNameFilter = expression instanceof RegExp ? expression : null;
        if (classNameFilter) {
          var reservedRegex = new RegExp("[(\\s|\\/)]" + NG_ANIMATE_CLASSNAME + "[(\\s|\\/)]");
          if (reservedRegex.test(classNameFilter.toString())) {
            classNameFilter = null;
            throw $animateMinErr("nongcls", '$animateProvider.classNameFilter(regex) prohibits accepting a regex value which matches/contains the "{0}" CSS class.', NG_ANIMATE_CLASSNAME);
          }
        }
      }
      return classNameFilter;
    };
    this.$get = ["$$animateQueue", function($$animateQueue) {
      function domInsert(element, parentElement, afterElement) {
        if (afterElement) {
          var afterNode = extractElementNode(afterElement);
          if (afterNode && !afterNode.parentNode && !afterNode.previousElementSibling) {
            afterElement = null;
          }
        }
        if (afterElement) {
          afterElement.after(element);
        } else {
          parentElement.prepend(element);
        }
      }
      return {
        on: $$animateQueue.on,
        off: $$animateQueue.off,
        pin: $$animateQueue.pin,
        enabled: $$animateQueue.enabled,
        cancel: function(runner) {
          if (runner.cancel) {
            runner.cancel();
          }
        },
        enter: function(element, parent, after, options) {
          parent = parent && jqLite(parent);
          after = after && jqLite(after);
          parent = parent || after.parent();
          domInsert(element, parent, after);
          return $$animateQueue.push(element, "enter", prepareAnimateOptions(options));
        },
        move: function(element, parent, after, options) {
          parent = parent && jqLite(parent);
          after = after && jqLite(after);
          parent = parent || after.parent();
          domInsert(element, parent, after);
          return $$animateQueue.push(element, "move", prepareAnimateOptions(options));
        },
        leave: function(element, options) {
          return $$animateQueue.push(element, "leave", prepareAnimateOptions(options), function() {
            element.remove();
          });
        },
        addClass: function(element, className, options) {
          options = prepareAnimateOptions(options);
          options.addClass = mergeClasses(options.addclass, className);
          return $$animateQueue.push(element, "addClass", options);
        },
        removeClass: function(element, className, options) {
          options = prepareAnimateOptions(options);
          options.removeClass = mergeClasses(options.removeClass, className);
          return $$animateQueue.push(element, "removeClass", options);
        },
        setClass: function(element, add, remove, options) {
          options = prepareAnimateOptions(options);
          options.addClass = mergeClasses(options.addClass, add);
          options.removeClass = mergeClasses(options.removeClass, remove);
          return $$animateQueue.push(element, "setClass", options);
        },
        animate: function(element, from, to, className, options) {
          options = prepareAnimateOptions(options);
          options.from = options.from ? extend(options.from, from) : from;
          options.to = options.to ? extend(options.to, to) : to;
          className = className || "ng-inline-animate";
          options.tempClasses = mergeClasses(options.tempClasses, className);
          return $$animateQueue.push(element, "animate", options);
        }
      };
    }];
  }];
  var $$AnimateAsyncRunFactoryProvider = function() {
    this.$get = ["$$rAF", function($$rAF) {
      var waitQueue = [];
      function waitForTick(fn) {
        waitQueue.push(fn);
        if (waitQueue.length > 1)
          return;
        $$rAF(function() {
          for (var i = 0; i < waitQueue.length; i++) {
            waitQueue[i]();
          }
          waitQueue = [];
        });
      }
      return function() {
        var passed = false;
        waitForTick(function() {
          passed = true;
        });
        return function(callback) {
          if (passed) {
            callback();
          } else {
            waitForTick(callback);
          }
        };
      };
    }];
  };
  var $$AnimateRunnerFactoryProvider = function() {
    this.$get = [
      "$q",
      "$sniffer",
      "$$animateAsyncRun",
      "$$isDocumentHidden",
      "$timeout",
      function($q, $sniffer, $$animateAsyncRun, $$isDocumentHidden, $timeout) {
        var INITIAL_STATE = 0;
        var DONE_PENDING_STATE = 1;
        var DONE_COMPLETE_STATE = 2;
        AnimateRunner.chain = function(chain, callback) {
          var index = 0;
          next();
          function next() {
            if (index === chain.length) {
              callback(true);
              return;
            }
            chain[index](function(response) {
              if (response === false) {
                callback(false);
                return;
              }
              index++;
              next();
            });
          }
        };
        AnimateRunner.all = function(runners, callback) {
          var count = 0;
          var status = true;
          forEach(runners, function(runner) {
            runner.done(onProgress);
          });
          function onProgress(response) {
            status = status && response;
            if (++count === runners.length) {
              callback(status);
            }
          }
        };
        function AnimateRunner(host) {
          this.setHost(host);
          var rafTick = $$animateAsyncRun();
          var timeoutTick = function(fn) {
            $timeout(fn, 0, false);
          };
          this._doneCallbacks = [];
          this._tick = function(fn) {
            if ($$isDocumentHidden()) {
              timeoutTick(fn);
            } else {
              rafTick(fn);
            }
          };
          this._state = 0;
        }
        AnimateRunner.prototype = {
          setHost: function(host) {
            this.host = host || {};
          },
          done: function(fn) {
            if (this._state === DONE_COMPLETE_STATE) {
              fn();
            } else {
              this._doneCallbacks.push(fn);
            }
          },
          progress: noop,
          getPromise: function() {
            if (!this.promise) {
              var self = this;
              this.promise = $q(function(resolve, reject) {
                self.done(function(status) {
                  if (status === false) {
                    reject();
                  } else {
                    resolve();
                  }
                });
              });
            }
            return this.promise;
          },
          then: function(resolveHandler, rejectHandler) {
            return this.getPromise().then(resolveHandler, rejectHandler);
          },
          "catch": function(handler) {
            return this.getPromise()["catch"](handler);
          },
          "finally": function(handler) {
            return this.getPromise()["finally"](handler);
          },
          pause: function() {
            if (this.host.pause) {
              this.host.pause();
            }
          },
          resume: function() {
            if (this.host.resume) {
              this.host.resume();
            }
          },
          end: function() {
            if (this.host.end) {
              this.host.end();
            }
            this._resolve(true);
          },
          cancel: function() {
            if (this.host.cancel) {
              this.host.cancel();
            }
            this._resolve(false);
          },
          complete: function(response) {
            var self = this;
            if (self._state === INITIAL_STATE) {
              self._state = DONE_PENDING_STATE;
              self._tick(function() {
                self._resolve(response);
              });
            }
          },
          _resolve: function(response) {
            if (this._state !== DONE_COMPLETE_STATE) {
              forEach(this._doneCallbacks, function(fn) {
                fn(response);
              });
              this._doneCallbacks.length = 0;
              this._state = DONE_COMPLETE_STATE;
            }
          }
        };
        return AnimateRunner;
      }
    ];
  };
  var $CoreAnimateCssProvider = function() {
    this.$get = ["$$rAF", "$q", "$$AnimateRunner", function($$rAF, $q, $$AnimateRunner) {
      return function(element, initialOptions) {
        var options = initialOptions || {};
        if (!options.$$prepared) {
          options = copy(options);
        }
        if (options.cleanupStyles) {
          options.from = options.to = null;
        }
        if (options.from) {
          element.css(options.from);
          options.from = null;
        }
        var closed, runner = new $$AnimateRunner();
        return {
          start: run,
          end: run
        };
        function run() {
          $$rAF(function() {
            applyAnimationContents();
            if (!closed) {
              runner.complete();
            }
            closed = true;
          });
          return runner;
        }
        function applyAnimationContents() {
          if (options.addClass) {
            element.addClass(options.addClass);
            options.addClass = null;
          }
          if (options.removeClass) {
            element.removeClass(options.removeClass);
            options.removeClass = null;
          }
          if (options.to) {
            element.css(options.to);
            options.to = null;
          }
        }
      };
    }];
  };
  function getHash(url) {
    var index = url.indexOf("#");
    return index === -1 ? "" : url.substr(index);
  }
  function trimEmptyHash(url) {
    return url.replace(/#$/, "");
  }
  function Browser(window3, document2, $log, $sniffer, $$taskTrackerFactory) {
    var self = this, location = window3.location, history = window3.history, setTimeout = window3.setTimeout, clearTimeout = window3.clearTimeout, pendingDeferIds = {}, taskTracker = $$taskTrackerFactory($log);
    self.isMock = false;
    self.$$completeOutstandingRequest = taskTracker.completeTask;
    self.$$incOutstandingRequestCount = taskTracker.incTaskCount;
    self.notifyWhenNoOutstandingRequests = taskTracker.notifyWhenNoPendingTasks;
    var cachedState, lastHistoryState, lastBrowserUrl = location.href, baseElement = document2.find("base"), pendingLocation = null, getCurrentState = !$sniffer.history ? noop : function getCurrentState2() {
      try {
        return history.state;
      } catch (e) {
      }
    };
    cacheState();
    self.url = function(url, replace, state) {
      if (isUndefined(state)) {
        state = null;
      }
      if (location !== window3.location)
        location = window3.location;
      if (history !== window3.history)
        history = window3.history;
      if (url) {
        var sameState = lastHistoryState === state;
        url = urlResolve(url).href;
        if (lastBrowserUrl === url && (!$sniffer.history || sameState)) {
          return self;
        }
        var sameBase = lastBrowserUrl && stripHash(lastBrowserUrl) === stripHash(url);
        lastBrowserUrl = url;
        lastHistoryState = state;
        if ($sniffer.history && (!sameBase || !sameState)) {
          history[replace ? "replaceState" : "pushState"](state, "", url);
          cacheState();
        } else {
          if (!sameBase) {
            pendingLocation = url;
          }
          if (replace) {
            location.replace(url);
          } else if (!sameBase) {
            location.href = url;
          } else {
            location.hash = getHash(url);
          }
          if (location.href !== url) {
            pendingLocation = url;
          }
        }
        if (pendingLocation) {
          pendingLocation = url;
        }
        return self;
      } else {
        return trimEmptyHash(pendingLocation || location.href);
      }
    };
    self.state = function() {
      return cachedState;
    };
    var urlChangeListeners = [], urlChangeInit = false;
    function cacheStateAndFireUrlChange() {
      pendingLocation = null;
      fireStateOrUrlChange();
    }
    var lastCachedState = null;
    function cacheState() {
      cachedState = getCurrentState();
      cachedState = isUndefined(cachedState) ? null : cachedState;
      if (equals(cachedState, lastCachedState)) {
        cachedState = lastCachedState;
      }
      lastCachedState = cachedState;
      lastHistoryState = cachedState;
    }
    function fireStateOrUrlChange() {
      var prevLastHistoryState = lastHistoryState;
      cacheState();
      if (lastBrowserUrl === self.url() && prevLastHistoryState === cachedState) {
        return;
      }
      lastBrowserUrl = self.url();
      lastHistoryState = cachedState;
      forEach(urlChangeListeners, function(listener) {
        listener(self.url(), cachedState);
      });
    }
    self.onUrlChange = function(callback) {
      if (!urlChangeInit) {
        if ($sniffer.history)
          jqLite(window3).on("popstate", cacheStateAndFireUrlChange);
        jqLite(window3).on("hashchange", cacheStateAndFireUrlChange);
        urlChangeInit = true;
      }
      urlChangeListeners.push(callback);
      return callback;
    };
    self.$$applicationDestroyed = function() {
      jqLite(window3).off("hashchange popstate", cacheStateAndFireUrlChange);
    };
    self.$$checkUrlChange = fireStateOrUrlChange;
    self.baseHref = function() {
      var href = baseElement.attr("href");
      return href ? href.replace(/^(https?:)?\/\/[^/]*/, "") : "";
    };
    self.defer = function(fn, delay, taskType) {
      var timeoutId;
      delay = delay || 0;
      taskType = taskType || taskTracker.DEFAULT_TASK_TYPE;
      taskTracker.incTaskCount(taskType);
      timeoutId = setTimeout(function() {
        delete pendingDeferIds[timeoutId];
        taskTracker.completeTask(fn, taskType);
      }, delay);
      pendingDeferIds[timeoutId] = taskType;
      return timeoutId;
    };
    self.defer.cancel = function(deferId) {
      if (pendingDeferIds.hasOwnProperty(deferId)) {
        var taskType = pendingDeferIds[deferId];
        delete pendingDeferIds[deferId];
        clearTimeout(deferId);
        taskTracker.completeTask(noop, taskType);
        return true;
      }
      return false;
    };
  }
  function $BrowserProvider() {
    this.$get = [
      "$window",
      "$log",
      "$sniffer",
      "$document",
      "$$taskTrackerFactory",
      function($window, $log, $sniffer, $document, $$taskTrackerFactory) {
        return new Browser($window, $document, $log, $sniffer, $$taskTrackerFactory);
      }
    ];
  }
  function $CacheFactoryProvider() {
    this.$get = function() {
      var caches = {};
      function cacheFactory(cacheId, options) {
        if (cacheId in caches) {
          throw minErr("$cacheFactory")("iid", "CacheId '{0}' is already taken!", cacheId);
        }
        var size = 0, stats = extend({}, options, { id: cacheId }), data = createMap(), capacity = options && options.capacity || Number.MAX_VALUE, lruHash = createMap(), freshEnd = null, staleEnd = null;
        return caches[cacheId] = {
          put: function(key2, value) {
            if (isUndefined(value))
              return;
            if (capacity < Number.MAX_VALUE) {
              var lruEntry = lruHash[key2] || (lruHash[key2] = { key: key2 });
              refresh(lruEntry);
            }
            if (!(key2 in data))
              size++;
            data[key2] = value;
            if (size > capacity) {
              this.remove(staleEnd.key);
            }
            return value;
          },
          get: function(key2) {
            if (capacity < Number.MAX_VALUE) {
              var lruEntry = lruHash[key2];
              if (!lruEntry)
                return;
              refresh(lruEntry);
            }
            return data[key2];
          },
          remove: function(key2) {
            if (capacity < Number.MAX_VALUE) {
              var lruEntry = lruHash[key2];
              if (!lruEntry)
                return;
              if (lruEntry === freshEnd)
                freshEnd = lruEntry.p;
              if (lruEntry === staleEnd)
                staleEnd = lruEntry.n;
              link(lruEntry.n, lruEntry.p);
              delete lruHash[key2];
            }
            if (!(key2 in data))
              return;
            delete data[key2];
            size--;
          },
          removeAll: function() {
            data = createMap();
            size = 0;
            lruHash = createMap();
            freshEnd = staleEnd = null;
          },
          destroy: function() {
            data = null;
            stats = null;
            lruHash = null;
            delete caches[cacheId];
          },
          info: function() {
            return extend({}, stats, { size });
          }
        };
        function refresh(entry) {
          if (entry !== freshEnd) {
            if (!staleEnd) {
              staleEnd = entry;
            } else if (staleEnd === entry) {
              staleEnd = entry.n;
            }
            link(entry.n, entry.p);
            link(entry, freshEnd);
            freshEnd = entry;
            freshEnd.n = null;
          }
        }
        function link(nextEntry, prevEntry) {
          if (nextEntry !== prevEntry) {
            if (nextEntry)
              nextEntry.p = prevEntry;
            if (prevEntry)
              prevEntry.n = nextEntry;
          }
        }
      }
      cacheFactory.info = function() {
        var info = {};
        forEach(caches, function(cache, cacheId) {
          info[cacheId] = cache.info();
        });
        return info;
      };
      cacheFactory.get = function(cacheId) {
        return caches[cacheId];
      };
      return cacheFactory;
    };
  }
  function $TemplateCacheProvider() {
    this.$get = ["$cacheFactory", function($cacheFactory) {
      return $cacheFactory("templates");
    }];
  }
  var $compileMinErr = minErr("$compile");
  function UNINITIALIZED_VALUE() {
  }
  var _UNINITIALIZED_VALUE = new UNINITIALIZED_VALUE();
  $CompileProvider.$inject = ["$provide", "$$sanitizeUriProvider"];
  function $CompileProvider($provide, $$sanitizeUriProvider) {
    var hasDirectives = {}, Suffix = "Directive", COMMENT_DIRECTIVE_REGEXP = /^\s*directive:\s*([\w-]+)\s+(.*)$/, CLASS_DIRECTIVE_REGEXP = /(([\w-]+)(?::([^;]+))?;?)/, ALL_OR_NOTHING_ATTRS = makeMap("ngSrc,ngSrcset,src,srcset"), REQUIRE_PREFIX_REGEXP = /^(?:(\^\^?)?(\?)?(\^\^?)?)?/;
    var EVENT_HANDLER_ATTR_REGEXP = /^(on[a-z]+|formaction)$/;
    var bindingCache = createMap();
    function parseIsolateBindings(scope, directiveName, isController) {
      var LOCAL_REGEXP = /^([@&]|[=<](\*?))(\??)\s*([\w$]*)$/;
      var bindings = createMap();
      forEach(scope, function(definition, scopeName) {
        definition = definition.trim();
        if (definition in bindingCache) {
          bindings[scopeName] = bindingCache[definition];
          return;
        }
        var match = definition.match(LOCAL_REGEXP);
        if (!match) {
          throw $compileMinErr("iscp", "Invalid {3} for directive '{0}'. Definition: {... {1}: '{2}' ...}", directiveName, scopeName, definition, isController ? "controller bindings definition" : "isolate scope definition");
        }
        bindings[scopeName] = {
          mode: match[1][0],
          collection: match[2] === "*",
          optional: match[3] === "?",
          attrName: match[4] || scopeName
        };
        if (match[4]) {
          bindingCache[definition] = bindings[scopeName];
        }
      });
      return bindings;
    }
    function parseDirectiveBindings(directive, directiveName) {
      var bindings = {
        isolateScope: null,
        bindToController: null
      };
      if (isObject(directive.scope)) {
        if (directive.bindToController === true) {
          bindings.bindToController = parseIsolateBindings(directive.scope, directiveName, true);
          bindings.isolateScope = {};
        } else {
          bindings.isolateScope = parseIsolateBindings(directive.scope, directiveName, false);
        }
      }
      if (isObject(directive.bindToController)) {
        bindings.bindToController = parseIsolateBindings(directive.bindToController, directiveName, true);
      }
      if (bindings.bindToController && !directive.controller) {
        throw $compileMinErr("noctrl", "Cannot bind to controller without directive '{0}'s controller.", directiveName);
      }
      return bindings;
    }
    function assertValidDirectiveName(name) {
      var letter = name.charAt(0);
      if (!letter || letter !== lowercase(letter)) {
        throw $compileMinErr("baddir", "Directive/Component name '{0}' is invalid. The first character must be a lowercase letter", name);
      }
      if (name !== name.trim()) {
        throw $compileMinErr("baddir", "Directive/Component name '{0}' is invalid. The name should not contain leading or trailing whitespaces", name);
      }
    }
    function getDirectiveRequire(directive) {
      var require = directive.require || directive.controller && directive.name;
      if (!isArray(require) && isObject(require)) {
        forEach(require, function(value, key2) {
          var match = value.match(REQUIRE_PREFIX_REGEXP);
          var name = value.substring(match[0].length);
          if (!name)
            require[key2] = match[0] + key2;
        });
      }
      return require;
    }
    function getDirectiveRestrict(restrict, name) {
      if (restrict && !(isString(restrict) && /[EACM]/.test(restrict))) {
        throw $compileMinErr("badrestrict", "Restrict property '{0}' of directive '{1}' is invalid", restrict, name);
      }
      return restrict || "EA";
    }
    this.directive = function registerDirective(name, directiveFactory) {
      assertArg(name, "name");
      assertNotHasOwnProperty(name, "directive");
      if (isString(name)) {
        assertValidDirectiveName(name);
        assertArg(directiveFactory, "directiveFactory");
        if (!hasDirectives.hasOwnProperty(name)) {
          hasDirectives[name] = [];
          $provide.factory(name + Suffix, [
            "$injector",
            "$exceptionHandler",
            function($injector, $exceptionHandler) {
              var directives = [];
              forEach(hasDirectives[name], function(directiveFactory2, index) {
                try {
                  var directive = $injector.invoke(directiveFactory2);
                  if (isFunction(directive)) {
                    directive = { compile: valueFn(directive) };
                  } else if (!directive.compile && directive.link) {
                    directive.compile = valueFn(directive.link);
                  }
                  directive.priority = directive.priority || 0;
                  directive.index = index;
                  directive.name = directive.name || name;
                  directive.require = getDirectiveRequire(directive);
                  directive.restrict = getDirectiveRestrict(directive.restrict, name);
                  directive.$$moduleName = directiveFactory2.$$moduleName;
                  directives.push(directive);
                } catch (e) {
                  $exceptionHandler(e);
                }
              });
              return directives;
            }
          ]);
        }
        hasDirectives[name].push(directiveFactory);
      } else {
        forEach(name, reverseParams(registerDirective));
      }
      return this;
    };
    this.component = function registerComponent(name, options) {
      if (!isString(name)) {
        forEach(name, reverseParams(bind(this, registerComponent)));
        return this;
      }
      var controller = options.controller || function() {
      };
      function factory($injector) {
        function makeInjectable(fn) {
          if (isFunction(fn) || isArray(fn)) {
            return function(tElement, tAttrs) {
              return $injector.invoke(fn, this, { $element: tElement, $attrs: tAttrs });
            };
          } else {
            return fn;
          }
        }
        var template = !options.template && !options.templateUrl ? "" : options.template;
        var ddo = {
          controller,
          controllerAs: identifierForController(options.controller) || options.controllerAs || "$ctrl",
          template: makeInjectable(template),
          templateUrl: makeInjectable(options.templateUrl),
          transclude: options.transclude,
          scope: {},
          bindToController: options.bindings || {},
          restrict: "E",
          require: options.require
        };
        forEach(options, function(val, key2) {
          if (key2.charAt(0) === "$")
            ddo[key2] = val;
        });
        return ddo;
      }
      forEach(options, function(val, key2) {
        if (key2.charAt(0) === "$") {
          factory[key2] = val;
          if (isFunction(controller))
            controller[key2] = val;
        }
      });
      factory.$inject = ["$injector"];
      return this.directive(name, factory);
    };
    this.aHrefSanitizationTrustedUrlList = function(regexp) {
      if (isDefined(regexp)) {
        $$sanitizeUriProvider.aHrefSanitizationTrustedUrlList(regexp);
        return this;
      } else {
        return $$sanitizeUriProvider.aHrefSanitizationTrustedUrlList();
      }
    };
    Object.defineProperty(this, "aHrefSanitizationWhitelist", {
      get: function() {
        return this.aHrefSanitizationTrustedUrlList;
      },
      set: function(value) {
        this.aHrefSanitizationTrustedUrlList = value;
      }
    });
    this.imgSrcSanitizationTrustedUrlList = function(regexp) {
      if (isDefined(regexp)) {
        $$sanitizeUriProvider.imgSrcSanitizationTrustedUrlList(regexp);
        return this;
      } else {
        return $$sanitizeUriProvider.imgSrcSanitizationTrustedUrlList();
      }
    };
    Object.defineProperty(this, "imgSrcSanitizationWhitelist", {
      get: function() {
        return this.imgSrcSanitizationTrustedUrlList;
      },
      set: function(value) {
        this.imgSrcSanitizationTrustedUrlList = value;
      }
    });
    var debugInfoEnabled = true;
    this.debugInfoEnabled = function(enabled) {
      if (isDefined(enabled)) {
        debugInfoEnabled = enabled;
        return this;
      }
      return debugInfoEnabled;
    };
    var strictComponentBindingsEnabled = false;
    this.strictComponentBindingsEnabled = function(enabled) {
      if (isDefined(enabled)) {
        strictComponentBindingsEnabled = enabled;
        return this;
      }
      return strictComponentBindingsEnabled;
    };
    var TTL = 10;
    this.onChangesTtl = function(value) {
      if (arguments.length) {
        TTL = value;
        return this;
      }
      return TTL;
    };
    var commentDirectivesEnabledConfig = true;
    this.commentDirectivesEnabled = function(value) {
      if (arguments.length) {
        commentDirectivesEnabledConfig = value;
        return this;
      }
      return commentDirectivesEnabledConfig;
    };
    var cssClassDirectivesEnabledConfig = true;
    this.cssClassDirectivesEnabled = function(value) {
      if (arguments.length) {
        cssClassDirectivesEnabledConfig = value;
        return this;
      }
      return cssClassDirectivesEnabledConfig;
    };
    var PROP_CONTEXTS = createMap();
    this.addPropertySecurityContext = function(elementName, propertyName, ctx) {
      var key2 = elementName.toLowerCase() + "|" + propertyName.toLowerCase();
      if (key2 in PROP_CONTEXTS && PROP_CONTEXTS[key2] !== ctx) {
        throw $compileMinErr("ctxoverride", "Property context '{0}.{1}' already set to '{2}', cannot override to '{3}'.", elementName, propertyName, PROP_CONTEXTS[key2], ctx);
      }
      PROP_CONTEXTS[key2] = ctx;
      return this;
    };
    (function registerNativePropertyContexts() {
      function registerContext(ctx, values) {
        forEach(values, function(v) {
          PROP_CONTEXTS[v.toLowerCase()] = ctx;
        });
      }
      registerContext(SCE_CONTEXTS.HTML, [
        "iframe|srcdoc",
        "*|innerHTML",
        "*|outerHTML"
      ]);
      registerContext(SCE_CONTEXTS.CSS, ["*|style"]);
      registerContext(SCE_CONTEXTS.URL, [
        "area|href",
        "area|ping",
        "a|href",
        "a|ping",
        "blockquote|cite",
        "body|background",
        "del|cite",
        "input|src",
        "ins|cite",
        "q|cite"
      ]);
      registerContext(SCE_CONTEXTS.MEDIA_URL, [
        "audio|src",
        "img|src",
        "img|srcset",
        "source|src",
        "source|srcset",
        "track|src",
        "video|src",
        "video|poster"
      ]);
      registerContext(SCE_CONTEXTS.RESOURCE_URL, [
        "*|formAction",
        "applet|code",
        "applet|codebase",
        "base|href",
        "embed|src",
        "frame|src",
        "form|action",
        "head|profile",
        "html|manifest",
        "iframe|src",
        "link|href",
        "media|src",
        "object|codebase",
        "object|data",
        "script|src"
      ]);
    })();
    this.$get = [
      "$injector",
      "$interpolate",
      "$exceptionHandler",
      "$templateRequest",
      "$parse",
      "$controller",
      "$rootScope",
      "$sce",
      "$animate",
      function($injector, $interpolate, $exceptionHandler, $templateRequest, $parse, $controller, $rootScope, $sce, $animate) {
        var SIMPLE_ATTR_NAME = /^\w/;
        var specialAttrHolder = window2.document.createElement("div");
        var commentDirectivesEnabled = commentDirectivesEnabledConfig;
        var cssClassDirectivesEnabled = cssClassDirectivesEnabledConfig;
        var onChangesTtl = TTL;
        var onChangesQueue;
        function flushOnChangesQueue() {
          try {
            if (!--onChangesTtl) {
              onChangesQueue = void 0;
              throw $compileMinErr("infchng", "{0} $onChanges() iterations reached. Aborting!\n", TTL);
            }
            $rootScope.$apply(function() {
              for (var i = 0, ii = onChangesQueue.length; i < ii; ++i) {
                try {
                  onChangesQueue[i]();
                } catch (e) {
                  $exceptionHandler(e);
                }
              }
              onChangesQueue = void 0;
            });
          } finally {
            onChangesTtl++;
          }
        }
        function sanitizeSrcset(value, invokeType) {
          if (!value) {
            return value;
          }
          if (!isString(value)) {
            throw $compileMinErr("srcset", 'Can\'t pass trusted values to `{0}`: "{1}"', invokeType, value.toString());
          }
          var result = "";
          var trimmedSrcset = trim(value);
          var srcPattern = /(\s+\d+x\s*,|\s+\d+w\s*,|\s+,|,\s+)/;
          var pattern = /\s/.test(trimmedSrcset) ? srcPattern : /(,)/;
          var rawUris = trimmedSrcset.split(pattern);
          var nbrUrisWith2parts = Math.floor(rawUris.length / 2);
          for (var i = 0; i < nbrUrisWith2parts; i++) {
            var innerIdx = i * 2;
            result += $sce.getTrustedMediaUrl(trim(rawUris[innerIdx]));
            result += " " + trim(rawUris[innerIdx + 1]);
          }
          var lastTuple = trim(rawUris[i * 2]).split(/\s/);
          result += $sce.getTrustedMediaUrl(trim(lastTuple[0]));
          if (lastTuple.length === 2) {
            result += " " + trim(lastTuple[1]);
          }
          return result;
        }
        function Attributes(element, attributesToCopy) {
          if (attributesToCopy) {
            var keys = Object.keys(attributesToCopy);
            var i, l, key2;
            for (i = 0, l = keys.length; i < l; i++) {
              key2 = keys[i];
              this[key2] = attributesToCopy[key2];
            }
          } else {
            this.$attr = {};
          }
          this.$$element = element;
        }
        Attributes.prototype = {
          $normalize: directiveNormalize,
          $addClass: function(classVal) {
            if (classVal && classVal.length > 0) {
              $animate.addClass(this.$$element, classVal);
            }
          },
          $removeClass: function(classVal) {
            if (classVal && classVal.length > 0) {
              $animate.removeClass(this.$$element, classVal);
            }
          },
          $updateClass: function(newClasses, oldClasses) {
            var toAdd = tokenDifference(newClasses, oldClasses);
            if (toAdd && toAdd.length) {
              $animate.addClass(this.$$element, toAdd);
            }
            var toRemove = tokenDifference(oldClasses, newClasses);
            if (toRemove && toRemove.length) {
              $animate.removeClass(this.$$element, toRemove);
            }
          },
          $set: function(key2, value, writeAttr, attrName) {
            var node = this.$$element[0], booleanKey = getBooleanAttrName(node, key2), aliasedKey = getAliasedAttrName(key2), observer = key2, nodeName;
            if (booleanKey) {
              this.$$element.prop(key2, value);
              attrName = booleanKey;
            } else if (aliasedKey) {
              this[aliasedKey] = value;
              observer = aliasedKey;
            }
            this[key2] = value;
            if (attrName) {
              this.$attr[key2] = attrName;
            } else {
              attrName = this.$attr[key2];
              if (!attrName) {
                this.$attr[key2] = attrName = snake_case(key2, "-");
              }
            }
            nodeName = nodeName_(this.$$element);
            if (nodeName === "img" && key2 === "srcset") {
              this[key2] = value = sanitizeSrcset(value, "$set('srcset', value)");
            }
            if (writeAttr !== false) {
              if (value === null || isUndefined(value)) {
                this.$$element.removeAttr(attrName);
              } else {
                if (SIMPLE_ATTR_NAME.test(attrName)) {
                  if (booleanKey && value === false) {
                    this.$$element.removeAttr(attrName);
                  } else {
                    this.$$element.attr(attrName, value);
                  }
                } else {
                  setSpecialAttr(this.$$element[0], attrName, value);
                }
              }
            }
            var $$observers = this.$$observers;
            if ($$observers) {
              forEach($$observers[observer], function(fn) {
                try {
                  fn(value);
                } catch (e) {
                  $exceptionHandler(e);
                }
              });
            }
          },
          $observe: function(key2, fn) {
            var attrs = this, $$observers = attrs.$$observers || (attrs.$$observers = createMap()), listeners = $$observers[key2] || ($$observers[key2] = []);
            listeners.push(fn);
            $rootScope.$evalAsync(function() {
              if (!listeners.$$inter && attrs.hasOwnProperty(key2) && !isUndefined(attrs[key2])) {
                fn(attrs[key2]);
              }
            });
            return function() {
              arrayRemove(listeners, fn);
            };
          }
        };
        function setSpecialAttr(element, attrName, value) {
          specialAttrHolder.innerHTML = "<span " + attrName + ">";
          var attributes = specialAttrHolder.firstChild.attributes;
          var attribute = attributes[0];
          attributes.removeNamedItem(attribute.name);
          attribute.value = value;
          element.attributes.setNamedItem(attribute);
        }
        function safeAddClass($element, className) {
          try {
            $element.addClass(className);
          } catch (e) {
          }
        }
        var startSymbol = $interpolate.startSymbol(), endSymbol = $interpolate.endSymbol(), denormalizeTemplate = startSymbol === "{{" && endSymbol === "}}" ? identity : function denormalizeTemplate2(template) {
          return template.replace(/\{\{/g, startSymbol).replace(/}}/g, endSymbol);
        }, NG_PREFIX_BINDING = /^ng(Attr|Prop|On)([A-Z].*)$/;
        var MULTI_ELEMENT_DIR_RE = /^(.+)Start$/;
        compile.$$addBindingInfo = debugInfoEnabled ? function $$addBindingInfo($element, binding) {
          var bindings = $element.data("$binding") || [];
          if (isArray(binding)) {
            bindings = bindings.concat(binding);
          } else {
            bindings.push(binding);
          }
          $element.data("$binding", bindings);
        } : noop;
        compile.$$addBindingClass = debugInfoEnabled ? function $$addBindingClass($element) {
          safeAddClass($element, "ng-binding");
        } : noop;
        compile.$$addScopeInfo = debugInfoEnabled ? function $$addScopeInfo($element, scope, isolated, noTemplate) {
          var dataName = isolated ? noTemplate ? "$isolateScopeNoTemplate" : "$isolateScope" : "$scope";
          $element.data(dataName, scope);
        } : noop;
        compile.$$addScopeClass = debugInfoEnabled ? function $$addScopeClass($element, isolated) {
          safeAddClass($element, isolated ? "ng-isolate-scope" : "ng-scope");
        } : noop;
        compile.$$createComment = function(directiveName, comment) {
          var content = "";
          if (debugInfoEnabled) {
            content = " " + (directiveName || "") + ": ";
            if (comment)
              content += comment + " ";
          }
          return window2.document.createComment(content);
        };
        return compile;
        function compile($compileNodes, transcludeFn, maxPriority, ignoreDirective, previousCompileContext) {
          if (!($compileNodes instanceof jqLite)) {
            $compileNodes = jqLite($compileNodes);
          }
          var compositeLinkFn = compileNodes($compileNodes, transcludeFn, $compileNodes, maxPriority, ignoreDirective, previousCompileContext);
          compile.$$addScopeClass($compileNodes);
          var namespace = null;
          return function publicLinkFn(scope, cloneConnectFn, options) {
            if (!$compileNodes) {
              throw $compileMinErr("multilink", "This element has already been linked.");
            }
            assertArg(scope, "scope");
            if (previousCompileContext && previousCompileContext.needsNewScope) {
              scope = scope.$parent.$new();
            }
            options = options || {};
            var parentBoundTranscludeFn = options.parentBoundTranscludeFn, transcludeControllers = options.transcludeControllers, futureParentElement = options.futureParentElement;
            if (parentBoundTranscludeFn && parentBoundTranscludeFn.$$boundTransclude) {
              parentBoundTranscludeFn = parentBoundTranscludeFn.$$boundTransclude;
            }
            if (!namespace) {
              namespace = detectNamespaceForChildElements(futureParentElement);
            }
            var $linkNode;
            if (namespace !== "html") {
              $linkNode = jqLite(wrapTemplate(namespace, jqLite("<div></div>").append($compileNodes).html()));
            } else if (cloneConnectFn) {
              $linkNode = JQLitePrototype.clone.call($compileNodes);
            } else {
              $linkNode = $compileNodes;
            }
            if (transcludeControllers) {
              for (var controllerName in transcludeControllers) {
                $linkNode.data("$" + controllerName + "Controller", transcludeControllers[controllerName].instance);
              }
            }
            compile.$$addScopeInfo($linkNode, scope);
            if (cloneConnectFn)
              cloneConnectFn($linkNode, scope);
            if (compositeLinkFn)
              compositeLinkFn(scope, $linkNode, $linkNode, parentBoundTranscludeFn);
            if (!cloneConnectFn) {
              $compileNodes = compositeLinkFn = null;
            }
            return $linkNode;
          };
        }
        function detectNamespaceForChildElements(parentElement) {
          var node = parentElement && parentElement[0];
          if (!node) {
            return "html";
          } else {
            return nodeName_(node) !== "foreignobject" && toString.call(node).match(/SVG/) ? "svg" : "html";
          }
        }
        function compileNodes(nodeList, transcludeFn, $rootElement, maxPriority, ignoreDirective, previousCompileContext) {
          var linkFns = [], notLiveList = isArray(nodeList) || nodeList instanceof jqLite, attrs, directives, nodeLinkFn, childNodes, childLinkFn, linkFnFound, nodeLinkFnFound;
          for (var i = 0; i < nodeList.length; i++) {
            attrs = new Attributes();
            if (msie === 11) {
              mergeConsecutiveTextNodes(nodeList, i, notLiveList);
            }
            directives = collectDirectives(nodeList[i], [], attrs, i === 0 ? maxPriority : void 0, ignoreDirective);
            nodeLinkFn = directives.length ? applyDirectivesToNode(directives, nodeList[i], attrs, transcludeFn, $rootElement, null, [], [], previousCompileContext) : null;
            if (nodeLinkFn && nodeLinkFn.scope) {
              compile.$$addScopeClass(attrs.$$element);
            }
            childLinkFn = nodeLinkFn && nodeLinkFn.terminal || !(childNodes = nodeList[i].childNodes) || !childNodes.length ? null : compileNodes(childNodes, nodeLinkFn ? (nodeLinkFn.transcludeOnThisElement || !nodeLinkFn.templateOnThisElement) && nodeLinkFn.transclude : transcludeFn);
            if (nodeLinkFn || childLinkFn) {
              linkFns.push(i, nodeLinkFn, childLinkFn);
              linkFnFound = true;
              nodeLinkFnFound = nodeLinkFnFound || nodeLinkFn;
            }
            previousCompileContext = null;
          }
          return linkFnFound ? compositeLinkFn : null;
          function compositeLinkFn(scope, nodeList2, $rootElement2, parentBoundTranscludeFn) {
            var nodeLinkFn2, childLinkFn2, node, childScope, i2, ii, idx, childBoundTranscludeFn;
            var stableNodeList;
            if (nodeLinkFnFound) {
              var nodeListLength = nodeList2.length;
              stableNodeList = new Array(nodeListLength);
              for (i2 = 0; i2 < linkFns.length; i2 += 3) {
                idx = linkFns[i2];
                stableNodeList[idx] = nodeList2[idx];
              }
            } else {
              stableNodeList = nodeList2;
            }
            for (i2 = 0, ii = linkFns.length; i2 < ii; ) {
              node = stableNodeList[linkFns[i2++]];
              nodeLinkFn2 = linkFns[i2++];
              childLinkFn2 = linkFns[i2++];
              if (nodeLinkFn2) {
                if (nodeLinkFn2.scope) {
                  childScope = scope.$new();
                  compile.$$addScopeInfo(jqLite(node), childScope);
                } else {
                  childScope = scope;
                }
                if (nodeLinkFn2.transcludeOnThisElement) {
                  childBoundTranscludeFn = createBoundTranscludeFn(scope, nodeLinkFn2.transclude, parentBoundTranscludeFn);
                } else if (!nodeLinkFn2.templateOnThisElement && parentBoundTranscludeFn) {
                  childBoundTranscludeFn = parentBoundTranscludeFn;
                } else if (!parentBoundTranscludeFn && transcludeFn) {
                  childBoundTranscludeFn = createBoundTranscludeFn(scope, transcludeFn);
                } else {
                  childBoundTranscludeFn = null;
                }
                nodeLinkFn2(childLinkFn2, childScope, node, $rootElement2, childBoundTranscludeFn);
              } else if (childLinkFn2) {
                childLinkFn2(scope, node.childNodes, void 0, parentBoundTranscludeFn);
              }
            }
          }
        }
        function mergeConsecutiveTextNodes(nodeList, idx, notLiveList) {
          var node = nodeList[idx];
          var parent = node.parentNode;
          var sibling;
          if (node.nodeType !== NODE_TYPE_TEXT) {
            return;
          }
          while (true) {
            sibling = parent ? node.nextSibling : nodeList[idx + 1];
            if (!sibling || sibling.nodeType !== NODE_TYPE_TEXT) {
              break;
            }
            node.nodeValue = node.nodeValue + sibling.nodeValue;
            if (sibling.parentNode) {
              sibling.parentNode.removeChild(sibling);
            }
            if (notLiveList && sibling === nodeList[idx + 1]) {
              nodeList.splice(idx + 1, 1);
            }
          }
        }
        function createBoundTranscludeFn(scope, transcludeFn, previousBoundTranscludeFn) {
          function boundTranscludeFn(transcludedScope, cloneFn, controllers, futureParentElement, containingScope) {
            if (!transcludedScope) {
              transcludedScope = scope.$new(false, containingScope);
              transcludedScope.$$transcluded = true;
            }
            return transcludeFn(transcludedScope, cloneFn, {
              parentBoundTranscludeFn: previousBoundTranscludeFn,
              transcludeControllers: controllers,
              futureParentElement
            });
          }
          var boundSlots = boundTranscludeFn.$$slots = createMap();
          for (var slotName in transcludeFn.$$slots) {
            if (transcludeFn.$$slots[slotName]) {
              boundSlots[slotName] = createBoundTranscludeFn(scope, transcludeFn.$$slots[slotName], previousBoundTranscludeFn);
            } else {
              boundSlots[slotName] = null;
            }
          }
          return boundTranscludeFn;
        }
        function collectDirectives(node, directives, attrs, maxPriority, ignoreDirective) {
          var nodeType = node.nodeType, attrsMap = attrs.$attr, match, nodeName, className;
          switch (nodeType) {
            case NODE_TYPE_ELEMENT:
              nodeName = nodeName_(node);
              addDirective(directives, directiveNormalize(nodeName), "E", maxPriority, ignoreDirective);
              for (var attr, name, nName, value, ngPrefixMatch, nAttrs = node.attributes, j = 0, jj = nAttrs && nAttrs.length; j < jj; j++) {
                var attrStartName = false;
                var attrEndName = false;
                var isNgAttr = false, isNgProp = false, isNgEvent = false;
                var multiElementMatch;
                attr = nAttrs[j];
                name = attr.name;
                value = attr.value;
                nName = directiveNormalize(name.toLowerCase());
                if (ngPrefixMatch = nName.match(NG_PREFIX_BINDING)) {
                  isNgAttr = ngPrefixMatch[1] === "Attr";
                  isNgProp = ngPrefixMatch[1] === "Prop";
                  isNgEvent = ngPrefixMatch[1] === "On";
                  name = name.replace(PREFIX_REGEXP, "").toLowerCase().substr(4 + ngPrefixMatch[1].length).replace(/_(.)/g, function(match2, letter) {
                    return letter.toUpperCase();
                  });
                } else if ((multiElementMatch = nName.match(MULTI_ELEMENT_DIR_RE)) && directiveIsMultiElement(multiElementMatch[1])) {
                  attrStartName = name;
                  attrEndName = name.substr(0, name.length - 5) + "end";
                  name = name.substr(0, name.length - 6);
                }
                if (isNgProp || isNgEvent) {
                  attrs[nName] = value;
                  attrsMap[nName] = attr.name;
                  if (isNgProp) {
                    addPropertyDirective(node, directives, nName, name);
                  } else {
                    addEventDirective(directives, nName, name);
                  }
                } else {
                  nName = directiveNormalize(name.toLowerCase());
                  attrsMap[nName] = name;
                  if (isNgAttr || !attrs.hasOwnProperty(nName)) {
                    attrs[nName] = value;
                    if (getBooleanAttrName(node, nName)) {
                      attrs[nName] = true;
                    }
                  }
                  addAttrInterpolateDirective(node, directives, value, nName, isNgAttr);
                  addDirective(directives, nName, "A", maxPriority, ignoreDirective, attrStartName, attrEndName);
                }
              }
              if (nodeName === "input" && node.getAttribute("type") === "hidden") {
                node.setAttribute("autocomplete", "off");
              }
              if (!cssClassDirectivesEnabled)
                break;
              className = node.className;
              if (isObject(className)) {
                className = className.animVal;
              }
              if (isString(className) && className !== "") {
                while (match = CLASS_DIRECTIVE_REGEXP.exec(className)) {
                  nName = directiveNormalize(match[2]);
                  if (addDirective(directives, nName, "C", maxPriority, ignoreDirective)) {
                    attrs[nName] = trim(match[3]);
                  }
                  className = className.substr(match.index + match[0].length);
                }
              }
              break;
            case NODE_TYPE_TEXT:
              addTextInterpolateDirective(directives, node.nodeValue);
              break;
            case NODE_TYPE_COMMENT:
              if (!commentDirectivesEnabled)
                break;
              collectCommentDirectives(node, directives, attrs, maxPriority, ignoreDirective);
              break;
          }
          directives.sort(byPriority);
          return directives;
        }
        function collectCommentDirectives(node, directives, attrs, maxPriority, ignoreDirective) {
          try {
            var match = COMMENT_DIRECTIVE_REGEXP.exec(node.nodeValue);
            if (match) {
              var nName = directiveNormalize(match[1]);
              if (addDirective(directives, nName, "M", maxPriority, ignoreDirective)) {
                attrs[nName] = trim(match[2]);
              }
            }
          } catch (e) {
          }
        }
        function groupScan(node, attrStart, attrEnd) {
          var nodes = [];
          var depth = 0;
          if (attrStart && node.hasAttribute && node.hasAttribute(attrStart)) {
            do {
              if (!node) {
                throw $compileMinErr("uterdir", "Unterminated attribute, found '{0}' but no matching '{1}' found.", attrStart, attrEnd);
              }
              if (node.nodeType === NODE_TYPE_ELEMENT) {
                if (node.hasAttribute(attrStart))
                  depth++;
                if (node.hasAttribute(attrEnd))
                  depth--;
              }
              nodes.push(node);
              node = node.nextSibling;
            } while (depth > 0);
          } else {
            nodes.push(node);
          }
          return jqLite(nodes);
        }
        function groupElementsLinkFnWrapper(linkFn, attrStart, attrEnd) {
          return function groupedElementsLink(scope, element, attrs, controllers, transcludeFn) {
            element = groupScan(element[0], attrStart, attrEnd);
            return linkFn(scope, element, attrs, controllers, transcludeFn);
          };
        }
        function compilationGenerator(eager, $compileNodes, transcludeFn, maxPriority, ignoreDirective, previousCompileContext) {
          var compiled;
          if (eager) {
            return compile($compileNodes, transcludeFn, maxPriority, ignoreDirective, previousCompileContext);
          }
          return function lazyCompilation() {
            if (!compiled) {
              compiled = compile($compileNodes, transcludeFn, maxPriority, ignoreDirective, previousCompileContext);
              $compileNodes = transcludeFn = previousCompileContext = null;
            }
            return compiled.apply(this, arguments);
          };
        }
        function applyDirectivesToNode(directives, compileNode, templateAttrs, transcludeFn, jqCollection, originalReplaceDirective, preLinkFns, postLinkFns, previousCompileContext) {
          previousCompileContext = previousCompileContext || {};
          var terminalPriority = -Number.MAX_VALUE, newScopeDirective = previousCompileContext.newScopeDirective, controllerDirectives = previousCompileContext.controllerDirectives, newIsolateScopeDirective = previousCompileContext.newIsolateScopeDirective, templateDirective = previousCompileContext.templateDirective, nonTlbTranscludeDirective = previousCompileContext.nonTlbTranscludeDirective, hasTranscludeDirective = false, hasTemplate = false, hasElementTranscludeDirective = previousCompileContext.hasElementTranscludeDirective, $compileNode = templateAttrs.$$element = jqLite(compileNode), directive, directiveName, $template, replaceDirective = originalReplaceDirective, childTranscludeFn = transcludeFn, linkFn, didScanForMultipleTransclusion = false, mightHaveMultipleTransclusionError = false, directiveValue;
          for (var i = 0, ii = directives.length; i < ii; i++) {
            directive = directives[i];
            var attrStart = directive.$$start;
            var attrEnd = directive.$$end;
            if (attrStart) {
              $compileNode = groupScan(compileNode, attrStart, attrEnd);
            }
            $template = void 0;
            if (terminalPriority > directive.priority) {
              break;
            }
            directiveValue = directive.scope;
            if (directiveValue) {
              if (!directive.templateUrl) {
                if (isObject(directiveValue)) {
                  assertNoDuplicate("new/isolated scope", newIsolateScopeDirective || newScopeDirective, directive, $compileNode);
                  newIsolateScopeDirective = directive;
                } else {
                  assertNoDuplicate("new/isolated scope", newIsolateScopeDirective, directive, $compileNode);
                }
              }
              newScopeDirective = newScopeDirective || directive;
            }
            directiveName = directive.name;
            if (!didScanForMultipleTransclusion && (directive.replace && (directive.templateUrl || directive.template) || directive.transclude && !directive.$$tlb)) {
              var candidateDirective;
              for (var scanningIndex = i + 1; candidateDirective = directives[scanningIndex++]; ) {
                if (candidateDirective.transclude && !candidateDirective.$$tlb || candidateDirective.replace && (candidateDirective.templateUrl || candidateDirective.template)) {
                  mightHaveMultipleTransclusionError = true;
                  break;
                }
              }
              didScanForMultipleTransclusion = true;
            }
            if (!directive.templateUrl && directive.controller) {
              controllerDirectives = controllerDirectives || createMap();
              assertNoDuplicate("'" + directiveName + "' controller", controllerDirectives[directiveName], directive, $compileNode);
              controllerDirectives[directiveName] = directive;
            }
            directiveValue = directive.transclude;
            if (directiveValue) {
              hasTranscludeDirective = true;
              if (!directive.$$tlb) {
                assertNoDuplicate("transclusion", nonTlbTranscludeDirective, directive, $compileNode);
                nonTlbTranscludeDirective = directive;
              }
              if (directiveValue === "element") {
                hasElementTranscludeDirective = true;
                terminalPriority = directive.priority;
                $template = $compileNode;
                $compileNode = templateAttrs.$$element = jqLite(compile.$$createComment(directiveName, templateAttrs[directiveName]));
                compileNode = $compileNode[0];
                replaceWith(jqCollection, sliceArgs($template), compileNode);
                childTranscludeFn = compilationGenerator(mightHaveMultipleTransclusionError, $template, transcludeFn, terminalPriority, replaceDirective && replaceDirective.name, {
                  nonTlbTranscludeDirective
                });
              } else {
                var slots = createMap();
                if (!isObject(directiveValue)) {
                  $template = jqLite(jqLiteClone(compileNode)).contents();
                } else {
                  $template = window2.document.createDocumentFragment();
                  var slotMap = createMap();
                  var filledSlots = createMap();
                  forEach(directiveValue, function(elementSelector, slotName2) {
                    var optional = elementSelector.charAt(0) === "?";
                    elementSelector = optional ? elementSelector.substring(1) : elementSelector;
                    slotMap[elementSelector] = slotName2;
                    slots[slotName2] = null;
                    filledSlots[slotName2] = optional;
                  });
                  forEach($compileNode.contents(), function(node) {
                    var slotName2 = slotMap[directiveNormalize(nodeName_(node))];
                    if (slotName2) {
                      filledSlots[slotName2] = true;
                      slots[slotName2] = slots[slotName2] || window2.document.createDocumentFragment();
                      slots[slotName2].appendChild(node);
                    } else {
                      $template.appendChild(node);
                    }
                  });
                  forEach(filledSlots, function(filled, slotName2) {
                    if (!filled) {
                      throw $compileMinErr("reqslot", "Required transclusion slot `{0}` was not filled.", slotName2);
                    }
                  });
                  for (var slotName in slots) {
                    if (slots[slotName]) {
                      var slotCompileNodes = jqLite(slots[slotName].childNodes);
                      slots[slotName] = compilationGenerator(mightHaveMultipleTransclusionError, slotCompileNodes, transcludeFn);
                    }
                  }
                  $template = jqLite($template.childNodes);
                }
                $compileNode.empty();
                childTranscludeFn = compilationGenerator(mightHaveMultipleTransclusionError, $template, transcludeFn, void 0, void 0, { needsNewScope: directive.$$isolateScope || directive.$$newScope });
                childTranscludeFn.$$slots = slots;
              }
            }
            if (directive.template) {
              hasTemplate = true;
              assertNoDuplicate("template", templateDirective, directive, $compileNode);
              templateDirective = directive;
              directiveValue = isFunction(directive.template) ? directive.template($compileNode, templateAttrs) : directive.template;
              directiveValue = denormalizeTemplate(directiveValue);
              if (directive.replace) {
                replaceDirective = directive;
                if (jqLiteIsTextNode(directiveValue)) {
                  $template = [];
                } else {
                  $template = removeComments(wrapTemplate(directive.templateNamespace, trim(directiveValue)));
                }
                compileNode = $template[0];
                if ($template.length !== 1 || compileNode.nodeType !== NODE_TYPE_ELEMENT) {
                  throw $compileMinErr("tplrt", "Template for directive '{0}' must have exactly one root element. {1}", directiveName, "");
                }
                replaceWith(jqCollection, $compileNode, compileNode);
                var newTemplateAttrs = { $attr: {} };
                var templateDirectives = collectDirectives(compileNode, [], newTemplateAttrs);
                var unprocessedDirectives = directives.splice(i + 1, directives.length - (i + 1));
                if (newIsolateScopeDirective || newScopeDirective) {
                  markDirectiveScope(templateDirectives, newIsolateScopeDirective, newScopeDirective);
                }
                directives = directives.concat(templateDirectives).concat(unprocessedDirectives);
                mergeTemplateAttributes(templateAttrs, newTemplateAttrs);
                ii = directives.length;
              } else {
                $compileNode.html(directiveValue);
              }
            }
            if (directive.templateUrl) {
              hasTemplate = true;
              assertNoDuplicate("template", templateDirective, directive, $compileNode);
              templateDirective = directive;
              if (directive.replace) {
                replaceDirective = directive;
              }
              nodeLinkFn = compileTemplateUrl(directives.splice(i, directives.length - i), $compileNode, templateAttrs, jqCollection, hasTranscludeDirective && childTranscludeFn, preLinkFns, postLinkFns, {
                controllerDirectives,
                newScopeDirective: newScopeDirective !== directive && newScopeDirective,
                newIsolateScopeDirective,
                templateDirective,
                nonTlbTranscludeDirective
              });
              ii = directives.length;
            } else if (directive.compile) {
              try {
                linkFn = directive.compile($compileNode, templateAttrs, childTranscludeFn);
                var context = directive.$$originalDirective || directive;
                if (isFunction(linkFn)) {
                  addLinkFns(null, bind(context, linkFn), attrStart, attrEnd);
                } else if (linkFn) {
                  addLinkFns(bind(context, linkFn.pre), bind(context, linkFn.post), attrStart, attrEnd);
                }
              } catch (e) {
                $exceptionHandler(e, startingTag($compileNode));
              }
            }
            if (directive.terminal) {
              nodeLinkFn.terminal = true;
              terminalPriority = Math.max(terminalPriority, directive.priority);
            }
          }
          nodeLinkFn.scope = newScopeDirective && newScopeDirective.scope === true;
          nodeLinkFn.transcludeOnThisElement = hasTranscludeDirective;
          nodeLinkFn.templateOnThisElement = hasTemplate;
          nodeLinkFn.transclude = childTranscludeFn;
          previousCompileContext.hasElementTranscludeDirective = hasElementTranscludeDirective;
          return nodeLinkFn;
          function addLinkFns(pre, post, attrStart2, attrEnd2) {
            if (pre) {
              if (attrStart2)
                pre = groupElementsLinkFnWrapper(pre, attrStart2, attrEnd2);
              pre.require = directive.require;
              pre.directiveName = directiveName;
              if (newIsolateScopeDirective === directive || directive.$$isolateScope) {
                pre = cloneAndAnnotateFn(pre, { isolateScope: true });
              }
              preLinkFns.push(pre);
            }
            if (post) {
              if (attrStart2)
                post = groupElementsLinkFnWrapper(post, attrStart2, attrEnd2);
              post.require = directive.require;
              post.directiveName = directiveName;
              if (newIsolateScopeDirective === directive || directive.$$isolateScope) {
                post = cloneAndAnnotateFn(post, { isolateScope: true });
              }
              postLinkFns.push(post);
            }
          }
          function nodeLinkFn(childLinkFn, scope, linkNode, $rootElement, boundTranscludeFn) {
            var i2, ii2, linkFn2, isolateScope, controllerScope, elementControllers, transcludeFn2, $element, attrs, scopeBindingInfo;
            if (compileNode === linkNode) {
              attrs = templateAttrs;
              $element = templateAttrs.$$element;
            } else {
              $element = jqLite(linkNode);
              attrs = new Attributes($element, templateAttrs);
            }
            controllerScope = scope;
            if (newIsolateScopeDirective) {
              isolateScope = scope.$new(true);
            } else if (newScopeDirective) {
              controllerScope = scope.$parent;
            }
            if (boundTranscludeFn) {
              transcludeFn2 = controllersBoundTransclude;
              transcludeFn2.$$boundTransclude = boundTranscludeFn;
              transcludeFn2.isSlotFilled = function(slotName2) {
                return !!boundTranscludeFn.$$slots[slotName2];
              };
            }
            if (controllerDirectives) {
              elementControllers = setupControllers($element, attrs, transcludeFn2, controllerDirectives, isolateScope, scope, newIsolateScopeDirective);
            }
            if (newIsolateScopeDirective) {
              compile.$$addScopeInfo($element, isolateScope, true, !(templateDirective && (templateDirective === newIsolateScopeDirective || templateDirective === newIsolateScopeDirective.$$originalDirective)));
              compile.$$addScopeClass($element, true);
              isolateScope.$$isolateBindings = newIsolateScopeDirective.$$isolateBindings;
              scopeBindingInfo = initializeDirectiveBindings(scope, attrs, isolateScope, isolateScope.$$isolateBindings, newIsolateScopeDirective);
              if (scopeBindingInfo.removeWatches) {
                isolateScope.$on("$destroy", scopeBindingInfo.removeWatches);
              }
            }
            for (var name in elementControllers) {
              var controllerDirective = controllerDirectives[name];
              var controller = elementControllers[name];
              var bindings = controllerDirective.$$bindings.bindToController;
              controller.instance = controller();
              $element.data("$" + controllerDirective.name + "Controller", controller.instance);
              controller.bindingInfo = initializeDirectiveBindings(controllerScope, attrs, controller.instance, bindings, controllerDirective);
            }
            forEach(controllerDirectives, function(controllerDirective2, name2) {
              var require = controllerDirective2.require;
              if (controllerDirective2.bindToController && !isArray(require) && isObject(require)) {
                extend(elementControllers[name2].instance, getControllers(name2, require, $element, elementControllers));
              }
            });
            forEach(elementControllers, function(controller2) {
              var controllerInstance = controller2.instance;
              if (isFunction(controllerInstance.$onChanges)) {
                try {
                  controllerInstance.$onChanges(controller2.bindingInfo.initialChanges);
                } catch (e) {
                  $exceptionHandler(e);
                }
              }
              if (isFunction(controllerInstance.$onInit)) {
                try {
                  controllerInstance.$onInit();
                } catch (e) {
                  $exceptionHandler(e);
                }
              }
              if (isFunction(controllerInstance.$doCheck)) {
                controllerScope.$watch(function() {
                  controllerInstance.$doCheck();
                });
                controllerInstance.$doCheck();
              }
              if (isFunction(controllerInstance.$onDestroy)) {
                controllerScope.$on("$destroy", function callOnDestroyHook() {
                  controllerInstance.$onDestroy();
                });
              }
            });
            for (i2 = 0, ii2 = preLinkFns.length; i2 < ii2; i2++) {
              linkFn2 = preLinkFns[i2];
              invokeLinkFn(linkFn2, linkFn2.isolateScope ? isolateScope : scope, $element, attrs, linkFn2.require && getControllers(linkFn2.directiveName, linkFn2.require, $element, elementControllers), transcludeFn2);
            }
            var scopeToChild = scope;
            if (newIsolateScopeDirective && (newIsolateScopeDirective.template || newIsolateScopeDirective.templateUrl === null)) {
              scopeToChild = isolateScope;
            }
            if (childLinkFn) {
              childLinkFn(scopeToChild, linkNode.childNodes, void 0, boundTranscludeFn);
            }
            for (i2 = postLinkFns.length - 1; i2 >= 0; i2--) {
              linkFn2 = postLinkFns[i2];
              invokeLinkFn(linkFn2, linkFn2.isolateScope ? isolateScope : scope, $element, attrs, linkFn2.require && getControllers(linkFn2.directiveName, linkFn2.require, $element, elementControllers), transcludeFn2);
            }
            forEach(elementControllers, function(controller2) {
              var controllerInstance = controller2.instance;
              if (isFunction(controllerInstance.$postLink)) {
                controllerInstance.$postLink();
              }
            });
            function controllersBoundTransclude(scope2, cloneAttachFn, futureParentElement, slotName2) {
              var transcludeControllers;
              if (!isScope(scope2)) {
                slotName2 = futureParentElement;
                futureParentElement = cloneAttachFn;
                cloneAttachFn = scope2;
                scope2 = void 0;
              }
              if (hasElementTranscludeDirective) {
                transcludeControllers = elementControllers;
              }
              if (!futureParentElement) {
                futureParentElement = hasElementTranscludeDirective ? $element.parent() : $element;
              }
              if (slotName2) {
                var slotTranscludeFn = boundTranscludeFn.$$slots[slotName2];
                if (slotTranscludeFn) {
                  return slotTranscludeFn(scope2, cloneAttachFn, transcludeControllers, futureParentElement, scopeToChild);
                } else if (isUndefined(slotTranscludeFn)) {
                  throw $compileMinErr("noslot", 'No parent directive that requires a transclusion with slot name "{0}". Element: {1}', slotName2, startingTag($element));
                }
              } else {
                return boundTranscludeFn(scope2, cloneAttachFn, transcludeControllers, futureParentElement, scopeToChild);
              }
            }
          }
        }
        function getControllers(directiveName, require, $element, elementControllers) {
          var value;
          if (isString(require)) {
            var match = require.match(REQUIRE_PREFIX_REGEXP);
            var name = require.substring(match[0].length);
            var inheritType = match[1] || match[3];
            var optional = match[2] === "?";
            if (inheritType === "^^") {
              $element = $element.parent();
            } else {
              value = elementControllers && elementControllers[name];
              value = value && value.instance;
            }
            if (!value) {
              var dataName = "$" + name + "Controller";
              if (inheritType === "^^" && $element[0] && $element[0].nodeType === NODE_TYPE_DOCUMENT) {
                value = null;
              } else {
                value = inheritType ? $element.inheritedData(dataName) : $element.data(dataName);
              }
            }
            if (!value && !optional) {
              throw $compileMinErr("ctreq", "Controller '{0}', required by directive '{1}', can't be found!", name, directiveName);
            }
          } else if (isArray(require)) {
            value = [];
            for (var i = 0, ii = require.length; i < ii; i++) {
              value[i] = getControllers(directiveName, require[i], $element, elementControllers);
            }
          } else if (isObject(require)) {
            value = {};
            forEach(require, function(controller, property) {
              value[property] = getControllers(directiveName, controller, $element, elementControllers);
            });
          }
          return value || null;
        }
        function setupControllers($element, attrs, transcludeFn, controllerDirectives, isolateScope, scope, newIsolateScopeDirective) {
          var elementControllers = createMap();
          for (var controllerKey in controllerDirectives) {
            var directive = controllerDirectives[controllerKey];
            var locals = {
              $scope: directive === newIsolateScopeDirective || directive.$$isolateScope ? isolateScope : scope,
              $element,
              $attrs: attrs,
              $transclude: transcludeFn
            };
            var controller = directive.controller;
            if (controller === "@") {
              controller = attrs[directive.name];
            }
            var controllerInstance = $controller(controller, locals, true, directive.controllerAs);
            elementControllers[directive.name] = controllerInstance;
            $element.data("$" + directive.name + "Controller", controllerInstance.instance);
          }
          return elementControllers;
        }
        function markDirectiveScope(directives, isolateScope, newScope) {
          for (var j = 0, jj = directives.length; j < jj; j++) {
            directives[j] = inherit(directives[j], { $$isolateScope: isolateScope, $$newScope: newScope });
          }
        }
        function addDirective(tDirectives, name, location, maxPriority, ignoreDirective, startAttrName, endAttrName) {
          if (name === ignoreDirective)
            return null;
          var match = null;
          if (hasDirectives.hasOwnProperty(name)) {
            for (var directive, directives = $injector.get(name + Suffix), i = 0, ii = directives.length; i < ii; i++) {
              directive = directives[i];
              if ((isUndefined(maxPriority) || maxPriority > directive.priority) && directive.restrict.indexOf(location) !== -1) {
                if (startAttrName) {
                  directive = inherit(directive, { $$start: startAttrName, $$end: endAttrName });
                }
                if (!directive.$$bindings) {
                  var bindings = directive.$$bindings = parseDirectiveBindings(directive, directive.name);
                  if (isObject(bindings.isolateScope)) {
                    directive.$$isolateBindings = bindings.isolateScope;
                  }
                }
                tDirectives.push(directive);
                match = directive;
              }
            }
          }
          return match;
        }
        function directiveIsMultiElement(name) {
          if (hasDirectives.hasOwnProperty(name)) {
            for (var directive, directives = $injector.get(name + Suffix), i = 0, ii = directives.length; i < ii; i++) {
              directive = directives[i];
              if (directive.multiElement) {
                return true;
              }
            }
          }
          return false;
        }
        function mergeTemplateAttributes(dst, src) {
          var srcAttr = src.$attr, dstAttr = dst.$attr;
          forEach(dst, function(value, key2) {
            if (key2.charAt(0) !== "$") {
              if (src[key2] && src[key2] !== value) {
                if (value.length) {
                  value += (key2 === "style" ? ";" : " ") + src[key2];
                } else {
                  value = src[key2];
                }
              }
              dst.$set(key2, value, true, srcAttr[key2]);
            }
          });
          forEach(src, function(value, key2) {
            if (!dst.hasOwnProperty(key2) && key2.charAt(0) !== "$") {
              dst[key2] = value;
              if (key2 !== "class" && key2 !== "style") {
                dstAttr[key2] = srcAttr[key2];
              }
            }
          });
        }
        function compileTemplateUrl(directives, $compileNode, tAttrs, $rootElement, childTranscludeFn, preLinkFns, postLinkFns, previousCompileContext) {
          var linkQueue = [], afterTemplateNodeLinkFn, afterTemplateChildLinkFn, beforeTemplateCompileNode = $compileNode[0], origAsyncDirective = directives.shift(), derivedSyncDirective = inherit(origAsyncDirective, {
            templateUrl: null,
            transclude: null,
            replace: null,
            $$originalDirective: origAsyncDirective
          }), templateUrl = isFunction(origAsyncDirective.templateUrl) ? origAsyncDirective.templateUrl($compileNode, tAttrs) : origAsyncDirective.templateUrl, templateNamespace = origAsyncDirective.templateNamespace;
          $compileNode.empty();
          $templateRequest(templateUrl).then(function(content) {
            var compileNode, tempTemplateAttrs, $template, childBoundTranscludeFn;
            content = denormalizeTemplate(content);
            if (origAsyncDirective.replace) {
              if (jqLiteIsTextNode(content)) {
                $template = [];
              } else {
                $template = removeComments(wrapTemplate(templateNamespace, trim(content)));
              }
              compileNode = $template[0];
              if ($template.length !== 1 || compileNode.nodeType !== NODE_TYPE_ELEMENT) {
                throw $compileMinErr("tplrt", "Template for directive '{0}' must have exactly one root element. {1}", origAsyncDirective.name, templateUrl);
              }
              tempTemplateAttrs = { $attr: {} };
              replaceWith($rootElement, $compileNode, compileNode);
              var templateDirectives = collectDirectives(compileNode, [], tempTemplateAttrs);
              if (isObject(origAsyncDirective.scope)) {
                markDirectiveScope(templateDirectives, true);
              }
              directives = templateDirectives.concat(directives);
              mergeTemplateAttributes(tAttrs, tempTemplateAttrs);
            } else {
              compileNode = beforeTemplateCompileNode;
              $compileNode.html(content);
            }
            directives.unshift(derivedSyncDirective);
            afterTemplateNodeLinkFn = applyDirectivesToNode(directives, compileNode, tAttrs, childTranscludeFn, $compileNode, origAsyncDirective, preLinkFns, postLinkFns, previousCompileContext);
            forEach($rootElement, function(node, i) {
              if (node === compileNode) {
                $rootElement[i] = $compileNode[0];
              }
            });
            afterTemplateChildLinkFn = compileNodes($compileNode[0].childNodes, childTranscludeFn);
            while (linkQueue.length) {
              var scope = linkQueue.shift(), beforeTemplateLinkNode = linkQueue.shift(), linkRootElement = linkQueue.shift(), boundTranscludeFn = linkQueue.shift(), linkNode = $compileNode[0];
              if (scope.$$destroyed)
                continue;
              if (beforeTemplateLinkNode !== beforeTemplateCompileNode) {
                var oldClasses = beforeTemplateLinkNode.className;
                if (!(previousCompileContext.hasElementTranscludeDirective && origAsyncDirective.replace)) {
                  linkNode = jqLiteClone(compileNode);
                }
                replaceWith(linkRootElement, jqLite(beforeTemplateLinkNode), linkNode);
                safeAddClass(jqLite(linkNode), oldClasses);
              }
              if (afterTemplateNodeLinkFn.transcludeOnThisElement) {
                childBoundTranscludeFn = createBoundTranscludeFn(scope, afterTemplateNodeLinkFn.transclude, boundTranscludeFn);
              } else {
                childBoundTranscludeFn = boundTranscludeFn;
              }
              afterTemplateNodeLinkFn(afterTemplateChildLinkFn, scope, linkNode, $rootElement, childBoundTranscludeFn);
            }
            linkQueue = null;
          }).catch(function(error) {
            if (isError(error)) {
              $exceptionHandler(error);
            }
          });
          return function delayedNodeLinkFn(ignoreChildLinkFn, scope, node, rootElement, boundTranscludeFn) {
            var childBoundTranscludeFn = boundTranscludeFn;
            if (scope.$$destroyed)
              return;
            if (linkQueue) {
              linkQueue.push(scope, node, rootElement, childBoundTranscludeFn);
            } else {
              if (afterTemplateNodeLinkFn.transcludeOnThisElement) {
                childBoundTranscludeFn = createBoundTranscludeFn(scope, afterTemplateNodeLinkFn.transclude, boundTranscludeFn);
              }
              afterTemplateNodeLinkFn(afterTemplateChildLinkFn, scope, node, rootElement, childBoundTranscludeFn);
            }
          };
        }
        function byPriority(a, b) {
          var diff = b.priority - a.priority;
          if (diff !== 0)
            return diff;
          if (a.name !== b.name)
            return a.name < b.name ? -1 : 1;
          return a.index - b.index;
        }
        function assertNoDuplicate(what, previousDirective, directive, element) {
          function wrapModuleNameIfDefined(moduleName) {
            return moduleName ? " (module: " + moduleName + ")" : "";
          }
          if (previousDirective) {
            throw $compileMinErr("multidir", "Multiple directives [{0}{1}, {2}{3}] asking for {4} on: {5}", previousDirective.name, wrapModuleNameIfDefined(previousDirective.$$moduleName), directive.name, wrapModuleNameIfDefined(directive.$$moduleName), what, startingTag(element));
          }
        }
        function addTextInterpolateDirective(directives, text) {
          var interpolateFn = $interpolate(text, true);
          if (interpolateFn) {
            directives.push({
              priority: 0,
              compile: function textInterpolateCompileFn(templateNode) {
                var templateNodeParent = templateNode.parent(), hasCompileParent = !!templateNodeParent.length;
                if (hasCompileParent)
                  compile.$$addBindingClass(templateNodeParent);
                return function textInterpolateLinkFn(scope, node) {
                  var parent = node.parent();
                  if (!hasCompileParent)
                    compile.$$addBindingClass(parent);
                  compile.$$addBindingInfo(parent, interpolateFn.expressions);
                  scope.$watch(interpolateFn, function interpolateFnWatchAction(value) {
                    node[0].nodeValue = value;
                  });
                };
              }
            });
          }
        }
        function wrapTemplate(type, template) {
          type = lowercase(type || "html");
          switch (type) {
            case "svg":
            case "math":
              var wrapper = window2.document.createElement("div");
              wrapper.innerHTML = "<" + type + ">" + template + "</" + type + ">";
              return wrapper.childNodes[0].childNodes;
            default:
              return template;
          }
        }
        function getTrustedAttrContext(nodeName, attrNormalizedName) {
          if (attrNormalizedName === "srcdoc") {
            return $sce.HTML;
          }
          if (attrNormalizedName === "src" || attrNormalizedName === "ngSrc") {
            if (["img", "video", "audio", "source", "track"].indexOf(nodeName) === -1) {
              return $sce.RESOURCE_URL;
            }
            return $sce.MEDIA_URL;
          } else if (attrNormalizedName === "xlinkHref") {
            if (nodeName === "image")
              return $sce.MEDIA_URL;
            if (nodeName === "a")
              return $sce.URL;
            return $sce.RESOURCE_URL;
          } else if (nodeName === "form" && attrNormalizedName === "action" || nodeName === "base" && attrNormalizedName === "href" || nodeName === "link" && attrNormalizedName === "href") {
            return $sce.RESOURCE_URL;
          } else if (nodeName === "a" && (attrNormalizedName === "href" || attrNormalizedName === "ngHref")) {
            return $sce.URL;
          }
        }
        function getTrustedPropContext(nodeName, propNormalizedName) {
          var prop = propNormalizedName.toLowerCase();
          return PROP_CONTEXTS[nodeName + "|" + prop] || PROP_CONTEXTS["*|" + prop];
        }
        function sanitizeSrcsetPropertyValue(value) {
          return sanitizeSrcset($sce.valueOf(value), "ng-prop-srcset");
        }
        function addPropertyDirective(node, directives, attrName, propName) {
          if (EVENT_HANDLER_ATTR_REGEXP.test(propName)) {
            throw $compileMinErr("nodomevents", "Property bindings for HTML DOM event properties are disallowed");
          }
          var nodeName = nodeName_(node);
          var trustedContext = getTrustedPropContext(nodeName, propName);
          var sanitizer = identity;
          if (propName === "srcset" && (nodeName === "img" || nodeName === "source")) {
            sanitizer = sanitizeSrcsetPropertyValue;
          } else if (trustedContext) {
            sanitizer = $sce.getTrusted.bind($sce, trustedContext);
          }
          directives.push({
            priority: 100,
            compile: function ngPropCompileFn(_, attr) {
              var ngPropGetter = $parse(attr[attrName]);
              var ngPropWatch = $parse(attr[attrName], function sceValueOf(val) {
                return $sce.valueOf(val);
              });
              return {
                pre: function ngPropPreLinkFn(scope, $element) {
                  function applyPropValue() {
                    var propValue = ngPropGetter(scope);
                    $element[0][propName] = sanitizer(propValue);
                  }
                  applyPropValue();
                  scope.$watch(ngPropWatch, applyPropValue);
                }
              };
            }
          });
        }
        function addEventDirective(directives, attrName, eventName) {
          directives.push(createEventDirective($parse, $rootScope, $exceptionHandler, attrName, eventName, false));
        }
        function addAttrInterpolateDirective(node, directives, value, name, isNgAttr) {
          var nodeName = nodeName_(node);
          var trustedContext = getTrustedAttrContext(nodeName, name);
          var mustHaveExpression = !isNgAttr;
          var allOrNothing = ALL_OR_NOTHING_ATTRS[name] || isNgAttr;
          var interpolateFn = $interpolate(value, mustHaveExpression, trustedContext, allOrNothing);
          if (!interpolateFn)
            return;
          if (name === "multiple" && nodeName === "select") {
            throw $compileMinErr("selmulti", "Binding to the 'multiple' attribute is not supported. Element: {0}", startingTag(node));
          }
          if (EVENT_HANDLER_ATTR_REGEXP.test(name)) {
            throw $compileMinErr("nodomevents", "Interpolations for HTML DOM event attributes are disallowed");
          }
          directives.push({
            priority: 100,
            compile: function() {
              return {
                pre: function attrInterpolatePreLinkFn(scope, element, attr) {
                  var $$observers = attr.$$observers || (attr.$$observers = createMap());
                  var newValue = attr[name];
                  if (newValue !== value) {
                    interpolateFn = newValue && $interpolate(newValue, true, trustedContext, allOrNothing);
                    value = newValue;
                  }
                  if (!interpolateFn)
                    return;
                  attr[name] = interpolateFn(scope);
                  ($$observers[name] || ($$observers[name] = [])).$$inter = true;
                  (attr.$$observers && attr.$$observers[name].$$scope || scope).$watch(interpolateFn, function interpolateFnWatchAction(newValue2, oldValue) {
                    if (name === "class" && newValue2 !== oldValue) {
                      attr.$updateClass(newValue2, oldValue);
                    } else {
                      attr.$set(name, newValue2);
                    }
                  });
                }
              };
            }
          });
        }
        function replaceWith($rootElement, elementsToRemove, newNode) {
          var firstElementToRemove = elementsToRemove[0], removeCount = elementsToRemove.length, parent = firstElementToRemove.parentNode, i, ii;
          if ($rootElement) {
            for (i = 0, ii = $rootElement.length; i < ii; i++) {
              if ($rootElement[i] === firstElementToRemove) {
                $rootElement[i++] = newNode;
                for (var j = i, j2 = j + removeCount - 1, jj = $rootElement.length; j < jj; j++, j2++) {
                  if (j2 < jj) {
                    $rootElement[j] = $rootElement[j2];
                  } else {
                    delete $rootElement[j];
                  }
                }
                $rootElement.length -= removeCount - 1;
                if ($rootElement.context === firstElementToRemove) {
                  $rootElement.context = newNode;
                }
                break;
              }
            }
          }
          if (parent) {
            parent.replaceChild(newNode, firstElementToRemove);
          }
          var fragment = window2.document.createDocumentFragment();
          for (i = 0; i < removeCount; i++) {
            fragment.appendChild(elementsToRemove[i]);
          }
          if (jqLite.hasData(firstElementToRemove)) {
            jqLite.data(newNode, jqLite.data(firstElementToRemove));
            jqLite(firstElementToRemove).off("$destroy");
          }
          jqLite.cleanData(fragment.querySelectorAll("*"));
          for (i = 1; i < removeCount; i++) {
            delete elementsToRemove[i];
          }
          elementsToRemove[0] = newNode;
          elementsToRemove.length = 1;
        }
        function cloneAndAnnotateFn(fn, annotation) {
          return extend(function() {
            return fn.apply(null, arguments);
          }, fn, annotation);
        }
        function invokeLinkFn(linkFn, scope, $element, attrs, controllers, transcludeFn) {
          try {
            linkFn(scope, $element, attrs, controllers, transcludeFn);
          } catch (e) {
            $exceptionHandler(e, startingTag($element));
          }
        }
        function strictBindingsCheck(attrName, directiveName) {
          if (strictComponentBindingsEnabled) {
            throw $compileMinErr("missingattr", "Attribute '{0}' of '{1}' is non-optional and must be set!", attrName, directiveName);
          }
        }
        function initializeDirectiveBindings(scope, attrs, destination, bindings, directive) {
          var removeWatchCollection = [];
          var initialChanges = {};
          var changes;
          forEach(bindings, function initializeBinding(definition, scopeName) {
            var attrName = definition.attrName, optional = definition.optional, mode = definition.mode, lastValue, parentGet, parentSet, compare, removeWatch;
            switch (mode) {
              case "@":
                if (!optional && !hasOwnProperty.call(attrs, attrName)) {
                  strictBindingsCheck(attrName, directive.name);
                  destination[scopeName] = attrs[attrName] = void 0;
                }
                removeWatch = attrs.$observe(attrName, function(value) {
                  if (isString(value) || isBoolean(value)) {
                    var oldValue = destination[scopeName];
                    recordChanges(scopeName, value, oldValue);
                    destination[scopeName] = value;
                  }
                });
                attrs.$$observers[attrName].$$scope = scope;
                lastValue = attrs[attrName];
                if (isString(lastValue)) {
                  destination[scopeName] = $interpolate(lastValue)(scope);
                } else if (isBoolean(lastValue)) {
                  destination[scopeName] = lastValue;
                }
                initialChanges[scopeName] = new SimpleChange(_UNINITIALIZED_VALUE, destination[scopeName]);
                removeWatchCollection.push(removeWatch);
                break;
              case "=":
                if (!hasOwnProperty.call(attrs, attrName)) {
                  if (optional)
                    break;
                  strictBindingsCheck(attrName, directive.name);
                  attrs[attrName] = void 0;
                }
                if (optional && !attrs[attrName])
                  break;
                parentGet = $parse(attrs[attrName]);
                if (parentGet.literal) {
                  compare = equals;
                } else {
                  compare = simpleCompare;
                }
                parentSet = parentGet.assign || function() {
                  lastValue = destination[scopeName] = parentGet(scope);
                  throw $compileMinErr("nonassign", "Expression '{0}' in attribute '{1}' used with directive '{2}' is non-assignable!", attrs[attrName], attrName, directive.name);
                };
                lastValue = destination[scopeName] = parentGet(scope);
                var parentValueWatch = function parentValueWatch2(parentValue) {
                  if (!compare(parentValue, destination[scopeName])) {
                    if (!compare(parentValue, lastValue)) {
                      destination[scopeName] = parentValue;
                    } else {
                      parentSet(scope, parentValue = destination[scopeName]);
                    }
                  }
                  lastValue = parentValue;
                  return lastValue;
                };
                parentValueWatch.$stateful = true;
                if (definition.collection) {
                  removeWatch = scope.$watchCollection(attrs[attrName], parentValueWatch);
                } else {
                  removeWatch = scope.$watch($parse(attrs[attrName], parentValueWatch), null, parentGet.literal);
                }
                removeWatchCollection.push(removeWatch);
                break;
              case "<":
                if (!hasOwnProperty.call(attrs, attrName)) {
                  if (optional)
                    break;
                  strictBindingsCheck(attrName, directive.name);
                  attrs[attrName] = void 0;
                }
                if (optional && !attrs[attrName])
                  break;
                parentGet = $parse(attrs[attrName]);
                var isLiteral2 = parentGet.literal;
                var initialValue = destination[scopeName] = parentGet(scope);
                initialChanges[scopeName] = new SimpleChange(_UNINITIALIZED_VALUE, destination[scopeName]);
                removeWatch = scope[definition.collection ? "$watchCollection" : "$watch"](parentGet, function parentValueWatchAction(newValue, oldValue) {
                  if (oldValue === newValue) {
                    if (oldValue === initialValue || isLiteral2 && equals(oldValue, initialValue)) {
                      return;
                    }
                    oldValue = initialValue;
                  }
                  recordChanges(scopeName, newValue, oldValue);
                  destination[scopeName] = newValue;
                });
                removeWatchCollection.push(removeWatch);
                break;
              case "&":
                if (!optional && !hasOwnProperty.call(attrs, attrName)) {
                  strictBindingsCheck(attrName, directive.name);
                }
                parentGet = attrs.hasOwnProperty(attrName) ? $parse(attrs[attrName]) : noop;
                if (parentGet === noop && optional)
                  break;
                destination[scopeName] = function(locals) {
                  return parentGet(scope, locals);
                };
                break;
            }
          });
          function recordChanges(key2, currentValue, previousValue) {
            if (isFunction(destination.$onChanges) && !simpleCompare(currentValue, previousValue)) {
              if (!onChangesQueue) {
                scope.$$postDigest(flushOnChangesQueue);
                onChangesQueue = [];
              }
              if (!changes) {
                changes = {};
                onChangesQueue.push(triggerOnChangesHook);
              }
              if (changes[key2]) {
                previousValue = changes[key2].previousValue;
              }
              changes[key2] = new SimpleChange(previousValue, currentValue);
            }
          }
          function triggerOnChangesHook() {
            destination.$onChanges(changes);
            changes = void 0;
          }
          return {
            initialChanges,
            removeWatches: removeWatchCollection.length && function removeWatches() {
              for (var i = 0, ii = removeWatchCollection.length; i < ii; ++i) {
                removeWatchCollection[i]();
              }
            }
          };
        }
      }
    ];
  }
  function SimpleChange(previous, current) {
    this.previousValue = previous;
    this.currentValue = current;
  }
  SimpleChange.prototype.isFirstChange = function() {
    return this.previousValue === _UNINITIALIZED_VALUE;
  };
  var PREFIX_REGEXP = /^((?:x|data)[:\-_])/i;
  var SPECIAL_CHARS_REGEXP = /[:\-_]+(.)/g;
  function directiveNormalize(name) {
    return name.replace(PREFIX_REGEXP, "").replace(SPECIAL_CHARS_REGEXP, function(_, letter, offset) {
      return offset ? letter.toUpperCase() : letter;
    });
  }
  function tokenDifference(str1, str2) {
    var values = "", tokens1 = str1.split(/\s+/), tokens2 = str2.split(/\s+/);
    outer:
      for (var i = 0; i < tokens1.length; i++) {
        var token = tokens1[i];
        for (var j = 0; j < tokens2.length; j++) {
          if (token === tokens2[j])
            continue outer;
        }
        values += (values.length > 0 ? " " : "") + token;
      }
    return values;
  }
  function removeComments(jqNodes) {
    jqNodes = jqLite(jqNodes);
    var i = jqNodes.length;
    if (i <= 1) {
      return jqNodes;
    }
    while (i--) {
      var node = jqNodes[i];
      if (node.nodeType === NODE_TYPE_COMMENT || node.nodeType === NODE_TYPE_TEXT && node.nodeValue.trim() === "") {
        splice.call(jqNodes, i, 1);
      }
    }
    return jqNodes;
  }
  var $controllerMinErr = minErr("$controller");
  var CNTRL_REG = /^(\S+)(\s+as\s+([\w$]+))?$/;
  function identifierForController(controller, ident) {
    if (ident && isString(ident))
      return ident;
    if (isString(controller)) {
      var match = CNTRL_REG.exec(controller);
      if (match)
        return match[3];
    }
  }
  function $ControllerProvider() {
    var controllers = {};
    this.has = function(name) {
      return controllers.hasOwnProperty(name);
    };
    this.register = function(name, constructor) {
      assertNotHasOwnProperty(name, "controller");
      if (isObject(name)) {
        extend(controllers, name);
      } else {
        controllers[name] = constructor;
      }
    };
    this.$get = ["$injector", function($injector) {
      return function $controller(expression, locals, later, ident) {
        var instance, match, constructor, identifier;
        later = later === true;
        if (ident && isString(ident)) {
          identifier = ident;
        }
        if (isString(expression)) {
          match = expression.match(CNTRL_REG);
          if (!match) {
            throw $controllerMinErr("ctrlfmt", "Badly formed controller string '{0}'. Must match `__name__ as __id__` or `__name__`.", expression);
          }
          constructor = match[1];
          identifier = identifier || match[3];
          expression = controllers.hasOwnProperty(constructor) ? controllers[constructor] : getter(locals.$scope, constructor, true);
          if (!expression) {
            throw $controllerMinErr("ctrlreg", "The controller with the name '{0}' is not registered.", constructor);
          }
          assertArgFn(expression, constructor, true);
        }
        if (later) {
          var controllerPrototype = (isArray(expression) ? expression[expression.length - 1] : expression).prototype;
          instance = Object.create(controllerPrototype || null);
          if (identifier) {
            addIdentifier(locals, identifier, instance, constructor || expression.name);
          }
          return extend(function $controllerInit() {
            var result = $injector.invoke(expression, instance, locals, constructor);
            if (result !== instance && (isObject(result) || isFunction(result))) {
              instance = result;
              if (identifier) {
                addIdentifier(locals, identifier, instance, constructor || expression.name);
              }
            }
            return instance;
          }, {
            instance,
            identifier
          });
        }
        instance = $injector.instantiate(expression, locals, constructor);
        if (identifier) {
          addIdentifier(locals, identifier, instance, constructor || expression.name);
        }
        return instance;
      };
      function addIdentifier(locals, identifier, instance, name) {
        if (!(locals && isObject(locals.$scope))) {
          throw minErr("$controller")("noscp", "Cannot export controller '{0}' as '{1}'! No $scope object provided via `locals`.", name, identifier);
        }
        locals.$scope[identifier] = instance;
      }
    }];
  }
  function $DocumentProvider() {
    this.$get = ["$window", function(window3) {
      return jqLite(window3.document);
    }];
  }
  function $$IsDocumentHiddenProvider() {
    this.$get = ["$document", "$rootScope", function($document, $rootScope) {
      var doc = $document[0];
      var hidden = doc && doc.hidden;
      $document.on("visibilitychange", changeListener);
      $rootScope.$on("$destroy", function() {
        $document.off("visibilitychange", changeListener);
      });
      function changeListener() {
        hidden = doc.hidden;
      }
      return function() {
        return hidden;
      };
    }];
  }
  function $ExceptionHandlerProvider() {
    this.$get = ["$log", function($log) {
      return function(exception, cause) {
        $log.error.apply($log, arguments);
      };
    }];
  }
  var $$ForceReflowProvider = function() {
    this.$get = ["$document", function($document) {
      return function(domNode) {
        if (domNode) {
          if (!domNode.nodeType && domNode instanceof jqLite) {
            domNode = domNode[0];
          }
        } else {
          domNode = $document[0].body;
        }
        return domNode.offsetWidth + 1;
      };
    }];
  };
  var APPLICATION_JSON = "application/json";
  var CONTENT_TYPE_APPLICATION_JSON = { "Content-Type": APPLICATION_JSON + ";charset=utf-8" };
  var JSON_START = /^\[|^\{(?!\{)/;
  var JSON_ENDS = {
    "[": /]$/,
    "{": /}$/
  };
  var JSON_PROTECTION_PREFIX = /^\)]\}',?\n/;
  var $httpMinErr = minErr("$http");
  function serializeValue(v) {
    if (isObject(v)) {
      return isDate(v) ? v.toISOString() : toJson(v);
    }
    return v;
  }
  function $HttpParamSerializerProvider() {
    this.$get = function() {
      return function ngParamSerializer(params) {
        if (!params)
          return "";
        var parts = [];
        forEachSorted(params, function(value, key2) {
          if (value === null || isUndefined(value) || isFunction(value))
            return;
          if (isArray(value)) {
            forEach(value, function(v) {
              parts.push(encodeUriQuery(key2) + "=" + encodeUriQuery(serializeValue(v)));
            });
          } else {
            parts.push(encodeUriQuery(key2) + "=" + encodeUriQuery(serializeValue(value)));
          }
        });
        return parts.join("&");
      };
    };
  }
  function $HttpParamSerializerJQLikeProvider() {
    this.$get = function() {
      return function jQueryLikeParamSerializer(params) {
        if (!params)
          return "";
        var parts = [];
        serialize(params, "", true);
        return parts.join("&");
        function serialize(toSerialize, prefix, topLevel) {
          if (isArray(toSerialize)) {
            forEach(toSerialize, function(value, index) {
              serialize(value, prefix + "[" + (isObject(value) ? index : "") + "]");
            });
          } else if (isObject(toSerialize) && !isDate(toSerialize)) {
            forEachSorted(toSerialize, function(value, key2) {
              serialize(value, prefix + (topLevel ? "" : "[") + key2 + (topLevel ? "" : "]"));
            });
          } else {
            if (isFunction(toSerialize)) {
              toSerialize = toSerialize();
            }
            parts.push(encodeUriQuery(prefix) + "=" + (toSerialize == null ? "" : encodeUriQuery(serializeValue(toSerialize))));
          }
        }
      };
    };
  }
  function defaultHttpResponseTransform(data, headers) {
    if (isString(data)) {
      var tempData = data.replace(JSON_PROTECTION_PREFIX, "").trim();
      if (tempData) {
        var contentType = headers("Content-Type");
        var hasJsonContentType = contentType && contentType.indexOf(APPLICATION_JSON) === 0;
        if (hasJsonContentType || isJsonLike(tempData)) {
          try {
            data = fromJson(tempData);
          } catch (e) {
            if (!hasJsonContentType) {
              return data;
            }
            throw $httpMinErr("baddata", 'Data must be a valid JSON object. Received: "{0}". Parse error: "{1}"', data, e);
          }
        }
      }
    }
    return data;
  }
  function isJsonLike(str) {
    var jsonStart = str.match(JSON_START);
    return jsonStart && JSON_ENDS[jsonStart[0]].test(str);
  }
  function parseHeaders(headers) {
    var parsed = createMap(), i;
    function fillInParsed(key2, val) {
      if (key2) {
        parsed[key2] = parsed[key2] ? parsed[key2] + ", " + val : val;
      }
    }
    if (isString(headers)) {
      forEach(headers.split("\n"), function(line) {
        i = line.indexOf(":");
        fillInParsed(lowercase(trim(line.substr(0, i))), trim(line.substr(i + 1)));
      });
    } else if (isObject(headers)) {
      forEach(headers, function(headerVal, headerKey) {
        fillInParsed(lowercase(headerKey), trim(headerVal));
      });
    }
    return parsed;
  }
  function headersGetter(headers) {
    var headersObj;
    return function(name) {
      if (!headersObj)
        headersObj = parseHeaders(headers);
      if (name) {
        var value = headersObj[lowercase(name)];
        if (value === void 0) {
          value = null;
        }
        return value;
      }
      return headersObj;
    };
  }
  function transformData(data, headers, status, fns) {
    if (isFunction(fns)) {
      return fns(data, headers, status);
    }
    forEach(fns, function(fn) {
      data = fn(data, headers, status);
    });
    return data;
  }
  function isSuccess(status) {
    return 200 <= status && status < 300;
  }
  function $HttpProvider() {
    var defaults2 = this.defaults = {
      transformResponse: [defaultHttpResponseTransform],
      transformRequest: [function(d) {
        return isObject(d) && !isFile(d) && !isBlob(d) && !isFormData(d) ? toJson(d) : d;
      }],
      headers: {
        common: {
          "Accept": "application/json, text/plain, */*"
        },
        post: shallowCopy(CONTENT_TYPE_APPLICATION_JSON),
        put: shallowCopy(CONTENT_TYPE_APPLICATION_JSON),
        patch: shallowCopy(CONTENT_TYPE_APPLICATION_JSON)
      },
      xsrfCookieName: "XSRF-TOKEN",
      xsrfHeaderName: "X-XSRF-TOKEN",
      paramSerializer: "$httpParamSerializer",
      jsonpCallbackParam: "callback"
    };
    var useApplyAsync = false;
    this.useApplyAsync = function(value) {
      if (isDefined(value)) {
        useApplyAsync = !!value;
        return this;
      }
      return useApplyAsync;
    };
    var interceptorFactories = this.interceptors = [];
    var xsrfTrustedOrigins = this.xsrfTrustedOrigins = [];
    Object.defineProperty(this, "xsrfWhitelistedOrigins", {
      get: function() {
        return this.xsrfTrustedOrigins;
      },
      set: function(origins) {
        this.xsrfTrustedOrigins = origins;
      }
    });
    this.$get = [
      "$browser",
      "$httpBackend",
      "$$cookieReader",
      "$cacheFactory",
      "$rootScope",
      "$q",
      "$injector",
      "$sce",
      function($browser, $httpBackend, $$cookieReader, $cacheFactory, $rootScope, $q, $injector, $sce) {
        var defaultCache = $cacheFactory("$http");
        defaults2.paramSerializer = isString(defaults2.paramSerializer) ? $injector.get(defaults2.paramSerializer) : defaults2.paramSerializer;
        var reversedInterceptors = [];
        forEach(interceptorFactories, function(interceptorFactory) {
          reversedInterceptors.unshift(isString(interceptorFactory) ? $injector.get(interceptorFactory) : $injector.invoke(interceptorFactory));
        });
        var urlIsAllowedOrigin = urlIsAllowedOriginFactory(xsrfTrustedOrigins);
        function $http(requestConfig) {
          if (!isObject(requestConfig)) {
            throw minErr("$http")("badreq", "Http request configuration must be an object.  Received: {0}", requestConfig);
          }
          if (!isString($sce.valueOf(requestConfig.url))) {
            throw minErr("$http")("badreq", "Http request configuration url must be a string or a $sce trusted object.  Received: {0}", requestConfig.url);
          }
          var config = extend({
            method: "get",
            transformRequest: defaults2.transformRequest,
            transformResponse: defaults2.transformResponse,
            paramSerializer: defaults2.paramSerializer,
            jsonpCallbackParam: defaults2.jsonpCallbackParam
          }, requestConfig);
          config.headers = mergeHeaders(requestConfig);
          config.method = uppercase(config.method);
          config.paramSerializer = isString(config.paramSerializer) ? $injector.get(config.paramSerializer) : config.paramSerializer;
          $browser.$$incOutstandingRequestCount("$http");
          var requestInterceptors = [];
          var responseInterceptors = [];
          var promise = $q.resolve(config);
          forEach(reversedInterceptors, function(interceptor) {
            if (interceptor.request || interceptor.requestError) {
              requestInterceptors.unshift(interceptor.request, interceptor.requestError);
            }
            if (interceptor.response || interceptor.responseError) {
              responseInterceptors.push(interceptor.response, interceptor.responseError);
            }
          });
          promise = chainInterceptors(promise, requestInterceptors);
          promise = promise.then(serverRequest);
          promise = chainInterceptors(promise, responseInterceptors);
          promise = promise.finally(completeOutstandingRequest);
          return promise;
          function chainInterceptors(promise2, interceptors) {
            for (var i = 0, ii = interceptors.length; i < ii; ) {
              var thenFn = interceptors[i++];
              var rejectFn = interceptors[i++];
              promise2 = promise2.then(thenFn, rejectFn);
            }
            interceptors.length = 0;
            return promise2;
          }
          function completeOutstandingRequest() {
            $browser.$$completeOutstandingRequest(noop, "$http");
          }
          function executeHeaderFns(headers, config2) {
            var headerContent, processedHeaders = {};
            forEach(headers, function(headerFn, header) {
              if (isFunction(headerFn)) {
                headerContent = headerFn(config2);
                if (headerContent != null) {
                  processedHeaders[header] = headerContent;
                }
              } else {
                processedHeaders[header] = headerFn;
              }
            });
            return processedHeaders;
          }
          function mergeHeaders(config2) {
            var defHeaders = defaults2.headers, reqHeaders = extend({}, config2.headers), defHeaderName, lowercaseDefHeaderName, reqHeaderName;
            defHeaders = extend({}, defHeaders.common, defHeaders[lowercase(config2.method)]);
            defaultHeadersIteration:
              for (defHeaderName in defHeaders) {
                lowercaseDefHeaderName = lowercase(defHeaderName);
                for (reqHeaderName in reqHeaders) {
                  if (lowercase(reqHeaderName) === lowercaseDefHeaderName) {
                    continue defaultHeadersIteration;
                  }
                }
                reqHeaders[defHeaderName] = defHeaders[defHeaderName];
              }
            return executeHeaderFns(reqHeaders, shallowCopy(config2));
          }
          function serverRequest(config2) {
            var headers = config2.headers;
            var reqData = transformData(config2.data, headersGetter(headers), void 0, config2.transformRequest);
            if (isUndefined(reqData)) {
              forEach(headers, function(value, header) {
                if (lowercase(header) === "content-type") {
                  delete headers[header];
                }
              });
            }
            if (isUndefined(config2.withCredentials) && !isUndefined(defaults2.withCredentials)) {
              config2.withCredentials = defaults2.withCredentials;
            }
            return sendReq(config2, reqData).then(transformResponse, transformResponse);
          }
          function transformResponse(response) {
            var resp = extend({}, response);
            resp.data = transformData(response.data, response.headers, response.status, config.transformResponse);
            return isSuccess(response.status) ? resp : $q.reject(resp);
          }
        }
        $http.pendingRequests = [];
        createShortMethods("get", "delete", "head", "jsonp");
        createShortMethodsWithData("post", "put", "patch");
        $http.defaults = defaults2;
        return $http;
        function createShortMethods(names) {
          forEach(arguments, function(name) {
            $http[name] = function(url, config) {
              return $http(extend({}, config || {}, {
                method: name,
                url
              }));
            };
          });
        }
        function createShortMethodsWithData(name) {
          forEach(arguments, function(name2) {
            $http[name2] = function(url, data, config) {
              return $http(extend({}, config || {}, {
                method: name2,
                url,
                data
              }));
            };
          });
        }
        function sendReq(config, reqData) {
          var deferred = $q.defer(), promise = deferred.promise, cache, cachedResp, reqHeaders = config.headers, isJsonp = lowercase(config.method) === "jsonp", url = config.url;
          if (isJsonp) {
            url = $sce.getTrustedResourceUrl(url);
          } else if (!isString(url)) {
            url = $sce.valueOf(url);
          }
          url = buildUrl(url, config.paramSerializer(config.params));
          if (isJsonp) {
            url = sanitizeJsonpCallbackParam(url, config.jsonpCallbackParam);
          }
          $http.pendingRequests.push(config);
          promise.then(removePendingReq, removePendingReq);
          if ((config.cache || defaults2.cache) && config.cache !== false && (config.method === "GET" || config.method === "JSONP")) {
            cache = isObject(config.cache) ? config.cache : isObject(defaults2.cache) ? defaults2.cache : defaultCache;
          }
          if (cache) {
            cachedResp = cache.get(url);
            if (isDefined(cachedResp)) {
              if (isPromiseLike(cachedResp)) {
                cachedResp.then(resolvePromiseWithResult, resolvePromiseWithResult);
              } else {
                if (isArray(cachedResp)) {
                  resolvePromise(cachedResp[1], cachedResp[0], shallowCopy(cachedResp[2]), cachedResp[3], cachedResp[4]);
                } else {
                  resolvePromise(cachedResp, 200, {}, "OK", "complete");
                }
              }
            } else {
              cache.put(url, promise);
            }
          }
          if (isUndefined(cachedResp)) {
            var xsrfValue = urlIsAllowedOrigin(config.url) ? $$cookieReader()[config.xsrfCookieName || defaults2.xsrfCookieName] : void 0;
            if (xsrfValue) {
              reqHeaders[config.xsrfHeaderName || defaults2.xsrfHeaderName] = xsrfValue;
            }
            $httpBackend(config.method, url, reqData, done, reqHeaders, config.timeout, config.withCredentials, config.responseType, createApplyHandlers(config.eventHandlers), createApplyHandlers(config.uploadEventHandlers));
          }
          return promise;
          function createApplyHandlers(eventHandlers) {
            if (eventHandlers) {
              var applyHandlers = {};
              forEach(eventHandlers, function(eventHandler, key2) {
                applyHandlers[key2] = function(event) {
                  if (useApplyAsync) {
                    $rootScope.$applyAsync(callEventHandler);
                  } else if ($rootScope.$$phase) {
                    callEventHandler();
                  } else {
                    $rootScope.$apply(callEventHandler);
                  }
                  function callEventHandler() {
                    eventHandler(event);
                  }
                };
              });
              return applyHandlers;
            }
          }
          function done(status, response, headersString, statusText, xhrStatus) {
            if (cache) {
              if (isSuccess(status)) {
                cache.put(url, [status, response, parseHeaders(headersString), statusText, xhrStatus]);
              } else {
                cache.remove(url);
              }
            }
            function resolveHttpPromise() {
              resolvePromise(response, status, headersString, statusText, xhrStatus);
            }
            if (useApplyAsync) {
              $rootScope.$applyAsync(resolveHttpPromise);
            } else {
              resolveHttpPromise();
              if (!$rootScope.$$phase)
                $rootScope.$apply();
            }
          }
          function resolvePromise(response, status, headers, statusText, xhrStatus) {
            status = status >= -1 ? status : 0;
            (isSuccess(status) ? deferred.resolve : deferred.reject)({
              data: response,
              status,
              headers: headersGetter(headers),
              config,
              statusText,
              xhrStatus
            });
          }
          function resolvePromiseWithResult(result) {
            resolvePromise(result.data, result.status, shallowCopy(result.headers()), result.statusText, result.xhrStatus);
          }
          function removePendingReq() {
            var idx = $http.pendingRequests.indexOf(config);
            if (idx !== -1)
              $http.pendingRequests.splice(idx, 1);
          }
        }
        function buildUrl(url, serializedParams) {
          if (serializedParams.length > 0) {
            url += (url.indexOf("?") === -1 ? "?" : "&") + serializedParams;
          }
          return url;
        }
        function sanitizeJsonpCallbackParam(url, cbKey) {
          var parts = url.split("?");
          if (parts.length > 2) {
            throw $httpMinErr("badjsonp", 'Illegal use more than one "?", in url, "{1}"', url);
          }
          var params = parseKeyValue(parts[1]);
          forEach(params, function(value, key2) {
            if (value === "JSON_CALLBACK") {
              throw $httpMinErr("badjsonp", 'Illegal use of JSON_CALLBACK in url, "{0}"', url);
            }
            if (key2 === cbKey) {
              throw $httpMinErr("badjsonp", 'Illegal use of callback param, "{0}", in url, "{1}"', cbKey, url);
            }
          });
          url += (url.indexOf("?") === -1 ? "?" : "&") + cbKey + "=JSON_CALLBACK";
          return url;
        }
      }
    ];
  }
  function $xhrFactoryProvider() {
    this.$get = function() {
      return function createXhr() {
        return new window2.XMLHttpRequest();
      };
    };
  }
  function $HttpBackendProvider() {
    this.$get = ["$browser", "$jsonpCallbacks", "$document", "$xhrFactory", function($browser, $jsonpCallbacks, $document, $xhrFactory) {
      return createHttpBackend($browser, $xhrFactory, $browser.defer, $jsonpCallbacks, $document[0]);
    }];
  }
  function createHttpBackend($browser, createXhr, $browserDefer, callbacks, rawDocument) {
    return function(method, url, post, callback, headers, timeout, withCredentials, responseType, eventHandlers, uploadEventHandlers) {
      url = url || $browser.url();
      if (lowercase(method) === "jsonp") {
        var callbackPath = callbacks.createCallback(url);
        var jsonpDone = jsonpReq(url, callbackPath, function(status, text) {
          var response = status === 200 && callbacks.getResponse(callbackPath);
          completeRequest(callback, status, response, "", text, "complete");
          callbacks.removeCallback(callbackPath);
        });
      } else {
        var xhr = createXhr(method, url);
        var abortedByTimeout = false;
        xhr.open(method, url, true);
        forEach(headers, function(value, key2) {
          if (isDefined(value)) {
            xhr.setRequestHeader(key2, value);
          }
        });
        xhr.onload = function requestLoaded() {
          var statusText = xhr.statusText || "";
          var response = "response" in xhr ? xhr.response : xhr.responseText;
          var status = xhr.status === 1223 ? 204 : xhr.status;
          if (status === 0) {
            status = response ? 200 : urlResolve(url).protocol === "file" ? 404 : 0;
          }
          completeRequest(callback, status, response, xhr.getAllResponseHeaders(), statusText, "complete");
        };
        var requestError = function() {
          completeRequest(callback, -1, null, null, "", "error");
        };
        var requestAborted = function() {
          completeRequest(callback, -1, null, null, "", abortedByTimeout ? "timeout" : "abort");
        };
        var requestTimeout = function() {
          completeRequest(callback, -1, null, null, "", "timeout");
        };
        xhr.onerror = requestError;
        xhr.ontimeout = requestTimeout;
        xhr.onabort = requestAborted;
        forEach(eventHandlers, function(value, key2) {
          xhr.addEventListener(key2, value);
        });
        forEach(uploadEventHandlers, function(value, key2) {
          xhr.upload.addEventListener(key2, value);
        });
        if (withCredentials) {
          xhr.withCredentials = true;
        }
        if (responseType) {
          try {
            xhr.responseType = responseType;
          } catch (e) {
            if (responseType !== "json") {
              throw e;
            }
          }
        }
        xhr.send(isUndefined(post) ? null : post);
      }
      if (timeout > 0) {
        var timeoutId = $browserDefer(function() {
          timeoutRequest("timeout");
        }, timeout);
      } else if (isPromiseLike(timeout)) {
        timeout.then(function() {
          timeoutRequest(isDefined(timeout.$$timeoutId) ? "timeout" : "abort");
        });
      }
      function timeoutRequest(reason) {
        abortedByTimeout = reason === "timeout";
        if (jsonpDone) {
          jsonpDone();
        }
        if (xhr) {
          xhr.abort();
        }
      }
      function completeRequest(callback2, status, response, headersString, statusText, xhrStatus) {
        if (isDefined(timeoutId)) {
          $browserDefer.cancel(timeoutId);
        }
        jsonpDone = xhr = null;
        callback2(status, response, headersString, statusText, xhrStatus);
      }
    };
    function jsonpReq(url, callbackPath, done) {
      url = url.replace("JSON_CALLBACK", callbackPath);
      var script = rawDocument.createElement("script"), callback = null;
      script.type = "text/javascript";
      script.src = url;
      script.async = true;
      callback = function(event) {
        script.removeEventListener("load", callback);
        script.removeEventListener("error", callback);
        rawDocument.body.removeChild(script);
        script = null;
        var status = -1;
        var text = "unknown";
        if (event) {
          if (event.type === "load" && !callbacks.wasCalled(callbackPath)) {
            event = { type: "error" };
          }
          text = event.type;
          status = event.type === "error" ? 404 : 200;
        }
        if (done) {
          done(status, text);
        }
      };
      script.addEventListener("load", callback);
      script.addEventListener("error", callback);
      rawDocument.body.appendChild(script);
      return callback;
    }
  }
  var $interpolateMinErr = angular2.$interpolateMinErr = minErr("$interpolate");
  $interpolateMinErr.throwNoconcat = function(text) {
    throw $interpolateMinErr("noconcat", "Error while interpolating: {0}\nStrict Contextual Escaping disallows interpolations that concatenate multiple expressions when a trusted value is required.  See http://docs.angularjs.org/api/ng.$sce", text);
  };
  $interpolateMinErr.interr = function(text, err) {
    return $interpolateMinErr("interr", "Can't interpolate: {0}\n{1}", text, err.toString());
  };
  function $InterpolateProvider() {
    var startSymbol = "{{";
    var endSymbol = "}}";
    this.startSymbol = function(value) {
      if (value) {
        startSymbol = value;
        return this;
      }
      return startSymbol;
    };
    this.endSymbol = function(value) {
      if (value) {
        endSymbol = value;
        return this;
      }
      return endSymbol;
    };
    this.$get = ["$parse", "$exceptionHandler", "$sce", function($parse, $exceptionHandler, $sce) {
      var startSymbolLength = startSymbol.length, endSymbolLength = endSymbol.length, escapedStartRegexp = new RegExp(startSymbol.replace(/./g, escape), "g"), escapedEndRegexp = new RegExp(endSymbol.replace(/./g, escape), "g");
      function escape(ch) {
        return "\\\\\\" + ch;
      }
      function unescapeText(text) {
        return text.replace(escapedStartRegexp, startSymbol).replace(escapedEndRegexp, endSymbol);
      }
      function constantWatchDelegate(scope, listener, objectEquality, constantInterp) {
        var unwatch = scope.$watch(function constantInterpolateWatch(scope2) {
          unwatch();
          return constantInterp(scope2);
        }, listener, objectEquality);
        return unwatch;
      }
      function $interpolate(text, mustHaveExpression, trustedContext, allOrNothing) {
        var contextAllowsConcatenation = trustedContext === $sce.URL || trustedContext === $sce.MEDIA_URL;
        if (!text.length || text.indexOf(startSymbol) === -1) {
          if (mustHaveExpression)
            return;
          var unescapedText = unescapeText(text);
          if (contextAllowsConcatenation) {
            unescapedText = $sce.getTrusted(trustedContext, unescapedText);
          }
          var constantInterp = valueFn(unescapedText);
          constantInterp.exp = text;
          constantInterp.expressions = [];
          constantInterp.$$watchDelegate = constantWatchDelegate;
          return constantInterp;
        }
        allOrNothing = !!allOrNothing;
        var startIndex, endIndex, index = 0, expressions = [], parseFns, textLength = text.length, exp, concat2 = [], expressionPositions = [], singleExpression;
        while (index < textLength) {
          if ((startIndex = text.indexOf(startSymbol, index)) !== -1 && (endIndex = text.indexOf(endSymbol, startIndex + startSymbolLength)) !== -1) {
            if (index !== startIndex) {
              concat2.push(unescapeText(text.substring(index, startIndex)));
            }
            exp = text.substring(startIndex + startSymbolLength, endIndex);
            expressions.push(exp);
            index = endIndex + endSymbolLength;
            expressionPositions.push(concat2.length);
            concat2.push("");
          } else {
            if (index !== textLength) {
              concat2.push(unescapeText(text.substring(index)));
            }
            break;
          }
        }
        singleExpression = concat2.length === 1 && expressionPositions.length === 1;
        var interceptor = contextAllowsConcatenation && singleExpression ? void 0 : parseStringifyInterceptor;
        parseFns = expressions.map(function(exp2) {
          return $parse(exp2, interceptor);
        });
        if (!mustHaveExpression || expressions.length) {
          var compute = function(values) {
            for (var i = 0, ii = expressions.length; i < ii; i++) {
              if (allOrNothing && isUndefined(values[i]))
                return;
              concat2[expressionPositions[i]] = values[i];
            }
            if (contextAllowsConcatenation) {
              return $sce.getTrusted(trustedContext, singleExpression ? concat2[0] : concat2.join(""));
            } else if (trustedContext && concat2.length > 1) {
              $interpolateMinErr.throwNoconcat(text);
            }
            return concat2.join("");
          };
          return extend(function interpolationFn(context) {
            var i = 0;
            var ii = expressions.length;
            var values = new Array(ii);
            try {
              for (; i < ii; i++) {
                values[i] = parseFns[i](context);
              }
              return compute(values);
            } catch (err) {
              $exceptionHandler($interpolateMinErr.interr(text, err));
            }
          }, {
            exp: text,
            expressions,
            $$watchDelegate: function(scope, listener) {
              var lastValue;
              return scope.$watchGroup(parseFns, function interpolateFnWatcher(values, oldValues) {
                var currValue = compute(values);
                listener.call(this, currValue, values !== oldValues ? lastValue : currValue, scope);
                lastValue = currValue;
              });
            }
          });
        }
        function parseStringifyInterceptor(value) {
          try {
            value = trustedContext && !contextAllowsConcatenation ? $sce.getTrusted(trustedContext, value) : $sce.valueOf(value);
            return allOrNothing && !isDefined(value) ? value : stringify(value);
          } catch (err) {
            $exceptionHandler($interpolateMinErr.interr(text, err));
          }
        }
      }
      $interpolate.startSymbol = function() {
        return startSymbol;
      };
      $interpolate.endSymbol = function() {
        return endSymbol;
      };
      return $interpolate;
    }];
  }
  var $intervalMinErr = minErr("$interval");
  function $IntervalProvider() {
    this.$get = [
      "$$intervalFactory",
      "$window",
      function($$intervalFactory, $window) {
        var intervals = {};
        var setIntervalFn = function(tick, delay, deferred) {
          var id = $window.setInterval(tick, delay);
          intervals[id] = deferred;
          return id;
        };
        var clearIntervalFn = function(id) {
          $window.clearInterval(id);
          delete intervals[id];
        };
        var interval = $$intervalFactory(setIntervalFn, clearIntervalFn);
        interval.cancel = function(promise) {
          if (!promise)
            return false;
          if (!promise.hasOwnProperty("$$intervalId")) {
            throw $intervalMinErr("badprom", "`$interval.cancel()` called with a promise that was not generated by `$interval()`.");
          }
          if (!intervals.hasOwnProperty(promise.$$intervalId))
            return false;
          var id = promise.$$intervalId;
          var deferred = intervals[id];
          markQExceptionHandled(deferred.promise);
          deferred.reject("canceled");
          clearIntervalFn(id);
          return true;
        };
        return interval;
      }
    ];
  }
  function $$IntervalFactoryProvider() {
    this.$get = [
      "$browser",
      "$q",
      "$$q",
      "$rootScope",
      function($browser, $q, $$q, $rootScope) {
        return function intervalFactory(setIntervalFn, clearIntervalFn) {
          return function intervalFn(fn, delay, count, invokeApply) {
            var hasParams = arguments.length > 4, args = hasParams ? sliceArgs(arguments, 4) : [], iteration = 0, skipApply = isDefined(invokeApply) && !invokeApply, deferred = (skipApply ? $$q : $q).defer(), promise = deferred.promise;
            count = isDefined(count) ? count : 0;
            function callback() {
              if (!hasParams) {
                fn(iteration);
              } else {
                fn.apply(null, args);
              }
            }
            function tick() {
              if (skipApply) {
                $browser.defer(callback);
              } else {
                $rootScope.$evalAsync(callback);
              }
              deferred.notify(iteration++);
              if (count > 0 && iteration >= count) {
                deferred.resolve(iteration);
                clearIntervalFn(promise.$$intervalId);
              }
              if (!skipApply)
                $rootScope.$apply();
            }
            promise.$$intervalId = setIntervalFn(tick, delay, deferred, skipApply);
            return promise;
          };
        };
      }
    ];
  }
  var $jsonpCallbacksProvider = function() {
    this.$get = function() {
      var callbacks = angular2.callbacks;
      var callbackMap = {};
      function createCallback(callbackId) {
        var callback = function(data) {
          callback.data = data;
          callback.called = true;
        };
        callback.id = callbackId;
        return callback;
      }
      return {
        createCallback: function(url) {
          var callbackId = "_" + (callbacks.$$counter++).toString(36);
          var callbackPath = "angular.callbacks." + callbackId;
          var callback = createCallback(callbackId);
          callbackMap[callbackPath] = callbacks[callbackId] = callback;
          return callbackPath;
        },
        wasCalled: function(callbackPath) {
          return callbackMap[callbackPath].called;
        },
        getResponse: function(callbackPath) {
          return callbackMap[callbackPath].data;
        },
        removeCallback: function(callbackPath) {
          var callback = callbackMap[callbackPath];
          delete callbacks[callback.id];
          delete callbackMap[callbackPath];
        }
      };
    };
  };
  var PATH_MATCH = /^([^?#]*)(\?([^#]*))?(#(.*))?$/, DEFAULT_PORTS = { "http": 80, "https": 443, "ftp": 21 };
  var $locationMinErr = minErr("$location");
  function encodePath(path) {
    var segments = path.split("/"), i = segments.length;
    while (i--) {
      segments[i] = encodeUriSegment(segments[i].replace(/%2F/g, "/"));
    }
    return segments.join("/");
  }
  function decodePath(path, html5Mode) {
    var segments = path.split("/"), i = segments.length;
    while (i--) {
      segments[i] = decodeURIComponent(segments[i]);
      if (html5Mode) {
        segments[i] = segments[i].replace(/\//g, "%2F");
      }
    }
    return segments.join("/");
  }
  function normalizePath(pathValue, searchValue, hashValue) {
    var search = toKeyValue(searchValue), hash = hashValue ? "#" + encodeUriSegment(hashValue) : "", path = encodePath(pathValue);
    return path + (search ? "?" + search : "") + hash;
  }
  function parseAbsoluteUrl(absoluteUrl, locationObj) {
    var parsedUrl = urlResolve(absoluteUrl);
    locationObj.$$protocol = parsedUrl.protocol;
    locationObj.$$host = parsedUrl.hostname;
    locationObj.$$port = toInt(parsedUrl.port) || DEFAULT_PORTS[parsedUrl.protocol] || null;
  }
  var DOUBLE_SLASH_REGEX = /^\s*[\\/]{2,}/;
  function parseAppUrl(url, locationObj, html5Mode) {
    if (DOUBLE_SLASH_REGEX.test(url)) {
      throw $locationMinErr("badpath", 'Invalid url "{0}".', url);
    }
    var prefixed = url.charAt(0) !== "/";
    if (prefixed) {
      url = "/" + url;
    }
    var match = urlResolve(url);
    var path = prefixed && match.pathname.charAt(0) === "/" ? match.pathname.substring(1) : match.pathname;
    locationObj.$$path = decodePath(path, html5Mode);
    locationObj.$$search = parseKeyValue(match.search);
    locationObj.$$hash = decodeURIComponent(match.hash);
    if (locationObj.$$path && locationObj.$$path.charAt(0) !== "/") {
      locationObj.$$path = "/" + locationObj.$$path;
    }
  }
  function startsWith(str, search) {
    return str.slice(0, search.length) === search;
  }
  function stripBaseUrl(base, url) {
    if (startsWith(url, base)) {
      return url.substr(base.length);
    }
  }
  function stripHash(url) {
    var index = url.indexOf("#");
    return index === -1 ? url : url.substr(0, index);
  }
  function stripFile(url) {
    return url.substr(0, stripHash(url).lastIndexOf("/") + 1);
  }
  function serverBase(url) {
    return url.substring(0, url.indexOf("/", url.indexOf("//") + 2));
  }
  function LocationHtml5Url(appBase, appBaseNoFile, basePrefix) {
    this.$$html5 = true;
    basePrefix = basePrefix || "";
    parseAbsoluteUrl(appBase, this);
    this.$$parse = function(url) {
      var pathUrl = stripBaseUrl(appBaseNoFile, url);
      if (!isString(pathUrl)) {
        throw $locationMinErr("ipthprfx", 'Invalid url "{0}", missing path prefix "{1}".', url, appBaseNoFile);
      }
      parseAppUrl(pathUrl, this, true);
      if (!this.$$path) {
        this.$$path = "/";
      }
      this.$$compose();
    };
    this.$$normalizeUrl = function(url) {
      return appBaseNoFile + url.substr(1);
    };
    this.$$parseLinkUrl = function(url, relHref) {
      if (relHref && relHref[0] === "#") {
        this.hash(relHref.slice(1));
        return true;
      }
      var appUrl, prevAppUrl;
      var rewrittenUrl;
      if (isDefined(appUrl = stripBaseUrl(appBase, url))) {
        prevAppUrl = appUrl;
        if (basePrefix && isDefined(appUrl = stripBaseUrl(basePrefix, appUrl))) {
          rewrittenUrl = appBaseNoFile + (stripBaseUrl("/", appUrl) || appUrl);
        } else {
          rewrittenUrl = appBase + prevAppUrl;
        }
      } else if (isDefined(appUrl = stripBaseUrl(appBaseNoFile, url))) {
        rewrittenUrl = appBaseNoFile + appUrl;
      } else if (appBaseNoFile === url + "/") {
        rewrittenUrl = appBaseNoFile;
      }
      if (rewrittenUrl) {
        this.$$parse(rewrittenUrl);
      }
      return !!rewrittenUrl;
    };
  }
  function LocationHashbangUrl(appBase, appBaseNoFile, hashPrefix) {
    parseAbsoluteUrl(appBase, this);
    this.$$parse = function(url) {
      var withoutBaseUrl = stripBaseUrl(appBase, url) || stripBaseUrl(appBaseNoFile, url);
      var withoutHashUrl;
      if (!isUndefined(withoutBaseUrl) && withoutBaseUrl.charAt(0) === "#") {
        withoutHashUrl = stripBaseUrl(hashPrefix, withoutBaseUrl);
        if (isUndefined(withoutHashUrl)) {
          withoutHashUrl = withoutBaseUrl;
        }
      } else {
        if (this.$$html5) {
          withoutHashUrl = withoutBaseUrl;
        } else {
          withoutHashUrl = "";
          if (isUndefined(withoutBaseUrl)) {
            appBase = url;
            this.replace();
          }
        }
      }
      parseAppUrl(withoutHashUrl, this, false);
      this.$$path = removeWindowsDriveName(this.$$path, withoutHashUrl, appBase);
      this.$$compose();
      function removeWindowsDriveName(path, url2, base) {
        var windowsFilePathExp = /^\/[A-Z]:(\/.*)/;
        var firstPathSegmentMatch;
        if (startsWith(url2, base)) {
          url2 = url2.replace(base, "");
        }
        if (windowsFilePathExp.exec(url2)) {
          return path;
        }
        firstPathSegmentMatch = windowsFilePathExp.exec(path);
        return firstPathSegmentMatch ? firstPathSegmentMatch[1] : path;
      }
    };
    this.$$normalizeUrl = function(url) {
      return appBase + (url ? hashPrefix + url : "");
    };
    this.$$parseLinkUrl = function(url, relHref) {
      if (stripHash(appBase) === stripHash(url)) {
        this.$$parse(url);
        return true;
      }
      return false;
    };
  }
  function LocationHashbangInHtml5Url(appBase, appBaseNoFile, hashPrefix) {
    this.$$html5 = true;
    LocationHashbangUrl.apply(this, arguments);
    this.$$parseLinkUrl = function(url, relHref) {
      if (relHref && relHref[0] === "#") {
        this.hash(relHref.slice(1));
        return true;
      }
      var rewrittenUrl;
      var appUrl;
      if (appBase === stripHash(url)) {
        rewrittenUrl = url;
      } else if (appUrl = stripBaseUrl(appBaseNoFile, url)) {
        rewrittenUrl = appBase + hashPrefix + appUrl;
      } else if (appBaseNoFile === url + "/") {
        rewrittenUrl = appBaseNoFile;
      }
      if (rewrittenUrl) {
        this.$$parse(rewrittenUrl);
      }
      return !!rewrittenUrl;
    };
    this.$$normalizeUrl = function(url) {
      return appBase + hashPrefix + url;
    };
  }
  var locationPrototype = {
    $$absUrl: "",
    $$html5: false,
    $$replace: false,
    $$compose: function() {
      this.$$url = normalizePath(this.$$path, this.$$search, this.$$hash);
      this.$$absUrl = this.$$normalizeUrl(this.$$url);
      this.$$urlUpdatedByLocation = true;
    },
    absUrl: locationGetter("$$absUrl"),
    url: function(url) {
      if (isUndefined(url)) {
        return this.$$url;
      }
      var match = PATH_MATCH.exec(url);
      if (match[1] || url === "")
        this.path(decodeURIComponent(match[1]));
      if (match[2] || match[1] || url === "")
        this.search(match[3] || "");
      this.hash(match[5] || "");
      return this;
    },
    protocol: locationGetter("$$protocol"),
    host: locationGetter("$$host"),
    port: locationGetter("$$port"),
    path: locationGetterSetter("$$path", function(path) {
      path = path !== null ? path.toString() : "";
      return path.charAt(0) === "/" ? path : "/" + path;
    }),
    search: function(search, paramValue) {
      switch (arguments.length) {
        case 0:
          return this.$$search;
        case 1:
          if (isString(search) || isNumber(search)) {
            search = search.toString();
            this.$$search = parseKeyValue(search);
          } else if (isObject(search)) {
            search = copy(search, {});
            forEach(search, function(value, key2) {
              if (value == null)
                delete search[key2];
            });
            this.$$search = search;
          } else {
            throw $locationMinErr("isrcharg", "The first argument of the `$location#search()` call must be a string or an object.");
          }
          break;
        default:
          if (isUndefined(paramValue) || paramValue === null) {
            delete this.$$search[search];
          } else {
            this.$$search[search] = paramValue;
          }
      }
      this.$$compose();
      return this;
    },
    hash: locationGetterSetter("$$hash", function(hash) {
      return hash !== null ? hash.toString() : "";
    }),
    replace: function() {
      this.$$replace = true;
      return this;
    }
  };
  forEach([LocationHashbangInHtml5Url, LocationHashbangUrl, LocationHtml5Url], function(Location) {
    Location.prototype = Object.create(locationPrototype);
    Location.prototype.state = function(state) {
      if (!arguments.length) {
        return this.$$state;
      }
      if (Location !== LocationHtml5Url || !this.$$html5) {
        throw $locationMinErr("nostate", "History API state support is available only in HTML5 mode and only in browsers supporting HTML5 History API");
      }
      this.$$state = isUndefined(state) ? null : state;
      this.$$urlUpdatedByLocation = true;
      return this;
    };
  });
  function locationGetter(property) {
    return function() {
      return this[property];
    };
  }
  function locationGetterSetter(property, preprocess) {
    return function(value) {
      if (isUndefined(value)) {
        return this[property];
      }
      this[property] = preprocess(value);
      this.$$compose();
      return this;
    };
  }
  function $LocationProvider() {
    var hashPrefix = "!", html5Mode = {
      enabled: false,
      requireBase: true,
      rewriteLinks: true
    };
    this.hashPrefix = function(prefix) {
      if (isDefined(prefix)) {
        hashPrefix = prefix;
        return this;
      } else {
        return hashPrefix;
      }
    };
    this.html5Mode = function(mode) {
      if (isBoolean(mode)) {
        html5Mode.enabled = mode;
        return this;
      } else if (isObject(mode)) {
        if (isBoolean(mode.enabled)) {
          html5Mode.enabled = mode.enabled;
        }
        if (isBoolean(mode.requireBase)) {
          html5Mode.requireBase = mode.requireBase;
        }
        if (isBoolean(mode.rewriteLinks) || isString(mode.rewriteLinks)) {
          html5Mode.rewriteLinks = mode.rewriteLinks;
        }
        return this;
      } else {
        return html5Mode;
      }
    };
    this.$get = [
      "$rootScope",
      "$browser",
      "$sniffer",
      "$rootElement",
      "$window",
      function($rootScope, $browser, $sniffer, $rootElement, $window) {
        var $location, LocationMode, baseHref = $browser.baseHref(), initialUrl = $browser.url(), appBase;
        if (html5Mode.enabled) {
          if (!baseHref && html5Mode.requireBase) {
            throw $locationMinErr("nobase", "$location in HTML5 mode requires a <base> tag to be present!");
          }
          appBase = serverBase(initialUrl) + (baseHref || "/");
          LocationMode = $sniffer.history ? LocationHtml5Url : LocationHashbangInHtml5Url;
        } else {
          appBase = stripHash(initialUrl);
          LocationMode = LocationHashbangUrl;
        }
        var appBaseNoFile = stripFile(appBase);
        $location = new LocationMode(appBase, appBaseNoFile, "#" + hashPrefix);
        $location.$$parseLinkUrl(initialUrl, initialUrl);
        $location.$$state = $browser.state();
        var IGNORE_URI_REGEXP = /^\s*(javascript|mailto):/i;
        function urlsEqual(a, b) {
          return a === b || urlResolve(a).href === urlResolve(b).href;
        }
        function setBrowserUrlWithFallback(url, replace, state) {
          var oldUrl = $location.url();
          var oldState = $location.$$state;
          try {
            $browser.url(url, replace, state);
            $location.$$state = $browser.state();
          } catch (e) {
            $location.url(oldUrl);
            $location.$$state = oldState;
            throw e;
          }
        }
        $rootElement.on("click", function(event) {
          var rewriteLinks = html5Mode.rewriteLinks;
          if (!rewriteLinks || event.ctrlKey || event.metaKey || event.shiftKey || event.which === 2 || event.button === 2)
            return;
          var elm = jqLite(event.target);
          while (nodeName_(elm[0]) !== "a") {
            if (elm[0] === $rootElement[0] || !(elm = elm.parent())[0])
              return;
          }
          if (isString(rewriteLinks) && isUndefined(elm.attr(rewriteLinks)))
            return;
          var absHref = elm.prop("href");
          var relHref = elm.attr("href") || elm.attr("xlink:href");
          if (isObject(absHref) && absHref.toString() === "[object SVGAnimatedString]") {
            absHref = urlResolve(absHref.animVal).href;
          }
          if (IGNORE_URI_REGEXP.test(absHref))
            return;
          if (absHref && !elm.attr("target") && !event.isDefaultPrevented()) {
            if ($location.$$parseLinkUrl(absHref, relHref)) {
              event.preventDefault();
              if ($location.absUrl() !== $browser.url()) {
                $rootScope.$apply();
              }
            }
          }
        });
        if ($location.absUrl() !== initialUrl) {
          $browser.url($location.absUrl(), true);
        }
        var initializing = true;
        $browser.onUrlChange(function(newUrl, newState) {
          if (!startsWith(newUrl, appBaseNoFile)) {
            $window.location.href = newUrl;
            return;
          }
          $rootScope.$evalAsync(function() {
            var oldUrl = $location.absUrl();
            var oldState = $location.$$state;
            var defaultPrevented;
            $location.$$parse(newUrl);
            $location.$$state = newState;
            defaultPrevented = $rootScope.$broadcast("$locationChangeStart", newUrl, oldUrl, newState, oldState).defaultPrevented;
            if ($location.absUrl() !== newUrl)
              return;
            if (defaultPrevented) {
              $location.$$parse(oldUrl);
              $location.$$state = oldState;
              setBrowserUrlWithFallback(oldUrl, false, oldState);
            } else {
              initializing = false;
              afterLocationChange(oldUrl, oldState);
            }
          });
          if (!$rootScope.$$phase)
            $rootScope.$digest();
        });
        $rootScope.$watch(function $locationWatch() {
          if (initializing || $location.$$urlUpdatedByLocation) {
            $location.$$urlUpdatedByLocation = false;
            var oldUrl = $browser.url();
            var newUrl = $location.absUrl();
            var oldState = $browser.state();
            var currentReplace = $location.$$replace;
            var urlOrStateChanged = !urlsEqual(oldUrl, newUrl) || $location.$$html5 && $sniffer.history && oldState !== $location.$$state;
            if (initializing || urlOrStateChanged) {
              initializing = false;
              $rootScope.$evalAsync(function() {
                var newUrl2 = $location.absUrl();
                var defaultPrevented = $rootScope.$broadcast("$locationChangeStart", newUrl2, oldUrl, $location.$$state, oldState).defaultPrevented;
                if ($location.absUrl() !== newUrl2)
                  return;
                if (defaultPrevented) {
                  $location.$$parse(oldUrl);
                  $location.$$state = oldState;
                } else {
                  if (urlOrStateChanged) {
                    setBrowserUrlWithFallback(newUrl2, currentReplace, oldState === $location.$$state ? null : $location.$$state);
                  }
                  afterLocationChange(oldUrl, oldState);
                }
              });
            }
          }
          $location.$$replace = false;
        });
        return $location;
        function afterLocationChange(oldUrl, oldState) {
          $rootScope.$broadcast("$locationChangeSuccess", $location.absUrl(), oldUrl, $location.$$state, oldState);
        }
      }
    ];
  }
  function $LogProvider() {
    var debug = true, self = this;
    this.debugEnabled = function(flag) {
      if (isDefined(flag)) {
        debug = flag;
        return this;
      } else {
        return debug;
      }
    };
    this.$get = ["$window", function($window) {
      var formatStackTrace = msie || /\bEdge\//.test($window.navigator && $window.navigator.userAgent);
      return {
        log: consoleLog("log"),
        info: consoleLog("info"),
        warn: consoleLog("warn"),
        error: consoleLog("error"),
        debug: function() {
          var fn = consoleLog("debug");
          return function() {
            if (debug) {
              fn.apply(self, arguments);
            }
          };
        }()
      };
      function formatError(arg) {
        if (isError(arg)) {
          if (arg.stack && formatStackTrace) {
            arg = arg.message && arg.stack.indexOf(arg.message) === -1 ? "Error: " + arg.message + "\n" + arg.stack : arg.stack;
          } else if (arg.sourceURL) {
            arg = arg.message + "\n" + arg.sourceURL + ":" + arg.line;
          }
        }
        return arg;
      }
      function consoleLog(type) {
        var console2 = $window.console || {}, logFn = console2[type] || console2.log || noop;
        return function() {
          var args = [];
          forEach(arguments, function(arg) {
            args.push(formatError(arg));
          });
          return Function.prototype.apply.call(logFn, console2, args);
        };
      }
    }];
  }
  var $parseMinErr = minErr("$parse");
  var objectValueOf = {}.constructor.prototype.valueOf;
  function getStringValue(name) {
    return name + "";
  }
  var OPERATORS = createMap();
  forEach("+ - * / % === !== == != < > <= >= && || ! = |".split(" "), function(operator) {
    OPERATORS[operator] = true;
  });
  var ESCAPE = { "n": "\n", "f": "\f", "r": "\r", "t": "	", "v": "\v", "'": "'", '"': '"' };
  var Lexer = function Lexer2(options) {
    this.options = options;
  };
  Lexer.prototype = {
    constructor: Lexer,
    lex: function(text) {
      this.text = text;
      this.index = 0;
      this.tokens = [];
      while (this.index < this.text.length) {
        var ch = this.text.charAt(this.index);
        if (ch === '"' || ch === "'") {
          this.readString(ch);
        } else if (this.isNumber(ch) || ch === "." && this.isNumber(this.peek())) {
          this.readNumber();
        } else if (this.isIdentifierStart(this.peekMultichar())) {
          this.readIdent();
        } else if (this.is(ch, "(){}[].,;:?")) {
          this.tokens.push({ index: this.index, text: ch });
          this.index++;
        } else if (this.isWhitespace(ch)) {
          this.index++;
        } else {
          var ch2 = ch + this.peek();
          var ch3 = ch2 + this.peek(2);
          var op1 = OPERATORS[ch];
          var op2 = OPERATORS[ch2];
          var op3 = OPERATORS[ch3];
          if (op1 || op2 || op3) {
            var token = op3 ? ch3 : op2 ? ch2 : ch;
            this.tokens.push({ index: this.index, text: token, operator: true });
            this.index += token.length;
          } else {
            this.throwError("Unexpected next character ", this.index, this.index + 1);
          }
        }
      }
      return this.tokens;
    },
    is: function(ch, chars) {
      return chars.indexOf(ch) !== -1;
    },
    peek: function(i) {
      var num = i || 1;
      return this.index + num < this.text.length ? this.text.charAt(this.index + num) : false;
    },
    isNumber: function(ch) {
      return "0" <= ch && ch <= "9" && typeof ch === "string";
    },
    isWhitespace: function(ch) {
      return ch === " " || ch === "\r" || ch === "	" || ch === "\n" || ch === "\v" || ch === "\xA0";
    },
    isIdentifierStart: function(ch) {
      return this.options.isIdentifierStart ? this.options.isIdentifierStart(ch, this.codePointAt(ch)) : this.isValidIdentifierStart(ch);
    },
    isValidIdentifierStart: function(ch) {
      return "a" <= ch && ch <= "z" || "A" <= ch && ch <= "Z" || ch === "_" || ch === "$";
    },
    isIdentifierContinue: function(ch) {
      return this.options.isIdentifierContinue ? this.options.isIdentifierContinue(ch, this.codePointAt(ch)) : this.isValidIdentifierContinue(ch);
    },
    isValidIdentifierContinue: function(ch, cp) {
      return this.isValidIdentifierStart(ch, cp) || this.isNumber(ch);
    },
    codePointAt: function(ch) {
      if (ch.length === 1)
        return ch.charCodeAt(0);
      return (ch.charCodeAt(0) << 10) + ch.charCodeAt(1) - 56613888;
    },
    peekMultichar: function() {
      var ch = this.text.charAt(this.index);
      var peek = this.peek();
      if (!peek) {
        return ch;
      }
      var cp1 = ch.charCodeAt(0);
      var cp2 = peek.charCodeAt(0);
      if (cp1 >= 55296 && cp1 <= 56319 && cp2 >= 56320 && cp2 <= 57343) {
        return ch + peek;
      }
      return ch;
    },
    isExpOperator: function(ch) {
      return ch === "-" || ch === "+" || this.isNumber(ch);
    },
    throwError: function(error, start, end) {
      end = end || this.index;
      var colStr = isDefined(start) ? "s " + start + "-" + this.index + " [" + this.text.substring(start, end) + "]" : " " + end;
      throw $parseMinErr("lexerr", "Lexer Error: {0} at column{1} in expression [{2}].", error, colStr, this.text);
    },
    readNumber: function() {
      var number = "";
      var start = this.index;
      while (this.index < this.text.length) {
        var ch = lowercase(this.text.charAt(this.index));
        if (ch === "." || this.isNumber(ch)) {
          number += ch;
        } else {
          var peekCh = this.peek();
          if (ch === "e" && this.isExpOperator(peekCh)) {
            number += ch;
          } else if (this.isExpOperator(ch) && peekCh && this.isNumber(peekCh) && number.charAt(number.length - 1) === "e") {
            number += ch;
          } else if (this.isExpOperator(ch) && (!peekCh || !this.isNumber(peekCh)) && number.charAt(number.length - 1) === "e") {
            this.throwError("Invalid exponent");
          } else {
            break;
          }
        }
        this.index++;
      }
      this.tokens.push({
        index: start,
        text: number,
        constant: true,
        value: Number(number)
      });
    },
    readIdent: function() {
      var start = this.index;
      this.index += this.peekMultichar().length;
      while (this.index < this.text.length) {
        var ch = this.peekMultichar();
        if (!this.isIdentifierContinue(ch)) {
          break;
        }
        this.index += ch.length;
      }
      this.tokens.push({
        index: start,
        text: this.text.slice(start, this.index),
        identifier: true
      });
    },
    readString: function(quote) {
      var start = this.index;
      this.index++;
      var string = "";
      var rawString = quote;
      var escape = false;
      while (this.index < this.text.length) {
        var ch = this.text.charAt(this.index);
        rawString += ch;
        if (escape) {
          if (ch === "u") {
            var hex = this.text.substring(this.index + 1, this.index + 5);
            if (!hex.match(/[\da-f]{4}/i)) {
              this.throwError("Invalid unicode escape [\\u" + hex + "]");
            }
            this.index += 4;
            string += String.fromCharCode(parseInt(hex, 16));
          } else {
            var rep = ESCAPE[ch];
            string = string + (rep || ch);
          }
          escape = false;
        } else if (ch === "\\") {
          escape = true;
        } else if (ch === quote) {
          this.index++;
          this.tokens.push({
            index: start,
            text: rawString,
            constant: true,
            value: string
          });
          return;
        } else {
          string += ch;
        }
        this.index++;
      }
      this.throwError("Unterminated quote", start);
    }
  };
  var AST = function AST2(lexer, options) {
    this.lexer = lexer;
    this.options = options;
  };
  AST.Program = "Program";
  AST.ExpressionStatement = "ExpressionStatement";
  AST.AssignmentExpression = "AssignmentExpression";
  AST.ConditionalExpression = "ConditionalExpression";
  AST.LogicalExpression = "LogicalExpression";
  AST.BinaryExpression = "BinaryExpression";
  AST.UnaryExpression = "UnaryExpression";
  AST.CallExpression = "CallExpression";
  AST.MemberExpression = "MemberExpression";
  AST.Identifier = "Identifier";
  AST.Literal = "Literal";
  AST.ArrayExpression = "ArrayExpression";
  AST.Property = "Property";
  AST.ObjectExpression = "ObjectExpression";
  AST.ThisExpression = "ThisExpression";
  AST.LocalsExpression = "LocalsExpression";
  AST.NGValueParameter = "NGValueParameter";
  AST.prototype = {
    ast: function(text) {
      this.text = text;
      this.tokens = this.lexer.lex(text);
      var value = this.program();
      if (this.tokens.length !== 0) {
        this.throwError("is an unexpected token", this.tokens[0]);
      }
      return value;
    },
    program: function() {
      var body = [];
      while (true) {
        if (this.tokens.length > 0 && !this.peek("}", ")", ";", "]"))
          body.push(this.expressionStatement());
        if (!this.expect(";")) {
          return { type: AST.Program, body };
        }
      }
    },
    expressionStatement: function() {
      return { type: AST.ExpressionStatement, expression: this.filterChain() };
    },
    filterChain: function() {
      var left = this.expression();
      while (this.expect("|")) {
        left = this.filter(left);
      }
      return left;
    },
    expression: function() {
      return this.assignment();
    },
    assignment: function() {
      var result = this.ternary();
      if (this.expect("=")) {
        if (!isAssignable(result)) {
          throw $parseMinErr("lval", "Trying to assign a value to a non l-value");
        }
        result = { type: AST.AssignmentExpression, left: result, right: this.assignment(), operator: "=" };
      }
      return result;
    },
    ternary: function() {
      var test = this.logicalOR();
      var alternate;
      var consequent;
      if (this.expect("?")) {
        alternate = this.expression();
        if (this.consume(":")) {
          consequent = this.expression();
          return { type: AST.ConditionalExpression, test, alternate, consequent };
        }
      }
      return test;
    },
    logicalOR: function() {
      var left = this.logicalAND();
      while (this.expect("||")) {
        left = { type: AST.LogicalExpression, operator: "||", left, right: this.logicalAND() };
      }
      return left;
    },
    logicalAND: function() {
      var left = this.equality();
      while (this.expect("&&")) {
        left = { type: AST.LogicalExpression, operator: "&&", left, right: this.equality() };
      }
      return left;
    },
    equality: function() {
      var left = this.relational();
      var token;
      while (token = this.expect("==", "!=", "===", "!==")) {
        left = { type: AST.BinaryExpression, operator: token.text, left, right: this.relational() };
      }
      return left;
    },
    relational: function() {
      var left = this.additive();
      var token;
      while (token = this.expect("<", ">", "<=", ">=")) {
        left = { type: AST.BinaryExpression, operator: token.text, left, right: this.additive() };
      }
      return left;
    },
    additive: function() {
      var left = this.multiplicative();
      var token;
      while (token = this.expect("+", "-")) {
        left = { type: AST.BinaryExpression, operator: token.text, left, right: this.multiplicative() };
      }
      return left;
    },
    multiplicative: function() {
      var left = this.unary();
      var token;
      while (token = this.expect("*", "/", "%")) {
        left = { type: AST.BinaryExpression, operator: token.text, left, right: this.unary() };
      }
      return left;
    },
    unary: function() {
      var token;
      if (token = this.expect("+", "-", "!")) {
        return { type: AST.UnaryExpression, operator: token.text, prefix: true, argument: this.unary() };
      } else {
        return this.primary();
      }
    },
    primary: function() {
      var primary;
      if (this.expect("(")) {
        primary = this.filterChain();
        this.consume(")");
      } else if (this.expect("[")) {
        primary = this.arrayDeclaration();
      } else if (this.expect("{")) {
        primary = this.object();
      } else if (this.selfReferential.hasOwnProperty(this.peek().text)) {
        primary = copy(this.selfReferential[this.consume().text]);
      } else if (this.options.literals.hasOwnProperty(this.peek().text)) {
        primary = { type: AST.Literal, value: this.options.literals[this.consume().text] };
      } else if (this.peek().identifier) {
        primary = this.identifier();
      } else if (this.peek().constant) {
        primary = this.constant();
      } else {
        this.throwError("not a primary expression", this.peek());
      }
      var next;
      while (next = this.expect("(", "[", ".")) {
        if (next.text === "(") {
          primary = { type: AST.CallExpression, callee: primary, arguments: this.parseArguments() };
          this.consume(")");
        } else if (next.text === "[") {
          primary = { type: AST.MemberExpression, object: primary, property: this.expression(), computed: true };
          this.consume("]");
        } else if (next.text === ".") {
          primary = { type: AST.MemberExpression, object: primary, property: this.identifier(), computed: false };
        } else {
          this.throwError("IMPOSSIBLE");
        }
      }
      return primary;
    },
    filter: function(baseExpression) {
      var args = [baseExpression];
      var result = { type: AST.CallExpression, callee: this.identifier(), arguments: args, filter: true };
      while (this.expect(":")) {
        args.push(this.expression());
      }
      return result;
    },
    parseArguments: function() {
      var args = [];
      if (this.peekToken().text !== ")") {
        do {
          args.push(this.filterChain());
        } while (this.expect(","));
      }
      return args;
    },
    identifier: function() {
      var token = this.consume();
      if (!token.identifier) {
        this.throwError("is not a valid identifier", token);
      }
      return { type: AST.Identifier, name: token.text };
    },
    constant: function() {
      return { type: AST.Literal, value: this.consume().value };
    },
    arrayDeclaration: function() {
      var elements = [];
      if (this.peekToken().text !== "]") {
        do {
          if (this.peek("]")) {
            break;
          }
          elements.push(this.expression());
        } while (this.expect(","));
      }
      this.consume("]");
      return { type: AST.ArrayExpression, elements };
    },
    object: function() {
      var properties = [], property;
      if (this.peekToken().text !== "}") {
        do {
          if (this.peek("}")) {
            break;
          }
          property = { type: AST.Property, kind: "init" };
          if (this.peek().constant) {
            property.key = this.constant();
            property.computed = false;
            this.consume(":");
            property.value = this.expression();
          } else if (this.peek().identifier) {
            property.key = this.identifier();
            property.computed = false;
            if (this.peek(":")) {
              this.consume(":");
              property.value = this.expression();
            } else {
              property.value = property.key;
            }
          } else if (this.peek("[")) {
            this.consume("[");
            property.key = this.expression();
            this.consume("]");
            property.computed = true;
            this.consume(":");
            property.value = this.expression();
          } else {
            this.throwError("invalid key", this.peek());
          }
          properties.push(property);
        } while (this.expect(","));
      }
      this.consume("}");
      return { type: AST.ObjectExpression, properties };
    },
    throwError: function(msg, token) {
      throw $parseMinErr("syntax", "Syntax Error: Token '{0}' {1} at column {2} of the expression [{3}] starting at [{4}].", token.text, msg, token.index + 1, this.text, this.text.substring(token.index));
    },
    consume: function(e1) {
      if (this.tokens.length === 0) {
        throw $parseMinErr("ueoe", "Unexpected end of expression: {0}", this.text);
      }
      var token = this.expect(e1);
      if (!token) {
        this.throwError("is unexpected, expecting [" + e1 + "]", this.peek());
      }
      return token;
    },
    peekToken: function() {
      if (this.tokens.length === 0) {
        throw $parseMinErr("ueoe", "Unexpected end of expression: {0}", this.text);
      }
      return this.tokens[0];
    },
    peek: function(e1, e2, e3, e4) {
      return this.peekAhead(0, e1, e2, e3, e4);
    },
    peekAhead: function(i, e1, e2, e3, e4) {
      if (this.tokens.length > i) {
        var token = this.tokens[i];
        var t = token.text;
        if (t === e1 || t === e2 || t === e3 || t === e4 || !e1 && !e2 && !e3 && !e4) {
          return token;
        }
      }
      return false;
    },
    expect: function(e1, e2, e3, e4) {
      var token = this.peek(e1, e2, e3, e4);
      if (token) {
        this.tokens.shift();
        return token;
      }
      return false;
    },
    selfReferential: {
      "this": { type: AST.ThisExpression },
      "$locals": { type: AST.LocalsExpression }
    }
  };
  function ifDefined(v, d) {
    return typeof v !== "undefined" ? v : d;
  }
  function plusFn(l, r) {
    if (typeof l === "undefined")
      return r;
    if (typeof r === "undefined")
      return l;
    return l + r;
  }
  function isStateless($filter, filterName) {
    var fn = $filter(filterName);
    return !fn.$stateful;
  }
  var PURITY_ABSOLUTE = 1;
  var PURITY_RELATIVE = 2;
  function isPure(node, parentIsPure) {
    switch (node.type) {
      case AST.MemberExpression:
        if (node.computed) {
          return false;
        }
        break;
      case AST.UnaryExpression:
        return PURITY_ABSOLUTE;
      case AST.BinaryExpression:
        return node.operator !== "+" ? PURITY_ABSOLUTE : false;
      case AST.CallExpression:
        return false;
    }
    return parentIsPure === void 0 ? PURITY_RELATIVE : parentIsPure;
  }
  function findConstantAndWatchExpressions(ast, $filter, parentIsPure) {
    var allConstants;
    var argsToWatch;
    var isStatelessFilter;
    var astIsPure = ast.isPure = isPure(ast, parentIsPure);
    switch (ast.type) {
      case AST.Program:
        allConstants = true;
        forEach(ast.body, function(expr) {
          findConstantAndWatchExpressions(expr.expression, $filter, astIsPure);
          allConstants = allConstants && expr.expression.constant;
        });
        ast.constant = allConstants;
        break;
      case AST.Literal:
        ast.constant = true;
        ast.toWatch = [];
        break;
      case AST.UnaryExpression:
        findConstantAndWatchExpressions(ast.argument, $filter, astIsPure);
        ast.constant = ast.argument.constant;
        ast.toWatch = ast.argument.toWatch;
        break;
      case AST.BinaryExpression:
        findConstantAndWatchExpressions(ast.left, $filter, astIsPure);
        findConstantAndWatchExpressions(ast.right, $filter, astIsPure);
        ast.constant = ast.left.constant && ast.right.constant;
        ast.toWatch = ast.left.toWatch.concat(ast.right.toWatch);
        break;
      case AST.LogicalExpression:
        findConstantAndWatchExpressions(ast.left, $filter, astIsPure);
        findConstantAndWatchExpressions(ast.right, $filter, astIsPure);
        ast.constant = ast.left.constant && ast.right.constant;
        ast.toWatch = ast.constant ? [] : [ast];
        break;
      case AST.ConditionalExpression:
        findConstantAndWatchExpressions(ast.test, $filter, astIsPure);
        findConstantAndWatchExpressions(ast.alternate, $filter, astIsPure);
        findConstantAndWatchExpressions(ast.consequent, $filter, astIsPure);
        ast.constant = ast.test.constant && ast.alternate.constant && ast.consequent.constant;
        ast.toWatch = ast.constant ? [] : [ast];
        break;
      case AST.Identifier:
        ast.constant = false;
        ast.toWatch = [ast];
        break;
      case AST.MemberExpression:
        findConstantAndWatchExpressions(ast.object, $filter, astIsPure);
        if (ast.computed) {
          findConstantAndWatchExpressions(ast.property, $filter, astIsPure);
        }
        ast.constant = ast.object.constant && (!ast.computed || ast.property.constant);
        ast.toWatch = ast.constant ? [] : [ast];
        break;
      case AST.CallExpression:
        isStatelessFilter = ast.filter ? isStateless($filter, ast.callee.name) : false;
        allConstants = isStatelessFilter;
        argsToWatch = [];
        forEach(ast.arguments, function(expr) {
          findConstantAndWatchExpressions(expr, $filter, astIsPure);
          allConstants = allConstants && expr.constant;
          argsToWatch.push.apply(argsToWatch, expr.toWatch);
        });
        ast.constant = allConstants;
        ast.toWatch = isStatelessFilter ? argsToWatch : [ast];
        break;
      case AST.AssignmentExpression:
        findConstantAndWatchExpressions(ast.left, $filter, astIsPure);
        findConstantAndWatchExpressions(ast.right, $filter, astIsPure);
        ast.constant = ast.left.constant && ast.right.constant;
        ast.toWatch = [ast];
        break;
      case AST.ArrayExpression:
        allConstants = true;
        argsToWatch = [];
        forEach(ast.elements, function(expr) {
          findConstantAndWatchExpressions(expr, $filter, astIsPure);
          allConstants = allConstants && expr.constant;
          argsToWatch.push.apply(argsToWatch, expr.toWatch);
        });
        ast.constant = allConstants;
        ast.toWatch = argsToWatch;
        break;
      case AST.ObjectExpression:
        allConstants = true;
        argsToWatch = [];
        forEach(ast.properties, function(property) {
          findConstantAndWatchExpressions(property.value, $filter, astIsPure);
          allConstants = allConstants && property.value.constant;
          argsToWatch.push.apply(argsToWatch, property.value.toWatch);
          if (property.computed) {
            findConstantAndWatchExpressions(property.key, $filter, false);
            allConstants = allConstants && property.key.constant;
            argsToWatch.push.apply(argsToWatch, property.key.toWatch);
          }
        });
        ast.constant = allConstants;
        ast.toWatch = argsToWatch;
        break;
      case AST.ThisExpression:
        ast.constant = false;
        ast.toWatch = [];
        break;
      case AST.LocalsExpression:
        ast.constant = false;
        ast.toWatch = [];
        break;
    }
  }
  function getInputs(body) {
    if (body.length !== 1)
      return;
    var lastExpression = body[0].expression;
    var candidate = lastExpression.toWatch;
    if (candidate.length !== 1)
      return candidate;
    return candidate[0] !== lastExpression ? candidate : void 0;
  }
  function isAssignable(ast) {
    return ast.type === AST.Identifier || ast.type === AST.MemberExpression;
  }
  function assignableAST(ast) {
    if (ast.body.length === 1 && isAssignable(ast.body[0].expression)) {
      return { type: AST.AssignmentExpression, left: ast.body[0].expression, right: { type: AST.NGValueParameter }, operator: "=" };
    }
  }
  function isLiteral(ast) {
    return ast.body.length === 0 || ast.body.length === 1 && (ast.body[0].expression.type === AST.Literal || ast.body[0].expression.type === AST.ArrayExpression || ast.body[0].expression.type === AST.ObjectExpression);
  }
  function isConstant(ast) {
    return ast.constant;
  }
  function ASTCompiler($filter) {
    this.$filter = $filter;
  }
  ASTCompiler.prototype = {
    compile: function(ast) {
      var self = this;
      this.state = {
        nextId: 0,
        filters: {},
        fn: { vars: [], body: [], own: {} },
        assign: { vars: [], body: [], own: {} },
        inputs: []
      };
      findConstantAndWatchExpressions(ast, self.$filter);
      var extra = "";
      var assignable;
      this.stage = "assign";
      if (assignable = assignableAST(ast)) {
        this.state.computing = "assign";
        var result = this.nextId();
        this.recurse(assignable, result);
        this.return_(result);
        extra = "fn.assign=" + this.generateFunction("assign", "s,v,l");
      }
      var toWatch = getInputs(ast.body);
      self.stage = "inputs";
      forEach(toWatch, function(watch, key2) {
        var fnKey = "fn" + key2;
        self.state[fnKey] = { vars: [], body: [], own: {} };
        self.state.computing = fnKey;
        var intoId = self.nextId();
        self.recurse(watch, intoId);
        self.return_(intoId);
        self.state.inputs.push({ name: fnKey, isPure: watch.isPure });
        watch.watchId = key2;
      });
      this.state.computing = "fn";
      this.stage = "main";
      this.recurse(ast);
      var fnString = '"' + this.USE + " " + this.STRICT + '";\n' + this.filterPrefix() + "var fn=" + this.generateFunction("fn", "s,l,a,i") + extra + this.watchFns() + "return fn;";
      var fn = new Function("$filter", "getStringValue", "ifDefined", "plus", fnString)(this.$filter, getStringValue, ifDefined, plusFn);
      this.state = this.stage = void 0;
      return fn;
    },
    USE: "use",
    STRICT: "strict",
    watchFns: function() {
      var result = [];
      var inputs = this.state.inputs;
      var self = this;
      forEach(inputs, function(input) {
        result.push("var " + input.name + "=" + self.generateFunction(input.name, "s"));
        if (input.isPure) {
          result.push(input.name, ".isPure=" + JSON.stringify(input.isPure) + ";");
        }
      });
      if (inputs.length) {
        result.push("fn.inputs=[" + inputs.map(function(i) {
          return i.name;
        }).join(",") + "];");
      }
      return result.join("");
    },
    generateFunction: function(name, params) {
      return "function(" + params + "){" + this.varsPrefix(name) + this.body(name) + "};";
    },
    filterPrefix: function() {
      var parts = [];
      var self = this;
      forEach(this.state.filters, function(id, filter) {
        parts.push(id + "=$filter(" + self.escape(filter) + ")");
      });
      if (parts.length)
        return "var " + parts.join(",") + ";";
      return "";
    },
    varsPrefix: function(section) {
      return this.state[section].vars.length ? "var " + this.state[section].vars.join(",") + ";" : "";
    },
    body: function(section) {
      return this.state[section].body.join("");
    },
    recurse: function(ast, intoId, nameId, recursionFn, create, skipWatchIdCheck) {
      var left, right, self = this, args, expression, computed;
      recursionFn = recursionFn || noop;
      if (!skipWatchIdCheck && isDefined(ast.watchId)) {
        intoId = intoId || this.nextId();
        this.if_("i", this.lazyAssign(intoId, this.computedMember("i", ast.watchId)), this.lazyRecurse(ast, intoId, nameId, recursionFn, create, true));
        return;
      }
      switch (ast.type) {
        case AST.Program:
          forEach(ast.body, function(expression2, pos) {
            self.recurse(expression2.expression, void 0, void 0, function(expr) {
              right = expr;
            });
            if (pos !== ast.body.length - 1) {
              self.current().body.push(right, ";");
            } else {
              self.return_(right);
            }
          });
          break;
        case AST.Literal:
          expression = this.escape(ast.value);
          this.assign(intoId, expression);
          recursionFn(intoId || expression);
          break;
        case AST.UnaryExpression:
          this.recurse(ast.argument, void 0, void 0, function(expr) {
            right = expr;
          });
          expression = ast.operator + "(" + this.ifDefined(right, 0) + ")";
          this.assign(intoId, expression);
          recursionFn(expression);
          break;
        case AST.BinaryExpression:
          this.recurse(ast.left, void 0, void 0, function(expr) {
            left = expr;
          });
          this.recurse(ast.right, void 0, void 0, function(expr) {
            right = expr;
          });
          if (ast.operator === "+") {
            expression = this.plus(left, right);
          } else if (ast.operator === "-") {
            expression = this.ifDefined(left, 0) + ast.operator + this.ifDefined(right, 0);
          } else {
            expression = "(" + left + ")" + ast.operator + "(" + right + ")";
          }
          this.assign(intoId, expression);
          recursionFn(expression);
          break;
        case AST.LogicalExpression:
          intoId = intoId || this.nextId();
          self.recurse(ast.left, intoId);
          self.if_(ast.operator === "&&" ? intoId : self.not(intoId), self.lazyRecurse(ast.right, intoId));
          recursionFn(intoId);
          break;
        case AST.ConditionalExpression:
          intoId = intoId || this.nextId();
          self.recurse(ast.test, intoId);
          self.if_(intoId, self.lazyRecurse(ast.alternate, intoId), self.lazyRecurse(ast.consequent, intoId));
          recursionFn(intoId);
          break;
        case AST.Identifier:
          intoId = intoId || this.nextId();
          if (nameId) {
            nameId.context = self.stage === "inputs" ? "s" : this.assign(this.nextId(), this.getHasOwnProperty("l", ast.name) + "?l:s");
            nameId.computed = false;
            nameId.name = ast.name;
          }
          self.if_(self.stage === "inputs" || self.not(self.getHasOwnProperty("l", ast.name)), function() {
            self.if_(self.stage === "inputs" || "s", function() {
              if (create && create !== 1) {
                self.if_(self.isNull(self.nonComputedMember("s", ast.name)), self.lazyAssign(self.nonComputedMember("s", ast.name), "{}"));
              }
              self.assign(intoId, self.nonComputedMember("s", ast.name));
            });
          }, intoId && self.lazyAssign(intoId, self.nonComputedMember("l", ast.name)));
          recursionFn(intoId);
          break;
        case AST.MemberExpression:
          left = nameId && (nameId.context = this.nextId()) || this.nextId();
          intoId = intoId || this.nextId();
          self.recurse(ast.object, left, void 0, function() {
            self.if_(self.notNull(left), function() {
              if (ast.computed) {
                right = self.nextId();
                self.recurse(ast.property, right);
                self.getStringValue(right);
                if (create && create !== 1) {
                  self.if_(self.not(self.computedMember(left, right)), self.lazyAssign(self.computedMember(left, right), "{}"));
                }
                expression = self.computedMember(left, right);
                self.assign(intoId, expression);
                if (nameId) {
                  nameId.computed = true;
                  nameId.name = right;
                }
              } else {
                if (create && create !== 1) {
                  self.if_(self.isNull(self.nonComputedMember(left, ast.property.name)), self.lazyAssign(self.nonComputedMember(left, ast.property.name), "{}"));
                }
                expression = self.nonComputedMember(left, ast.property.name);
                self.assign(intoId, expression);
                if (nameId) {
                  nameId.computed = false;
                  nameId.name = ast.property.name;
                }
              }
            }, function() {
              self.assign(intoId, "undefined");
            });
            recursionFn(intoId);
          }, !!create);
          break;
        case AST.CallExpression:
          intoId = intoId || this.nextId();
          if (ast.filter) {
            right = self.filter(ast.callee.name);
            args = [];
            forEach(ast.arguments, function(expr) {
              var argument = self.nextId();
              self.recurse(expr, argument);
              args.push(argument);
            });
            expression = right + "(" + args.join(",") + ")";
            self.assign(intoId, expression);
            recursionFn(intoId);
          } else {
            right = self.nextId();
            left = {};
            args = [];
            self.recurse(ast.callee, right, left, function() {
              self.if_(self.notNull(right), function() {
                forEach(ast.arguments, function(expr) {
                  self.recurse(expr, ast.constant ? void 0 : self.nextId(), void 0, function(argument) {
                    args.push(argument);
                  });
                });
                if (left.name) {
                  expression = self.member(left.context, left.name, left.computed) + "(" + args.join(",") + ")";
                } else {
                  expression = right + "(" + args.join(",") + ")";
                }
                self.assign(intoId, expression);
              }, function() {
                self.assign(intoId, "undefined");
              });
              recursionFn(intoId);
            });
          }
          break;
        case AST.AssignmentExpression:
          right = this.nextId();
          left = {};
          this.recurse(ast.left, void 0, left, function() {
            self.if_(self.notNull(left.context), function() {
              self.recurse(ast.right, right);
              expression = self.member(left.context, left.name, left.computed) + ast.operator + right;
              self.assign(intoId, expression);
              recursionFn(intoId || expression);
            });
          }, 1);
          break;
        case AST.ArrayExpression:
          args = [];
          forEach(ast.elements, function(expr) {
            self.recurse(expr, ast.constant ? void 0 : self.nextId(), void 0, function(argument) {
              args.push(argument);
            });
          });
          expression = "[" + args.join(",") + "]";
          this.assign(intoId, expression);
          recursionFn(intoId || expression);
          break;
        case AST.ObjectExpression:
          args = [];
          computed = false;
          forEach(ast.properties, function(property) {
            if (property.computed) {
              computed = true;
            }
          });
          if (computed) {
            intoId = intoId || this.nextId();
            this.assign(intoId, "{}");
            forEach(ast.properties, function(property) {
              if (property.computed) {
                left = self.nextId();
                self.recurse(property.key, left);
              } else {
                left = property.key.type === AST.Identifier ? property.key.name : "" + property.key.value;
              }
              right = self.nextId();
              self.recurse(property.value, right);
              self.assign(self.member(intoId, left, property.computed), right);
            });
          } else {
            forEach(ast.properties, function(property) {
              self.recurse(property.value, ast.constant ? void 0 : self.nextId(), void 0, function(expr) {
                args.push(self.escape(property.key.type === AST.Identifier ? property.key.name : "" + property.key.value) + ":" + expr);
              });
            });
            expression = "{" + args.join(",") + "}";
            this.assign(intoId, expression);
          }
          recursionFn(intoId || expression);
          break;
        case AST.ThisExpression:
          this.assign(intoId, "s");
          recursionFn(intoId || "s");
          break;
        case AST.LocalsExpression:
          this.assign(intoId, "l");
          recursionFn(intoId || "l");
          break;
        case AST.NGValueParameter:
          this.assign(intoId, "v");
          recursionFn(intoId || "v");
          break;
      }
    },
    getHasOwnProperty: function(element, property) {
      var key2 = element + "." + property;
      var own = this.current().own;
      if (!own.hasOwnProperty(key2)) {
        own[key2] = this.nextId(false, element + "&&(" + this.escape(property) + " in " + element + ")");
      }
      return own[key2];
    },
    assign: function(id, value) {
      if (!id)
        return;
      this.current().body.push(id, "=", value, ";");
      return id;
    },
    filter: function(filterName) {
      if (!this.state.filters.hasOwnProperty(filterName)) {
        this.state.filters[filterName] = this.nextId(true);
      }
      return this.state.filters[filterName];
    },
    ifDefined: function(id, defaultValue) {
      return "ifDefined(" + id + "," + this.escape(defaultValue) + ")";
    },
    plus: function(left, right) {
      return "plus(" + left + "," + right + ")";
    },
    return_: function(id) {
      this.current().body.push("return ", id, ";");
    },
    if_: function(test, alternate, consequent) {
      if (test === true) {
        alternate();
      } else {
        var body = this.current().body;
        body.push("if(", test, "){");
        alternate();
        body.push("}");
        if (consequent) {
          body.push("else{");
          consequent();
          body.push("}");
        }
      }
    },
    not: function(expression) {
      return "!(" + expression + ")";
    },
    isNull: function(expression) {
      return expression + "==null";
    },
    notNull: function(expression) {
      return expression + "!=null";
    },
    nonComputedMember: function(left, right) {
      var SAFE_IDENTIFIER = /^[$_a-zA-Z][$_a-zA-Z0-9]*$/;
      var UNSAFE_CHARACTERS = /[^$_a-zA-Z0-9]/g;
      if (SAFE_IDENTIFIER.test(right)) {
        return left + "." + right;
      } else {
        return left + '["' + right.replace(UNSAFE_CHARACTERS, this.stringEscapeFn) + '"]';
      }
    },
    computedMember: function(left, right) {
      return left + "[" + right + "]";
    },
    member: function(left, right, computed) {
      if (computed)
        return this.computedMember(left, right);
      return this.nonComputedMember(left, right);
    },
    getStringValue: function(item) {
      this.assign(item, "getStringValue(" + item + ")");
    },
    lazyRecurse: function(ast, intoId, nameId, recursionFn, create, skipWatchIdCheck) {
      var self = this;
      return function() {
        self.recurse(ast, intoId, nameId, recursionFn, create, skipWatchIdCheck);
      };
    },
    lazyAssign: function(id, value) {
      var self = this;
      return function() {
        self.assign(id, value);
      };
    },
    stringEscapeRegex: /[^ a-zA-Z0-9]/g,
    stringEscapeFn: function(c) {
      return "\\u" + ("0000" + c.charCodeAt(0).toString(16)).slice(-4);
    },
    escape: function(value) {
      if (isString(value))
        return "'" + value.replace(this.stringEscapeRegex, this.stringEscapeFn) + "'";
      if (isNumber(value))
        return value.toString();
      if (value === true)
        return "true";
      if (value === false)
        return "false";
      if (value === null)
        return "null";
      if (typeof value === "undefined")
        return "undefined";
      throw $parseMinErr("esc", "IMPOSSIBLE");
    },
    nextId: function(skip, init) {
      var id = "v" + this.state.nextId++;
      if (!skip) {
        this.current().vars.push(id + (init ? "=" + init : ""));
      }
      return id;
    },
    current: function() {
      return this.state[this.state.computing];
    }
  };
  function ASTInterpreter($filter) {
    this.$filter = $filter;
  }
  ASTInterpreter.prototype = {
    compile: function(ast) {
      var self = this;
      findConstantAndWatchExpressions(ast, self.$filter);
      var assignable;
      var assign;
      if (assignable = assignableAST(ast)) {
        assign = this.recurse(assignable);
      }
      var toWatch = getInputs(ast.body);
      var inputs;
      if (toWatch) {
        inputs = [];
        forEach(toWatch, function(watch, key2) {
          var input = self.recurse(watch);
          input.isPure = watch.isPure;
          watch.input = input;
          inputs.push(input);
          watch.watchId = key2;
        });
      }
      var expressions = [];
      forEach(ast.body, function(expression) {
        expressions.push(self.recurse(expression.expression));
      });
      var fn = ast.body.length === 0 ? noop : ast.body.length === 1 ? expressions[0] : function(scope, locals) {
        var lastValue;
        forEach(expressions, function(exp) {
          lastValue = exp(scope, locals);
        });
        return lastValue;
      };
      if (assign) {
        fn.assign = function(scope, value, locals) {
          return assign(scope, locals, value);
        };
      }
      if (inputs) {
        fn.inputs = inputs;
      }
      return fn;
    },
    recurse: function(ast, context, create) {
      var left, right, self = this, args;
      if (ast.input) {
        return this.inputs(ast.input, ast.watchId);
      }
      switch (ast.type) {
        case AST.Literal:
          return this.value(ast.value, context);
        case AST.UnaryExpression:
          right = this.recurse(ast.argument);
          return this["unary" + ast.operator](right, context);
        case AST.BinaryExpression:
          left = this.recurse(ast.left);
          right = this.recurse(ast.right);
          return this["binary" + ast.operator](left, right, context);
        case AST.LogicalExpression:
          left = this.recurse(ast.left);
          right = this.recurse(ast.right);
          return this["binary" + ast.operator](left, right, context);
        case AST.ConditionalExpression:
          return this["ternary?:"](this.recurse(ast.test), this.recurse(ast.alternate), this.recurse(ast.consequent), context);
        case AST.Identifier:
          return self.identifier(ast.name, context, create);
        case AST.MemberExpression:
          left = this.recurse(ast.object, false, !!create);
          if (!ast.computed) {
            right = ast.property.name;
          }
          if (ast.computed)
            right = this.recurse(ast.property);
          return ast.computed ? this.computedMember(left, right, context, create) : this.nonComputedMember(left, right, context, create);
        case AST.CallExpression:
          args = [];
          forEach(ast.arguments, function(expr) {
            args.push(self.recurse(expr));
          });
          if (ast.filter)
            right = this.$filter(ast.callee.name);
          if (!ast.filter)
            right = this.recurse(ast.callee, true);
          return ast.filter ? function(scope, locals, assign, inputs) {
            var values = [];
            for (var i = 0; i < args.length; ++i) {
              values.push(args[i](scope, locals, assign, inputs));
            }
            var value = right.apply(void 0, values, inputs);
            return context ? { context: void 0, name: void 0, value } : value;
          } : function(scope, locals, assign, inputs) {
            var rhs = right(scope, locals, assign, inputs);
            var value;
            if (rhs.value != null) {
              var values = [];
              for (var i = 0; i < args.length; ++i) {
                values.push(args[i](scope, locals, assign, inputs));
              }
              value = rhs.value.apply(rhs.context, values);
            }
            return context ? { value } : value;
          };
        case AST.AssignmentExpression:
          left = this.recurse(ast.left, true, 1);
          right = this.recurse(ast.right);
          return function(scope, locals, assign, inputs) {
            var lhs = left(scope, locals, assign, inputs);
            var rhs = right(scope, locals, assign, inputs);
            lhs.context[lhs.name] = rhs;
            return context ? { value: rhs } : rhs;
          };
        case AST.ArrayExpression:
          args = [];
          forEach(ast.elements, function(expr) {
            args.push(self.recurse(expr));
          });
          return function(scope, locals, assign, inputs) {
            var value = [];
            for (var i = 0; i < args.length; ++i) {
              value.push(args[i](scope, locals, assign, inputs));
            }
            return context ? { value } : value;
          };
        case AST.ObjectExpression:
          args = [];
          forEach(ast.properties, function(property) {
            if (property.computed) {
              args.push({
                key: self.recurse(property.key),
                computed: true,
                value: self.recurse(property.value)
              });
            } else {
              args.push({
                key: property.key.type === AST.Identifier ? property.key.name : "" + property.key.value,
                computed: false,
                value: self.recurse(property.value)
              });
            }
          });
          return function(scope, locals, assign, inputs) {
            var value = {};
            for (var i = 0; i < args.length; ++i) {
              if (args[i].computed) {
                value[args[i].key(scope, locals, assign, inputs)] = args[i].value(scope, locals, assign, inputs);
              } else {
                value[args[i].key] = args[i].value(scope, locals, assign, inputs);
              }
            }
            return context ? { value } : value;
          };
        case AST.ThisExpression:
          return function(scope) {
            return context ? { value: scope } : scope;
          };
        case AST.LocalsExpression:
          return function(scope, locals) {
            return context ? { value: locals } : locals;
          };
        case AST.NGValueParameter:
          return function(scope, locals, assign) {
            return context ? { value: assign } : assign;
          };
      }
    },
    "unary+": function(argument, context) {
      return function(scope, locals, assign, inputs) {
        var arg = argument(scope, locals, assign, inputs);
        if (isDefined(arg)) {
          arg = +arg;
        } else {
          arg = 0;
        }
        return context ? { value: arg } : arg;
      };
    },
    "unary-": function(argument, context) {
      return function(scope, locals, assign, inputs) {
        var arg = argument(scope, locals, assign, inputs);
        if (isDefined(arg)) {
          arg = -arg;
        } else {
          arg = -0;
        }
        return context ? { value: arg } : arg;
      };
    },
    "unary!": function(argument, context) {
      return function(scope, locals, assign, inputs) {
        var arg = !argument(scope, locals, assign, inputs);
        return context ? { value: arg } : arg;
      };
    },
    "binary+": function(left, right, context) {
      return function(scope, locals, assign, inputs) {
        var lhs = left(scope, locals, assign, inputs);
        var rhs = right(scope, locals, assign, inputs);
        var arg = plusFn(lhs, rhs);
        return context ? { value: arg } : arg;
      };
    },
    "binary-": function(left, right, context) {
      return function(scope, locals, assign, inputs) {
        var lhs = left(scope, locals, assign, inputs);
        var rhs = right(scope, locals, assign, inputs);
        var arg = (isDefined(lhs) ? lhs : 0) - (isDefined(rhs) ? rhs : 0);
        return context ? { value: arg } : arg;
      };
    },
    "binary*": function(left, right, context) {
      return function(scope, locals, assign, inputs) {
        var arg = left(scope, locals, assign, inputs) * right(scope, locals, assign, inputs);
        return context ? { value: arg } : arg;
      };
    },
    "binary/": function(left, right, context) {
      return function(scope, locals, assign, inputs) {
        var arg = left(scope, locals, assign, inputs) / right(scope, locals, assign, inputs);
        return context ? { value: arg } : arg;
      };
    },
    "binary%": function(left, right, context) {
      return function(scope, locals, assign, inputs) {
        var arg = left(scope, locals, assign, inputs) % right(scope, locals, assign, inputs);
        return context ? { value: arg } : arg;
      };
    },
    "binary===": function(left, right, context) {
      return function(scope, locals, assign, inputs) {
        var arg = left(scope, locals, assign, inputs) === right(scope, locals, assign, inputs);
        return context ? { value: arg } : arg;
      };
    },
    "binary!==": function(left, right, context) {
      return function(scope, locals, assign, inputs) {
        var arg = left(scope, locals, assign, inputs) !== right(scope, locals, assign, inputs);
        return context ? { value: arg } : arg;
      };
    },
    "binary==": function(left, right, context) {
      return function(scope, locals, assign, inputs) {
        var arg = left(scope, locals, assign, inputs) == right(scope, locals, assign, inputs);
        return context ? { value: arg } : arg;
      };
    },
    "binary!=": function(left, right, context) {
      return function(scope, locals, assign, inputs) {
        var arg = left(scope, locals, assign, inputs) != right(scope, locals, assign, inputs);
        return context ? { value: arg } : arg;
      };
    },
    "binary<": function(left, right, context) {
      return function(scope, locals, assign, inputs) {
        var arg = left(scope, locals, assign, inputs) < right(scope, locals, assign, inputs);
        return context ? { value: arg } : arg;
      };
    },
    "binary>": function(left, right, context) {
      return function(scope, locals, assign, inputs) {
        var arg = left(scope, locals, assign, inputs) > right(scope, locals, assign, inputs);
        return context ? { value: arg } : arg;
      };
    },
    "binary<=": function(left, right, context) {
      return function(scope, locals, assign, inputs) {
        var arg = left(scope, locals, assign, inputs) <= right(scope, locals, assign, inputs);
        return context ? { value: arg } : arg;
      };
    },
    "binary>=": function(left, right, context) {
      return function(scope, locals, assign, inputs) {
        var arg = left(scope, locals, assign, inputs) >= right(scope, locals, assign, inputs);
        return context ? { value: arg } : arg;
      };
    },
    "binary&&": function(left, right, context) {
      return function(scope, locals, assign, inputs) {
        var arg = left(scope, locals, assign, inputs) && right(scope, locals, assign, inputs);
        return context ? { value: arg } : arg;
      };
    },
    "binary||": function(left, right, context) {
      return function(scope, locals, assign, inputs) {
        var arg = left(scope, locals, assign, inputs) || right(scope, locals, assign, inputs);
        return context ? { value: arg } : arg;
      };
    },
    "ternary?:": function(test, alternate, consequent, context) {
      return function(scope, locals, assign, inputs) {
        var arg = test(scope, locals, assign, inputs) ? alternate(scope, locals, assign, inputs) : consequent(scope, locals, assign, inputs);
        return context ? { value: arg } : arg;
      };
    },
    value: function(value, context) {
      return function() {
        return context ? { context: void 0, name: void 0, value } : value;
      };
    },
    identifier: function(name, context, create) {
      return function(scope, locals, assign, inputs) {
        var base = locals && name in locals ? locals : scope;
        if (create && create !== 1 && base && base[name] == null) {
          base[name] = {};
        }
        var value = base ? base[name] : void 0;
        if (context) {
          return { context: base, name, value };
        } else {
          return value;
        }
      };
    },
    computedMember: function(left, right, context, create) {
      return function(scope, locals, assign, inputs) {
        var lhs = left(scope, locals, assign, inputs);
        var rhs;
        var value;
        if (lhs != null) {
          rhs = right(scope, locals, assign, inputs);
          rhs = getStringValue(rhs);
          if (create && create !== 1) {
            if (lhs && !lhs[rhs]) {
              lhs[rhs] = {};
            }
          }
          value = lhs[rhs];
        }
        if (context) {
          return { context: lhs, name: rhs, value };
        } else {
          return value;
        }
      };
    },
    nonComputedMember: function(left, right, context, create) {
      return function(scope, locals, assign, inputs) {
        var lhs = left(scope, locals, assign, inputs);
        if (create && create !== 1) {
          if (lhs && lhs[right] == null) {
            lhs[right] = {};
          }
        }
        var value = lhs != null ? lhs[right] : void 0;
        if (context) {
          return { context: lhs, name: right, value };
        } else {
          return value;
        }
      };
    },
    inputs: function(input, watchId) {
      return function(scope, value, locals, inputs) {
        if (inputs)
          return inputs[watchId];
        return input(scope, value, locals);
      };
    }
  };
  function Parser(lexer, $filter, options) {
    this.ast = new AST(lexer, options);
    this.astCompiler = options.csp ? new ASTInterpreter($filter) : new ASTCompiler($filter);
  }
  Parser.prototype = {
    constructor: Parser,
    parse: function(text) {
      var ast = this.getAst(text);
      var fn = this.astCompiler.compile(ast.ast);
      fn.literal = isLiteral(ast.ast);
      fn.constant = isConstant(ast.ast);
      fn.oneTime = ast.oneTime;
      return fn;
    },
    getAst: function(exp) {
      var oneTime = false;
      exp = exp.trim();
      if (exp.charAt(0) === ":" && exp.charAt(1) === ":") {
        oneTime = true;
        exp = exp.substring(2);
      }
      return {
        ast: this.ast.ast(exp),
        oneTime
      };
    }
  };
  function getValueOf(value) {
    return isFunction(value.valueOf) ? value.valueOf() : objectValueOf.call(value);
  }
  function $ParseProvider() {
    var cache = createMap();
    var literals = {
      "true": true,
      "false": false,
      "null": null,
      "undefined": void 0
    };
    var identStart, identContinue;
    this.addLiteral = function(literalName, literalValue) {
      literals[literalName] = literalValue;
    };
    this.setIdentifierFns = function(identifierStart, identifierContinue) {
      identStart = identifierStart;
      identContinue = identifierContinue;
      return this;
    };
    this.$get = ["$filter", function($filter) {
      var noUnsafeEval = csp().noUnsafeEval;
      var $parseOptions = {
        csp: noUnsafeEval,
        literals: copy(literals),
        isIdentifierStart: isFunction(identStart) && identStart,
        isIdentifierContinue: isFunction(identContinue) && identContinue
      };
      $parse.$$getAst = $$getAst;
      return $parse;
      function $parse(exp, interceptorFn) {
        var parsedExpression, cacheKey;
        switch (typeof exp) {
          case "string":
            exp = exp.trim();
            cacheKey = exp;
            parsedExpression = cache[cacheKey];
            if (!parsedExpression) {
              var lexer = new Lexer($parseOptions);
              var parser = new Parser(lexer, $filter, $parseOptions);
              parsedExpression = parser.parse(exp);
              cache[cacheKey] = addWatchDelegate(parsedExpression);
            }
            return addInterceptor(parsedExpression, interceptorFn);
          case "function":
            return addInterceptor(exp, interceptorFn);
          default:
            return addInterceptor(noop, interceptorFn);
        }
      }
      function $$getAst(exp) {
        var lexer = new Lexer($parseOptions);
        var parser = new Parser(lexer, $filter, $parseOptions);
        return parser.getAst(exp).ast;
      }
      function expressionInputDirtyCheck(newValue, oldValueOfValue, compareObjectIdentity) {
        if (newValue == null || oldValueOfValue == null) {
          return newValue === oldValueOfValue;
        }
        if (typeof newValue === "object") {
          newValue = getValueOf(newValue);
          if (typeof newValue === "object" && !compareObjectIdentity) {
            return false;
          }
        }
        return newValue === oldValueOfValue || newValue !== newValue && oldValueOfValue !== oldValueOfValue;
      }
      function inputsWatchDelegate(scope, listener, objectEquality, parsedExpression, prettyPrintExpression) {
        var inputExpressions = parsedExpression.inputs;
        var lastResult;
        if (inputExpressions.length === 1) {
          var oldInputValueOf = expressionInputDirtyCheck;
          inputExpressions = inputExpressions[0];
          return scope.$watch(function expressionInputWatch(scope2) {
            var newInputValue = inputExpressions(scope2);
            if (!expressionInputDirtyCheck(newInputValue, oldInputValueOf, inputExpressions.isPure)) {
              lastResult = parsedExpression(scope2, void 0, void 0, [newInputValue]);
              oldInputValueOf = newInputValue && getValueOf(newInputValue);
            }
            return lastResult;
          }, listener, objectEquality, prettyPrintExpression);
        }
        var oldInputValueOfValues = [];
        var oldInputValues = [];
        for (var i = 0, ii = inputExpressions.length; i < ii; i++) {
          oldInputValueOfValues[i] = expressionInputDirtyCheck;
          oldInputValues[i] = null;
        }
        return scope.$watch(function expressionInputsWatch(scope2) {
          var changed = false;
          for (var i2 = 0, ii2 = inputExpressions.length; i2 < ii2; i2++) {
            var newInputValue = inputExpressions[i2](scope2);
            if (changed || (changed = !expressionInputDirtyCheck(newInputValue, oldInputValueOfValues[i2], inputExpressions[i2].isPure))) {
              oldInputValues[i2] = newInputValue;
              oldInputValueOfValues[i2] = newInputValue && getValueOf(newInputValue);
            }
          }
          if (changed) {
            lastResult = parsedExpression(scope2, void 0, void 0, oldInputValues);
          }
          return lastResult;
        }, listener, objectEquality, prettyPrintExpression);
      }
      function oneTimeWatchDelegate(scope, listener, objectEquality, parsedExpression, prettyPrintExpression) {
        var isDone = parsedExpression.literal ? isAllDefined : isDefined;
        var unwatch, lastValue;
        var exp = parsedExpression.$$intercepted || parsedExpression;
        var post = parsedExpression.$$interceptor || identity;
        var useInputs = parsedExpression.inputs && !exp.inputs;
        oneTimeWatch.literal = parsedExpression.literal;
        oneTimeWatch.constant = parsedExpression.constant;
        oneTimeWatch.inputs = parsedExpression.inputs;
        addWatchDelegate(oneTimeWatch);
        unwatch = scope.$watch(oneTimeWatch, listener, objectEquality, prettyPrintExpression);
        return unwatch;
        function unwatchIfDone() {
          if (isDone(lastValue)) {
            unwatch();
          }
        }
        function oneTimeWatch(scope2, locals, assign, inputs) {
          lastValue = useInputs && inputs ? inputs[0] : exp(scope2, locals, assign, inputs);
          if (isDone(lastValue)) {
            scope2.$$postDigest(unwatchIfDone);
          }
          return post(lastValue);
        }
      }
      function isAllDefined(value) {
        var allDefined = true;
        forEach(value, function(val) {
          if (!isDefined(val))
            allDefined = false;
        });
        return allDefined;
      }
      function constantWatchDelegate(scope, listener, objectEquality, parsedExpression) {
        var unwatch = scope.$watch(function constantWatch(scope2) {
          unwatch();
          return parsedExpression(scope2);
        }, listener, objectEquality);
        return unwatch;
      }
      function addWatchDelegate(parsedExpression) {
        if (parsedExpression.constant) {
          parsedExpression.$$watchDelegate = constantWatchDelegate;
        } else if (parsedExpression.oneTime) {
          parsedExpression.$$watchDelegate = oneTimeWatchDelegate;
        } else if (parsedExpression.inputs) {
          parsedExpression.$$watchDelegate = inputsWatchDelegate;
        }
        return parsedExpression;
      }
      function chainInterceptors(first, second) {
        function chainedInterceptor(value) {
          return second(first(value));
        }
        chainedInterceptor.$stateful = first.$stateful || second.$stateful;
        chainedInterceptor.$$pure = first.$$pure && second.$$pure;
        return chainedInterceptor;
      }
      function addInterceptor(parsedExpression, interceptorFn) {
        if (!interceptorFn)
          return parsedExpression;
        if (parsedExpression.$$interceptor) {
          interceptorFn = chainInterceptors(parsedExpression.$$interceptor, interceptorFn);
          parsedExpression = parsedExpression.$$intercepted;
        }
        var useInputs = false;
        var fn = function interceptedExpression(scope, locals, assign, inputs) {
          var value = useInputs && inputs ? inputs[0] : parsedExpression(scope, locals, assign, inputs);
          return interceptorFn(value);
        };
        fn.$$intercepted = parsedExpression;
        fn.$$interceptor = interceptorFn;
        fn.literal = parsedExpression.literal;
        fn.oneTime = parsedExpression.oneTime;
        fn.constant = parsedExpression.constant;
        if (!interceptorFn.$stateful) {
          useInputs = !parsedExpression.inputs;
          fn.inputs = parsedExpression.inputs ? parsedExpression.inputs : [parsedExpression];
          if (!interceptorFn.$$pure) {
            fn.inputs = fn.inputs.map(function(e) {
              if (e.isPure === PURITY_RELATIVE) {
                return function depurifier(s) {
                  return e(s);
                };
              }
              return e;
            });
          }
        }
        return addWatchDelegate(fn);
      }
    }];
  }
  function $QProvider() {
    var errorOnUnhandledRejections = true;
    this.$get = ["$rootScope", "$exceptionHandler", function($rootScope, $exceptionHandler) {
      return qFactory(function(callback) {
        $rootScope.$evalAsync(callback);
      }, $exceptionHandler, errorOnUnhandledRejections);
    }];
    this.errorOnUnhandledRejections = function(value) {
      if (isDefined(value)) {
        errorOnUnhandledRejections = value;
        return this;
      } else {
        return errorOnUnhandledRejections;
      }
    };
  }
  function $$QProvider() {
    var errorOnUnhandledRejections = true;
    this.$get = ["$browser", "$exceptionHandler", function($browser, $exceptionHandler) {
      return qFactory(function(callback) {
        $browser.defer(callback);
      }, $exceptionHandler, errorOnUnhandledRejections);
    }];
    this.errorOnUnhandledRejections = function(value) {
      if (isDefined(value)) {
        errorOnUnhandledRejections = value;
        return this;
      } else {
        return errorOnUnhandledRejections;
      }
    };
  }
  function qFactory(nextTick, exceptionHandler, errorOnUnhandledRejections) {
    var $qMinErr = minErr("$q", TypeError);
    var queueSize = 0;
    var checkQueue = [];
    function defer() {
      return new Deferred();
    }
    function Deferred() {
      var promise = this.promise = new Promise();
      this.resolve = function(val) {
        resolvePromise(promise, val);
      };
      this.reject = function(reason) {
        rejectPromise(promise, reason);
      };
      this.notify = function(progress) {
        notifyPromise(promise, progress);
      };
    }
    function Promise() {
      this.$$state = { status: 0 };
    }
    extend(Promise.prototype, {
      then: function(onFulfilled, onRejected, progressBack) {
        if (isUndefined(onFulfilled) && isUndefined(onRejected) && isUndefined(progressBack)) {
          return this;
        }
        var result = new Promise();
        this.$$state.pending = this.$$state.pending || [];
        this.$$state.pending.push([result, onFulfilled, onRejected, progressBack]);
        if (this.$$state.status > 0)
          scheduleProcessQueue(this.$$state);
        return result;
      },
      "catch": function(callback) {
        return this.then(null, callback);
      },
      "finally": function(callback, progressBack) {
        return this.then(function(value) {
          return handleCallback(value, resolve, callback);
        }, function(error) {
          return handleCallback(error, reject, callback);
        }, progressBack);
      }
    });
    function processQueue(state) {
      var fn, promise, pending;
      pending = state.pending;
      state.processScheduled = false;
      state.pending = void 0;
      try {
        for (var i = 0, ii = pending.length; i < ii; ++i) {
          markQStateExceptionHandled(state);
          promise = pending[i][0];
          fn = pending[i][state.status];
          try {
            if (isFunction(fn)) {
              resolvePromise(promise, fn(state.value));
            } else if (state.status === 1) {
              resolvePromise(promise, state.value);
            } else {
              rejectPromise(promise, state.value);
            }
          } catch (e) {
            rejectPromise(promise, e);
            if (e && e.$$passToExceptionHandler === true) {
              exceptionHandler(e);
            }
          }
        }
      } finally {
        --queueSize;
        if (errorOnUnhandledRejections && queueSize === 0) {
          nextTick(processChecks);
        }
      }
    }
    function processChecks() {
      while (!queueSize && checkQueue.length) {
        var toCheck = checkQueue.shift();
        if (!isStateExceptionHandled(toCheck)) {
          markQStateExceptionHandled(toCheck);
          var errorMessage = "Possibly unhandled rejection: " + toDebugString(toCheck.value);
          if (isError(toCheck.value)) {
            exceptionHandler(toCheck.value, errorMessage);
          } else {
            exceptionHandler(errorMessage);
          }
        }
      }
    }
    function scheduleProcessQueue(state) {
      if (errorOnUnhandledRejections && !state.pending && state.status === 2 && !isStateExceptionHandled(state)) {
        if (queueSize === 0 && checkQueue.length === 0) {
          nextTick(processChecks);
        }
        checkQueue.push(state);
      }
      if (state.processScheduled || !state.pending)
        return;
      state.processScheduled = true;
      ++queueSize;
      nextTick(function() {
        processQueue(state);
      });
    }
    function resolvePromise(promise, val) {
      if (promise.$$state.status)
        return;
      if (val === promise) {
        $$reject(promise, $qMinErr("qcycle", "Expected promise to be resolved with value other than itself '{0}'", val));
      } else {
        $$resolve(promise, val);
      }
    }
    function $$resolve(promise, val) {
      var then;
      var done = false;
      try {
        if (isObject(val) || isFunction(val))
          then = val.then;
        if (isFunction(then)) {
          promise.$$state.status = -1;
          then.call(val, doResolve, doReject, doNotify);
        } else {
          promise.$$state.value = val;
          promise.$$state.status = 1;
          scheduleProcessQueue(promise.$$state);
        }
      } catch (e) {
        doReject(e);
      }
      function doResolve(val2) {
        if (done)
          return;
        done = true;
        $$resolve(promise, val2);
      }
      function doReject(val2) {
        if (done)
          return;
        done = true;
        $$reject(promise, val2);
      }
      function doNotify(progress) {
        notifyPromise(promise, progress);
      }
    }
    function rejectPromise(promise, reason) {
      if (promise.$$state.status)
        return;
      $$reject(promise, reason);
    }
    function $$reject(promise, reason) {
      promise.$$state.value = reason;
      promise.$$state.status = 2;
      scheduleProcessQueue(promise.$$state);
    }
    function notifyPromise(promise, progress) {
      var callbacks = promise.$$state.pending;
      if (promise.$$state.status <= 0 && callbacks && callbacks.length) {
        nextTick(function() {
          var callback, result;
          for (var i = 0, ii = callbacks.length; i < ii; i++) {
            result = callbacks[i][0];
            callback = callbacks[i][3];
            try {
              notifyPromise(result, isFunction(callback) ? callback(progress) : progress);
            } catch (e) {
              exceptionHandler(e);
            }
          }
        });
      }
    }
    function reject(reason) {
      var result = new Promise();
      rejectPromise(result, reason);
      return result;
    }
    function handleCallback(value, resolver, callback) {
      var callbackOutput = null;
      try {
        if (isFunction(callback))
          callbackOutput = callback();
      } catch (e) {
        return reject(e);
      }
      if (isPromiseLike(callbackOutput)) {
        return callbackOutput.then(function() {
          return resolver(value);
        }, reject);
      } else {
        return resolver(value);
      }
    }
    function when(value, callback, errback, progressBack) {
      var result = new Promise();
      resolvePromise(result, value);
      return result.then(callback, errback, progressBack);
    }
    var resolve = when;
    function all(promises) {
      var result = new Promise(), counter = 0, results = isArray(promises) ? [] : {};
      forEach(promises, function(promise, key2) {
        counter++;
        when(promise).then(function(value) {
          results[key2] = value;
          if (!--counter)
            resolvePromise(result, results);
        }, function(reason) {
          rejectPromise(result, reason);
        });
      });
      if (counter === 0) {
        resolvePromise(result, results);
      }
      return result;
    }
    function race(promises) {
      var deferred = defer();
      forEach(promises, function(promise) {
        when(promise).then(deferred.resolve, deferred.reject);
      });
      return deferred.promise;
    }
    function $Q(resolver) {
      if (!isFunction(resolver)) {
        throw $qMinErr("norslvr", "Expected resolverFn, got '{0}'", resolver);
      }
      var promise = new Promise();
      function resolveFn(value) {
        resolvePromise(promise, value);
      }
      function rejectFn(reason) {
        rejectPromise(promise, reason);
      }
      resolver(resolveFn, rejectFn);
      return promise;
    }
    $Q.prototype = Promise.prototype;
    $Q.defer = defer;
    $Q.reject = reject;
    $Q.when = when;
    $Q.resolve = resolve;
    $Q.all = all;
    $Q.race = race;
    return $Q;
  }
  function isStateExceptionHandled(state) {
    return !!state.pur;
  }
  function markQStateExceptionHandled(state) {
    state.pur = true;
  }
  function markQExceptionHandled(q) {
    if (q.$$state) {
      markQStateExceptionHandled(q.$$state);
    }
  }
  function $$RAFProvider() {
    this.$get = ["$window", "$timeout", function($window, $timeout) {
      var requestAnimationFrame = $window.requestAnimationFrame || $window.webkitRequestAnimationFrame;
      var cancelAnimationFrame = $window.cancelAnimationFrame || $window.webkitCancelAnimationFrame || $window.webkitCancelRequestAnimationFrame;
      var rafSupported = !!requestAnimationFrame;
      var raf = rafSupported ? function(fn) {
        var id = requestAnimationFrame(fn);
        return function() {
          cancelAnimationFrame(id);
        };
      } : function(fn) {
        var timer = $timeout(fn, 16.66, false);
        return function() {
          $timeout.cancel(timer);
        };
      };
      raf.supported = rafSupported;
      return raf;
    }];
  }
  function $RootScopeProvider() {
    var TTL = 10;
    var $rootScopeMinErr = minErr("$rootScope");
    var lastDirtyWatch = null;
    var applyAsyncId = null;
    this.digestTtl = function(value) {
      if (arguments.length) {
        TTL = value;
      }
      return TTL;
    };
    function createChildScopeClass(parent) {
      function ChildScope() {
        this.$$watchers = this.$$nextSibling = this.$$childHead = this.$$childTail = null;
        this.$$listeners = {};
        this.$$listenerCount = {};
        this.$$watchersCount = 0;
        this.$id = nextUid();
        this.$$ChildScope = null;
        this.$$suspended = false;
      }
      ChildScope.prototype = parent;
      return ChildScope;
    }
    this.$get = [
      "$exceptionHandler",
      "$parse",
      "$browser",
      function($exceptionHandler, $parse, $browser) {
        function destroyChildScope($event) {
          $event.currentScope.$$destroyed = true;
        }
        function cleanUpScope($scope) {
          if (msie === 9) {
            if ($scope.$$childHead) {
              cleanUpScope($scope.$$childHead);
            }
            if ($scope.$$nextSibling) {
              cleanUpScope($scope.$$nextSibling);
            }
          }
          $scope.$parent = $scope.$$nextSibling = $scope.$$prevSibling = $scope.$$childHead = $scope.$$childTail = $scope.$root = $scope.$$watchers = null;
        }
        function Scope() {
          this.$id = nextUid();
          this.$$phase = this.$parent = this.$$watchers = this.$$nextSibling = this.$$prevSibling = this.$$childHead = this.$$childTail = null;
          this.$root = this;
          this.$$destroyed = false;
          this.$$suspended = false;
          this.$$listeners = {};
          this.$$listenerCount = {};
          this.$$watchersCount = 0;
          this.$$isolateBindings = null;
        }
        Scope.prototype = {
          constructor: Scope,
          $new: function(isolate, parent) {
            var child;
            parent = parent || this;
            if (isolate) {
              child = new Scope();
              child.$root = this.$root;
            } else {
              if (!this.$$ChildScope) {
                this.$$ChildScope = createChildScopeClass(this);
              }
              child = new this.$$ChildScope();
            }
            child.$parent = parent;
            child.$$prevSibling = parent.$$childTail;
            if (parent.$$childHead) {
              parent.$$childTail.$$nextSibling = child;
              parent.$$childTail = child;
            } else {
              parent.$$childHead = parent.$$childTail = child;
            }
            if (isolate || parent !== this)
              child.$on("$destroy", destroyChildScope);
            return child;
          },
          $watch: function(watchExp, listener, objectEquality, prettyPrintExpression) {
            var get = $parse(watchExp);
            var fn = isFunction(listener) ? listener : noop;
            if (get.$$watchDelegate) {
              return get.$$watchDelegate(this, fn, objectEquality, get, watchExp);
            }
            var scope = this, array = scope.$$watchers, watcher = {
              fn,
              last: initWatchVal,
              get,
              exp: prettyPrintExpression || watchExp,
              eq: !!objectEquality
            };
            lastDirtyWatch = null;
            if (!array) {
              array = scope.$$watchers = [];
              array.$$digestWatchIndex = -1;
            }
            array.unshift(watcher);
            array.$$digestWatchIndex++;
            incrementWatchersCount(this, 1);
            return function deregisterWatch() {
              var index = arrayRemove(array, watcher);
              if (index >= 0) {
                incrementWatchersCount(scope, -1);
                if (index < array.$$digestWatchIndex) {
                  array.$$digestWatchIndex--;
                }
              }
              lastDirtyWatch = null;
            };
          },
          $watchGroup: function(watchExpressions2, listener) {
            var oldValues = new Array(watchExpressions2.length);
            var newValues = new Array(watchExpressions2.length);
            var deregisterFns = [];
            var self = this;
            var changeReactionScheduled = false;
            var firstRun = true;
            if (!watchExpressions2.length) {
              var shouldCall = true;
              self.$evalAsync(function() {
                if (shouldCall)
                  listener(newValues, newValues, self);
              });
              return function deregisterWatchGroup() {
                shouldCall = false;
              };
            }
            if (watchExpressions2.length === 1) {
              return this.$watch(watchExpressions2[0], function watchGroupAction2(value, oldValue, scope) {
                newValues[0] = value;
                oldValues[0] = oldValue;
                listener(newValues, value === oldValue ? newValues : oldValues, scope);
              });
            }
            forEach(watchExpressions2, function(expr, i) {
              var unwatchFn = self.$watch(expr, function watchGroupSubAction(value) {
                newValues[i] = value;
                if (!changeReactionScheduled) {
                  changeReactionScheduled = true;
                  self.$evalAsync(watchGroupAction);
                }
              });
              deregisterFns.push(unwatchFn);
            });
            function watchGroupAction() {
              changeReactionScheduled = false;
              try {
                if (firstRun) {
                  firstRun = false;
                  listener(newValues, newValues, self);
                } else {
                  listener(newValues, oldValues, self);
                }
              } finally {
                for (var i = 0; i < watchExpressions2.length; i++) {
                  oldValues[i] = newValues[i];
                }
              }
            }
            return function deregisterWatchGroup() {
              while (deregisterFns.length) {
                deregisterFns.shift()();
              }
            };
          },
          $watchCollection: function(obj, listener) {
            $watchCollectionInterceptor.$$pure = $parse(obj).literal;
            $watchCollectionInterceptor.$stateful = !$watchCollectionInterceptor.$$pure;
            var self = this;
            var newValue;
            var oldValue;
            var veryOldValue;
            var trackVeryOldValue = listener.length > 1;
            var changeDetected = 0;
            var changeDetector = $parse(obj, $watchCollectionInterceptor);
            var internalArray = [];
            var internalObject = {};
            var initRun = true;
            var oldLength = 0;
            function $watchCollectionInterceptor(_value) {
              newValue = _value;
              var newLength, key2, bothNaN, newItem, oldItem;
              if (isUndefined(newValue))
                return;
              if (!isObject(newValue)) {
                if (oldValue !== newValue) {
                  oldValue = newValue;
                  changeDetected++;
                }
              } else if (isArrayLike(newValue)) {
                if (oldValue !== internalArray) {
                  oldValue = internalArray;
                  oldLength = oldValue.length = 0;
                  changeDetected++;
                }
                newLength = newValue.length;
                if (oldLength !== newLength) {
                  changeDetected++;
                  oldValue.length = oldLength = newLength;
                }
                for (var i = 0; i < newLength; i++) {
                  oldItem = oldValue[i];
                  newItem = newValue[i];
                  bothNaN = oldItem !== oldItem && newItem !== newItem;
                  if (!bothNaN && oldItem !== newItem) {
                    changeDetected++;
                    oldValue[i] = newItem;
                  }
                }
              } else {
                if (oldValue !== internalObject) {
                  oldValue = internalObject = {};
                  oldLength = 0;
                  changeDetected++;
                }
                newLength = 0;
                for (key2 in newValue) {
                  if (hasOwnProperty.call(newValue, key2)) {
                    newLength++;
                    newItem = newValue[key2];
                    oldItem = oldValue[key2];
                    if (key2 in oldValue) {
                      bothNaN = oldItem !== oldItem && newItem !== newItem;
                      if (!bothNaN && oldItem !== newItem) {
                        changeDetected++;
                        oldValue[key2] = newItem;
                      }
                    } else {
                      oldLength++;
                      oldValue[key2] = newItem;
                      changeDetected++;
                    }
                  }
                }
                if (oldLength > newLength) {
                  changeDetected++;
                  for (key2 in oldValue) {
                    if (!hasOwnProperty.call(newValue, key2)) {
                      oldLength--;
                      delete oldValue[key2];
                    }
                  }
                }
              }
              return changeDetected;
            }
            function $watchCollectionAction() {
              if (initRun) {
                initRun = false;
                listener(newValue, newValue, self);
              } else {
                listener(newValue, veryOldValue, self);
              }
              if (trackVeryOldValue) {
                if (!isObject(newValue)) {
                  veryOldValue = newValue;
                } else if (isArrayLike(newValue)) {
                  veryOldValue = new Array(newValue.length);
                  for (var i = 0; i < newValue.length; i++) {
                    veryOldValue[i] = newValue[i];
                  }
                } else {
                  veryOldValue = {};
                  for (var key2 in newValue) {
                    if (hasOwnProperty.call(newValue, key2)) {
                      veryOldValue[key2] = newValue[key2];
                    }
                  }
                }
              }
            }
            return this.$watch(changeDetector, $watchCollectionAction);
          },
          $digest: function() {
            var watch, value, last, fn, get, watchers, dirty, ttl = TTL, next, current, target = asyncQueue.length ? $rootScope : this, watchLog = [], logIdx, asyncTask;
            beginPhase("$digest");
            $browser.$$checkUrlChange();
            if (this === $rootScope && applyAsyncId !== null) {
              $browser.defer.cancel(applyAsyncId);
              flushApplyAsync();
            }
            lastDirtyWatch = null;
            do {
              dirty = false;
              current = target;
              for (var asyncQueuePosition = 0; asyncQueuePosition < asyncQueue.length; asyncQueuePosition++) {
                try {
                  asyncTask = asyncQueue[asyncQueuePosition];
                  fn = asyncTask.fn;
                  fn(asyncTask.scope, asyncTask.locals);
                } catch (e) {
                  $exceptionHandler(e);
                }
                lastDirtyWatch = null;
              }
              asyncQueue.length = 0;
              traverseScopesLoop:
                do {
                  if (watchers = !current.$$suspended && current.$$watchers) {
                    watchers.$$digestWatchIndex = watchers.length;
                    while (watchers.$$digestWatchIndex--) {
                      try {
                        watch = watchers[watchers.$$digestWatchIndex];
                        if (watch) {
                          get = watch.get;
                          if ((value = get(current)) !== (last = watch.last) && !(watch.eq ? equals(value, last) : isNumberNaN(value) && isNumberNaN(last))) {
                            dirty = true;
                            lastDirtyWatch = watch;
                            watch.last = watch.eq ? copy(value, null) : value;
                            fn = watch.fn;
                            fn(value, last === initWatchVal ? value : last, current);
                            if (ttl < 5) {
                              logIdx = 4 - ttl;
                              if (!watchLog[logIdx])
                                watchLog[logIdx] = [];
                              watchLog[logIdx].push({
                                msg: isFunction(watch.exp) ? "fn: " + (watch.exp.name || watch.exp.toString()) : watch.exp,
                                newVal: value,
                                oldVal: last
                              });
                            }
                          } else if (watch === lastDirtyWatch) {
                            dirty = false;
                            break traverseScopesLoop;
                          }
                        }
                      } catch (e) {
                        $exceptionHandler(e);
                      }
                    }
                  }
                  if (!(next = !current.$$suspended && current.$$watchersCount && current.$$childHead || current !== target && current.$$nextSibling)) {
                    while (current !== target && !(next = current.$$nextSibling)) {
                      current = current.$parent;
                    }
                  }
                } while (current = next);
              if ((dirty || asyncQueue.length) && !ttl--) {
                clearPhase();
                throw $rootScopeMinErr("infdig", "{0} $digest() iterations reached. Aborting!\nWatchers fired in the last 5 iterations: {1}", TTL, watchLog);
              }
            } while (dirty || asyncQueue.length);
            clearPhase();
            while (postDigestQueuePosition < postDigestQueue.length) {
              try {
                postDigestQueue[postDigestQueuePosition++]();
              } catch (e) {
                $exceptionHandler(e);
              }
            }
            postDigestQueue.length = postDigestQueuePosition = 0;
            $browser.$$checkUrlChange();
          },
          $suspend: function() {
            this.$$suspended = true;
          },
          $isSuspended: function() {
            return this.$$suspended;
          },
          $resume: function() {
            this.$$suspended = false;
          },
          $destroy: function() {
            if (this.$$destroyed)
              return;
            var parent = this.$parent;
            this.$broadcast("$destroy");
            this.$$destroyed = true;
            if (this === $rootScope) {
              $browser.$$applicationDestroyed();
            }
            incrementWatchersCount(this, -this.$$watchersCount);
            for (var eventName in this.$$listenerCount) {
              decrementListenerCount(this, this.$$listenerCount[eventName], eventName);
            }
            if (parent && parent.$$childHead === this)
              parent.$$childHead = this.$$nextSibling;
            if (parent && parent.$$childTail === this)
              parent.$$childTail = this.$$prevSibling;
            if (this.$$prevSibling)
              this.$$prevSibling.$$nextSibling = this.$$nextSibling;
            if (this.$$nextSibling)
              this.$$nextSibling.$$prevSibling = this.$$prevSibling;
            this.$destroy = this.$digest = this.$apply = this.$evalAsync = this.$applyAsync = noop;
            this.$on = this.$watch = this.$watchGroup = function() {
              return noop;
            };
            this.$$listeners = {};
            this.$$nextSibling = null;
            cleanUpScope(this);
          },
          $eval: function(expr, locals) {
            return $parse(expr)(this, locals);
          },
          $evalAsync: function(expr, locals) {
            if (!$rootScope.$$phase && !asyncQueue.length) {
              $browser.defer(function() {
                if (asyncQueue.length) {
                  $rootScope.$digest();
                }
              }, null, "$evalAsync");
            }
            asyncQueue.push({ scope: this, fn: $parse(expr), locals });
          },
          $$postDigest: function(fn) {
            postDigestQueue.push(fn);
          },
          $apply: function(expr) {
            try {
              beginPhase("$apply");
              try {
                return this.$eval(expr);
              } finally {
                clearPhase();
              }
            } catch (e) {
              $exceptionHandler(e);
            } finally {
              try {
                $rootScope.$digest();
              } catch (e) {
                $exceptionHandler(e);
                throw e;
              }
            }
          },
          $applyAsync: function(expr) {
            var scope = this;
            if (expr) {
              applyAsyncQueue.push($applyAsyncExpression);
            }
            expr = $parse(expr);
            scheduleApplyAsync();
            function $applyAsyncExpression() {
              scope.$eval(expr);
            }
          },
          $on: function(name, listener) {
            var namedListeners = this.$$listeners[name];
            if (!namedListeners) {
              this.$$listeners[name] = namedListeners = [];
            }
            namedListeners.push(listener);
            var current = this;
            do {
              if (!current.$$listenerCount[name]) {
                current.$$listenerCount[name] = 0;
              }
              current.$$listenerCount[name]++;
            } while (current = current.$parent);
            var self = this;
            return function() {
              var indexOfListener = namedListeners.indexOf(listener);
              if (indexOfListener !== -1) {
                delete namedListeners[indexOfListener];
                decrementListenerCount(self, 1, name);
              }
            };
          },
          $emit: function(name, args) {
            var empty = [], namedListeners, scope = this, stopPropagation = false, event = {
              name,
              targetScope: scope,
              stopPropagation: function() {
                stopPropagation = true;
              },
              preventDefault: function() {
                event.defaultPrevented = true;
              },
              defaultPrevented: false
            }, listenerArgs = concat([event], arguments, 1), i, length;
            do {
              namedListeners = scope.$$listeners[name] || empty;
              event.currentScope = scope;
              for (i = 0, length = namedListeners.length; i < length; i++) {
                if (!namedListeners[i]) {
                  namedListeners.splice(i, 1);
                  i--;
                  length--;
                  continue;
                }
                try {
                  namedListeners[i].apply(null, listenerArgs);
                } catch (e) {
                  $exceptionHandler(e);
                }
              }
              if (stopPropagation) {
                break;
              }
              scope = scope.$parent;
            } while (scope);
            event.currentScope = null;
            return event;
          },
          $broadcast: function(name, args) {
            var target = this, current = target, next = target, event = {
              name,
              targetScope: target,
              preventDefault: function() {
                event.defaultPrevented = true;
              },
              defaultPrevented: false
            };
            if (!target.$$listenerCount[name])
              return event;
            var listenerArgs = concat([event], arguments, 1), listeners, i, length;
            while (current = next) {
              event.currentScope = current;
              listeners = current.$$listeners[name] || [];
              for (i = 0, length = listeners.length; i < length; i++) {
                if (!listeners[i]) {
                  listeners.splice(i, 1);
                  i--;
                  length--;
                  continue;
                }
                try {
                  listeners[i].apply(null, listenerArgs);
                } catch (e) {
                  $exceptionHandler(e);
                }
              }
              if (!(next = current.$$listenerCount[name] && current.$$childHead || current !== target && current.$$nextSibling)) {
                while (current !== target && !(next = current.$$nextSibling)) {
                  current = current.$parent;
                }
              }
            }
            event.currentScope = null;
            return event;
          }
        };
        var $rootScope = new Scope();
        var asyncQueue = $rootScope.$$asyncQueue = [];
        var postDigestQueue = $rootScope.$$postDigestQueue = [];
        var applyAsyncQueue = $rootScope.$$applyAsyncQueue = [];
        var postDigestQueuePosition = 0;
        return $rootScope;
        function beginPhase(phase) {
          if ($rootScope.$$phase) {
            throw $rootScopeMinErr("inprog", "{0} already in progress", $rootScope.$$phase);
          }
          $rootScope.$$phase = phase;
        }
        function clearPhase() {
          $rootScope.$$phase = null;
        }
        function incrementWatchersCount(current, count) {
          do {
            current.$$watchersCount += count;
          } while (current = current.$parent);
        }
        function decrementListenerCount(current, count, name) {
          do {
            current.$$listenerCount[name] -= count;
            if (current.$$listenerCount[name] === 0) {
              delete current.$$listenerCount[name];
            }
          } while (current = current.$parent);
        }
        function initWatchVal() {
        }
        function flushApplyAsync() {
          while (applyAsyncQueue.length) {
            try {
              applyAsyncQueue.shift()();
            } catch (e) {
              $exceptionHandler(e);
            }
          }
          applyAsyncId = null;
        }
        function scheduleApplyAsync() {
          if (applyAsyncId === null) {
            applyAsyncId = $browser.defer(function() {
              $rootScope.$apply(flushApplyAsync);
            }, null, "$applyAsync");
          }
        }
      }
    ];
  }
  function $$SanitizeUriProvider() {
    var aHrefSanitizationTrustedUrlList = /^\s*(https?|s?ftp|mailto|tel|file):/, imgSrcSanitizationTrustedUrlList = /^\s*((https?|ftp|file|blob):|data:image\/)/;
    this.aHrefSanitizationTrustedUrlList = function(regexp) {
      if (isDefined(regexp)) {
        aHrefSanitizationTrustedUrlList = regexp;
        return this;
      }
      return aHrefSanitizationTrustedUrlList;
    };
    this.imgSrcSanitizationTrustedUrlList = function(regexp) {
      if (isDefined(regexp)) {
        imgSrcSanitizationTrustedUrlList = regexp;
        return this;
      }
      return imgSrcSanitizationTrustedUrlList;
    };
    this.$get = function() {
      return function sanitizeUri(uri, isMediaUrl) {
        var regex = isMediaUrl ? imgSrcSanitizationTrustedUrlList : aHrefSanitizationTrustedUrlList;
        var normalizedVal = urlResolve(uri && uri.trim()).href;
        if (normalizedVal !== "" && !normalizedVal.match(regex)) {
          return "unsafe:" + normalizedVal;
        }
        return uri;
      };
    };
  }
  var $sceMinErr = minErr("$sce");
  var SCE_CONTEXTS = {
    HTML: "html",
    CSS: "css",
    MEDIA_URL: "mediaUrl",
    URL: "url",
    RESOURCE_URL: "resourceUrl",
    JS: "js"
  };
  var UNDERSCORE_LOWERCASE_REGEXP = /_([a-z])/g;
  function snakeToCamel(name) {
    return name.replace(UNDERSCORE_LOWERCASE_REGEXP, fnCamelCaseReplace);
  }
  function adjustMatcher(matcher) {
    if (matcher === "self") {
      return matcher;
    } else if (isString(matcher)) {
      if (matcher.indexOf("***") > -1) {
        throw $sceMinErr("iwcard", "Illegal sequence *** in string matcher.  String: {0}", matcher);
      }
      matcher = escapeForRegexp(matcher).replace(/\\\*\\\*/g, ".*").replace(/\\\*/g, "[^:/.?&;]*");
      return new RegExp("^" + matcher + "$");
    } else if (isRegExp(matcher)) {
      return new RegExp("^" + matcher.source + "$");
    } else {
      throw $sceMinErr("imatcher", 'Matchers may only be "self", string patterns or RegExp objects');
    }
  }
  function adjustMatchers(matchers) {
    var adjustedMatchers = [];
    if (isDefined(matchers)) {
      forEach(matchers, function(matcher) {
        adjustedMatchers.push(adjustMatcher(matcher));
      });
    }
    return adjustedMatchers;
  }
  function $SceDelegateProvider() {
    this.SCE_CONTEXTS = SCE_CONTEXTS;
    var trustedResourceUrlList = ["self"], bannedResourceUrlList = [];
    this.trustedResourceUrlList = function(value) {
      if (arguments.length) {
        trustedResourceUrlList = adjustMatchers(value);
      }
      return trustedResourceUrlList;
    };
    Object.defineProperty(this, "resourceUrlWhitelist", {
      get: function() {
        return this.trustedResourceUrlList;
      },
      set: function(value) {
        this.trustedResourceUrlList = value;
      }
    });
    this.bannedResourceUrlList = function(value) {
      if (arguments.length) {
        bannedResourceUrlList = adjustMatchers(value);
      }
      return bannedResourceUrlList;
    };
    Object.defineProperty(this, "resourceUrlBlacklist", {
      get: function() {
        return this.bannedResourceUrlList;
      },
      set: function(value) {
        this.bannedResourceUrlList = value;
      }
    });
    this.$get = ["$injector", "$$sanitizeUri", function($injector, $$sanitizeUri) {
      var htmlSanitizer = function htmlSanitizer2(html) {
        throw $sceMinErr("unsafe", "Attempting to use an unsafe value in a safe context.");
      };
      if ($injector.has("$sanitize")) {
        htmlSanitizer = $injector.get("$sanitize");
      }
      function matchUrl(matcher, parsedUrl) {
        if (matcher === "self") {
          return urlIsSameOrigin(parsedUrl) || urlIsSameOriginAsBaseUrl(parsedUrl);
        } else {
          return !!matcher.exec(parsedUrl.href);
        }
      }
      function isResourceUrlAllowedByPolicy(url) {
        var parsedUrl = urlResolve(url.toString());
        var i, n, allowed = false;
        for (i = 0, n = trustedResourceUrlList.length; i < n; i++) {
          if (matchUrl(trustedResourceUrlList[i], parsedUrl)) {
            allowed = true;
            break;
          }
        }
        if (allowed) {
          for (i = 0, n = bannedResourceUrlList.length; i < n; i++) {
            if (matchUrl(bannedResourceUrlList[i], parsedUrl)) {
              allowed = false;
              break;
            }
          }
        }
        return allowed;
      }
      function generateHolderType(Base) {
        var holderType = function TrustedValueHolderType(trustedValue) {
          this.$$unwrapTrustedValue = function() {
            return trustedValue;
          };
        };
        if (Base) {
          holderType.prototype = new Base();
        }
        holderType.prototype.valueOf = function sceValueOf() {
          return this.$$unwrapTrustedValue();
        };
        holderType.prototype.toString = function sceToString() {
          return this.$$unwrapTrustedValue().toString();
        };
        return holderType;
      }
      var trustedValueHolderBase = generateHolderType(), byType = {};
      byType[SCE_CONTEXTS.HTML] = generateHolderType(trustedValueHolderBase);
      byType[SCE_CONTEXTS.CSS] = generateHolderType(trustedValueHolderBase);
      byType[SCE_CONTEXTS.MEDIA_URL] = generateHolderType(trustedValueHolderBase);
      byType[SCE_CONTEXTS.URL] = generateHolderType(byType[SCE_CONTEXTS.MEDIA_URL]);
      byType[SCE_CONTEXTS.JS] = generateHolderType(trustedValueHolderBase);
      byType[SCE_CONTEXTS.RESOURCE_URL] = generateHolderType(byType[SCE_CONTEXTS.URL]);
      function trustAs(type, trustedValue) {
        var Constructor = byType.hasOwnProperty(type) ? byType[type] : null;
        if (!Constructor) {
          throw $sceMinErr("icontext", "Attempted to trust a value in invalid context. Context: {0}; Value: {1}", type, trustedValue);
        }
        if (trustedValue === null || isUndefined(trustedValue) || trustedValue === "") {
          return trustedValue;
        }
        if (typeof trustedValue !== "string") {
          throw $sceMinErr("itype", "Attempted to trust a non-string value in a content requiring a string: Context: {0}", type);
        }
        return new Constructor(trustedValue);
      }
      function valueOf(maybeTrusted) {
        if (maybeTrusted instanceof trustedValueHolderBase) {
          return maybeTrusted.$$unwrapTrustedValue();
        } else {
          return maybeTrusted;
        }
      }
      function getTrusted(type, maybeTrusted) {
        if (maybeTrusted === null || isUndefined(maybeTrusted) || maybeTrusted === "") {
          return maybeTrusted;
        }
        var constructor = byType.hasOwnProperty(type) ? byType[type] : null;
        if (constructor && maybeTrusted instanceof constructor) {
          return maybeTrusted.$$unwrapTrustedValue();
        }
        if (isFunction(maybeTrusted.$$unwrapTrustedValue)) {
          maybeTrusted = maybeTrusted.$$unwrapTrustedValue();
        }
        if (type === SCE_CONTEXTS.MEDIA_URL || type === SCE_CONTEXTS.URL) {
          return $$sanitizeUri(maybeTrusted.toString(), type === SCE_CONTEXTS.MEDIA_URL);
        } else if (type === SCE_CONTEXTS.RESOURCE_URL) {
          if (isResourceUrlAllowedByPolicy(maybeTrusted)) {
            return maybeTrusted;
          } else {
            throw $sceMinErr("insecurl", "Blocked loading resource from url not allowed by $sceDelegate policy.  URL: {0}", maybeTrusted.toString());
          }
        } else if (type === SCE_CONTEXTS.HTML) {
          return htmlSanitizer(maybeTrusted);
        }
        throw $sceMinErr("unsafe", "Attempting to use an unsafe value in a safe context.");
      }
      return {
        trustAs,
        getTrusted,
        valueOf
      };
    }];
  }
  function $SceProvider() {
    var enabled = true;
    this.enabled = function(value) {
      if (arguments.length) {
        enabled = !!value;
      }
      return enabled;
    };
    this.$get = ["$parse", "$sceDelegate", function($parse, $sceDelegate) {
      if (enabled && msie < 8) {
        throw $sceMinErr("iequirks", "Strict Contextual Escaping does not support Internet Explorer version < 11 in quirks mode.  You can fix this by adding the text <!doctype html> to the top of your HTML document.  See http://docs.angularjs.org/api/ng.$sce for more information.");
      }
      var sce = shallowCopy(SCE_CONTEXTS);
      sce.isEnabled = function() {
        return enabled;
      };
      sce.trustAs = $sceDelegate.trustAs;
      sce.getTrusted = $sceDelegate.getTrusted;
      sce.valueOf = $sceDelegate.valueOf;
      if (!enabled) {
        sce.trustAs = sce.getTrusted = function(type, value) {
          return value;
        };
        sce.valueOf = identity;
      }
      sce.parseAs = function sceParseAs(type, expr) {
        var parsed = $parse(expr);
        if (parsed.literal && parsed.constant) {
          return parsed;
        } else {
          return $parse(expr, function(value) {
            return sce.getTrusted(type, value);
          });
        }
      };
      var parse2 = sce.parseAs, getTrusted = sce.getTrusted, trustAs = sce.trustAs;
      forEach(SCE_CONTEXTS, function(enumValue, name) {
        var lName = lowercase(name);
        sce[snakeToCamel("parse_as_" + lName)] = function(expr) {
          return parse2(enumValue, expr);
        };
        sce[snakeToCamel("get_trusted_" + lName)] = function(value) {
          return getTrusted(enumValue, value);
        };
        sce[snakeToCamel("trust_as_" + lName)] = function(value) {
          return trustAs(enumValue, value);
        };
      });
      return sce;
    }];
  }
  function $SnifferProvider() {
    this.$get = ["$window", "$document", function($window, $document) {
      var eventSupport = {}, isNw = $window.nw && $window.nw.process, isChromePackagedApp = !isNw && $window.chrome && ($window.chrome.app && $window.chrome.app.runtime || !$window.chrome.app && $window.chrome.runtime && $window.chrome.runtime.id), hasHistoryPushState = !isChromePackagedApp && $window.history && $window.history.pushState, android = toInt((/android (\d+)/.exec(lowercase(($window.navigator || {}).userAgent)) || [])[1]), boxee = /Boxee/i.test(($window.navigator || {}).userAgent), document2 = $document[0] || {}, bodyStyle = document2.body && document2.body.style, transitions = false, animations = false;
      if (bodyStyle) {
        transitions = !!("transition" in bodyStyle || "webkitTransition" in bodyStyle);
        animations = !!("animation" in bodyStyle || "webkitAnimation" in bodyStyle);
      }
      return {
        history: !!(hasHistoryPushState && !(android < 4) && !boxee),
        hasEvent: function(event) {
          if (event === "input" && msie)
            return false;
          if (isUndefined(eventSupport[event])) {
            var divElm = document2.createElement("div");
            eventSupport[event] = "on" + event in divElm;
          }
          return eventSupport[event];
        },
        csp: csp(),
        transitions,
        animations,
        android
      };
    }];
  }
  function $$TaskTrackerFactoryProvider() {
    this.$get = valueFn(function(log) {
      return new TaskTracker(log);
    });
  }
  function TaskTracker(log) {
    var self = this;
    var taskCounts = {};
    var taskCallbacks = [];
    var ALL_TASKS_TYPE = self.ALL_TASKS_TYPE = "$$all$$";
    var DEFAULT_TASK_TYPE = self.DEFAULT_TASK_TYPE = "$$default$$";
    self.completeTask = completeTask;
    self.incTaskCount = incTaskCount;
    self.notifyWhenNoPendingTasks = notifyWhenNoPendingTasks;
    function completeTask(fn, taskType) {
      taskType = taskType || DEFAULT_TASK_TYPE;
      try {
        fn();
      } finally {
        decTaskCount(taskType);
        var countForType = taskCounts[taskType];
        var countForAll = taskCounts[ALL_TASKS_TYPE];
        if (!countForAll || !countForType) {
          var getNextCallback = !countForAll ? getLastCallback : getLastCallbackForType;
          var nextCb;
          while (nextCb = getNextCallback(taskType)) {
            try {
              nextCb();
            } catch (e) {
              log.error(e);
            }
          }
        }
      }
    }
    function decTaskCount(taskType) {
      taskType = taskType || DEFAULT_TASK_TYPE;
      if (taskCounts[taskType]) {
        taskCounts[taskType]--;
        taskCounts[ALL_TASKS_TYPE]--;
      }
    }
    function getLastCallback() {
      var cbInfo = taskCallbacks.pop();
      return cbInfo && cbInfo.cb;
    }
    function getLastCallbackForType(taskType) {
      for (var i = taskCallbacks.length - 1; i >= 0; --i) {
        var cbInfo = taskCallbacks[i];
        if (cbInfo.type === taskType) {
          taskCallbacks.splice(i, 1);
          return cbInfo.cb;
        }
      }
    }
    function incTaskCount(taskType) {
      taskType = taskType || DEFAULT_TASK_TYPE;
      taskCounts[taskType] = (taskCounts[taskType] || 0) + 1;
      taskCounts[ALL_TASKS_TYPE] = (taskCounts[ALL_TASKS_TYPE] || 0) + 1;
    }
    function notifyWhenNoPendingTasks(callback, taskType) {
      taskType = taskType || ALL_TASKS_TYPE;
      if (!taskCounts[taskType]) {
        callback();
      } else {
        taskCallbacks.push({ type: taskType, cb: callback });
      }
    }
  }
  var $templateRequestMinErr = minErr("$templateRequest");
  function $TemplateRequestProvider() {
    var httpOptions;
    this.httpOptions = function(val) {
      if (val) {
        httpOptions = val;
        return this;
      }
      return httpOptions;
    };
    this.$get = [
      "$exceptionHandler",
      "$templateCache",
      "$http",
      "$q",
      "$sce",
      function($exceptionHandler, $templateCache, $http, $q, $sce) {
        function handleRequestFn(tpl, ignoreRequestError) {
          handleRequestFn.totalPendingRequests++;
          if (!isString(tpl) || isUndefined($templateCache.get(tpl))) {
            tpl = $sce.getTrustedResourceUrl(tpl);
          }
          var transformResponse = $http.defaults && $http.defaults.transformResponse;
          if (isArray(transformResponse)) {
            transformResponse = transformResponse.filter(function(transformer) {
              return transformer !== defaultHttpResponseTransform;
            });
          } else if (transformResponse === defaultHttpResponseTransform) {
            transformResponse = null;
          }
          return $http.get(tpl, extend({
            cache: $templateCache,
            transformResponse
          }, httpOptions)).finally(function() {
            handleRequestFn.totalPendingRequests--;
          }).then(function(response) {
            return $templateCache.put(tpl, response.data);
          }, handleError);
          function handleError(resp) {
            if (!ignoreRequestError) {
              resp = $templateRequestMinErr("tpload", "Failed to load template: {0} (HTTP status: {1} {2})", tpl, resp.status, resp.statusText);
              $exceptionHandler(resp);
            }
            return $q.reject(resp);
          }
        }
        handleRequestFn.totalPendingRequests = 0;
        return handleRequestFn;
      }
    ];
  }
  function $$TestabilityProvider() {
    this.$get = [
      "$rootScope",
      "$browser",
      "$location",
      function($rootScope, $browser, $location) {
        var testability = {};
        testability.findBindings = function(element, expression, opt_exactMatch) {
          var bindings = element.getElementsByClassName("ng-binding");
          var matches = [];
          forEach(bindings, function(binding) {
            var dataBinding = angular2.element(binding).data("$binding");
            if (dataBinding) {
              forEach(dataBinding, function(bindingName) {
                if (opt_exactMatch) {
                  var matcher = new RegExp("(^|\\s)" + escapeForRegexp(expression) + "(\\s|\\||$)");
                  if (matcher.test(bindingName)) {
                    matches.push(binding);
                  }
                } else {
                  if (bindingName.indexOf(expression) !== -1) {
                    matches.push(binding);
                  }
                }
              });
            }
          });
          return matches;
        };
        testability.findModels = function(element, expression, opt_exactMatch) {
          var prefixes = ["ng-", "data-ng-", "ng\\:"];
          for (var p = 0; p < prefixes.length; ++p) {
            var attributeEquals = opt_exactMatch ? "=" : "*=";
            var selector = "[" + prefixes[p] + "model" + attributeEquals + '"' + expression + '"]';
            var elements = element.querySelectorAll(selector);
            if (elements.length) {
              return elements;
            }
          }
        };
        testability.getLocation = function() {
          return $location.url();
        };
        testability.setLocation = function(url) {
          if (url !== $location.url()) {
            $location.url(url);
            $rootScope.$digest();
          }
        };
        testability.whenStable = function(callback) {
          $browser.notifyWhenNoOutstandingRequests(callback);
        };
        return testability;
      }
    ];
  }
  var $timeoutMinErr = minErr("$timeout");
  function $TimeoutProvider() {
    this.$get = [
      "$rootScope",
      "$browser",
      "$q",
      "$$q",
      "$exceptionHandler",
      function($rootScope, $browser, $q, $$q, $exceptionHandler) {
        var deferreds = {};
        function timeout(fn, delay, invokeApply) {
          if (!isFunction(fn)) {
            invokeApply = delay;
            delay = fn;
            fn = noop;
          }
          var args = sliceArgs(arguments, 3), skipApply = isDefined(invokeApply) && !invokeApply, deferred = (skipApply ? $$q : $q).defer(), promise = deferred.promise, timeoutId;
          timeoutId = $browser.defer(function() {
            try {
              deferred.resolve(fn.apply(null, args));
            } catch (e) {
              deferred.reject(e);
              $exceptionHandler(e);
            } finally {
              delete deferreds[promise.$$timeoutId];
            }
            if (!skipApply)
              $rootScope.$apply();
          }, delay, "$timeout");
          promise.$$timeoutId = timeoutId;
          deferreds[timeoutId] = deferred;
          return promise;
        }
        timeout.cancel = function(promise) {
          if (!promise)
            return false;
          if (!promise.hasOwnProperty("$$timeoutId")) {
            throw $timeoutMinErr("badprom", "`$timeout.cancel()` called with a promise that was not generated by `$timeout()`.");
          }
          if (!deferreds.hasOwnProperty(promise.$$timeoutId))
            return false;
          var id = promise.$$timeoutId;
          var deferred = deferreds[id];
          markQExceptionHandled(deferred.promise);
          deferred.reject("canceled");
          delete deferreds[id];
          return $browser.defer.cancel(id);
        };
        return timeout;
      }
    ];
  }
  var urlParsingNode = window2.document.createElement("a");
  var originUrl = urlResolve(window2.location.href);
  var baseUrlParsingNode;
  urlParsingNode.href = "http://[::1]";
  var ipv6InBrackets = urlParsingNode.hostname === "[::1]";
  function urlResolve(url) {
    if (!isString(url))
      return url;
    var href = url;
    if (msie) {
      urlParsingNode.setAttribute("href", href);
      href = urlParsingNode.href;
    }
    urlParsingNode.setAttribute("href", href);
    var hostname = urlParsingNode.hostname;
    if (!ipv6InBrackets && hostname.indexOf(":") > -1) {
      hostname = "[" + hostname + "]";
    }
    return {
      href: urlParsingNode.href,
      protocol: urlParsingNode.protocol ? urlParsingNode.protocol.replace(/:$/, "") : "",
      host: urlParsingNode.host,
      search: urlParsingNode.search ? urlParsingNode.search.replace(/^\?/, "") : "",
      hash: urlParsingNode.hash ? urlParsingNode.hash.replace(/^#/, "") : "",
      hostname,
      port: urlParsingNode.port,
      pathname: urlParsingNode.pathname.charAt(0) === "/" ? urlParsingNode.pathname : "/" + urlParsingNode.pathname
    };
  }
  function urlIsSameOrigin(requestUrl) {
    return urlsAreSameOrigin(requestUrl, originUrl);
  }
  function urlIsSameOriginAsBaseUrl(requestUrl) {
    return urlsAreSameOrigin(requestUrl, getBaseUrl());
  }
  function urlIsAllowedOriginFactory(trustedOriginUrls) {
    var parsedAllowedOriginUrls = [originUrl].concat(trustedOriginUrls.map(urlResolve));
    return function urlIsAllowedOrigin(requestUrl) {
      var parsedUrl = urlResolve(requestUrl);
      return parsedAllowedOriginUrls.some(urlsAreSameOrigin.bind(null, parsedUrl));
    };
  }
  function urlsAreSameOrigin(url1, url2) {
    url1 = urlResolve(url1);
    url2 = urlResolve(url2);
    return url1.protocol === url2.protocol && url1.host === url2.host;
  }
  function getBaseUrl() {
    if (window2.document.baseURI) {
      return window2.document.baseURI;
    }
    if (!baseUrlParsingNode) {
      baseUrlParsingNode = window2.document.createElement("a");
      baseUrlParsingNode.href = ".";
      baseUrlParsingNode = baseUrlParsingNode.cloneNode(false);
    }
    return baseUrlParsingNode.href;
  }
  function $WindowProvider() {
    this.$get = valueFn(window2);
  }
  function $$CookieReader($document) {
    var rawDocument = $document[0] || {};
    var lastCookies = {};
    var lastCookieString = "";
    function safeGetCookie(rawDocument2) {
      try {
        return rawDocument2.cookie || "";
      } catch (e) {
        return "";
      }
    }
    function safeDecodeURIComponent(str) {
      try {
        return decodeURIComponent(str);
      } catch (e) {
        return str;
      }
    }
    return function() {
      var cookieArray, cookie, i, index, name;
      var currentCookieString = safeGetCookie(rawDocument);
      if (currentCookieString !== lastCookieString) {
        lastCookieString = currentCookieString;
        cookieArray = lastCookieString.split("; ");
        lastCookies = {};
        for (i = 0; i < cookieArray.length; i++) {
          cookie = cookieArray[i];
          index = cookie.indexOf("=");
          if (index > 0) {
            name = safeDecodeURIComponent(cookie.substring(0, index));
            if (isUndefined(lastCookies[name])) {
              lastCookies[name] = safeDecodeURIComponent(cookie.substring(index + 1));
            }
          }
        }
      }
      return lastCookies;
    };
  }
  $$CookieReader.$inject = ["$document"];
  function $$CookieReaderProvider() {
    this.$get = $$CookieReader;
  }
  $FilterProvider.$inject = ["$provide"];
  function $FilterProvider($provide) {
    var suffix = "Filter";
    function register(name, factory) {
      if (isObject(name)) {
        var filters = {};
        forEach(name, function(filter, key2) {
          filters[key2] = register(key2, filter);
        });
        return filters;
      } else {
        return $provide.factory(name + suffix, factory);
      }
    }
    this.register = register;
    this.$get = ["$injector", function($injector) {
      return function(name) {
        return $injector.get(name + suffix);
      };
    }];
    register("currency", currencyFilter);
    register("date", dateFilter);
    register("filter", filterFilter);
    register("json", jsonFilter);
    register("limitTo", limitToFilter);
    register("lowercase", lowercaseFilter);
    register("number", numberFilter);
    register("orderBy", orderByFilter);
    register("uppercase", uppercaseFilter);
  }
  function filterFilter() {
    return function(array, expression, comparator, anyPropertyKey) {
      if (!isArrayLike(array)) {
        if (array == null) {
          return array;
        } else {
          throw minErr("filter")("notarray", "Expected array but received: {0}", array);
        }
      }
      anyPropertyKey = anyPropertyKey || "$";
      var expressionType = getTypeForFilter(expression);
      var predicateFn;
      var matchAgainstAnyProp;
      switch (expressionType) {
        case "function":
          predicateFn = expression;
          break;
        case "boolean":
        case "null":
        case "number":
        case "string":
          matchAgainstAnyProp = true;
        case "object":
          predicateFn = createPredicateFn(expression, comparator, anyPropertyKey, matchAgainstAnyProp);
          break;
        default:
          return array;
      }
      return Array.prototype.filter.call(array, predicateFn);
    };
  }
  function createPredicateFn(expression, comparator, anyPropertyKey, matchAgainstAnyProp) {
    var shouldMatchPrimitives = isObject(expression) && anyPropertyKey in expression;
    var predicateFn;
    if (comparator === true) {
      comparator = equals;
    } else if (!isFunction(comparator)) {
      comparator = function(actual, expected) {
        if (isUndefined(actual)) {
          return false;
        }
        if (actual === null || expected === null) {
          return actual === expected;
        }
        if (isObject(expected) || isObject(actual) && !hasCustomToString(actual)) {
          return false;
        }
        actual = lowercase("" + actual);
        expected = lowercase("" + expected);
        return actual.indexOf(expected) !== -1;
      };
    }
    predicateFn = function(item) {
      if (shouldMatchPrimitives && !isObject(item)) {
        return deepCompare(item, expression[anyPropertyKey], comparator, anyPropertyKey, false);
      }
      return deepCompare(item, expression, comparator, anyPropertyKey, matchAgainstAnyProp);
    };
    return predicateFn;
  }
  function deepCompare(actual, expected, comparator, anyPropertyKey, matchAgainstAnyProp, dontMatchWholeObject) {
    var actualType = getTypeForFilter(actual);
    var expectedType = getTypeForFilter(expected);
    if (expectedType === "string" && expected.charAt(0) === "!") {
      return !deepCompare(actual, expected.substring(1), comparator, anyPropertyKey, matchAgainstAnyProp);
    } else if (isArray(actual)) {
      return actual.some(function(item) {
        return deepCompare(item, expected, comparator, anyPropertyKey, matchAgainstAnyProp);
      });
    }
    switch (actualType) {
      case "object":
        var key2;
        if (matchAgainstAnyProp) {
          for (key2 in actual) {
            if (key2.charAt && key2.charAt(0) !== "$" && deepCompare(actual[key2], expected, comparator, anyPropertyKey, true)) {
              return true;
            }
          }
          return dontMatchWholeObject ? false : deepCompare(actual, expected, comparator, anyPropertyKey, false);
        } else if (expectedType === "object") {
          for (key2 in expected) {
            var expectedVal = expected[key2];
            if (isFunction(expectedVal) || isUndefined(expectedVal)) {
              continue;
            }
            var matchAnyProperty = key2 === anyPropertyKey;
            var actualVal = matchAnyProperty ? actual : actual[key2];
            if (!deepCompare(actualVal, expectedVal, comparator, anyPropertyKey, matchAnyProperty, matchAnyProperty)) {
              return false;
            }
          }
          return true;
        } else {
          return comparator(actual, expected);
        }
      case "function":
        return false;
      default:
        return comparator(actual, expected);
    }
  }
  function getTypeForFilter(val) {
    return val === null ? "null" : typeof val;
  }
  var MAX_DIGITS = 22;
  var DECIMAL_SEP = ".";
  var ZERO_CHAR = "0";
  currencyFilter.$inject = ["$locale"];
  function currencyFilter($locale) {
    var formats = $locale.NUMBER_FORMATS;
    return function(amount, currencySymbol, fractionSize) {
      if (isUndefined(currencySymbol)) {
        currencySymbol = formats.CURRENCY_SYM;
      }
      if (isUndefined(fractionSize)) {
        fractionSize = formats.PATTERNS[1].maxFrac;
      }
      var currencySymbolRe = !currencySymbol ? /\s*\u00A4\s*/g : /\u00A4/g;
      return amount == null ? amount : formatNumber(amount, formats.PATTERNS[1], formats.GROUP_SEP, formats.DECIMAL_SEP, fractionSize).replace(currencySymbolRe, currencySymbol);
    };
  }
  numberFilter.$inject = ["$locale"];
  function numberFilter($locale) {
    var formats = $locale.NUMBER_FORMATS;
    return function(number, fractionSize) {
      return number == null ? number : formatNumber(number, formats.PATTERNS[0], formats.GROUP_SEP, formats.DECIMAL_SEP, fractionSize);
    };
  }
  function parse(numStr) {
    var exponent = 0, digits, numberOfIntegerDigits;
    var i, j, zeros;
    if ((numberOfIntegerDigits = numStr.indexOf(DECIMAL_SEP)) > -1) {
      numStr = numStr.replace(DECIMAL_SEP, "");
    }
    if ((i = numStr.search(/e/i)) > 0) {
      if (numberOfIntegerDigits < 0)
        numberOfIntegerDigits = i;
      numberOfIntegerDigits += +numStr.slice(i + 1);
      numStr = numStr.substring(0, i);
    } else if (numberOfIntegerDigits < 0) {
      numberOfIntegerDigits = numStr.length;
    }
    for (i = 0; numStr.charAt(i) === ZERO_CHAR; i++) {
    }
    if (i === (zeros = numStr.length)) {
      digits = [0];
      numberOfIntegerDigits = 1;
    } else {
      zeros--;
      while (numStr.charAt(zeros) === ZERO_CHAR)
        zeros--;
      numberOfIntegerDigits -= i;
      digits = [];
      for (j = 0; i <= zeros; i++, j++) {
        digits[j] = +numStr.charAt(i);
      }
    }
    if (numberOfIntegerDigits > MAX_DIGITS) {
      digits = digits.splice(0, MAX_DIGITS - 1);
      exponent = numberOfIntegerDigits - 1;
      numberOfIntegerDigits = 1;
    }
    return { d: digits, e: exponent, i: numberOfIntegerDigits };
  }
  function roundNumber(parsedNumber, fractionSize, minFrac, maxFrac) {
    var digits = parsedNumber.d;
    var fractionLen = digits.length - parsedNumber.i;
    fractionSize = isUndefined(fractionSize) ? Math.min(Math.max(minFrac, fractionLen), maxFrac) : +fractionSize;
    var roundAt = fractionSize + parsedNumber.i;
    var digit = digits[roundAt];
    if (roundAt > 0) {
      digits.splice(Math.max(parsedNumber.i, roundAt));
      for (var j = roundAt; j < digits.length; j++) {
        digits[j] = 0;
      }
    } else {
      fractionLen = Math.max(0, fractionLen);
      parsedNumber.i = 1;
      digits.length = Math.max(1, roundAt = fractionSize + 1);
      digits[0] = 0;
      for (var i = 1; i < roundAt; i++)
        digits[i] = 0;
    }
    if (digit >= 5) {
      if (roundAt - 1 < 0) {
        for (var k = 0; k > roundAt; k--) {
          digits.unshift(0);
          parsedNumber.i++;
        }
        digits.unshift(1);
        parsedNumber.i++;
      } else {
        digits[roundAt - 1]++;
      }
    }
    for (; fractionLen < Math.max(0, fractionSize); fractionLen++)
      digits.push(0);
    var carry = digits.reduceRight(function(carry2, d, i2, digits2) {
      d = d + carry2;
      digits2[i2] = d % 10;
      return Math.floor(d / 10);
    }, 0);
    if (carry) {
      digits.unshift(carry);
      parsedNumber.i++;
    }
  }
  function formatNumber(number, pattern, groupSep, decimalSep, fractionSize) {
    if (!(isString(number) || isNumber(number)) || isNaN(number))
      return "";
    var isInfinity = !isFinite(number);
    var isZero = false;
    var numStr = Math.abs(number) + "", formattedText = "", parsedNumber;
    if (isInfinity) {
      formattedText = "\u221E";
    } else {
      parsedNumber = parse(numStr);
      roundNumber(parsedNumber, fractionSize, pattern.minFrac, pattern.maxFrac);
      var digits = parsedNumber.d;
      var integerLen = parsedNumber.i;
      var exponent = parsedNumber.e;
      var decimals = [];
      isZero = digits.reduce(function(isZero2, d) {
        return isZero2 && !d;
      }, true);
      while (integerLen < 0) {
        digits.unshift(0);
        integerLen++;
      }
      if (integerLen > 0) {
        decimals = digits.splice(integerLen, digits.length);
      } else {
        decimals = digits;
        digits = [0];
      }
      var groups = [];
      if (digits.length >= pattern.lgSize) {
        groups.unshift(digits.splice(-pattern.lgSize, digits.length).join(""));
      }
      while (digits.length > pattern.gSize) {
        groups.unshift(digits.splice(-pattern.gSize, digits.length).join(""));
      }
      if (digits.length) {
        groups.unshift(digits.join(""));
      }
      formattedText = groups.join(groupSep);
      if (decimals.length) {
        formattedText += decimalSep + decimals.join("");
      }
      if (exponent) {
        formattedText += "e+" + exponent;
      }
    }
    if (number < 0 && !isZero) {
      return pattern.negPre + formattedText + pattern.negSuf;
    } else {
      return pattern.posPre + formattedText + pattern.posSuf;
    }
  }
  function padNumber(num, digits, trim2, negWrap) {
    var neg = "";
    if (num < 0 || negWrap && num <= 0) {
      if (negWrap) {
        num = -num + 1;
      } else {
        num = -num;
        neg = "-";
      }
    }
    num = "" + num;
    while (num.length < digits)
      num = ZERO_CHAR + num;
    if (trim2) {
      num = num.substr(num.length - digits);
    }
    return neg + num;
  }
  function dateGetter(name, size, offset, trim2, negWrap) {
    offset = offset || 0;
    return function(date) {
      var value = date["get" + name]();
      if (offset > 0 || value > -offset) {
        value += offset;
      }
      if (value === 0 && offset === -12)
        value = 12;
      return padNumber(value, size, trim2, negWrap);
    };
  }
  function dateStrGetter(name, shortForm, standAlone) {
    return function(date, formats) {
      var value = date["get" + name]();
      var propPrefix = (standAlone ? "STANDALONE" : "") + (shortForm ? "SHORT" : "");
      var get = uppercase(propPrefix + name);
      return formats[get][value];
    };
  }
  function timeZoneGetter(date, formats, offset) {
    var zone = -1 * offset;
    var paddedZone = zone >= 0 ? "+" : "";
    paddedZone += padNumber(Math[zone > 0 ? "floor" : "ceil"](zone / 60), 2) + padNumber(Math.abs(zone % 60), 2);
    return paddedZone;
  }
  function getFirstThursdayOfYear(year) {
    var dayOfWeekOnFirst = new Date(year, 0, 1).getDay();
    return new Date(year, 0, (dayOfWeekOnFirst <= 4 ? 5 : 12) - dayOfWeekOnFirst);
  }
  function getThursdayThisWeek(datetime) {
    return new Date(datetime.getFullYear(), datetime.getMonth(), datetime.getDate() + (4 - datetime.getDay()));
  }
  function weekGetter(size) {
    return function(date) {
      var firstThurs = getFirstThursdayOfYear(date.getFullYear()), thisThurs = getThursdayThisWeek(date);
      var diff = +thisThurs - +firstThurs, result = 1 + Math.round(diff / 6048e5);
      return padNumber(result, size);
    };
  }
  function ampmGetter(date, formats) {
    return date.getHours() < 12 ? formats.AMPMS[0] : formats.AMPMS[1];
  }
  function eraGetter(date, formats) {
    return date.getFullYear() <= 0 ? formats.ERAS[0] : formats.ERAS[1];
  }
  function longEraGetter(date, formats) {
    return date.getFullYear() <= 0 ? formats.ERANAMES[0] : formats.ERANAMES[1];
  }
  var DATE_FORMATS = {
    yyyy: dateGetter("FullYear", 4, 0, false, true),
    yy: dateGetter("FullYear", 2, 0, true, true),
    y: dateGetter("FullYear", 1, 0, false, true),
    MMMM: dateStrGetter("Month"),
    MMM: dateStrGetter("Month", true),
    MM: dateGetter("Month", 2, 1),
    M: dateGetter("Month", 1, 1),
    LLLL: dateStrGetter("Month", false, true),
    dd: dateGetter("Date", 2),
    d: dateGetter("Date", 1),
    HH: dateGetter("Hours", 2),
    H: dateGetter("Hours", 1),
    hh: dateGetter("Hours", 2, -12),
    h: dateGetter("Hours", 1, -12),
    mm: dateGetter("Minutes", 2),
    m: dateGetter("Minutes", 1),
    ss: dateGetter("Seconds", 2),
    s: dateGetter("Seconds", 1),
    sss: dateGetter("Milliseconds", 3),
    EEEE: dateStrGetter("Day"),
    EEE: dateStrGetter("Day", true),
    a: ampmGetter,
    Z: timeZoneGetter,
    ww: weekGetter(2),
    w: weekGetter(1),
    G: eraGetter,
    GG: eraGetter,
    GGG: eraGetter,
    GGGG: longEraGetter
  };
  var DATE_FORMATS_SPLIT = /((?:[^yMLdHhmsaZEwG']+)|(?:'(?:[^']|'')*')|(?:E+|y+|M+|L+|d+|H+|h+|m+|s+|a|Z|G+|w+))([\s\S]*)/, NUMBER_STRING = /^-?\d+$/;
  dateFilter.$inject = ["$locale"];
  function dateFilter($locale) {
    var R_ISO8601_STR = /^(\d{4})-?(\d\d)-?(\d\d)(?:T(\d\d)(?::?(\d\d)(?::?(\d\d)(?:\.(\d+))?)?)?(Z|([+-])(\d\d):?(\d\d))?)?$/;
    function jsonStringToDate(string) {
      var match;
      if (match = string.match(R_ISO8601_STR)) {
        var date = new Date(0), tzHour = 0, tzMin = 0, dateSetter = match[8] ? date.setUTCFullYear : date.setFullYear, timeSetter = match[8] ? date.setUTCHours : date.setHours;
        if (match[9]) {
          tzHour = toInt(match[9] + match[10]);
          tzMin = toInt(match[9] + match[11]);
        }
        dateSetter.call(date, toInt(match[1]), toInt(match[2]) - 1, toInt(match[3]));
        var h2 = toInt(match[4] || 0) - tzHour;
        var m = toInt(match[5] || 0) - tzMin;
        var s = toInt(match[6] || 0);
        var ms = Math.round(parseFloat("0." + (match[7] || 0)) * 1e3);
        timeSetter.call(date, h2, m, s, ms);
        return date;
      }
      return string;
    }
    return function(date, format, timezone) {
      var text = "", parts = [], fn, match;
      format = format || "mediumDate";
      format = $locale.DATETIME_FORMATS[format] || format;
      if (isString(date)) {
        date = NUMBER_STRING.test(date) ? toInt(date) : jsonStringToDate(date);
      }
      if (isNumber(date)) {
        date = new Date(date);
      }
      if (!isDate(date) || !isFinite(date.getTime())) {
        return date;
      }
      while (format) {
        match = DATE_FORMATS_SPLIT.exec(format);
        if (match) {
          parts = concat(parts, match, 1);
          format = parts.pop();
        } else {
          parts.push(format);
          format = null;
        }
      }
      var dateTimezoneOffset = date.getTimezoneOffset();
      if (timezone) {
        dateTimezoneOffset = timezoneToOffset(timezone, dateTimezoneOffset);
        date = convertTimezoneToLocal(date, timezone, true);
      }
      forEach(parts, function(value) {
        fn = DATE_FORMATS[value];
        text += fn ? fn(date, $locale.DATETIME_FORMATS, dateTimezoneOffset) : value === "''" ? "'" : value.replace(/(^'|'$)/g, "").replace(/''/g, "'");
      });
      return text;
    };
  }
  function jsonFilter() {
    return function(object, spacing) {
      if (isUndefined(spacing)) {
        spacing = 2;
      }
      return toJson(object, spacing);
    };
  }
  var lowercaseFilter = valueFn(lowercase);
  var uppercaseFilter = valueFn(uppercase);
  function limitToFilter() {
    return function(input, limit, begin) {
      if (Math.abs(Number(limit)) === Infinity) {
        limit = Number(limit);
      } else {
        limit = toInt(limit);
      }
      if (isNumberNaN(limit))
        return input;
      if (isNumber(input))
        input = input.toString();
      if (!isArrayLike(input))
        return input;
      begin = !begin || isNaN(begin) ? 0 : toInt(begin);
      begin = begin < 0 ? Math.max(0, input.length + begin) : begin;
      if (limit >= 0) {
        return sliceFn(input, begin, begin + limit);
      } else {
        if (begin === 0) {
          return sliceFn(input, limit, input.length);
        } else {
          return sliceFn(input, Math.max(0, begin + limit), begin);
        }
      }
    };
  }
  function sliceFn(input, begin, end) {
    if (isString(input))
      return input.slice(begin, end);
    return slice.call(input, begin, end);
  }
  orderByFilter.$inject = ["$parse"];
  function orderByFilter($parse) {
    return function(array, sortPredicate, reverseOrder, compareFn) {
      if (array == null)
        return array;
      if (!isArrayLike(array)) {
        throw minErr("orderBy")("notarray", "Expected array but received: {0}", array);
      }
      if (!isArray(sortPredicate)) {
        sortPredicate = [sortPredicate];
      }
      if (sortPredicate.length === 0) {
        sortPredicate = ["+"];
      }
      var predicates = processPredicates(sortPredicate);
      var descending = reverseOrder ? -1 : 1;
      var compare = isFunction(compareFn) ? compareFn : defaultCompare;
      var compareValues = Array.prototype.map.call(array, getComparisonObject);
      compareValues.sort(doComparison);
      array = compareValues.map(function(item) {
        return item.value;
      });
      return array;
      function getComparisonObject(value, index) {
        return {
          value,
          tieBreaker: { value: index, type: "number", index },
          predicateValues: predicates.map(function(predicate) {
            return getPredicateValue(predicate.get(value), index);
          })
        };
      }
      function doComparison(v1, v2) {
        for (var i = 0, ii = predicates.length; i < ii; i++) {
          var result = compare(v1.predicateValues[i], v2.predicateValues[i]);
          if (result) {
            return result * predicates[i].descending * descending;
          }
        }
        return (compare(v1.tieBreaker, v2.tieBreaker) || defaultCompare(v1.tieBreaker, v2.tieBreaker)) * descending;
      }
    };
    function processPredicates(sortPredicates) {
      return sortPredicates.map(function(predicate) {
        var descending = 1, get = identity;
        if (isFunction(predicate)) {
          get = predicate;
        } else if (isString(predicate)) {
          if (predicate.charAt(0) === "+" || predicate.charAt(0) === "-") {
            descending = predicate.charAt(0) === "-" ? -1 : 1;
            predicate = predicate.substring(1);
          }
          if (predicate !== "") {
            get = $parse(predicate);
            if (get.constant) {
              var key2 = get();
              get = function(value) {
                return value[key2];
              };
            }
          }
        }
        return { get, descending };
      });
    }
    function isPrimitive(value) {
      switch (typeof value) {
        case "number":
        case "boolean":
        case "string":
          return true;
        default:
          return false;
      }
    }
    function objectValue(value) {
      if (isFunction(value.valueOf)) {
        value = value.valueOf();
        if (isPrimitive(value))
          return value;
      }
      if (hasCustomToString(value)) {
        value = value.toString();
        if (isPrimitive(value))
          return value;
      }
      return value;
    }
    function getPredicateValue(value, index) {
      var type = typeof value;
      if (value === null) {
        type = "null";
      } else if (type === "object") {
        value = objectValue(value);
      }
      return { value, type, index };
    }
    function defaultCompare(v1, v2) {
      var result = 0;
      var type1 = v1.type;
      var type2 = v2.type;
      if (type1 === type2) {
        var value1 = v1.value;
        var value2 = v2.value;
        if (type1 === "string") {
          value1 = value1.toLowerCase();
          value2 = value2.toLowerCase();
        } else if (type1 === "object") {
          if (isObject(value1))
            value1 = v1.index;
          if (isObject(value2))
            value2 = v2.index;
        }
        if (value1 !== value2) {
          result = value1 < value2 ? -1 : 1;
        }
      } else {
        result = type1 === "undefined" ? 1 : type2 === "undefined" ? -1 : type1 === "null" ? 1 : type2 === "null" ? -1 : type1 < type2 ? -1 : 1;
      }
      return result;
    }
  }
  function ngDirective(directive) {
    if (isFunction(directive)) {
      directive = {
        link: directive
      };
    }
    directive.restrict = directive.restrict || "AC";
    return valueFn(directive);
  }
  var htmlAnchorDirective = valueFn({
    restrict: "E",
    compile: function(element, attr) {
      if (!attr.href && !attr.xlinkHref) {
        return function(scope, element2) {
          if (element2[0].nodeName.toLowerCase() !== "a")
            return;
          var href = toString.call(element2.prop("href")) === "[object SVGAnimatedString]" ? "xlink:href" : "href";
          element2.on("click", function(event) {
            if (!element2.attr(href)) {
              event.preventDefault();
            }
          });
        };
      }
    }
  });
  var ngAttributeAliasDirectives = {};
  forEach(BOOLEAN_ATTR, function(propName, attrName) {
    if (propName === "multiple")
      return;
    function defaultLinkFn(scope, element, attr) {
      scope.$watch(attr[normalized], function ngBooleanAttrWatchAction(value) {
        attr.$set(attrName, !!value);
      });
    }
    var normalized = directiveNormalize("ng-" + attrName);
    var linkFn = defaultLinkFn;
    if (propName === "checked") {
      linkFn = function(scope, element, attr) {
        if (attr.ngModel !== attr[normalized]) {
          defaultLinkFn(scope, element, attr);
        }
      };
    }
    ngAttributeAliasDirectives[normalized] = function() {
      return {
        restrict: "A",
        priority: 100,
        link: linkFn
      };
    };
  });
  forEach(ALIASED_ATTR, function(htmlAttr, ngAttr) {
    ngAttributeAliasDirectives[ngAttr] = function() {
      return {
        priority: 100,
        link: function(scope, element, attr) {
          if (ngAttr === "ngPattern" && attr.ngPattern.charAt(0) === "/") {
            var match = attr.ngPattern.match(REGEX_STRING_REGEXP);
            if (match) {
              attr.$set("ngPattern", new RegExp(match[1], match[2]));
              return;
            }
          }
          scope.$watch(attr[ngAttr], function ngAttrAliasWatchAction(value) {
            attr.$set(ngAttr, value);
          });
        }
      };
    };
  });
  forEach(["src", "srcset", "href"], function(attrName) {
    var normalized = directiveNormalize("ng-" + attrName);
    ngAttributeAliasDirectives[normalized] = ["$sce", function($sce) {
      return {
        priority: 99,
        link: function(scope, element, attr) {
          var propName = attrName, name = attrName;
          if (attrName === "href" && toString.call(element.prop("href")) === "[object SVGAnimatedString]") {
            name = "xlinkHref";
            attr.$attr[name] = "xlink:href";
            propName = null;
          }
          attr.$set(normalized, $sce.getTrustedMediaUrl(attr[normalized]));
          attr.$observe(normalized, function(value) {
            if (!value) {
              if (attrName === "href") {
                attr.$set(name, null);
              }
              return;
            }
            attr.$set(name, value);
            if (msie && propName)
              element.prop(propName, attr[name]);
          });
        }
      };
    }];
  });
  var nullFormCtrl = {
    $addControl: noop,
    $getControls: valueFn([]),
    $$renameControl: nullFormRenameControl,
    $removeControl: noop,
    $setValidity: noop,
    $setDirty: noop,
    $setPristine: noop,
    $setSubmitted: noop,
    $$setSubmitted: noop
  }, PENDING_CLASS = "ng-pending", SUBMITTED_CLASS = "ng-submitted";
  function nullFormRenameControl(control, name) {
    control.$name = name;
  }
  FormController.$inject = ["$element", "$attrs", "$scope", "$animate", "$interpolate"];
  function FormController($element, $attrs, $scope, $animate, $interpolate) {
    this.$$controls = [];
    this.$error = {};
    this.$$success = {};
    this.$pending = void 0;
    this.$name = $interpolate($attrs.name || $attrs.ngForm || "")($scope);
    this.$dirty = false;
    this.$pristine = true;
    this.$valid = true;
    this.$invalid = false;
    this.$submitted = false;
    this.$$parentForm = nullFormCtrl;
    this.$$element = $element;
    this.$$animate = $animate;
    setupValidity(this);
  }
  FormController.prototype = {
    $rollbackViewValue: function() {
      forEach(this.$$controls, function(control) {
        control.$rollbackViewValue();
      });
    },
    $commitViewValue: function() {
      forEach(this.$$controls, function(control) {
        control.$commitViewValue();
      });
    },
    $addControl: function(control) {
      assertNotHasOwnProperty(control.$name, "input");
      this.$$controls.push(control);
      if (control.$name) {
        this[control.$name] = control;
      }
      control.$$parentForm = this;
    },
    $getControls: function() {
      return shallowCopy(this.$$controls);
    },
    $$renameControl: function(control, newName) {
      var oldName = control.$name;
      if (this[oldName] === control) {
        delete this[oldName];
      }
      this[newName] = control;
      control.$name = newName;
    },
    $removeControl: function(control) {
      if (control.$name && this[control.$name] === control) {
        delete this[control.$name];
      }
      forEach(this.$pending, function(value, name) {
        this.$setValidity(name, null, control);
      }, this);
      forEach(this.$error, function(value, name) {
        this.$setValidity(name, null, control);
      }, this);
      forEach(this.$$success, function(value, name) {
        this.$setValidity(name, null, control);
      }, this);
      arrayRemove(this.$$controls, control);
      control.$$parentForm = nullFormCtrl;
    },
    $setDirty: function() {
      this.$$animate.removeClass(this.$$element, PRISTINE_CLASS);
      this.$$animate.addClass(this.$$element, DIRTY_CLASS);
      this.$dirty = true;
      this.$pristine = false;
      this.$$parentForm.$setDirty();
    },
    $setPristine: function() {
      this.$$animate.setClass(this.$$element, PRISTINE_CLASS, DIRTY_CLASS + " " + SUBMITTED_CLASS);
      this.$dirty = false;
      this.$pristine = true;
      this.$submitted = false;
      forEach(this.$$controls, function(control) {
        control.$setPristine();
      });
    },
    $setUntouched: function() {
      forEach(this.$$controls, function(control) {
        control.$setUntouched();
      });
    },
    $setSubmitted: function() {
      var rootForm = this;
      while (rootForm.$$parentForm && rootForm.$$parentForm !== nullFormCtrl) {
        rootForm = rootForm.$$parentForm;
      }
      rootForm.$$setSubmitted();
    },
    $$setSubmitted: function() {
      this.$$animate.addClass(this.$$element, SUBMITTED_CLASS);
      this.$submitted = true;
      forEach(this.$$controls, function(control) {
        if (control.$$setSubmitted) {
          control.$$setSubmitted();
        }
      });
    }
  };
  addSetValidityMethod({
    clazz: FormController,
    set: function(object, property, controller) {
      var list = object[property];
      if (!list) {
        object[property] = [controller];
      } else {
        var index = list.indexOf(controller);
        if (index === -1) {
          list.push(controller);
        }
      }
    },
    unset: function(object, property, controller) {
      var list = object[property];
      if (!list) {
        return;
      }
      arrayRemove(list, controller);
      if (list.length === 0) {
        delete object[property];
      }
    }
  });
  var formDirectiveFactory = function(isNgForm) {
    return ["$timeout", "$parse", function($timeout, $parse) {
      var formDirective2 = {
        name: "form",
        restrict: isNgForm ? "EAC" : "E",
        require: ["form", "^^?form"],
        controller: FormController,
        compile: function ngFormCompile(formElement, attr) {
          formElement.addClass(PRISTINE_CLASS).addClass(VALID_CLASS);
          var nameAttr = attr.name ? "name" : isNgForm && attr.ngForm ? "ngForm" : false;
          return {
            pre: function ngFormPreLink(scope, formElement2, attr2, ctrls) {
              var controller = ctrls[0];
              if (!("action" in attr2)) {
                var handleFormSubmission = function(event) {
                  scope.$apply(function() {
                    controller.$commitViewValue();
                    controller.$setSubmitted();
                  });
                  event.preventDefault();
                };
                formElement2[0].addEventListener("submit", handleFormSubmission);
                formElement2.on("$destroy", function() {
                  $timeout(function() {
                    formElement2[0].removeEventListener("submit", handleFormSubmission);
                  }, 0, false);
                });
              }
              var parentFormCtrl = ctrls[1] || controller.$$parentForm;
              parentFormCtrl.$addControl(controller);
              var setter = nameAttr ? getSetter(controller.$name) : noop;
              if (nameAttr) {
                setter(scope, controller);
                attr2.$observe(nameAttr, function(newValue) {
                  if (controller.$name === newValue)
                    return;
                  setter(scope, void 0);
                  controller.$$parentForm.$$renameControl(controller, newValue);
                  setter = getSetter(controller.$name);
                  setter(scope, controller);
                });
              }
              formElement2.on("$destroy", function() {
                controller.$$parentForm.$removeControl(controller);
                setter(scope, void 0);
                extend(controller, nullFormCtrl);
              });
            }
          };
        }
      };
      return formDirective2;
      function getSetter(expression) {
        if (expression === "") {
          return $parse('this[""]').assign;
        }
        return $parse(expression).assign || noop;
      }
    }];
  };
  var formDirective = formDirectiveFactory();
  var ngFormDirective = formDirectiveFactory(true);
  function setupValidity(instance) {
    instance.$$classCache = {};
    instance.$$classCache[INVALID_CLASS] = !(instance.$$classCache[VALID_CLASS] = instance.$$element.hasClass(VALID_CLASS));
  }
  function addSetValidityMethod(context) {
    var clazz = context.clazz, set = context.set, unset = context.unset;
    clazz.prototype.$setValidity = function(validationErrorKey, state, controller) {
      if (isUndefined(state)) {
        createAndSet(this, "$pending", validationErrorKey, controller);
      } else {
        unsetAndCleanup(this, "$pending", validationErrorKey, controller);
      }
      if (!isBoolean(state)) {
        unset(this.$error, validationErrorKey, controller);
        unset(this.$$success, validationErrorKey, controller);
      } else {
        if (state) {
          unset(this.$error, validationErrorKey, controller);
          set(this.$$success, validationErrorKey, controller);
        } else {
          set(this.$error, validationErrorKey, controller);
          unset(this.$$success, validationErrorKey, controller);
        }
      }
      if (this.$pending) {
        cachedToggleClass(this, PENDING_CLASS, true);
        this.$valid = this.$invalid = void 0;
        toggleValidationCss(this, "", null);
      } else {
        cachedToggleClass(this, PENDING_CLASS, false);
        this.$valid = isObjectEmpty(this.$error);
        this.$invalid = !this.$valid;
        toggleValidationCss(this, "", this.$valid);
      }
      var combinedState;
      if (this.$pending && this.$pending[validationErrorKey]) {
        combinedState = void 0;
      } else if (this.$error[validationErrorKey]) {
        combinedState = false;
      } else if (this.$$success[validationErrorKey]) {
        combinedState = true;
      } else {
        combinedState = null;
      }
      toggleValidationCss(this, validationErrorKey, combinedState);
      this.$$parentForm.$setValidity(validationErrorKey, combinedState, this);
    };
    function createAndSet(ctrl, name, value, controller) {
      if (!ctrl[name]) {
        ctrl[name] = {};
      }
      set(ctrl[name], value, controller);
    }
    function unsetAndCleanup(ctrl, name, value, controller) {
      if (ctrl[name]) {
        unset(ctrl[name], value, controller);
      }
      if (isObjectEmpty(ctrl[name])) {
        ctrl[name] = void 0;
      }
    }
    function cachedToggleClass(ctrl, className, switchValue) {
      if (switchValue && !ctrl.$$classCache[className]) {
        ctrl.$$animate.addClass(ctrl.$$element, className);
        ctrl.$$classCache[className] = true;
      } else if (!switchValue && ctrl.$$classCache[className]) {
        ctrl.$$animate.removeClass(ctrl.$$element, className);
        ctrl.$$classCache[className] = false;
      }
    }
    function toggleValidationCss(ctrl, validationErrorKey, isValid) {
      validationErrorKey = validationErrorKey ? "-" + snake_case(validationErrorKey, "-") : "";
      cachedToggleClass(ctrl, VALID_CLASS + validationErrorKey, isValid === true);
      cachedToggleClass(ctrl, INVALID_CLASS + validationErrorKey, isValid === false);
    }
  }
  function isObjectEmpty(obj) {
    if (obj) {
      for (var prop in obj) {
        if (obj.hasOwnProperty(prop)) {
          return false;
        }
      }
    }
    return true;
  }
  var ISO_DATE_REGEXP = /^\d{4,}-[01]\d-[0-3]\dT[0-2]\d:[0-5]\d:[0-5]\d\.\d+(?:[+-][0-2]\d:[0-5]\d|Z)$/;
  var URL_REGEXP = /^[a-z][a-z\d.+-]*:\/*(?:[^:@]+(?::[^@]+)?@)?(?:[^\s:/?#]+|\[[a-f\d:]+])(?::\d+)?(?:\/[^?#]*)?(?:\?[^#]*)?(?:#.*)?$/i;
  var EMAIL_REGEXP = /^(?=.{1,254}$)(?=.{1,64}@)[-!#$%&'*+/0-9=?A-Z^_`a-z{|}~]+(\.[-!#$%&'*+/0-9=?A-Z^_`a-z{|}~]+)*@[A-Za-z0-9]([A-Za-z0-9-]{0,61}[A-Za-z0-9])?(\.[A-Za-z0-9]([A-Za-z0-9-]{0,61}[A-Za-z0-9])?)*$/;
  var NUMBER_REGEXP = /^\s*(-|\+)?(\d+|(\d*(\.\d*)))([eE][+-]?\d+)?\s*$/;
  var DATE_REGEXP = /^(\d{4,})-(\d{2})-(\d{2})$/;
  var DATETIMELOCAL_REGEXP = /^(\d{4,})-(\d\d)-(\d\d)T(\d\d):(\d\d)(?::(\d\d)(\.\d{1,3})?)?$/;
  var WEEK_REGEXP = /^(\d{4,})-W(\d\d)$/;
  var MONTH_REGEXP = /^(\d{4,})-(\d\d)$/;
  var TIME_REGEXP = /^(\d\d):(\d\d)(?::(\d\d)(\.\d{1,3})?)?$/;
  var PARTIAL_VALIDATION_EVENTS = "keydown wheel mousedown";
  var PARTIAL_VALIDATION_TYPES = createMap();
  forEach("date,datetime-local,month,time,week".split(","), function(type) {
    PARTIAL_VALIDATION_TYPES[type] = true;
  });
  var inputType = {
    "text": textInputType,
    "date": createDateInputType("date", DATE_REGEXP, createDateParser(DATE_REGEXP, ["yyyy", "MM", "dd"]), "yyyy-MM-dd"),
    "datetime-local": createDateInputType("datetimelocal", DATETIMELOCAL_REGEXP, createDateParser(DATETIMELOCAL_REGEXP, ["yyyy", "MM", "dd", "HH", "mm", "ss", "sss"]), "yyyy-MM-ddTHH:mm:ss.sss"),
    "time": createDateInputType("time", TIME_REGEXP, createDateParser(TIME_REGEXP, ["HH", "mm", "ss", "sss"]), "HH:mm:ss.sss"),
    "week": createDateInputType("week", WEEK_REGEXP, weekParser, "yyyy-Www"),
    "month": createDateInputType("month", MONTH_REGEXP, createDateParser(MONTH_REGEXP, ["yyyy", "MM"]), "yyyy-MM"),
    "number": numberInputType,
    "url": urlInputType,
    "email": emailInputType,
    "radio": radioInputType,
    "range": rangeInputType,
    "checkbox": checkboxInputType,
    "hidden": noop,
    "button": noop,
    "submit": noop,
    "reset": noop,
    "file": noop
  };
  function stringBasedInputType(ctrl) {
    ctrl.$formatters.push(function(value) {
      return ctrl.$isEmpty(value) ? value : value.toString();
    });
  }
  function textInputType(scope, element, attr, ctrl, $sniffer, $browser) {
    baseInputType(scope, element, attr, ctrl, $sniffer, $browser);
    stringBasedInputType(ctrl);
  }
  function baseInputType(scope, element, attr, ctrl, $sniffer, $browser) {
    var type = lowercase(element[0].type);
    if (!$sniffer.android) {
      var composing = false;
      element.on("compositionstart", function() {
        composing = true;
      });
      element.on("compositionupdate", function(ev) {
        if (isUndefined(ev.data) || ev.data === "") {
          composing = false;
        }
      });
      element.on("compositionend", function() {
        composing = false;
        listener();
      });
    }
    var timeout;
    var listener = function(ev) {
      if (timeout) {
        $browser.defer.cancel(timeout);
        timeout = null;
      }
      if (composing)
        return;
      var value = element.val(), event = ev && ev.type;
      if (type !== "password" && (!attr.ngTrim || attr.ngTrim !== "false")) {
        value = trim(value);
      }
      if (ctrl.$viewValue !== value || value === "" && ctrl.$$hasNativeValidators) {
        ctrl.$setViewValue(value, event);
      }
    };
    if ($sniffer.hasEvent("input")) {
      element.on("input", listener);
    } else {
      var deferListener = function(ev, input, origValue) {
        if (!timeout) {
          timeout = $browser.defer(function() {
            timeout = null;
            if (!input || input.value !== origValue) {
              listener(ev);
            }
          });
        }
      };
      element.on("keydown", function(event) {
        var key2 = event.keyCode;
        if (key2 === 91 || 15 < key2 && key2 < 19 || 37 <= key2 && key2 <= 40)
          return;
        deferListener(event, this, this.value);
      });
      if ($sniffer.hasEvent("paste")) {
        element.on("paste cut drop", deferListener);
      }
    }
    element.on("change", listener);
    if (PARTIAL_VALIDATION_TYPES[type] && ctrl.$$hasNativeValidators && type === attr.type) {
      element.on(PARTIAL_VALIDATION_EVENTS, function(ev) {
        if (!timeout) {
          var validity = this[VALIDITY_STATE_PROPERTY];
          var origBadInput = validity.badInput;
          var origTypeMismatch = validity.typeMismatch;
          timeout = $browser.defer(function() {
            timeout = null;
            if (validity.badInput !== origBadInput || validity.typeMismatch !== origTypeMismatch) {
              listener(ev);
            }
          });
        }
      });
    }
    ctrl.$render = function() {
      var value = ctrl.$isEmpty(ctrl.$viewValue) ? "" : ctrl.$viewValue;
      if (element.val() !== value) {
        element.val(value);
      }
    };
  }
  function weekParser(isoWeek, existingDate) {
    if (isDate(isoWeek)) {
      return isoWeek;
    }
    if (isString(isoWeek)) {
      WEEK_REGEXP.lastIndex = 0;
      var parts = WEEK_REGEXP.exec(isoWeek);
      if (parts) {
        var year = +parts[1], week = +parts[2], hours = 0, minutes = 0, seconds = 0, milliseconds = 0, firstThurs = getFirstThursdayOfYear(year), addDays = (week - 1) * 7;
        if (existingDate) {
          hours = existingDate.getHours();
          minutes = existingDate.getMinutes();
          seconds = existingDate.getSeconds();
          milliseconds = existingDate.getMilliseconds();
        }
        return new Date(year, 0, firstThurs.getDate() + addDays, hours, minutes, seconds, milliseconds);
      }
    }
    return NaN;
  }
  function createDateParser(regexp, mapping) {
    return function(iso, previousDate) {
      var parts, map;
      if (isDate(iso)) {
        return iso;
      }
      if (isString(iso)) {
        if (iso.charAt(0) === '"' && iso.charAt(iso.length - 1) === '"') {
          iso = iso.substring(1, iso.length - 1);
        }
        if (ISO_DATE_REGEXP.test(iso)) {
          return new Date(iso);
        }
        regexp.lastIndex = 0;
        parts = regexp.exec(iso);
        if (parts) {
          parts.shift();
          if (previousDate) {
            map = {
              yyyy: previousDate.getFullYear(),
              MM: previousDate.getMonth() + 1,
              dd: previousDate.getDate(),
              HH: previousDate.getHours(),
              mm: previousDate.getMinutes(),
              ss: previousDate.getSeconds(),
              sss: previousDate.getMilliseconds() / 1e3
            };
          } else {
            map = { yyyy: 1970, MM: 1, dd: 1, HH: 0, mm: 0, ss: 0, sss: 0 };
          }
          forEach(parts, function(part, index) {
            if (index < mapping.length) {
              map[mapping[index]] = +part;
            }
          });
          var date = new Date(map.yyyy, map.MM - 1, map.dd, map.HH, map.mm, map.ss || 0, map.sss * 1e3 || 0);
          if (map.yyyy < 100) {
            date.setFullYear(map.yyyy);
          }
          return date;
        }
      }
      return NaN;
    };
  }
  function createDateInputType(type, regexp, parseDate, format) {
    return function dynamicDateInputType(scope, element, attr, ctrl, $sniffer, $browser, $filter, $parse) {
      badInputChecker(scope, element, attr, ctrl, type);
      baseInputType(scope, element, attr, ctrl, $sniffer, $browser);
      var isTimeType = type === "time" || type === "datetimelocal";
      var previousDate;
      var previousTimezone;
      ctrl.$parsers.push(function(value) {
        if (ctrl.$isEmpty(value))
          return null;
        if (regexp.test(value)) {
          return parseDateAndConvertTimeZoneToLocal(value, previousDate);
        }
        ctrl.$$parserName = type;
        return void 0;
      });
      ctrl.$formatters.push(function(value) {
        if (value && !isDate(value)) {
          throw ngModelMinErr("datefmt", "Expected `{0}` to be a date", value);
        }
        if (isValidDate(value)) {
          previousDate = value;
          var timezone = ctrl.$options.getOption("timezone");
          if (timezone) {
            previousTimezone = timezone;
            previousDate = convertTimezoneToLocal(previousDate, timezone, true);
          }
          return formatter(value, timezone);
        } else {
          previousDate = null;
          previousTimezone = null;
          return "";
        }
      });
      if (isDefined(attr.min) || attr.ngMin) {
        var minVal = attr.min || $parse(attr.ngMin)(scope);
        var parsedMinVal = parseObservedDateValue(minVal);
        ctrl.$validators.min = function(value) {
          return !isValidDate(value) || isUndefined(parsedMinVal) || parseDate(value) >= parsedMinVal;
        };
        attr.$observe("min", function(val) {
          if (val !== minVal) {
            parsedMinVal = parseObservedDateValue(val);
            minVal = val;
            ctrl.$validate();
          }
        });
      }
      if (isDefined(attr.max) || attr.ngMax) {
        var maxVal = attr.max || $parse(attr.ngMax)(scope);
        var parsedMaxVal = parseObservedDateValue(maxVal);
        ctrl.$validators.max = function(value) {
          return !isValidDate(value) || isUndefined(parsedMaxVal) || parseDate(value) <= parsedMaxVal;
        };
        attr.$observe("max", function(val) {
          if (val !== maxVal) {
            parsedMaxVal = parseObservedDateValue(val);
            maxVal = val;
            ctrl.$validate();
          }
        });
      }
      function isValidDate(value) {
        return value && !(value.getTime && value.getTime() !== value.getTime());
      }
      function parseObservedDateValue(val) {
        return isDefined(val) && !isDate(val) ? parseDateAndConvertTimeZoneToLocal(val) || void 0 : val;
      }
      function parseDateAndConvertTimeZoneToLocal(value, previousDate2) {
        var timezone = ctrl.$options.getOption("timezone");
        if (previousTimezone && previousTimezone !== timezone) {
          previousDate2 = addDateMinutes(previousDate2, timezoneToOffset(previousTimezone));
        }
        var parsedDate = parseDate(value, previousDate2);
        if (!isNaN(parsedDate) && timezone) {
          parsedDate = convertTimezoneToLocal(parsedDate, timezone);
        }
        return parsedDate;
      }
      function formatter(value, timezone) {
        var targetFormat = format;
        if (isTimeType && isString(ctrl.$options.getOption("timeSecondsFormat"))) {
          targetFormat = format.replace("ss.sss", ctrl.$options.getOption("timeSecondsFormat")).replace(/:$/, "");
        }
        var formatted = $filter("date")(value, targetFormat, timezone);
        if (isTimeType && ctrl.$options.getOption("timeStripZeroSeconds")) {
          formatted = formatted.replace(/(?::00)?(?:\.000)?$/, "");
        }
        return formatted;
      }
    };
  }
  function badInputChecker(scope, element, attr, ctrl, parserName) {
    var node = element[0];
    var nativeValidation = ctrl.$$hasNativeValidators = isObject(node.validity);
    if (nativeValidation) {
      ctrl.$parsers.push(function(value) {
        var validity = element.prop(VALIDITY_STATE_PROPERTY) || {};
        if (validity.badInput || validity.typeMismatch) {
          ctrl.$$parserName = parserName;
          return void 0;
        }
        return value;
      });
    }
  }
  function numberFormatterParser(ctrl) {
    ctrl.$parsers.push(function(value) {
      if (ctrl.$isEmpty(value))
        return null;
      if (NUMBER_REGEXP.test(value))
        return parseFloat(value);
      ctrl.$$parserName = "number";
      return void 0;
    });
    ctrl.$formatters.push(function(value) {
      if (!ctrl.$isEmpty(value)) {
        if (!isNumber(value)) {
          throw ngModelMinErr("numfmt", "Expected `{0}` to be a number", value);
        }
        value = value.toString();
      }
      return value;
    });
  }
  function parseNumberAttrVal(val) {
    if (isDefined(val) && !isNumber(val)) {
      val = parseFloat(val);
    }
    return !isNumberNaN(val) ? val : void 0;
  }
  function isNumberInteger(num) {
    return (num | 0) === num;
  }
  function countDecimals(num) {
    var numString = num.toString();
    var decimalSymbolIndex = numString.indexOf(".");
    if (decimalSymbolIndex === -1) {
      if (-1 < num && num < 1) {
        var match = /e-(\d+)$/.exec(numString);
        if (match) {
          return Number(match[1]);
        }
      }
      return 0;
    }
    return numString.length - decimalSymbolIndex - 1;
  }
  function isValidForStep(viewValue, stepBase, step) {
    var value = Number(viewValue);
    var isNonIntegerValue = !isNumberInteger(value);
    var isNonIntegerStepBase = !isNumberInteger(stepBase);
    var isNonIntegerStep = !isNumberInteger(step);
    if (isNonIntegerValue || isNonIntegerStepBase || isNonIntegerStep) {
      var valueDecimals = isNonIntegerValue ? countDecimals(value) : 0;
      var stepBaseDecimals = isNonIntegerStepBase ? countDecimals(stepBase) : 0;
      var stepDecimals = isNonIntegerStep ? countDecimals(step) : 0;
      var decimalCount = Math.max(valueDecimals, stepBaseDecimals, stepDecimals);
      var multiplier = Math.pow(10, decimalCount);
      value = value * multiplier;
      stepBase = stepBase * multiplier;
      step = step * multiplier;
      if (isNonIntegerValue)
        value = Math.round(value);
      if (isNonIntegerStepBase)
        stepBase = Math.round(stepBase);
      if (isNonIntegerStep)
        step = Math.round(step);
    }
    return (value - stepBase) % step === 0;
  }
  function numberInputType(scope, element, attr, ctrl, $sniffer, $browser, $filter, $parse) {
    badInputChecker(scope, element, attr, ctrl, "number");
    numberFormatterParser(ctrl);
    baseInputType(scope, element, attr, ctrl, $sniffer, $browser);
    var parsedMinVal;
    if (isDefined(attr.min) || attr.ngMin) {
      var minVal = attr.min || $parse(attr.ngMin)(scope);
      parsedMinVal = parseNumberAttrVal(minVal);
      ctrl.$validators.min = function(modelValue, viewValue) {
        return ctrl.$isEmpty(viewValue) || isUndefined(parsedMinVal) || viewValue >= parsedMinVal;
      };
      attr.$observe("min", function(val) {
        if (val !== minVal) {
          parsedMinVal = parseNumberAttrVal(val);
          minVal = val;
          ctrl.$validate();
        }
      });
    }
    if (isDefined(attr.max) || attr.ngMax) {
      var maxVal = attr.max || $parse(attr.ngMax)(scope);
      var parsedMaxVal = parseNumberAttrVal(maxVal);
      ctrl.$validators.max = function(modelValue, viewValue) {
        return ctrl.$isEmpty(viewValue) || isUndefined(parsedMaxVal) || viewValue <= parsedMaxVal;
      };
      attr.$observe("max", function(val) {
        if (val !== maxVal) {
          parsedMaxVal = parseNumberAttrVal(val);
          maxVal = val;
          ctrl.$validate();
        }
      });
    }
    if (isDefined(attr.step) || attr.ngStep) {
      var stepVal = attr.step || $parse(attr.ngStep)(scope);
      var parsedStepVal = parseNumberAttrVal(stepVal);
      ctrl.$validators.step = function(modelValue, viewValue) {
        return ctrl.$isEmpty(viewValue) || isUndefined(parsedStepVal) || isValidForStep(viewValue, parsedMinVal || 0, parsedStepVal);
      };
      attr.$observe("step", function(val) {
        if (val !== stepVal) {
          parsedStepVal = parseNumberAttrVal(val);
          stepVal = val;
          ctrl.$validate();
        }
      });
    }
  }
  function rangeInputType(scope, element, attr, ctrl, $sniffer, $browser) {
    badInputChecker(scope, element, attr, ctrl, "range");
    numberFormatterParser(ctrl);
    baseInputType(scope, element, attr, ctrl, $sniffer, $browser);
    var supportsRange = ctrl.$$hasNativeValidators && element[0].type === "range", minVal = supportsRange ? 0 : void 0, maxVal = supportsRange ? 100 : void 0, stepVal = supportsRange ? 1 : void 0, validity = element[0].validity, hasMinAttr = isDefined(attr.min), hasMaxAttr = isDefined(attr.max), hasStepAttr = isDefined(attr.step);
    var originalRender = ctrl.$render;
    ctrl.$render = supportsRange && isDefined(validity.rangeUnderflow) && isDefined(validity.rangeOverflow) ? function rangeRender() {
      originalRender();
      ctrl.$setViewValue(element.val());
    } : originalRender;
    if (hasMinAttr) {
      minVal = parseNumberAttrVal(attr.min);
      ctrl.$validators.min = supportsRange ? function noopMinValidator() {
        return true;
      } : function minValidator(modelValue, viewValue) {
        return ctrl.$isEmpty(viewValue) || isUndefined(minVal) || viewValue >= minVal;
      };
      setInitialValueAndObserver("min", minChange);
    }
    if (hasMaxAttr) {
      maxVal = parseNumberAttrVal(attr.max);
      ctrl.$validators.max = supportsRange ? function noopMaxValidator() {
        return true;
      } : function maxValidator(modelValue, viewValue) {
        return ctrl.$isEmpty(viewValue) || isUndefined(maxVal) || viewValue <= maxVal;
      };
      setInitialValueAndObserver("max", maxChange);
    }
    if (hasStepAttr) {
      stepVal = parseNumberAttrVal(attr.step);
      ctrl.$validators.step = supportsRange ? function nativeStepValidator() {
        return !validity.stepMismatch;
      } : function stepValidator(modelValue, viewValue) {
        return ctrl.$isEmpty(viewValue) || isUndefined(stepVal) || isValidForStep(viewValue, minVal || 0, stepVal);
      };
      setInitialValueAndObserver("step", stepChange);
    }
    function setInitialValueAndObserver(htmlAttrName, changeFn) {
      element.attr(htmlAttrName, attr[htmlAttrName]);
      var oldVal = attr[htmlAttrName];
      attr.$observe(htmlAttrName, function wrappedObserver(val) {
        if (val !== oldVal) {
          oldVal = val;
          changeFn(val);
        }
      });
    }
    function minChange(val) {
      minVal = parseNumberAttrVal(val);
      if (isNumberNaN(ctrl.$modelValue)) {
        return;
      }
      if (supportsRange) {
        var elVal = element.val();
        if (minVal > elVal) {
          elVal = minVal;
          element.val(elVal);
        }
        ctrl.$setViewValue(elVal);
      } else {
        ctrl.$validate();
      }
    }
    function maxChange(val) {
      maxVal = parseNumberAttrVal(val);
      if (isNumberNaN(ctrl.$modelValue)) {
        return;
      }
      if (supportsRange) {
        var elVal = element.val();
        if (maxVal < elVal) {
          element.val(maxVal);
          elVal = maxVal < minVal ? minVal : maxVal;
        }
        ctrl.$setViewValue(elVal);
      } else {
        ctrl.$validate();
      }
    }
    function stepChange(val) {
      stepVal = parseNumberAttrVal(val);
      if (isNumberNaN(ctrl.$modelValue)) {
        return;
      }
      if (!supportsRange) {
        ctrl.$validate();
      } else if (ctrl.$viewValue !== element.val()) {
        ctrl.$setViewValue(element.val());
      }
    }
  }
  function urlInputType(scope, element, attr, ctrl, $sniffer, $browser) {
    baseInputType(scope, element, attr, ctrl, $sniffer, $browser);
    stringBasedInputType(ctrl);
    ctrl.$validators.url = function(modelValue, viewValue) {
      var value = modelValue || viewValue;
      return ctrl.$isEmpty(value) || URL_REGEXP.test(value);
    };
  }
  function emailInputType(scope, element, attr, ctrl, $sniffer, $browser) {
    baseInputType(scope, element, attr, ctrl, $sniffer, $browser);
    stringBasedInputType(ctrl);
    ctrl.$validators.email = function(modelValue, viewValue) {
      var value = modelValue || viewValue;
      return ctrl.$isEmpty(value) || EMAIL_REGEXP.test(value);
    };
  }
  function radioInputType(scope, element, attr, ctrl) {
    var doTrim = !attr.ngTrim || trim(attr.ngTrim) !== "false";
    if (isUndefined(attr.name)) {
      element.attr("name", nextUid());
    }
    var listener = function(ev) {
      var value;
      if (element[0].checked) {
        value = attr.value;
        if (doTrim) {
          value = trim(value);
        }
        ctrl.$setViewValue(value, ev && ev.type);
      }
    };
    element.on("change", listener);
    ctrl.$render = function() {
      var value = attr.value;
      if (doTrim) {
        value = trim(value);
      }
      element[0].checked = value === ctrl.$viewValue;
    };
    attr.$observe("value", ctrl.$render);
  }
  function parseConstantExpr($parse, context, name, expression, fallback) {
    var parseFn;
    if (isDefined(expression)) {
      parseFn = $parse(expression);
      if (!parseFn.constant) {
        throw ngModelMinErr("constexpr", "Expected constant expression for `{0}`, but saw `{1}`.", name, expression);
      }
      return parseFn(context);
    }
    return fallback;
  }
  function checkboxInputType(scope, element, attr, ctrl, $sniffer, $browser, $filter, $parse) {
    var trueValue = parseConstantExpr($parse, scope, "ngTrueValue", attr.ngTrueValue, true);
    var falseValue = parseConstantExpr($parse, scope, "ngFalseValue", attr.ngFalseValue, false);
    var listener = function(ev) {
      ctrl.$setViewValue(element[0].checked, ev && ev.type);
    };
    element.on("change", listener);
    ctrl.$render = function() {
      element[0].checked = ctrl.$viewValue;
    };
    ctrl.$isEmpty = function(value) {
      return value === false;
    };
    ctrl.$formatters.push(function(value) {
      return equals(value, trueValue);
    });
    ctrl.$parsers.push(function(value) {
      return value ? trueValue : falseValue;
    });
  }
  var inputDirective = [
    "$browser",
    "$sniffer",
    "$filter",
    "$parse",
    function($browser, $sniffer, $filter, $parse) {
      return {
        restrict: "E",
        require: ["?ngModel"],
        link: {
          pre: function(scope, element, attr, ctrls) {
            if (ctrls[0]) {
              (inputType[lowercase(attr.type)] || inputType.text)(scope, element, attr, ctrls[0], $sniffer, $browser, $filter, $parse);
            }
          }
        }
      };
    }
  ];
  var hiddenInputBrowserCacheDirective = function() {
    var valueProperty = {
      configurable: true,
      enumerable: false,
      get: function() {
        return this.getAttribute("value") || "";
      },
      set: function(val) {
        this.setAttribute("value", val);
      }
    };
    return {
      restrict: "E",
      priority: 200,
      compile: function(_, attr) {
        if (lowercase(attr.type) !== "hidden") {
          return;
        }
        return {
          pre: function(scope, element, attr2, ctrls) {
            var node = element[0];
            if (node.parentNode) {
              node.parentNode.insertBefore(node, node.nextSibling);
            }
            if (Object.defineProperty) {
              Object.defineProperty(node, "value", valueProperty);
            }
          }
        };
      }
    };
  };
  var CONSTANT_VALUE_REGEXP = /^(true|false|\d+)$/;
  var ngValueDirective = function() {
    function updateElementValue(element, attr, value) {
      var propValue = isDefined(value) ? value : msie === 9 ? "" : null;
      element.prop("value", propValue);
      attr.$set("value", value);
    }
    return {
      restrict: "A",
      priority: 100,
      compile: function(tpl, tplAttr) {
        if (CONSTANT_VALUE_REGEXP.test(tplAttr.ngValue)) {
          return function ngValueConstantLink(scope, elm, attr) {
            var value = scope.$eval(attr.ngValue);
            updateElementValue(elm, attr, value);
          };
        } else {
          return function ngValueLink(scope, elm, attr) {
            scope.$watch(attr.ngValue, function valueWatchAction(value) {
              updateElementValue(elm, attr, value);
            });
          };
        }
      }
    };
  };
  var ngBindDirective = ["$compile", function($compile) {
    return {
      restrict: "AC",
      compile: function ngBindCompile(templateElement) {
        $compile.$$addBindingClass(templateElement);
        return function ngBindLink(scope, element, attr) {
          $compile.$$addBindingInfo(element, attr.ngBind);
          element = element[0];
          scope.$watch(attr.ngBind, function ngBindWatchAction(value) {
            element.textContent = stringify(value);
          });
        };
      }
    };
  }];
  var ngBindTemplateDirective = ["$interpolate", "$compile", function($interpolate, $compile) {
    return {
      compile: function ngBindTemplateCompile(templateElement) {
        $compile.$$addBindingClass(templateElement);
        return function ngBindTemplateLink(scope, element, attr) {
          var interpolateFn = $interpolate(element.attr(attr.$attr.ngBindTemplate));
          $compile.$$addBindingInfo(element, interpolateFn.expressions);
          element = element[0];
          attr.$observe("ngBindTemplate", function(value) {
            element.textContent = isUndefined(value) ? "" : value;
          });
        };
      }
    };
  }];
  var ngBindHtmlDirective = ["$sce", "$parse", "$compile", function($sce, $parse, $compile) {
    return {
      restrict: "A",
      compile: function ngBindHtmlCompile(tElement, tAttrs) {
        var ngBindHtmlGetter = $parse(tAttrs.ngBindHtml);
        var ngBindHtmlWatch = $parse(tAttrs.ngBindHtml, function sceValueOf(val) {
          return $sce.valueOf(val);
        });
        $compile.$$addBindingClass(tElement);
        return function ngBindHtmlLink(scope, element, attr) {
          $compile.$$addBindingInfo(element, attr.ngBindHtml);
          scope.$watch(ngBindHtmlWatch, function ngBindHtmlWatchAction() {
            var value = ngBindHtmlGetter(scope);
            element.html($sce.getTrustedHtml(value) || "");
          });
        };
      }
    };
  }];
  var ngChangeDirective = valueFn({
    restrict: "A",
    require: "ngModel",
    link: function(scope, element, attr, ctrl) {
      ctrl.$viewChangeListeners.push(function() {
        scope.$eval(attr.ngChange);
      });
    }
  });
  function classDirective(name, selector) {
    name = "ngClass" + name;
    var indexWatchExpression;
    return ["$parse", function($parse) {
      return {
        restrict: "AC",
        link: function(scope, element, attr) {
          var classCounts = element.data("$classCounts");
          var oldModulo = true;
          var oldClassString;
          if (!classCounts) {
            classCounts = createMap();
            element.data("$classCounts", classCounts);
          }
          if (name !== "ngClass") {
            if (!indexWatchExpression) {
              indexWatchExpression = $parse("$index", function moduloTwo($index) {
                return $index & 1;
              });
            }
            scope.$watch(indexWatchExpression, ngClassIndexWatchAction);
          }
          scope.$watch($parse(attr[name], toClassString), ngClassWatchAction);
          function addClasses(classString) {
            classString = digestClassCounts(split(classString), 1);
            attr.$addClass(classString);
          }
          function removeClasses(classString) {
            classString = digestClassCounts(split(classString), -1);
            attr.$removeClass(classString);
          }
          function updateClasses(oldClassString2, newClassString) {
            var oldClassArray = split(oldClassString2);
            var newClassArray = split(newClassString);
            var toRemoveArray = arrayDifference(oldClassArray, newClassArray);
            var toAddArray = arrayDifference(newClassArray, oldClassArray);
            var toRemoveString = digestClassCounts(toRemoveArray, -1);
            var toAddString = digestClassCounts(toAddArray, 1);
            attr.$addClass(toAddString);
            attr.$removeClass(toRemoveString);
          }
          function digestClassCounts(classArray, count) {
            var classesToUpdate = [];
            forEach(classArray, function(className) {
              if (count > 0 || classCounts[className]) {
                classCounts[className] = (classCounts[className] || 0) + count;
                if (classCounts[className] === +(count > 0)) {
                  classesToUpdate.push(className);
                }
              }
            });
            return classesToUpdate.join(" ");
          }
          function ngClassIndexWatchAction(newModulo) {
            if (newModulo === selector) {
              addClasses(oldClassString);
            } else {
              removeClasses(oldClassString);
            }
            oldModulo = newModulo;
          }
          function ngClassWatchAction(newClassString) {
            if (oldModulo === selector) {
              updateClasses(oldClassString, newClassString);
            }
            oldClassString = newClassString;
          }
        }
      };
    }];
    function arrayDifference(tokens1, tokens2) {
      if (!tokens1 || !tokens1.length)
        return [];
      if (!tokens2 || !tokens2.length)
        return tokens1;
      var values = [];
      outer:
        for (var i = 0; i < tokens1.length; i++) {
          var token = tokens1[i];
          for (var j = 0; j < tokens2.length; j++) {
            if (token === tokens2[j])
              continue outer;
          }
          values.push(token);
        }
      return values;
    }
    function split(classString) {
      return classString && classString.split(" ");
    }
    function toClassString(classValue) {
      if (!classValue)
        return classValue;
      var classString = classValue;
      if (isArray(classValue)) {
        classString = classValue.map(toClassString).join(" ");
      } else if (isObject(classValue)) {
        classString = Object.keys(classValue).filter(function(key2) {
          return classValue[key2];
        }).join(" ");
      } else if (!isString(classValue)) {
        classString = classValue + "";
      }
      return classString;
    }
  }
  var ngClassDirective = classDirective("", true);
  var ngClassOddDirective = classDirective("Odd", 0);
  var ngClassEvenDirective = classDirective("Even", 1);
  var ngCloakDirective = ngDirective({
    compile: function(element, attr) {
      attr.$set("ngCloak", void 0);
      element.removeClass("ng-cloak");
    }
  });
  var ngControllerDirective = [function() {
    return {
      restrict: "A",
      scope: true,
      controller: "@",
      priority: 500
    };
  }];
  var ngEventDirectives = {};
  var forceAsyncEvents = {
    "blur": true,
    "focus": true
  };
  forEach("click dblclick mousedown mouseup mouseover mouseout mousemove mouseenter mouseleave keydown keyup keypress submit focus blur copy cut paste".split(" "), function(eventName) {
    var directiveName = directiveNormalize("ng-" + eventName);
    ngEventDirectives[directiveName] = ["$parse", "$rootScope", "$exceptionHandler", function($parse, $rootScope, $exceptionHandler) {
      return createEventDirective($parse, $rootScope, $exceptionHandler, directiveName, eventName, forceAsyncEvents[eventName]);
    }];
  });
  function createEventDirective($parse, $rootScope, $exceptionHandler, directiveName, eventName, forceAsync) {
    return {
      restrict: "A",
      compile: function($element, attr) {
        var fn = $parse(attr[directiveName]);
        return function ngEventHandler(scope, element) {
          element.on(eventName, function(event) {
            var callback = function() {
              fn(scope, { $event: event });
            };
            if (!$rootScope.$$phase) {
              scope.$apply(callback);
            } else if (forceAsync) {
              scope.$evalAsync(callback);
            } else {
              try {
                callback();
              } catch (error) {
                $exceptionHandler(error);
              }
            }
          });
        };
      }
    };
  }
  var ngIfDirective = ["$animate", "$compile", function($animate, $compile) {
    return {
      multiElement: true,
      transclude: "element",
      priority: 600,
      terminal: true,
      restrict: "A",
      $$tlb: true,
      link: function($scope, $element, $attr, ctrl, $transclude) {
        var block, childScope, previousElements;
        $scope.$watch($attr.ngIf, function ngIfWatchAction(value) {
          if (value) {
            if (!childScope) {
              $transclude(function(clone, newScope) {
                childScope = newScope;
                clone[clone.length++] = $compile.$$createComment("end ngIf", $attr.ngIf);
                block = {
                  clone
                };
                $animate.enter(clone, $element.parent(), $element);
              });
            }
          } else {
            if (previousElements) {
              previousElements.remove();
              previousElements = null;
            }
            if (childScope) {
              childScope.$destroy();
              childScope = null;
            }
            if (block) {
              previousElements = getBlockNodes(block.clone);
              $animate.leave(previousElements).done(function(response) {
                if (response !== false)
                  previousElements = null;
              });
              block = null;
            }
          }
        });
      }
    };
  }];
  var ngIncludeDirective = [
    "$templateRequest",
    "$anchorScroll",
    "$animate",
    function($templateRequest, $anchorScroll, $animate) {
      return {
        restrict: "ECA",
        priority: 400,
        terminal: true,
        transclude: "element",
        controller: angular2.noop,
        compile: function(element, attr) {
          var srcExp = attr.ngInclude || attr.src, onloadExp = attr.onload || "", autoScrollExp = attr.autoscroll;
          return function(scope, $element, $attr, ctrl, $transclude) {
            var changeCounter = 0, currentScope, previousElement, currentElement;
            var cleanupLastIncludeContent = function() {
              if (previousElement) {
                previousElement.remove();
                previousElement = null;
              }
              if (currentScope) {
                currentScope.$destroy();
                currentScope = null;
              }
              if (currentElement) {
                $animate.leave(currentElement).done(function(response) {
                  if (response !== false)
                    previousElement = null;
                });
                previousElement = currentElement;
                currentElement = null;
              }
            };
            scope.$watch(srcExp, function ngIncludeWatchAction(src) {
              var afterAnimation = function(response) {
                if (response !== false && isDefined(autoScrollExp) && (!autoScrollExp || scope.$eval(autoScrollExp))) {
                  $anchorScroll();
                }
              };
              var thisChangeId = ++changeCounter;
              if (src) {
                $templateRequest(src, true).then(function(response) {
                  if (scope.$$destroyed)
                    return;
                  if (thisChangeId !== changeCounter)
                    return;
                  var newScope = scope.$new();
                  ctrl.template = response;
                  var clone = $transclude(newScope, function(clone2) {
                    cleanupLastIncludeContent();
                    $animate.enter(clone2, null, $element).done(afterAnimation);
                  });
                  currentScope = newScope;
                  currentElement = clone;
                  currentScope.$emit("$includeContentLoaded", src);
                  scope.$eval(onloadExp);
                }, function() {
                  if (scope.$$destroyed)
                    return;
                  if (thisChangeId === changeCounter) {
                    cleanupLastIncludeContent();
                    scope.$emit("$includeContentError", src);
                  }
                });
                scope.$emit("$includeContentRequested", src);
              } else {
                cleanupLastIncludeContent();
                ctrl.template = null;
              }
            });
          };
        }
      };
    }
  ];
  var ngIncludeFillContentDirective = [
    "$compile",
    function($compile) {
      return {
        restrict: "ECA",
        priority: -400,
        require: "ngInclude",
        link: function(scope, $element, $attr, ctrl) {
          if (toString.call($element[0]).match(/SVG/)) {
            $element.empty();
            $compile(jqLiteBuildFragment(ctrl.template, window2.document).childNodes)(scope, function namespaceAdaptedClone(clone) {
              $element.append(clone);
            }, { futureParentElement: $element });
            return;
          }
          $element.html(ctrl.template);
          $compile($element.contents())(scope);
        }
      };
    }
  ];
  var ngInitDirective = ngDirective({
    priority: 450,
    compile: function() {
      return {
        pre: function(scope, element, attrs) {
          scope.$eval(attrs.ngInit);
        }
      };
    }
  });
  var ngListDirective = function() {
    return {
      restrict: "A",
      priority: 100,
      require: "ngModel",
      link: function(scope, element, attr, ctrl) {
        var ngList = attr.ngList || ", ";
        var trimValues = attr.ngTrim !== "false";
        var separator = trimValues ? trim(ngList) : ngList;
        var parse2 = function(viewValue) {
          if (isUndefined(viewValue))
            return;
          var list = [];
          if (viewValue) {
            forEach(viewValue.split(separator), function(value) {
              if (value)
                list.push(trimValues ? trim(value) : value);
            });
          }
          return list;
        };
        ctrl.$parsers.push(parse2);
        ctrl.$formatters.push(function(value) {
          if (isArray(value)) {
            return value.join(ngList);
          }
          return void 0;
        });
        ctrl.$isEmpty = function(value) {
          return !value || !value.length;
        };
      }
    };
  };
  var VALID_CLASS = "ng-valid", INVALID_CLASS = "ng-invalid", PRISTINE_CLASS = "ng-pristine", DIRTY_CLASS = "ng-dirty", UNTOUCHED_CLASS = "ng-untouched", TOUCHED_CLASS = "ng-touched", EMPTY_CLASS = "ng-empty", NOT_EMPTY_CLASS = "ng-not-empty";
  var ngModelMinErr = minErr("ngModel");
  NgModelController.$inject = ["$scope", "$exceptionHandler", "$attrs", "$element", "$parse", "$animate", "$timeout", "$q", "$interpolate"];
  function NgModelController($scope, $exceptionHandler, $attr, $element, $parse, $animate, $timeout, $q, $interpolate) {
    this.$viewValue = Number.NaN;
    this.$modelValue = Number.NaN;
    this.$$rawModelValue = void 0;
    this.$validators = {};
    this.$asyncValidators = {};
    this.$parsers = [];
    this.$formatters = [];
    this.$viewChangeListeners = [];
    this.$untouched = true;
    this.$touched = false;
    this.$pristine = true;
    this.$dirty = false;
    this.$valid = true;
    this.$invalid = false;
    this.$error = {};
    this.$$success = {};
    this.$pending = void 0;
    this.$name = $interpolate($attr.name || "", false)($scope);
    this.$$parentForm = nullFormCtrl;
    this.$options = defaultModelOptions;
    this.$$updateEvents = "";
    this.$$updateEventHandler = this.$$updateEventHandler.bind(this);
    this.$$parsedNgModel = $parse($attr.ngModel);
    this.$$parsedNgModelAssign = this.$$parsedNgModel.assign;
    this.$$ngModelGet = this.$$parsedNgModel;
    this.$$ngModelSet = this.$$parsedNgModelAssign;
    this.$$pendingDebounce = null;
    this.$$parserValid = void 0;
    this.$$parserName = "parse";
    this.$$currentValidationRunId = 0;
    this.$$scope = $scope;
    this.$$rootScope = $scope.$root;
    this.$$attr = $attr;
    this.$$element = $element;
    this.$$animate = $animate;
    this.$$timeout = $timeout;
    this.$$parse = $parse;
    this.$$q = $q;
    this.$$exceptionHandler = $exceptionHandler;
    setupValidity(this);
    setupModelWatcher(this);
  }
  NgModelController.prototype = {
    $$initGetterSetters: function() {
      if (this.$options.getOption("getterSetter")) {
        var invokeModelGetter = this.$$parse(this.$$attr.ngModel + "()"), invokeModelSetter = this.$$parse(this.$$attr.ngModel + "($$$p)");
        this.$$ngModelGet = function($scope) {
          var modelValue = this.$$parsedNgModel($scope);
          if (isFunction(modelValue)) {
            modelValue = invokeModelGetter($scope);
          }
          return modelValue;
        };
        this.$$ngModelSet = function($scope, newValue) {
          if (isFunction(this.$$parsedNgModel($scope))) {
            invokeModelSetter($scope, { $$$p: newValue });
          } else {
            this.$$parsedNgModelAssign($scope, newValue);
          }
        };
      } else if (!this.$$parsedNgModel.assign) {
        throw ngModelMinErr("nonassign", "Expression '{0}' is non-assignable. Element: {1}", this.$$attr.ngModel, startingTag(this.$$element));
      }
    },
    $render: noop,
    $isEmpty: function(value) {
      return isUndefined(value) || value === "" || value === null || value !== value;
    },
    $$updateEmptyClasses: function(value) {
      if (this.$isEmpty(value)) {
        this.$$animate.removeClass(this.$$element, NOT_EMPTY_CLASS);
        this.$$animate.addClass(this.$$element, EMPTY_CLASS);
      } else {
        this.$$animate.removeClass(this.$$element, EMPTY_CLASS);
        this.$$animate.addClass(this.$$element, NOT_EMPTY_CLASS);
      }
    },
    $setPristine: function() {
      this.$dirty = false;
      this.$pristine = true;
      this.$$animate.removeClass(this.$$element, DIRTY_CLASS);
      this.$$animate.addClass(this.$$element, PRISTINE_CLASS);
    },
    $setDirty: function() {
      this.$dirty = true;
      this.$pristine = false;
      this.$$animate.removeClass(this.$$element, PRISTINE_CLASS);
      this.$$animate.addClass(this.$$element, DIRTY_CLASS);
      this.$$parentForm.$setDirty();
    },
    $setUntouched: function() {
      this.$touched = false;
      this.$untouched = true;
      this.$$animate.setClass(this.$$element, UNTOUCHED_CLASS, TOUCHED_CLASS);
    },
    $setTouched: function() {
      this.$touched = true;
      this.$untouched = false;
      this.$$animate.setClass(this.$$element, TOUCHED_CLASS, UNTOUCHED_CLASS);
    },
    $rollbackViewValue: function() {
      this.$$timeout.cancel(this.$$pendingDebounce);
      this.$viewValue = this.$$lastCommittedViewValue;
      this.$render();
    },
    $validate: function() {
      if (isNumberNaN(this.$modelValue)) {
        return;
      }
      var viewValue = this.$$lastCommittedViewValue;
      var modelValue = this.$$rawModelValue;
      var prevValid = this.$valid;
      var prevModelValue = this.$modelValue;
      var allowInvalid = this.$options.getOption("allowInvalid");
      var that = this;
      this.$$runValidators(modelValue, viewValue, function(allValid) {
        if (!allowInvalid && prevValid !== allValid) {
          that.$modelValue = allValid ? modelValue : void 0;
          if (that.$modelValue !== prevModelValue) {
            that.$$writeModelToScope();
          }
        }
      });
    },
    $$runValidators: function(modelValue, viewValue, doneCallback) {
      this.$$currentValidationRunId++;
      var localValidationRunId = this.$$currentValidationRunId;
      var that = this;
      if (!processParseErrors()) {
        validationDone(false);
        return;
      }
      if (!processSyncValidators()) {
        validationDone(false);
        return;
      }
      processAsyncValidators();
      function processParseErrors() {
        var errorKey = that.$$parserName;
        if (isUndefined(that.$$parserValid)) {
          setValidity(errorKey, null);
        } else {
          if (!that.$$parserValid) {
            forEach(that.$validators, function(v, name) {
              setValidity(name, null);
            });
            forEach(that.$asyncValidators, function(v, name) {
              setValidity(name, null);
            });
          }
          setValidity(errorKey, that.$$parserValid);
          return that.$$parserValid;
        }
        return true;
      }
      function processSyncValidators() {
        var syncValidatorsValid = true;
        forEach(that.$validators, function(validator, name) {
          var result = Boolean(validator(modelValue, viewValue));
          syncValidatorsValid = syncValidatorsValid && result;
          setValidity(name, result);
        });
        if (!syncValidatorsValid) {
          forEach(that.$asyncValidators, function(v, name) {
            setValidity(name, null);
          });
          return false;
        }
        return true;
      }
      function processAsyncValidators() {
        var validatorPromises = [];
        var allValid = true;
        forEach(that.$asyncValidators, function(validator, name) {
          var promise = validator(modelValue, viewValue);
          if (!isPromiseLike(promise)) {
            throw ngModelMinErr("nopromise", "Expected asynchronous validator to return a promise but got '{0}' instead.", promise);
          }
          setValidity(name, void 0);
          validatorPromises.push(promise.then(function() {
            setValidity(name, true);
          }, function() {
            allValid = false;
            setValidity(name, false);
          }));
        });
        if (!validatorPromises.length) {
          validationDone(true);
        } else {
          that.$$q.all(validatorPromises).then(function() {
            validationDone(allValid);
          }, noop);
        }
      }
      function setValidity(name, isValid) {
        if (localValidationRunId === that.$$currentValidationRunId) {
          that.$setValidity(name, isValid);
        }
      }
      function validationDone(allValid) {
        if (localValidationRunId === that.$$currentValidationRunId) {
          doneCallback(allValid);
        }
      }
    },
    $commitViewValue: function() {
      var viewValue = this.$viewValue;
      this.$$timeout.cancel(this.$$pendingDebounce);
      if (this.$$lastCommittedViewValue === viewValue && (viewValue !== "" || !this.$$hasNativeValidators)) {
        return;
      }
      this.$$updateEmptyClasses(viewValue);
      this.$$lastCommittedViewValue = viewValue;
      if (this.$pristine) {
        this.$setDirty();
      }
      this.$$parseAndValidate();
    },
    $$parseAndValidate: function() {
      var viewValue = this.$$lastCommittedViewValue;
      var modelValue = viewValue;
      var that = this;
      this.$$parserValid = isUndefined(modelValue) ? void 0 : true;
      this.$setValidity(this.$$parserName, null);
      this.$$parserName = "parse";
      if (this.$$parserValid) {
        for (var i = 0; i < this.$parsers.length; i++) {
          modelValue = this.$parsers[i](modelValue);
          if (isUndefined(modelValue)) {
            this.$$parserValid = false;
            break;
          }
        }
      }
      if (isNumberNaN(this.$modelValue)) {
        this.$modelValue = this.$$ngModelGet(this.$$scope);
      }
      var prevModelValue = this.$modelValue;
      var allowInvalid = this.$options.getOption("allowInvalid");
      this.$$rawModelValue = modelValue;
      if (allowInvalid) {
        this.$modelValue = modelValue;
        writeToModelIfNeeded();
      }
      this.$$runValidators(modelValue, this.$$lastCommittedViewValue, function(allValid) {
        if (!allowInvalid) {
          that.$modelValue = allValid ? modelValue : void 0;
          writeToModelIfNeeded();
        }
      });
      function writeToModelIfNeeded() {
        if (that.$modelValue !== prevModelValue) {
          that.$$writeModelToScope();
        }
      }
    },
    $$writeModelToScope: function() {
      this.$$ngModelSet(this.$$scope, this.$modelValue);
      forEach(this.$viewChangeListeners, function(listener) {
        try {
          listener();
        } catch (e) {
          this.$$exceptionHandler(e);
        }
      }, this);
    },
    $setViewValue: function(value, trigger) {
      this.$viewValue = value;
      if (this.$options.getOption("updateOnDefault")) {
        this.$$debounceViewValueCommit(trigger);
      }
    },
    $$debounceViewValueCommit: function(trigger) {
      var debounceDelay = this.$options.getOption("debounce");
      if (isNumber(debounceDelay[trigger])) {
        debounceDelay = debounceDelay[trigger];
      } else if (isNumber(debounceDelay["default"]) && this.$options.getOption("updateOn").indexOf(trigger) === -1) {
        debounceDelay = debounceDelay["default"];
      } else if (isNumber(debounceDelay["*"])) {
        debounceDelay = debounceDelay["*"];
      }
      this.$$timeout.cancel(this.$$pendingDebounce);
      var that = this;
      if (debounceDelay > 0) {
        this.$$pendingDebounce = this.$$timeout(function() {
          that.$commitViewValue();
        }, debounceDelay);
      } else if (this.$$rootScope.$$phase) {
        this.$commitViewValue();
      } else {
        this.$$scope.$apply(function() {
          that.$commitViewValue();
        });
      }
    },
    $overrideModelOptions: function(options) {
      this.$options = this.$options.createChild(options);
      this.$$setUpdateOnEvents();
    },
    $processModelValue: function() {
      var viewValue = this.$$format();
      if (this.$viewValue !== viewValue) {
        this.$$updateEmptyClasses(viewValue);
        this.$viewValue = this.$$lastCommittedViewValue = viewValue;
        this.$render();
        this.$$runValidators(this.$modelValue, this.$viewValue, noop);
      }
    },
    $$format: function() {
      var formatters = this.$formatters, idx = formatters.length;
      var viewValue = this.$modelValue;
      while (idx--) {
        viewValue = formatters[idx](viewValue);
      }
      return viewValue;
    },
    $$setModelValue: function(modelValue) {
      this.$modelValue = this.$$rawModelValue = modelValue;
      this.$$parserValid = void 0;
      this.$processModelValue();
    },
    $$setUpdateOnEvents: function() {
      if (this.$$updateEvents) {
        this.$$element.off(this.$$updateEvents, this.$$updateEventHandler);
      }
      this.$$updateEvents = this.$options.getOption("updateOn");
      if (this.$$updateEvents) {
        this.$$element.on(this.$$updateEvents, this.$$updateEventHandler);
      }
    },
    $$updateEventHandler: function(ev) {
      this.$$debounceViewValueCommit(ev && ev.type);
    }
  };
  function setupModelWatcher(ctrl) {
    ctrl.$$scope.$watch(function ngModelWatch(scope) {
      var modelValue = ctrl.$$ngModelGet(scope);
      if (modelValue !== ctrl.$modelValue && (ctrl.$modelValue === ctrl.$modelValue || modelValue === modelValue)) {
        ctrl.$$setModelValue(modelValue);
      }
      return modelValue;
    });
  }
  addSetValidityMethod({
    clazz: NgModelController,
    set: function(object, property) {
      object[property] = true;
    },
    unset: function(object, property) {
      delete object[property];
    }
  });
  var ngModelDirective = ["$rootScope", function($rootScope) {
    return {
      restrict: "A",
      require: ["ngModel", "^?form", "^?ngModelOptions"],
      controller: NgModelController,
      priority: 1,
      compile: function ngModelCompile(element) {
        element.addClass(PRISTINE_CLASS).addClass(UNTOUCHED_CLASS).addClass(VALID_CLASS);
        return {
          pre: function ngModelPreLink(scope, element2, attr, ctrls) {
            var modelCtrl = ctrls[0], formCtrl = ctrls[1] || modelCtrl.$$parentForm, optionsCtrl = ctrls[2];
            if (optionsCtrl) {
              modelCtrl.$options = optionsCtrl.$options;
            }
            modelCtrl.$$initGetterSetters();
            formCtrl.$addControl(modelCtrl);
            attr.$observe("name", function(newValue) {
              if (modelCtrl.$name !== newValue) {
                modelCtrl.$$parentForm.$$renameControl(modelCtrl, newValue);
              }
            });
            scope.$on("$destroy", function() {
              modelCtrl.$$parentForm.$removeControl(modelCtrl);
            });
          },
          post: function ngModelPostLink(scope, element2, attr, ctrls) {
            var modelCtrl = ctrls[0];
            modelCtrl.$$setUpdateOnEvents();
            function setTouched() {
              modelCtrl.$setTouched();
            }
            element2.on("blur", function() {
              if (modelCtrl.$touched)
                return;
              if ($rootScope.$$phase) {
                scope.$evalAsync(setTouched);
              } else {
                scope.$apply(setTouched);
              }
            });
          }
        };
      }
    };
  }];
  var defaultModelOptions;
  var DEFAULT_REGEXP = /(\s+|^)default(\s+|$)/;
  function ModelOptions(options) {
    this.$$options = options;
  }
  ModelOptions.prototype = {
    getOption: function(name) {
      return this.$$options[name];
    },
    createChild: function(options) {
      var inheritAll = false;
      options = extend({}, options);
      forEach(options, function(option, key2) {
        if (option === "$inherit") {
          if (key2 === "*") {
            inheritAll = true;
          } else {
            options[key2] = this.$$options[key2];
            if (key2 === "updateOn") {
              options.updateOnDefault = this.$$options.updateOnDefault;
            }
          }
        } else {
          if (key2 === "updateOn") {
            options.updateOnDefault = false;
            options[key2] = trim(option.replace(DEFAULT_REGEXP, function() {
              options.updateOnDefault = true;
              return " ";
            }));
          }
        }
      }, this);
      if (inheritAll) {
        delete options["*"];
        defaults(options, this.$$options);
      }
      defaults(options, defaultModelOptions.$$options);
      return new ModelOptions(options);
    }
  };
  defaultModelOptions = new ModelOptions({
    updateOn: "",
    updateOnDefault: true,
    debounce: 0,
    getterSetter: false,
    allowInvalid: false,
    timezone: null
  });
  var ngModelOptionsDirective = function() {
    NgModelOptionsController.$inject = ["$attrs", "$scope"];
    function NgModelOptionsController($attrs, $scope) {
      this.$$attrs = $attrs;
      this.$$scope = $scope;
    }
    NgModelOptionsController.prototype = {
      $onInit: function() {
        var parentOptions = this.parentCtrl ? this.parentCtrl.$options : defaultModelOptions;
        var modelOptionsDefinition = this.$$scope.$eval(this.$$attrs.ngModelOptions);
        this.$options = parentOptions.createChild(modelOptionsDefinition);
      }
    };
    return {
      restrict: "A",
      priority: 10,
      require: { parentCtrl: "?^^ngModelOptions" },
      bindToController: true,
      controller: NgModelOptionsController
    };
  };
  function defaults(dst, src) {
    forEach(src, function(value, key2) {
      if (!isDefined(dst[key2])) {
        dst[key2] = value;
      }
    });
  }
  var ngNonBindableDirective = ngDirective({ terminal: true, priority: 1e3 });
  var ngOptionsMinErr = minErr("ngOptions");
  var NG_OPTIONS_REGEXP = /^\s*([\s\S]+?)(?:\s+as\s+([\s\S]+?))?(?:\s+group\s+by\s+([\s\S]+?))?(?:\s+disable\s+when\s+([\s\S]+?))?\s+for\s+(?:([$\w][$\w]*)|(?:\(\s*([$\w][$\w]*)\s*,\s*([$\w][$\w]*)\s*\)))\s+in\s+([\s\S]+?)(?:\s+track\s+by\s+([\s\S]+?))?$/;
  var ngOptionsDirective = ["$compile", "$document", "$parse", function($compile, $document, $parse) {
    function parseOptionsExpression(optionsExp, selectElement, scope) {
      var match = optionsExp.match(NG_OPTIONS_REGEXP);
      if (!match) {
        throw ngOptionsMinErr("iexp", "Expected expression in form of '_select_ (as _label_)? for (_key_,)?_value_ in _collection_' but got '{0}'. Element: {1}", optionsExp, startingTag(selectElement));
      }
      var valueName = match[5] || match[7];
      var keyName = match[6];
      var selectAs = / as /.test(match[0]) && match[1];
      var trackBy = match[9];
      var valueFn2 = $parse(match[2] ? match[1] : valueName);
      var selectAsFn = selectAs && $parse(selectAs);
      var viewValueFn = selectAsFn || valueFn2;
      var trackByFn = trackBy && $parse(trackBy);
      var getTrackByValueFn = trackBy ? function(value, locals2) {
        return trackByFn(scope, locals2);
      } : function getHashOfValue(value) {
        return hashKey(value);
      };
      var getTrackByValue = function(value, key2) {
        return getTrackByValueFn(value, getLocals(value, key2));
      };
      var displayFn = $parse(match[2] || match[1]);
      var groupByFn = $parse(match[3] || "");
      var disableWhenFn = $parse(match[4] || "");
      var valuesFn = $parse(match[8]);
      var locals = {};
      var getLocals = keyName ? function(value, key2) {
        locals[keyName] = key2;
        locals[valueName] = value;
        return locals;
      } : function(value) {
        locals[valueName] = value;
        return locals;
      };
      function Option(selectValue, viewValue, label, group, disabled) {
        this.selectValue = selectValue;
        this.viewValue = viewValue;
        this.label = label;
        this.group = group;
        this.disabled = disabled;
      }
      function getOptionValuesKeys(optionValues) {
        var optionValuesKeys;
        if (!keyName && isArrayLike(optionValues)) {
          optionValuesKeys = optionValues;
        } else {
          optionValuesKeys = [];
          for (var itemKey in optionValues) {
            if (optionValues.hasOwnProperty(itemKey) && itemKey.charAt(0) !== "$") {
              optionValuesKeys.push(itemKey);
            }
          }
        }
        return optionValuesKeys;
      }
      return {
        trackBy,
        getTrackByValue,
        getWatchables: $parse(valuesFn, function(optionValues) {
          var watchedArray = [];
          optionValues = optionValues || [];
          var optionValuesKeys = getOptionValuesKeys(optionValues);
          var optionValuesLength = optionValuesKeys.length;
          for (var index = 0; index < optionValuesLength; index++) {
            var key2 = optionValues === optionValuesKeys ? index : optionValuesKeys[index];
            var value = optionValues[key2];
            var locals2 = getLocals(value, key2);
            var selectValue = getTrackByValueFn(value, locals2);
            watchedArray.push(selectValue);
            if (match[2] || match[1]) {
              var label = displayFn(scope, locals2);
              watchedArray.push(label);
            }
            if (match[4]) {
              var disableWhen = disableWhenFn(scope, locals2);
              watchedArray.push(disableWhen);
            }
          }
          return watchedArray;
        }),
        getOptions: function() {
          var optionItems = [];
          var selectValueMap = {};
          var optionValues = valuesFn(scope) || [];
          var optionValuesKeys = getOptionValuesKeys(optionValues);
          var optionValuesLength = optionValuesKeys.length;
          for (var index = 0; index < optionValuesLength; index++) {
            var key2 = optionValues === optionValuesKeys ? index : optionValuesKeys[index];
            var value = optionValues[key2];
            var locals2 = getLocals(value, key2);
            var viewValue = viewValueFn(scope, locals2);
            var selectValue = getTrackByValueFn(viewValue, locals2);
            var label = displayFn(scope, locals2);
            var group = groupByFn(scope, locals2);
            var disabled = disableWhenFn(scope, locals2);
            var optionItem = new Option(selectValue, viewValue, label, group, disabled);
            optionItems.push(optionItem);
            selectValueMap[selectValue] = optionItem;
          }
          return {
            items: optionItems,
            selectValueMap,
            getOptionFromViewValue: function(value2) {
              return selectValueMap[getTrackByValue(value2)];
            },
            getViewValueFromOption: function(option) {
              return trackBy ? copy(option.viewValue) : option.viewValue;
            }
          };
        }
      };
    }
    var optionTemplate = window2.document.createElement("option"), optGroupTemplate = window2.document.createElement("optgroup");
    function ngOptionsPostLink(scope, selectElement, attr, ctrls) {
      var selectCtrl = ctrls[0];
      var ngModelCtrl = ctrls[1];
      var multiple = attr.multiple;
      for (var i = 0, children = selectElement.children(), ii = children.length; i < ii; i++) {
        if (children[i].value === "") {
          selectCtrl.hasEmptyOption = true;
          selectCtrl.emptyOption = children.eq(i);
          break;
        }
      }
      selectElement.empty();
      var providedEmptyOption = !!selectCtrl.emptyOption;
      var unknownOption = jqLite(optionTemplate.cloneNode(false));
      unknownOption.val("?");
      var options;
      var ngOptions = parseOptionsExpression(attr.ngOptions, selectElement, scope);
      var listFragment = $document[0].createDocumentFragment();
      selectCtrl.generateUnknownOptionValue = function(val) {
        return "?";
      };
      if (!multiple) {
        selectCtrl.writeValue = function writeNgOptionsValue(value) {
          if (!options)
            return;
          var selectedOption = selectElement[0].options[selectElement[0].selectedIndex];
          var option = options.getOptionFromViewValue(value);
          if (selectedOption)
            selectedOption.removeAttribute("selected");
          if (option) {
            if (selectElement[0].value !== option.selectValue) {
              selectCtrl.removeUnknownOption();
              selectElement[0].value = option.selectValue;
              option.element.selected = true;
            }
            option.element.setAttribute("selected", "selected");
          } else {
            selectCtrl.selectUnknownOrEmptyOption(value);
          }
        };
        selectCtrl.readValue = function readNgOptionsValue() {
          var selectedOption = options.selectValueMap[selectElement.val()];
          if (selectedOption && !selectedOption.disabled) {
            selectCtrl.unselectEmptyOption();
            selectCtrl.removeUnknownOption();
            return options.getViewValueFromOption(selectedOption);
          }
          return null;
        };
        if (ngOptions.trackBy) {
          scope.$watch(function() {
            return ngOptions.getTrackByValue(ngModelCtrl.$viewValue);
          }, function() {
            ngModelCtrl.$render();
          });
        }
      } else {
        selectCtrl.writeValue = function writeNgOptionsMultiple(values) {
          if (!options)
            return;
          var selectedOptions = values && values.map(getAndUpdateSelectedOption) || [];
          options.items.forEach(function(option) {
            if (option.element.selected && !includes(selectedOptions, option)) {
              option.element.selected = false;
            }
          });
        };
        selectCtrl.readValue = function readNgOptionsMultiple() {
          var selectedValues = selectElement.val() || [], selections = [];
          forEach(selectedValues, function(value) {
            var option = options.selectValueMap[value];
            if (option && !option.disabled)
              selections.push(options.getViewValueFromOption(option));
          });
          return selections;
        };
        if (ngOptions.trackBy) {
          scope.$watchCollection(function() {
            if (isArray(ngModelCtrl.$viewValue)) {
              return ngModelCtrl.$viewValue.map(function(value) {
                return ngOptions.getTrackByValue(value);
              });
            }
          }, function() {
            ngModelCtrl.$render();
          });
        }
      }
      if (providedEmptyOption) {
        $compile(selectCtrl.emptyOption)(scope);
        selectElement.prepend(selectCtrl.emptyOption);
        if (selectCtrl.emptyOption[0].nodeType === NODE_TYPE_COMMENT) {
          selectCtrl.hasEmptyOption = false;
          selectCtrl.registerOption = function(optionScope, optionEl) {
            if (optionEl.val() === "") {
              selectCtrl.hasEmptyOption = true;
              selectCtrl.emptyOption = optionEl;
              selectCtrl.emptyOption.removeClass("ng-scope");
              ngModelCtrl.$render();
              optionEl.on("$destroy", function() {
                var needsRerender = selectCtrl.$isEmptyOptionSelected();
                selectCtrl.hasEmptyOption = false;
                selectCtrl.emptyOption = void 0;
                if (needsRerender)
                  ngModelCtrl.$render();
              });
            }
          };
        } else {
          selectCtrl.emptyOption.removeClass("ng-scope");
        }
      }
      scope.$watchCollection(ngOptions.getWatchables, updateOptions);
      function addOptionElement(option, parent) {
        var optionElement = optionTemplate.cloneNode(false);
        parent.appendChild(optionElement);
        updateOptionElement(option, optionElement);
      }
      function getAndUpdateSelectedOption(viewValue) {
        var option = options.getOptionFromViewValue(viewValue);
        var element = option && option.element;
        if (element && !element.selected)
          element.selected = true;
        return option;
      }
      function updateOptionElement(option, element) {
        option.element = element;
        element.disabled = option.disabled;
        if (option.label !== element.label) {
          element.label = option.label;
          element.textContent = option.label;
        }
        element.value = option.selectValue;
      }
      function updateOptions() {
        var previousValue = options && selectCtrl.readValue();
        if (options) {
          for (var i2 = options.items.length - 1; i2 >= 0; i2--) {
            var option = options.items[i2];
            if (isDefined(option.group)) {
              jqLiteRemove(option.element.parentNode);
            } else {
              jqLiteRemove(option.element);
            }
          }
        }
        options = ngOptions.getOptions();
        var groupElementMap = {};
        options.items.forEach(function addOption(option2) {
          var groupElement;
          if (isDefined(option2.group)) {
            groupElement = groupElementMap[option2.group];
            if (!groupElement) {
              groupElement = optGroupTemplate.cloneNode(false);
              listFragment.appendChild(groupElement);
              groupElement.label = option2.group === null ? "null" : option2.group;
              groupElementMap[option2.group] = groupElement;
            }
            addOptionElement(option2, groupElement);
          } else {
            addOptionElement(option2, listFragment);
          }
        });
        selectElement[0].appendChild(listFragment);
        ngModelCtrl.$render();
        if (!ngModelCtrl.$isEmpty(previousValue)) {
          var nextValue = selectCtrl.readValue();
          var isNotPrimitive = ngOptions.trackBy || multiple;
          if (isNotPrimitive ? !equals(previousValue, nextValue) : previousValue !== nextValue) {
            ngModelCtrl.$setViewValue(nextValue);
            ngModelCtrl.$render();
          }
        }
      }
    }
    return {
      restrict: "A",
      terminal: true,
      require: ["select", "ngModel"],
      link: {
        pre: function ngOptionsPreLink(scope, selectElement, attr, ctrls) {
          ctrls[0].registerOption = noop;
        },
        post: ngOptionsPostLink
      }
    };
  }];
  var ngPluralizeDirective = ["$locale", "$interpolate", "$log", function($locale, $interpolate, $log) {
    var BRACE = /{}/g, IS_WHEN = /^when(Minus)?(.+)$/;
    return {
      link: function(scope, element, attr) {
        var numberExp = attr.count, whenExp = attr.$attr.when && element.attr(attr.$attr.when), offset = attr.offset || 0, whens = scope.$eval(whenExp) || {}, whensExpFns = {}, startSymbol = $interpolate.startSymbol(), endSymbol = $interpolate.endSymbol(), braceReplacement = startSymbol + numberExp + "-" + offset + endSymbol, watchRemover = angular2.noop, lastCount;
        forEach(attr, function(expression, attributeName) {
          var tmpMatch = IS_WHEN.exec(attributeName);
          if (tmpMatch) {
            var whenKey = (tmpMatch[1] ? "-" : "") + lowercase(tmpMatch[2]);
            whens[whenKey] = element.attr(attr.$attr[attributeName]);
          }
        });
        forEach(whens, function(expression, key2) {
          whensExpFns[key2] = $interpolate(expression.replace(BRACE, braceReplacement));
        });
        scope.$watch(numberExp, function ngPluralizeWatchAction(newVal) {
          var count = parseFloat(newVal);
          var countIsNaN = isNumberNaN(count);
          if (!countIsNaN && !(count in whens)) {
            count = $locale.pluralCat(count - offset);
          }
          if (count !== lastCount && !(countIsNaN && isNumberNaN(lastCount))) {
            watchRemover();
            var whenExpFn = whensExpFns[count];
            if (isUndefined(whenExpFn)) {
              if (newVal != null) {
                $log.debug("ngPluralize: no rule defined for '" + count + "' in " + whenExp);
              }
              watchRemover = noop;
              updateElementText();
            } else {
              watchRemover = scope.$watch(whenExpFn, updateElementText);
            }
            lastCount = count;
          }
        });
        function updateElementText(newText) {
          element.text(newText || "");
        }
      }
    };
  }];
  var ngRefMinErr = minErr("ngRef");
  var ngRefDirective = ["$parse", function($parse) {
    return {
      priority: -1,
      restrict: "A",
      compile: function(tElement, tAttrs) {
        var controllerName = directiveNormalize(nodeName_(tElement));
        var getter2 = $parse(tAttrs.ngRef);
        var setter = getter2.assign || function() {
          throw ngRefMinErr("nonassign", 'Expression in ngRef="{0}" is non-assignable!', tAttrs.ngRef);
        };
        return function(scope, element, attrs) {
          var refValue;
          if (attrs.hasOwnProperty("ngRefRead")) {
            if (attrs.ngRefRead === "$element") {
              refValue = element;
            } else {
              refValue = element.data("$" + attrs.ngRefRead + "Controller");
              if (!refValue) {
                throw ngRefMinErr("noctrl", 'The controller for ngRefRead="{0}" could not be found on ngRef="{1}"', attrs.ngRefRead, tAttrs.ngRef);
              }
            }
          } else {
            refValue = element.data("$" + controllerName + "Controller");
          }
          refValue = refValue || element;
          setter(scope, refValue);
          element.on("$destroy", function() {
            if (getter2(scope) === refValue) {
              setter(scope, null);
            }
          });
        };
      }
    };
  }];
  var ngRepeatDirective = ["$parse", "$animate", "$compile", function($parse, $animate, $compile) {
    var NG_REMOVED = "$$NG_REMOVED";
    var ngRepeatMinErr = minErr("ngRepeat");
    var updateScope = function(scope, index, valueIdentifier, value, keyIdentifier, key2, arrayLength) {
      scope[valueIdentifier] = value;
      if (keyIdentifier)
        scope[keyIdentifier] = key2;
      scope.$index = index;
      scope.$first = index === 0;
      scope.$last = index === arrayLength - 1;
      scope.$middle = !(scope.$first || scope.$last);
      scope.$odd = !(scope.$even = (index & 1) === 0);
    };
    var getBlockStart = function(block) {
      return block.clone[0];
    };
    var getBlockEnd = function(block) {
      return block.clone[block.clone.length - 1];
    };
    var trackByIdArrayFn = function($scope, key2, value) {
      return hashKey(value);
    };
    var trackByIdObjFn = function($scope, key2) {
      return key2;
    };
    return {
      restrict: "A",
      multiElement: true,
      transclude: "element",
      priority: 1e3,
      terminal: true,
      $$tlb: true,
      compile: function ngRepeatCompile($element, $attr) {
        var expression = $attr.ngRepeat;
        var ngRepeatEndComment = $compile.$$createComment("end ngRepeat", expression);
        var match = expression.match(/^\s*([\s\S]+?)\s+in\s+([\s\S]+?)(?:\s+as\s+([\s\S]+?))?(?:\s+track\s+by\s+([\s\S]+?))?\s*$/);
        if (!match) {
          throw ngRepeatMinErr("iexp", "Expected expression in form of '_item_ in _collection_[ track by _id_]' but got '{0}'.", expression);
        }
        var lhs = match[1];
        var rhs = match[2];
        var aliasAs = match[3];
        var trackByExp = match[4];
        match = lhs.match(/^(?:(\s*[$\w]+)|\(\s*([$\w]+)\s*,\s*([$\w]+)\s*\))$/);
        if (!match) {
          throw ngRepeatMinErr("iidexp", "'_item_' in '_item_ in _collection_' should be an identifier or '(_key_, _value_)' expression, but got '{0}'.", lhs);
        }
        var valueIdentifier = match[3] || match[1];
        var keyIdentifier = match[2];
        if (aliasAs && (!/^[$a-zA-Z_][$a-zA-Z0-9_]*$/.test(aliasAs) || /^(null|undefined|this|\$index|\$first|\$middle|\$last|\$even|\$odd|\$parent|\$root|\$id)$/.test(aliasAs))) {
          throw ngRepeatMinErr("badident", "alias '{0}' is invalid --- must be a valid JS identifier which is not a reserved name.", aliasAs);
        }
        var trackByIdExpFn;
        if (trackByExp) {
          var hashFnLocals = { $id: hashKey };
          var trackByExpGetter = $parse(trackByExp);
          trackByIdExpFn = function($scope, key2, value, index) {
            if (keyIdentifier)
              hashFnLocals[keyIdentifier] = key2;
            hashFnLocals[valueIdentifier] = value;
            hashFnLocals.$index = index;
            return trackByExpGetter($scope, hashFnLocals);
          };
        }
        return function ngRepeatLink($scope, $element2, $attr2, ctrl, $transclude) {
          var lastBlockMap = createMap();
          $scope.$watchCollection(rhs, function ngRepeatAction(collection) {
            var index, length, previousNode = $element2[0], nextNode, nextBlockMap = createMap(), collectionLength, key2, value, trackById, trackByIdFn, collectionKeys, block, nextBlockOrder, elementsToRemove;
            if (aliasAs) {
              $scope[aliasAs] = collection;
            }
            if (isArrayLike(collection)) {
              collectionKeys = collection;
              trackByIdFn = trackByIdExpFn || trackByIdArrayFn;
            } else {
              trackByIdFn = trackByIdExpFn || trackByIdObjFn;
              collectionKeys = [];
              for (var itemKey in collection) {
                if (hasOwnProperty.call(collection, itemKey) && itemKey.charAt(0) !== "$") {
                  collectionKeys.push(itemKey);
                }
              }
            }
            collectionLength = collectionKeys.length;
            nextBlockOrder = new Array(collectionLength);
            for (index = 0; index < collectionLength; index++) {
              key2 = collection === collectionKeys ? index : collectionKeys[index];
              value = collection[key2];
              trackById = trackByIdFn($scope, key2, value, index);
              if (lastBlockMap[trackById]) {
                block = lastBlockMap[trackById];
                delete lastBlockMap[trackById];
                nextBlockMap[trackById] = block;
                nextBlockOrder[index] = block;
              } else if (nextBlockMap[trackById]) {
                forEach(nextBlockOrder, function(block2) {
                  if (block2 && block2.scope)
                    lastBlockMap[block2.id] = block2;
                });
                throw ngRepeatMinErr("dupes", "Duplicates in a repeater are not allowed. Use 'track by' expression to specify unique keys. Repeater: {0}, Duplicate key: {1}, Duplicate value: {2}", expression, trackById, value);
              } else {
                nextBlockOrder[index] = { id: trackById, scope: void 0, clone: void 0 };
                nextBlockMap[trackById] = true;
              }
            }
            if (hashFnLocals) {
              hashFnLocals[valueIdentifier] = void 0;
            }
            for (var blockKey in lastBlockMap) {
              block = lastBlockMap[blockKey];
              elementsToRemove = getBlockNodes(block.clone);
              $animate.leave(elementsToRemove);
              if (elementsToRemove[0].parentNode) {
                for (index = 0, length = elementsToRemove.length; index < length; index++) {
                  elementsToRemove[index][NG_REMOVED] = true;
                }
              }
              block.scope.$destroy();
            }
            for (index = 0; index < collectionLength; index++) {
              key2 = collection === collectionKeys ? index : collectionKeys[index];
              value = collection[key2];
              block = nextBlockOrder[index];
              if (block.scope) {
                nextNode = previousNode;
                do {
                  nextNode = nextNode.nextSibling;
                } while (nextNode && nextNode[NG_REMOVED]);
                if (getBlockStart(block) !== nextNode) {
                  $animate.move(getBlockNodes(block.clone), null, previousNode);
                }
                previousNode = getBlockEnd(block);
                updateScope(block.scope, index, valueIdentifier, value, keyIdentifier, key2, collectionLength);
              } else {
                $transclude(function ngRepeatTransclude(clone, scope) {
                  block.scope = scope;
                  var endNode = ngRepeatEndComment.cloneNode(false);
                  clone[clone.length++] = endNode;
                  $animate.enter(clone, null, previousNode);
                  previousNode = endNode;
                  block.clone = clone;
                  nextBlockMap[block.id] = block;
                  updateScope(block.scope, index, valueIdentifier, value, keyIdentifier, key2, collectionLength);
                });
              }
            }
            lastBlockMap = nextBlockMap;
          });
        };
      }
    };
  }];
  var NG_HIDE_CLASS = "ng-hide";
  var NG_HIDE_IN_PROGRESS_CLASS = "ng-hide-animate";
  var ngShowDirective = ["$animate", function($animate) {
    return {
      restrict: "A",
      multiElement: true,
      link: function(scope, element, attr) {
        scope.$watch(attr.ngShow, function ngShowWatchAction(value) {
          $animate[value ? "removeClass" : "addClass"](element, NG_HIDE_CLASS, {
            tempClasses: NG_HIDE_IN_PROGRESS_CLASS
          });
        });
      }
    };
  }];
  var ngHideDirective = ["$animate", function($animate) {
    return {
      restrict: "A",
      multiElement: true,
      link: function(scope, element, attr) {
        scope.$watch(attr.ngHide, function ngHideWatchAction(value) {
          $animate[value ? "addClass" : "removeClass"](element, NG_HIDE_CLASS, {
            tempClasses: NG_HIDE_IN_PROGRESS_CLASS
          });
        });
      }
    };
  }];
  var ngStyleDirective = ngDirective(function(scope, element, attr) {
    scope.$watchCollection(attr.ngStyle, function ngStyleWatchAction(newStyles, oldStyles) {
      if (oldStyles && newStyles !== oldStyles) {
        forEach(oldStyles, function(val, style) {
          element.css(style, "");
        });
      }
      if (newStyles)
        element.css(newStyles);
    });
  });
  var ngSwitchDirective = ["$animate", "$compile", function($animate, $compile) {
    return {
      require: "ngSwitch",
      controller: ["$scope", function NgSwitchController() {
        this.cases = {};
      }],
      link: function(scope, element, attr, ngSwitchController) {
        var watchExpr = attr.ngSwitch || attr.on, selectedTranscludes = [], selectedElements = [], previousLeaveAnimations = [], selectedScopes = [];
        var spliceFactory = function(array, index) {
          return function(response) {
            if (response !== false)
              array.splice(index, 1);
          };
        };
        scope.$watch(watchExpr, function ngSwitchWatchAction(value) {
          var i, ii;
          while (previousLeaveAnimations.length) {
            $animate.cancel(previousLeaveAnimations.pop());
          }
          for (i = 0, ii = selectedScopes.length; i < ii; ++i) {
            var selected = getBlockNodes(selectedElements[i].clone);
            selectedScopes[i].$destroy();
            var runner = previousLeaveAnimations[i] = $animate.leave(selected);
            runner.done(spliceFactory(previousLeaveAnimations, i));
          }
          selectedElements.length = 0;
          selectedScopes.length = 0;
          if (selectedTranscludes = ngSwitchController.cases["!" + value] || ngSwitchController.cases["?"]) {
            forEach(selectedTranscludes, function(selectedTransclude) {
              selectedTransclude.transclude(function(caseElement, selectedScope) {
                selectedScopes.push(selectedScope);
                var anchor = selectedTransclude.element;
                caseElement[caseElement.length++] = $compile.$$createComment("end ngSwitchWhen");
                var block = { clone: caseElement };
                selectedElements.push(block);
                $animate.enter(caseElement, anchor.parent(), anchor);
              });
            });
          }
        });
      }
    };
  }];
  var ngSwitchWhenDirective = ngDirective({
    transclude: "element",
    priority: 1200,
    require: "^ngSwitch",
    multiElement: true,
    link: function(scope, element, attrs, ctrl, $transclude) {
      var cases = attrs.ngSwitchWhen.split(attrs.ngSwitchWhenSeparator).sort().filter(function(element2, index, array) {
        return array[index - 1] !== element2;
      });
      forEach(cases, function(whenCase) {
        ctrl.cases["!" + whenCase] = ctrl.cases["!" + whenCase] || [];
        ctrl.cases["!" + whenCase].push({ transclude: $transclude, element });
      });
    }
  });
  var ngSwitchDefaultDirective = ngDirective({
    transclude: "element",
    priority: 1200,
    require: "^ngSwitch",
    multiElement: true,
    link: function(scope, element, attr, ctrl, $transclude) {
      ctrl.cases["?"] = ctrl.cases["?"] || [];
      ctrl.cases["?"].push({ transclude: $transclude, element });
    }
  });
  var ngTranscludeMinErr = minErr("ngTransclude");
  var ngTranscludeDirective = ["$compile", function($compile) {
    return {
      restrict: "EAC",
      compile: function ngTranscludeCompile(tElement) {
        var fallbackLinkFn = $compile(tElement.contents());
        tElement.empty();
        return function ngTranscludePostLink($scope, $element, $attrs, controller, $transclude) {
          if (!$transclude) {
            throw ngTranscludeMinErr("orphan", "Illegal use of ngTransclude directive in the template! No parent directive that requires a transclusion found. Element: {0}", startingTag($element));
          }
          if ($attrs.ngTransclude === $attrs.$attr.ngTransclude) {
            $attrs.ngTransclude = "";
          }
          var slotName = $attrs.ngTransclude || $attrs.ngTranscludeSlot;
          $transclude(ngTranscludeCloneAttachFn, null, slotName);
          if (slotName && !$transclude.isSlotFilled(slotName)) {
            useFallbackContent();
          }
          function ngTranscludeCloneAttachFn(clone, transcludedScope) {
            if (clone.length && notWhitespace(clone)) {
              $element.append(clone);
            } else {
              useFallbackContent();
              transcludedScope.$destroy();
            }
          }
          function useFallbackContent() {
            fallbackLinkFn($scope, function(clone) {
              $element.append(clone);
            });
          }
          function notWhitespace(nodes) {
            for (var i = 0, ii = nodes.length; i < ii; i++) {
              var node = nodes[i];
              if (node.nodeType !== NODE_TYPE_TEXT || node.nodeValue.trim()) {
                return true;
              }
            }
          }
        };
      }
    };
  }];
  var scriptDirective = ["$templateCache", function($templateCache) {
    return {
      restrict: "E",
      terminal: true,
      compile: function(element, attr) {
        if (attr.type === "text/ng-template") {
          var templateUrl = attr.id, text = element[0].text;
          $templateCache.put(templateUrl, text);
        }
      }
    };
  }];
  var noopNgModelController = { $setViewValue: noop, $render: noop };
  function setOptionSelectedStatus(optionEl, value) {
    optionEl.prop("selected", value);
    optionEl.attr("selected", value);
  }
  var SelectController = ["$element", "$scope", function($element, $scope) {
    var self = this, optionsMap = new NgMap();
    self.selectValueMap = {};
    self.ngModelCtrl = noopNgModelController;
    self.multiple = false;
    self.unknownOption = jqLite(window2.document.createElement("option"));
    self.hasEmptyOption = false;
    self.emptyOption = void 0;
    self.renderUnknownOption = function(val) {
      var unknownVal = self.generateUnknownOptionValue(val);
      self.unknownOption.val(unknownVal);
      $element.prepend(self.unknownOption);
      setOptionSelectedStatus(self.unknownOption, true);
      $element.val(unknownVal);
    };
    self.updateUnknownOption = function(val) {
      var unknownVal = self.generateUnknownOptionValue(val);
      self.unknownOption.val(unknownVal);
      setOptionSelectedStatus(self.unknownOption, true);
      $element.val(unknownVal);
    };
    self.generateUnknownOptionValue = function(val) {
      return "? " + hashKey(val) + " ?";
    };
    self.removeUnknownOption = function() {
      if (self.unknownOption.parent())
        self.unknownOption.remove();
    };
    self.selectEmptyOption = function() {
      if (self.emptyOption) {
        $element.val("");
        setOptionSelectedStatus(self.emptyOption, true);
      }
    };
    self.unselectEmptyOption = function() {
      if (self.hasEmptyOption) {
        setOptionSelectedStatus(self.emptyOption, false);
      }
    };
    $scope.$on("$destroy", function() {
      self.renderUnknownOption = noop;
    });
    self.readValue = function readSingleValue() {
      var val = $element.val();
      var realVal = val in self.selectValueMap ? self.selectValueMap[val] : val;
      if (self.hasOption(realVal)) {
        return realVal;
      }
      return null;
    };
    self.writeValue = function writeSingleValue(value) {
      var currentlySelectedOption = $element[0].options[$element[0].selectedIndex];
      if (currentlySelectedOption)
        setOptionSelectedStatus(jqLite(currentlySelectedOption), false);
      if (self.hasOption(value)) {
        self.removeUnknownOption();
        var hashedVal = hashKey(value);
        $element.val(hashedVal in self.selectValueMap ? hashedVal : value);
        var selectedOption = $element[0].options[$element[0].selectedIndex];
        setOptionSelectedStatus(jqLite(selectedOption), true);
      } else {
        self.selectUnknownOrEmptyOption(value);
      }
    };
    self.addOption = function(value, element) {
      if (element[0].nodeType === NODE_TYPE_COMMENT)
        return;
      assertNotHasOwnProperty(value, '"option value"');
      if (value === "") {
        self.hasEmptyOption = true;
        self.emptyOption = element;
      }
      var count = optionsMap.get(value) || 0;
      optionsMap.set(value, count + 1);
      scheduleRender();
    };
    self.removeOption = function(value) {
      var count = optionsMap.get(value);
      if (count) {
        if (count === 1) {
          optionsMap.delete(value);
          if (value === "") {
            self.hasEmptyOption = false;
            self.emptyOption = void 0;
          }
        } else {
          optionsMap.set(value, count - 1);
        }
      }
    };
    self.hasOption = function(value) {
      return !!optionsMap.get(value);
    };
    self.$hasEmptyOption = function() {
      return self.hasEmptyOption;
    };
    self.$isUnknownOptionSelected = function() {
      return $element[0].options[0] === self.unknownOption[0];
    };
    self.$isEmptyOptionSelected = function() {
      return self.hasEmptyOption && $element[0].options[$element[0].selectedIndex] === self.emptyOption[0];
    };
    self.selectUnknownOrEmptyOption = function(value) {
      if (value == null && self.emptyOption) {
        self.removeUnknownOption();
        self.selectEmptyOption();
      } else if (self.unknownOption.parent().length) {
        self.updateUnknownOption(value);
      } else {
        self.renderUnknownOption(value);
      }
    };
    var renderScheduled = false;
    function scheduleRender() {
      if (renderScheduled)
        return;
      renderScheduled = true;
      $scope.$$postDigest(function() {
        renderScheduled = false;
        self.ngModelCtrl.$render();
      });
    }
    var updateScheduled = false;
    function scheduleViewValueUpdate(renderAfter) {
      if (updateScheduled)
        return;
      updateScheduled = true;
      $scope.$$postDigest(function() {
        if ($scope.$$destroyed)
          return;
        updateScheduled = false;
        self.ngModelCtrl.$setViewValue(self.readValue());
        if (renderAfter)
          self.ngModelCtrl.$render();
      });
    }
    self.registerOption = function(optionScope, optionElement, optionAttrs, interpolateValueFn, interpolateTextFn) {
      if (optionAttrs.$attr.ngValue) {
        var oldVal, hashedVal;
        optionAttrs.$observe("value", function valueAttributeObserveAction(newVal) {
          var removal;
          var previouslySelected = optionElement.prop("selected");
          if (isDefined(hashedVal)) {
            self.removeOption(oldVal);
            delete self.selectValueMap[hashedVal];
            removal = true;
          }
          hashedVal = hashKey(newVal);
          oldVal = newVal;
          self.selectValueMap[hashedVal] = newVal;
          self.addOption(newVal, optionElement);
          optionElement.attr("value", hashedVal);
          if (removal && previouslySelected) {
            scheduleViewValueUpdate();
          }
        });
      } else if (interpolateValueFn) {
        optionAttrs.$observe("value", function valueAttributeObserveAction(newVal) {
          self.readValue();
          var removal;
          var previouslySelected = optionElement.prop("selected");
          if (isDefined(oldVal)) {
            self.removeOption(oldVal);
            removal = true;
          }
          oldVal = newVal;
          self.addOption(newVal, optionElement);
          if (removal && previouslySelected) {
            scheduleViewValueUpdate();
          }
        });
      } else if (interpolateTextFn) {
        optionScope.$watch(interpolateTextFn, function interpolateWatchAction(newVal, oldVal2) {
          optionAttrs.$set("value", newVal);
          var previouslySelected = optionElement.prop("selected");
          if (oldVal2 !== newVal) {
            self.removeOption(oldVal2);
          }
          self.addOption(newVal, optionElement);
          if (oldVal2 && previouslySelected) {
            scheduleViewValueUpdate();
          }
        });
      } else {
        self.addOption(optionAttrs.value, optionElement);
      }
      optionAttrs.$observe("disabled", function(newVal) {
        if (newVal === "true" || newVal && optionElement.prop("selected")) {
          if (self.multiple) {
            scheduleViewValueUpdate(true);
          } else {
            self.ngModelCtrl.$setViewValue(null);
            self.ngModelCtrl.$render();
          }
        }
      });
      optionElement.on("$destroy", function() {
        var currentValue = self.readValue();
        var removeValue = optionAttrs.value;
        self.removeOption(removeValue);
        scheduleRender();
        if (self.multiple && currentValue && currentValue.indexOf(removeValue) !== -1 || currentValue === removeValue) {
          scheduleViewValueUpdate(true);
        }
      });
    };
  }];
  var selectDirective = function() {
    return {
      restrict: "E",
      require: ["select", "?ngModel"],
      controller: SelectController,
      priority: 1,
      link: {
        pre: selectPreLink,
        post: selectPostLink
      }
    };
    function selectPreLink(scope, element, attr, ctrls) {
      var selectCtrl = ctrls[0];
      var ngModelCtrl = ctrls[1];
      if (!ngModelCtrl) {
        selectCtrl.registerOption = noop;
        return;
      }
      selectCtrl.ngModelCtrl = ngModelCtrl;
      element.on("change", function() {
        selectCtrl.removeUnknownOption();
        scope.$apply(function() {
          ngModelCtrl.$setViewValue(selectCtrl.readValue());
        });
      });
      if (attr.multiple) {
        selectCtrl.multiple = true;
        selectCtrl.readValue = function readMultipleValue() {
          var array = [];
          forEach(element.find("option"), function(option) {
            if (option.selected && !option.disabled) {
              var val = option.value;
              array.push(val in selectCtrl.selectValueMap ? selectCtrl.selectValueMap[val] : val);
            }
          });
          return array;
        };
        selectCtrl.writeValue = function writeMultipleValue(value) {
          forEach(element.find("option"), function(option) {
            var shouldBeSelected = !!value && (includes(value, option.value) || includes(value, selectCtrl.selectValueMap[option.value]));
            var currentlySelected = option.selected;
            if (shouldBeSelected !== currentlySelected) {
              setOptionSelectedStatus(jqLite(option), shouldBeSelected);
            }
          });
        };
        var lastView, lastViewRef = NaN;
        scope.$watch(function selectMultipleWatch() {
          if (lastViewRef === ngModelCtrl.$viewValue && !equals(lastView, ngModelCtrl.$viewValue)) {
            lastView = shallowCopy(ngModelCtrl.$viewValue);
            ngModelCtrl.$render();
          }
          lastViewRef = ngModelCtrl.$viewValue;
        });
        ngModelCtrl.$isEmpty = function(value) {
          return !value || value.length === 0;
        };
      }
    }
    function selectPostLink(scope, element, attrs, ctrls) {
      var ngModelCtrl = ctrls[1];
      if (!ngModelCtrl)
        return;
      var selectCtrl = ctrls[0];
      ngModelCtrl.$render = function() {
        selectCtrl.writeValue(ngModelCtrl.$viewValue);
      };
    }
  };
  var optionDirective = ["$interpolate", function($interpolate) {
    return {
      restrict: "E",
      priority: 100,
      compile: function(element, attr) {
        var interpolateValueFn, interpolateTextFn;
        if (isDefined(attr.ngValue))
          ;
        else if (isDefined(attr.value)) {
          interpolateValueFn = $interpolate(attr.value, true);
        } else {
          interpolateTextFn = $interpolate(element.text(), true);
          if (!interpolateTextFn) {
            attr.$set("value", element.text());
          }
        }
        return function(scope, element2, attr2) {
          var selectCtrlName = "$selectController", parent = element2.parent(), selectCtrl = parent.data(selectCtrlName) || parent.parent().data(selectCtrlName);
          if (selectCtrl) {
            selectCtrl.registerOption(scope, element2, attr2, interpolateValueFn, interpolateTextFn);
          }
        };
      }
    };
  }];
  var requiredDirective = ["$parse", function($parse) {
    return {
      restrict: "A",
      require: "?ngModel",
      link: function(scope, elm, attr, ctrl) {
        if (!ctrl)
          return;
        var value = attr.hasOwnProperty("required") || $parse(attr.ngRequired)(scope);
        if (!attr.ngRequired) {
          attr.required = true;
        }
        ctrl.$validators.required = function(modelValue, viewValue) {
          return !value || !ctrl.$isEmpty(viewValue);
        };
        attr.$observe("required", function(newVal) {
          if (value !== newVal) {
            value = newVal;
            ctrl.$validate();
          }
        });
      }
    };
  }];
  var patternDirective = ["$parse", function($parse) {
    return {
      restrict: "A",
      require: "?ngModel",
      compile: function(tElm, tAttr) {
        var patternExp;
        var parseFn;
        if (tAttr.ngPattern) {
          patternExp = tAttr.ngPattern;
          if (tAttr.ngPattern.charAt(0) === "/" && REGEX_STRING_REGEXP.test(tAttr.ngPattern)) {
            parseFn = function() {
              return tAttr.ngPattern;
            };
          } else {
            parseFn = $parse(tAttr.ngPattern);
          }
        }
        return function(scope, elm, attr, ctrl) {
          if (!ctrl)
            return;
          var attrVal = attr.pattern;
          if (attr.ngPattern) {
            attrVal = parseFn(scope);
          } else {
            patternExp = attr.pattern;
          }
          var regexp = parsePatternAttr(attrVal, patternExp, elm);
          attr.$observe("pattern", function(newVal) {
            var oldRegexp = regexp;
            regexp = parsePatternAttr(newVal, patternExp, elm);
            if ((oldRegexp && oldRegexp.toString()) !== (regexp && regexp.toString())) {
              ctrl.$validate();
            }
          });
          ctrl.$validators.pattern = function(modelValue, viewValue) {
            return ctrl.$isEmpty(viewValue) || isUndefined(regexp) || regexp.test(viewValue);
          };
        };
      }
    };
  }];
  var maxlengthDirective = ["$parse", function($parse) {
    return {
      restrict: "A",
      require: "?ngModel",
      link: function(scope, elm, attr, ctrl) {
        if (!ctrl)
          return;
        var maxlength = attr.maxlength || $parse(attr.ngMaxlength)(scope);
        var maxlengthParsed = parseLength(maxlength);
        attr.$observe("maxlength", function(value) {
          if (maxlength !== value) {
            maxlengthParsed = parseLength(value);
            maxlength = value;
            ctrl.$validate();
          }
        });
        ctrl.$validators.maxlength = function(modelValue, viewValue) {
          return maxlengthParsed < 0 || ctrl.$isEmpty(viewValue) || viewValue.length <= maxlengthParsed;
        };
      }
    };
  }];
  var minlengthDirective = ["$parse", function($parse) {
    return {
      restrict: "A",
      require: "?ngModel",
      link: function(scope, elm, attr, ctrl) {
        if (!ctrl)
          return;
        var minlength = attr.minlength || $parse(attr.ngMinlength)(scope);
        var minlengthParsed = parseLength(minlength) || -1;
        attr.$observe("minlength", function(value) {
          if (minlength !== value) {
            minlengthParsed = parseLength(value) || -1;
            minlength = value;
            ctrl.$validate();
          }
        });
        ctrl.$validators.minlength = function(modelValue, viewValue) {
          return ctrl.$isEmpty(viewValue) || viewValue.length >= minlengthParsed;
        };
      }
    };
  }];
  function parsePatternAttr(regex, patternExp, elm) {
    if (!regex)
      return void 0;
    if (isString(regex)) {
      regex = new RegExp("^" + regex + "$");
    }
    if (!regex.test) {
      throw minErr("ngPattern")("noregexp", "Expected {0} to be a RegExp but was {1}. Element: {2}", patternExp, regex, startingTag(elm));
    }
    return regex;
  }
  function parseLength(val) {
    var intVal = toInt(val);
    return isNumberNaN(intVal) ? -1 : intVal;
  }
  if (window2.angular.bootstrap) {
    if (window2.console) {
      console.log("WARNING: Tried to load AngularJS more than once.");
    }
    return;
  }
  bindJQuery();
  publishExternalAPI(angular2);
  angular2.module("ngLocale", [], ["$provide", function($provide) {
    var PLURAL_CATEGORY = { ZERO: "zero", ONE: "one", TWO: "two", FEW: "few", MANY: "many", OTHER: "other" };
    function getDecimals(n) {
      n = n + "";
      var i = n.indexOf(".");
      return i == -1 ? 0 : n.length - i - 1;
    }
    function getVF(n, opt_precision) {
      var v = opt_precision;
      if (v === void 0) {
        v = Math.min(getDecimals(n), 3);
      }
      var base = Math.pow(10, v);
      var f = (n * base | 0) % base;
      return { v, f };
    }
    $provide.value("$locale", {
      "DATETIME_FORMATS": {
        "AMPMS": [
          "AM",
          "PM"
        ],
        "DAY": [
          "Sunday",
          "Monday",
          "Tuesday",
          "Wednesday",
          "Thursday",
          "Friday",
          "Saturday"
        ],
        "ERANAMES": [
          "Before Christ",
          "Anno Domini"
        ],
        "ERAS": [
          "BC",
          "AD"
        ],
        "FIRSTDAYOFWEEK": 6,
        "MONTH": [
          "January",
          "February",
          "March",
          "April",
          "May",
          "June",
          "July",
          "August",
          "September",
          "October",
          "November",
          "December"
        ],
        "SHORTDAY": [
          "Sun",
          "Mon",
          "Tue",
          "Wed",
          "Thu",
          "Fri",
          "Sat"
        ],
        "SHORTMONTH": [
          "Jan",
          "Feb",
          "Mar",
          "Apr",
          "May",
          "Jun",
          "Jul",
          "Aug",
          "Sep",
          "Oct",
          "Nov",
          "Dec"
        ],
        "STANDALONEMONTH": [
          "January",
          "February",
          "March",
          "April",
          "May",
          "June",
          "July",
          "August",
          "September",
          "October",
          "November",
          "December"
        ],
        "WEEKENDRANGE": [
          5,
          6
        ],
        "fullDate": "EEEE, MMMM d, y",
        "longDate": "MMMM d, y",
        "medium": "MMM d, y h:mm:ss a",
        "mediumDate": "MMM d, y",
        "mediumTime": "h:mm:ss a",
        "short": "M/d/yy h:mm a",
        "shortDate": "M/d/yy",
        "shortTime": "h:mm a"
      },
      "NUMBER_FORMATS": {
        "CURRENCY_SYM": "$",
        "DECIMAL_SEP": ".",
        "GROUP_SEP": ",",
        "PATTERNS": [
          {
            "gSize": 3,
            "lgSize": 3,
            "maxFrac": 3,
            "minFrac": 0,
            "minInt": 1,
            "negPre": "-",
            "negSuf": "",
            "posPre": "",
            "posSuf": ""
          },
          {
            "gSize": 3,
            "lgSize": 3,
            "maxFrac": 2,
            "minFrac": 2,
            "minInt": 1,
            "negPre": "-\xA4",
            "negSuf": "",
            "posPre": "\xA4",
            "posSuf": ""
          }
        ]
      },
      "id": "en-us",
      "localeID": "en_US",
      "pluralCat": function(n, opt_precision) {
        var i = n | 0;
        var vf = getVF(n, opt_precision);
        if (i == 1 && vf.v == 0) {
          return PLURAL_CATEGORY.ONE;
        }
        return PLURAL_CATEGORY.OTHER;
      }
    });
  }]);
  jqLite(function() {
    angularInit(window2.document, bootstrap);
  });
})(window);
!window.angular.$$csp().noInlineStyle && window.angular.element(document.head).prepend(window.angular.element("<style>").text('@charset "UTF-8";[ng\\:cloak],[ng-cloak],[data-ng-cloak],[x-ng-cloak],.ng-cloak,.x-ng-cloak,.ng-hide:not(.ng-hide-animate){display:none !important;}ng\\:form{display:block;}.ng-animate-shim{visibility:hidden;}.ng-anchor{position:absolute;}'));
var angular_1 = angular;
var __defProp = Object.defineProperty;
var __getOwnPropSymbols = Object.getOwnPropertySymbols;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __propIsEnum = Object.prototype.propertyIsEnumerable;
var __defNormalProp = (obj, key, value) => key in obj ? __defProp(obj, key, { enumerable: true, configurable: true, writable: true, value }) : obj[key] = value;
var __spreadValues = (a, b) => {
  for (var prop in b || (b = {}))
    if (__hasOwnProp.call(b, prop))
      __defNormalProp(a, prop, b[prop]);
  if (__getOwnPropSymbols)
    for (var prop of __getOwnPropSymbols(b)) {
      if (__propIsEnum.call(b, prop))
        __defNormalProp(a, prop, b[prop]);
    }
  return a;
};
var __publicField = (obj, key, value) => {
  __defNormalProp(obj, typeof key !== "symbol" ? key + "" : key, value);
  return value;
};
function evaluateEvents(events, scope) {
  if (!(events && angular_1.isObject(events))) {
    return {};
  }
  const evaluatedEvents = Object.keys(events).reduce((accumulator, key) => {
    const fn = scope.$eval(events[key]);
    if (!angular_1.isFunction(fn)) {
      accumulator[key] = fn;
      console.warn(`[ngVue] Bound a non-function as an event handler (${key})`);
    } else {
      accumulator[key] = function() {
        return scope.$evalAsync(() => fn.apply(null, arguments));
      };
    }
    return accumulator;
  }, {});
  return evaluatedEvents;
}
function evaluateValues(expressions, scope) {
  if (!expressions)
    return {};
  const evaluatedValues = Object.keys(expressions).reduce((accumulator, prop) => {
    if (prop === "__ngvue_props__") {
      Object.assign(accumulator, scope.$eval(expressions.__ngvue_props__));
    } else {
      accumulator[prop] = scope.$eval(expressions[prop]);
    }
    return accumulator;
  }, {});
  return evaluatedValues;
}
function getTypeOf(value) {
  return value.constructor.name;
}
const transformers = {
  Object: (value) => [value],
  Array: (value) => value,
  String: (value) => value.split(/\s*,\s*/g).filter(Boolean).map((name) => ({ name }))
};
function evaluateDirectives(directiveExpression, scope) {
  if (!directiveExpression)
    return [];
  const directives = scope.$eval(directiveExpression);
  const transformer = transformers[getTypeOf(directives)];
  return transformer ? transformer(directives) : [];
}
const SPECIAL_ATTRS = ["class", "style"];
function extractSpecialAttributes(attributes, removeAttrFn) {
  return SPECIAL_ATTRS.reduce((accumulator, key) => {
    accumulator[key] = attributes[key] || "";
    removeAttrFn(key);
    return accumulator;
  }, {});
}
const excludedAttributes = [
  "vProps",
  "vOn",
  "vDirectives",
  "watchDepth",
  "ng",
  ...SPECIAL_ATTRS
];
const excludePattern = new RegExp(`^(${excludedAttributes.join("|")})`, "i");
function extractHtmlAttributes(attributes) {
  return Object.keys(attributes).filter((attribute) => {
    const isExcludedAttribute = excludePattern.test(attribute);
    const isAngularInternal = attribute[0] === "$";
    return !(isExcludedAttribute || isAngularInternal);
  });
}
function lowerFirst([first, ...rest]) {
  return first.toLowerCase() + rest.join("");
}
const replacementMap = {
  vProps: "",
  vOn: "on"
};
Object.freeze(replacementMap);
function extractExpressionName(expression, replaceKey) {
  const pattern = new RegExp(`^${replaceKey}`, "i");
  if (!pattern.test(expression))
    return null;
  const name = expression.replace(pattern, replacementMap[replaceKey]);
  return lowerFirst(name);
}
const attributeMap = {
  props: "vProps",
  on: "vOn"
};
Object.freeze(attributeMap);
function isAttributeMapKey(expressionType) {
  return expressionType in attributeMap;
}
function extractExpressions(expressionType, attributes, removeAttrFn) {
  let expressions = [];
  let key;
  let extractExpressionFn;
  let baseExpressionMap = {};
  if (isAttributeMapKey(expressionType)) {
    key = attributeMap[expressionType];
    const objectExpression = attributes[key];
    if (objectExpression !== void 0) {
      baseExpressionMap.__ngvue_props__ = objectExpression;
      removeAttrFn(key);
    }
    const propRegExp = new RegExp(`^${key}.+`, "i");
    expressions = Object.keys(attributes).filter((attr) => propRegExp.test(attr));
    extractExpressionFn = (accumulator, attrKey) => {
      const exprName = extractExpressionName(attrKey, key);
      if (exprName) {
        accumulator[exprName] = attributes[attrKey];
        removeAttrFn(attrKey);
      }
      return accumulator;
    };
  } else {
    expressions = extractHtmlAttributes(attributes);
    extractExpressionFn = (accumulator, attrKey) => {
      const denormalizedAttr = attributes.$attr[attrKey];
      accumulator[denormalizedAttr] = attributes[attrKey] === "" ? `${attrKey}` : attributes[attrKey];
      removeAttrFn(attrKey);
      return accumulator;
    };
  }
  const expressionsMap = expressions.reduce(extractExpressionFn, baseExpressionMap);
  return expressionsMap;
}
function getExpressions(attributes, removeAttrFn) {
  return {
    props: extractExpressions("props", attributes, removeAttrFn) || {},
    events: extractExpressions("on", attributes, removeAttrFn) || {},
    attrs: extractExpressions("attrs", attributes, removeAttrFn) || {}
  };
}
function watchExpressions(expressions, state, scope, options = { depth: "reference" }) {
  if (!expressions)
    return;
  const watcher = getWatcher(expressions, state);
  switch (options.depth) {
    case "value":
      watcher((expression, setter) => scope.$watch(expression, setter, true));
      break;
    case "collection":
      watcher((expression, setter) => scope.$watchCollection(expression, setter));
      break;
    case "reference":
    default:
      watcher((expression, setter) => scope.$watch(expression, setter));
      break;
  }
}
function isNgPropsObject(name, value) {
  return name === "__ngvue_props__" && angular_1.isObject(value);
}
function getWatcher(expressions, state) {
  return (callback) => {
    Object.keys(expressions).forEach((name) => {
      const setter = (value) => {
        if (isNgPropsObject(name, value)) {
          Object.keys(value).forEach((key) => {
            state[key] = value[key];
          });
        } else {
          state[name] = value;
        }
      };
      callback(expressions[name], setter);
    });
  };
}
const store = {};
function getInstanceState(id) {
  if (!store[id]) {
    store[id] = {
      props: reactive({}),
      attrs: reactive({}),
      special: reactive({})
    };
  }
  return store[id];
}
function getComponentName(component) {
  let name = "AnonymousComponent";
  if (component.name) {
    name = component.name;
  } else if (component.__file) {
    name = parseFileName(component.__file) || name;
  }
  return name;
}
function parseFileName(path) {
  let name = "";
  const match = path.match(/([^/\\]+)\.\w+$/);
  if (match) {
    name = match[1].replace(/(?:^|[-_])(\w)/g, (c) => c.toUpperCase()).replace(/[-_]/g, "");
  }
  return name;
}
function ngVueLinker(Component, jqElement, attrs, scope, $injector) {
  const instanceKey = Symbol("ngVueInstanceKey");
  const state = getInstanceState(instanceKey);
  const removeAttrFn = getAttrRemoveFunction(jqElement, attrs);
  const attrExpressions = getExpressions(attrs, removeAttrFn);
  const events = evaluateEvents(attrExpressions.events, scope);
  const ngVueDirectives = evaluateDirectives(attrs.vDirectives, scope);
  Object.assign(state.props, evaluateValues(attrExpressions.props, scope));
  Object.assign(state.attrs, evaluateValues(attrExpressions.attrs, scope));
  Object.assign(state.special, extractSpecialAttributes(attrs, removeAttrFn));
  const options = { depth: attrs.watchDepth };
  removeAttrFn("watchDepth");
  watchExpressions(attrExpressions.props, state.props, scope, options);
  watchExpressions(attrExpressions.attrs, state.attrs, scope, options);
  let html = getInnerHtml(jqElement[0]);
  let vueInstance = createAppInstance(Component, html, state, events, ngVueDirectives);
  loadNgVueGlobals(vueInstance, $injector);
  vueInstance.mount(jqElement[0]);
  scope.$on("$destroy", () => {
    vueInstance.unmount();
    if (vueInstance._container) {
      angular_1.element(vueInstance._container).remove();
    }
    vueInstance = null;
  });
}
function createAppInstance(Component, html, state, events, ngVueDirectives) {
  return createApp({
    name: `NgVue${getComponentName(Component)}`,
    setup() {
      const slot = ref(null);
      onMounted(() => {
        var _a, _b;
        if (html) {
          try {
            (_b = (_a = slot.value) == null ? void 0 : _a.parentElement) == null ? void 0 : _b.replaceChild(html, slot.value);
          } catch (err) {
            console.error("Attempted to insert content into slot and something went wrong. Inserting content, especially angular content, into a components slot is not advisable. This is a pretty hacky implementation in ngVue. Open an issue at https://github.com/jaredmcateer/ngvue3/issues with details.");
          }
        }
      });
      return () => {
        let node = h(Component, __spreadValues(__spreadValues(__spreadValues(__spreadValues({}, state.props), state.attrs), state.special), events), () => [h("span", { ref: slot })]);
        if (ngVueDirectives.length > 0) {
          const directives = ngVueDirectives.filter((d) => !!resolveDirective(d.name)).map((d) => {
            const directive = resolveDirective(d.name);
            return [directive, d.value, d.arg, d.modifiers];
          });
          node = withDirectives(node, directives);
        }
        return node;
      };
    }
  });
}
function loadNgVueGlobals(vueInstance, $injector) {
  const $ngVue = $injector.has("$ngVue") ? $injector.get("$ngVue") : null;
  if ($ngVue) {
    $ngVue.initNgVuePlugins(vueInstance);
    $ngVue.getVuePlugins().forEach((plugin) => vueInstance.use(plugin));
    $ngVue.getInjectables().forEach(([key, value]) => vueInstance.provide(key, value));
    Object.entries($ngVue.getVueDirectives()).forEach(([name, directive]) => vueInstance.directive(name, directive));
  }
}
function getInnerHtml(element) {
  if (element.innerHTML.trim()) {
    let html;
    if (element.children.length === 0) {
      const span = document.createElement("span");
      span.innerHTML = element.innerHTML.trim();
      html = span;
    } else {
      html = element.children[0];
    }
    return html;
  }
}
function getAttrRemoveFunction(element, attributes) {
  return (attr) => {
    const denormalizedAttr = attributes.$attr[attr];
    element.removeAttr(denormalizedAttr);
  };
}
function ngVueComponentFactory($injector) {
  return (component, ngDirectiveConfig) => {
    const config = {
      restrict: "E",
      link(scope, elem, attrs) {
        ngVueLinker(component, elem, attrs, scope, $injector);
      }
    };
    return angular_1.extend(config, ngDirectiveConfig);
  };
}
ngVueComponentFactory.$inject = ["$injector"];
function ngVueComponent(name, Component, ngDirectiveConfig) {
  return [
    name,
    [
      "createVueComponent",
      (createVueComponent) => createVueComponent(Component, ngDirectiveConfig)
    ]
  ];
}
class NgVueProvider {
  constructor($injector) {
    __publicField(this, "$injector");
    __publicField(this, "$get");
    __publicField(this, "pluginHooks", []);
    __publicField(this, "pluginConfig", {});
    __publicField(this, "injectables", []);
    __publicField(this, "nativeVuePlugins", []);
    __publicField(this, "nativeVueDirectives", {});
    this.$injector = $injector;
    this.$get = [
      "$injector",
      ($injector2) => {
        const initNgVuePlugins = (app) => {
          const callback = (hook) => {
            hook($injector2, app);
          };
          this.callHooks(this.pluginHooks, callback);
        };
        return {
          initNgVuePlugins,
          getInjectables: () => this.injectables,
          getVuePlugins: () => this.nativeVuePlugins,
          getVueDirectives: () => this.nativeVueDirectives
        };
      }
    ];
  }
  get plugins() {
    return this.pluginConfig;
  }
  provide(name, value) {
    this.injectables.push([name, value]);
  }
  use(vuePlugin) {
    this.nativeVuePlugins.push(vuePlugin);
  }
  directive(name, vueDirective) {
    this.nativeVueDirectives[name] = vueDirective;
  }
  installNgVuePlugin(plugin) {
    const { $name, $config, $plugin } = plugin();
    this.pluginHooks.push($plugin);
    this.pluginConfig[$name] = $config;
  }
  callHooks(hooks, callback) {
    if (hooks) {
      hooks.forEach((hook) => callback(hook));
    }
  }
}
__publicField(NgVueProvider, "$inject", ["$injector"]);
let ngVueModule;
function useNgVue() {
  if (!ngVueModule) {
    ngVueModule = angular_1.module("ngVue", []).factory("createVueComponent", ngVueComponentFactory);
  }
  return ngVueModule.name;
}
export { angular_1 as a, ngVueComponent as n, useNgVue as u };
