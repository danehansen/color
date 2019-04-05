import { prepend } from "@danehansen/format";

const WHITE = 255 + 255 + 255;

export function red(uint) {
  return (uint >> 16) & 0xff;
}

export function green(uint) {
  return (uint >> 8) & 0xff;
}

export function blue(uint) {
  return uint & 0xff;
}

const HEX_REGEX = /^(#|0x)?([0-9a-f]{6}|[0-9a-f]{3})$/i;
export function hexToUint(hex) {
  const exec = HEX_REGEX.exec(hex);
  if (!exec) {
    return null;
  }
  hex = exec[2];
  if (hex.length === 3) {
    hex = hex[0] + hex[0] + hex[1] + hex[1] + hex[2] + hex[2];
  }
  return parseInt(`0x${hex}`, 16);
}

export function rgbToBrightness(r, g, b) {
  return (r + g + b) / WHITE;
}

// TODO not that accurate with how chrome calculates conversion
export function rgbToHSL(r, g, b) {
  r /= 255;
  g /= 255;
  b /= 255;
  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  const delta = max - min;

  let hue;
  let saturation;
  const lightness = (max + min) / 2;

  if (!delta) {
    hue = 0;
    saturation = 0;
  } else {
    switch (max) {
      case r:
        hue = (g - b) / delta;
        // hue = (g - b) / delta + (g < b ? 6 : 0)
        break;
      case g:
        hue = (b - r) / delta + 2;
        break;
      case b:
        hue = (r - g) / delta + 4;
        break;
    }
    hue /= 6;
    saturation =
      lightness > 0.5 ? delta / (2 - max - min) : delta / (max + min);
  }

  return {
    hue,
    saturation,
    lightness
  };
}

const RGB_REGEX = /rgba?\(\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+)\s*,?\s*\d*\.?\d*\s*\)/i;
export function stringToHex(rgb) {
  const exec = RGB_REGEX.exec(rgb);
  if (!exec) {
    return null;
  }
  return uintToHex(rgbToUint(exec[1], exec[2], exec[3]));
}

export function rgbToUint(r, g, b) {
  return (r << 16) | (g << 8) | b;
}

export function uintToHex(uint) {
  let str = uint.toString(16);
  return `#${prepend(str, 6)}`;
}

export function uintToRGBString(uint) {
  return `rgb(${red(uint)},${green(uint)},${blue(uint)})`;
}

export function uintToRGBAString(uint, alpha = 1) {
  return `rgba(${red(uint)},${green(uint)},${blue(uint)},${alpha})`;
}

export function uintToHSLString(uint) {
  const hsl = rgbToHSL(red(uint), green(uint), blue(uint));
  return `hsl(${Math.min(360, Math.floor(hsl.hue * 360))},${Math.min(
    100,
    Math.floor(hsl.saturation * 101)
  )}%,${Math.min(100, Math.floor(hsl.lightness * 101))}%)`;
}

export function distance(a, b) {
  let result = (a.red - b.red) ** 2;
  result += (a.green - b.green) ** 2;
  result += (a.blue - b.blue) ** 2;
  return result;
}

export sortColorsByHue from "./sortColorsByHue";
