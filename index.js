/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// identity function for calling harmony imports with the correct context
/******/ 	__webpack_require__.i = function(value) { return value; };
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, {
/******/ 				configurable: false,
/******/ 				enumerable: true,
/******/ 				get: getter
/******/ 			});
/******/ 		}
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = 0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.red = red;
exports.green = green;
exports.blue = blue;
exports.rgbToBrightness = rgbToBrightness;
exports.stringToHex = stringToHex;
exports.rgbToUint = rgbToUint;
exports.uintToHex = uintToHex;
exports.uintToRGBString = uintToRGBString;
exports.uintToRGBAString = uintToRGBAString;
var WHITE = 255 + 255 + 255;

function red(uint) {
  return uint >> 16 & 0xFF;
}

function green(uint) {
  return uint >> 8 & 0xFF;
}

function blue(uint) {
  return uint & 0xFF;
}

function rgbToBrightness(r, g, b) {
  var decimal = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : true;

  var total = r + g + b;
  return decimal ? total / WHITE : total;
}

var RGB_REGEX = /rgba?\(\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+)\s*,?\s*\d*\.?\d*\s*\)/i;
function stringToHex(rgb) {
  var exec = RGB_REGEX.exec(rgb);
  if (!exec) {
    return null;
  }
  return uintToHex(rgbToUint(exec[1], exec[2], exec[3]));
}

function rgbToUint(r, g, b) {
  return r << 16 | g << 8 | b;
}

function uintToHex(uint) {
  var str = uint.toString(16);
  while (str.length < 6) {
    // TODO: do this with math
    str = '0' + str;
  }
  return '#' + str;
}

function uintToRGBString(uint) {
  return 'rgb(' + red(uint) + ',' + green(uint) + ',' + blue(uint) + ')';
}

function uintToRGBAString(uint) {
  var alpha = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 1;

  return 'rgba(' + red(uint) + ',' + green(uint) + ',' + blue(uint) + ',' + alpha + ')';
}

/***/ })
/******/ ]);