"use strict";

var _Object$keys = require("@babel/runtime-corejs3/core-js-stable/object/keys");

var _Object$getOwnPropertySymbols = require("@babel/runtime-corejs3/core-js-stable/object/get-own-property-symbols");

var _filterInstanceProperty = require("@babel/runtime-corejs3/core-js-stable/instance/filter");

var _Object$getOwnPropertyDescriptor = require("@babel/runtime-corejs3/core-js-stable/object/get-own-property-descriptor");

var _forEachInstanceProperty2 = require("@babel/runtime-corejs3/core-js-stable/instance/for-each");

var _Object$getOwnPropertyDescriptors = require("@babel/runtime-corejs3/core-js-stable/object/get-own-property-descriptors");

var _Object$defineProperties = require("@babel/runtime-corejs3/core-js-stable/object/define-properties");

var _Object$defineProperty = require("@babel/runtime-corejs3/core-js-stable/object/define-property");

var _interopRequireDefault = require("@babel/runtime-corejs3/helpers/interopRequireDefault");

_Object$defineProperty(exports, "__esModule", {
  value: true
});

exports.default = sanitize;

var _slicedToArray2 = _interopRequireDefault(require("@babel/runtime-corejs3/helpers/slicedToArray"));

var _defineProperty2 = _interopRequireDefault(require("@babel/runtime-corejs3/helpers/defineProperty"));

var _isArray = _interopRequireDefault(require("@babel/runtime-corejs3/core-js-stable/array/is-array"));

var _includes = _interopRequireDefault(require("@babel/runtime-corejs3/core-js-stable/instance/includes"));

var _forEach = _interopRequireDefault(require("@babel/runtime-corejs3/core-js-stable/instance/for-each"));

var _entries = _interopRequireDefault(require("@babel/runtime-corejs3/core-js-stable/object/entries"));

require("core-js/features/array/includes");

require("core-js/features/object/entries");

function ownKeys(object, enumerableOnly) { var keys = _Object$keys(object); if (_Object$getOwnPropertySymbols) { var symbols = _Object$getOwnPropertySymbols(object); if (enumerableOnly) { symbols = _filterInstanceProperty(symbols).call(symbols, function (sym) { return _Object$getOwnPropertyDescriptor(object, sym).enumerable; }); } keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { var _context2; _forEachInstanceProperty2(_context2 = ownKeys(Object(source), true)).call(_context2, function (key) { (0, _defineProperty2.default)(target, key, source[key]); }); } else if (_Object$getOwnPropertyDescriptors) { _Object$defineProperties(target, _Object$getOwnPropertyDescriptors(source)); } else { var _context3; _forEachInstanceProperty2(_context3 = ownKeys(Object(source))).call(_context3, function (key) { _Object$defineProperty(target, key, _Object$getOwnPropertyDescriptor(source, key)); }); } } return target; }

/**
 * @private
 * Abstraction for selectFromObject and omitFromObject for DRYness.
 * Set isInclusion to true if the filter should be for including the filtered items (ie. selecting
 * only them vs omitting only them).
 */
function filterFromObject(obj, filter) {
  var _ref = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {},
      _ref$isInclusion = _ref.isInclusion,
      isInclusion = _ref$isInclusion === void 0 ? true : _ref$isInclusion;

  if (filter && (0, _isArray.default)(filter)) {
    return applyFilterOnObject(obj, isInclusion ? function (val) {
      return (0, _includes.default)(filter).call(filter, val);
    } : function (val) {
      return !(0, _includes.default)(filter).call(filter, val);
    });
  } else if (filter && typeof filter === 'function') {
    // Flip the filter fn's return if it's for inclusion
    return applyFilterOnObject(obj, isInclusion ? filter : function () {
      return !filter.apply(void 0, arguments);
    });
  } else {
    throw new Error('The given filter is not an array or function. Filter aborted');
  }
}
/**
 * @private
 * Returns a filtered copy of the given object's own enumerable properties (no inherited
 * properties), keeping any keys that pass the given filter function.
 */


function applyFilterOnObject(obj, filterFn) {
  var _context;

  if (filterFn == null) {
    return _objectSpread({}, obj);
  }

  var filteredObj = {};
  (0, _forEach.default)(_context = (0, _entries.default)(obj)).call(_context, function (_ref2) {
    var _ref3 = (0, _slicedToArray2.default)(_ref2, 2),
        key = _ref3[0],
        val = _ref3[1];

    if (filterFn(val, key)) {
      filteredObj[key] = val;
    }
  });
  return filteredObj;
}
/**
 * @private
 * Similar to lodash's _.pick(), this returns a copy of the given object's
 * own and inherited enumerable properties, selecting only the keys in
 * the given array or whose value pass the given filter function.
 * @param {Object} obj Source object
 * @param {Array|function} filter Array of key names to select or function to invoke per iteration
 * @return {Object} The new object
 */


function selectFromObject(obj, filter) {
  return filterFromObject(obj, filter);
}
/**
 * @private
 * Glorified selectFromObject. Takes an object and returns a filtered shallow copy that strips out
 * any properties that are falsy (including coercions, ie. undefined, null, '', 0, ...).
 * Does not modify the passed in object.
 *
 * @param {Object} obj Javascript object
 * @return {Object} Sanitized Javascript object
 */


function sanitize(obj) {
  return selectFromObject(obj, function (val) {
    return !!val;
  });
}