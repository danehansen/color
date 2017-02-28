'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.red = red;
exports.green = green;
exports.blue = blue;
exports.rgbToHex = rgbToHex;
exports.rgbToUint = rgbToUint;
exports.uintToHex = uintToHex;
exports.uintToRGB = uintToRGB;
exports.uintToRGBA = uintToRGBA;
exports.rgbToBrightness = rgbToBrightness;
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

var RGB_REGEX = /rgb\(\s*(\d+),\s*(\d+),\s*(\d+)\s*\)/g;
function rgbToHex(rgb) {
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

function uintToRGB(uint) {
  return 'rgb(' + red(uint) + ',' + green(uint) + ',' + blue(uint) + ')';
}

function uintToRGBA(uint) {
  var alpha = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 1;

  return 'rgba(' + red(uint) + ',' + green(uint) + ',' + blue(uint) + ',' + alpha + ')';
}

function rgbToBrightness(r, g, b) {
  var decimal = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : true;

  var total = r + g + b;
  return decimal ? total / WHITE : total;
}
