import { prepend } from "@danehansen/format";

const WHITE = 255 + 255 + 255;

export function getUint(red, green, blue) {
  return (red << 16) | (green << 8) | blue;
}

export function getRed(uint) {
  return (uint >> 16) & 0xff;
}

export function getGreen(uint) {
  return (uint >> 8) & 0xff;
}

export function getBlue(uint) {
  return uint & 0xff;
}

export function getHSL(red, green, blue) {
  const rgb = [red / 255, green / 255, blue / 255];
  let min = rgb[0];
  let max = rgb[0];
  let maxIndex = 0;
  for (let i = 1; i < rgb.length; i++) {
    if (rgb[i] <= min) {
      min = rgb[i];
    }
    if (rgb[i] >= max) {
      max = rgb[i];
      maxIndex = i;
    }
  }
  let hue = 0;
  if (maxIndex === 0) {
    hue = (rgb[1] - rgb[2]) / (max - min);
  } else if (maxIndex === 1) {
    hue = 2 + (rgb[2] - rgb[0]) / (max - min);
  } else if (maxIndex === 2) {
    hue = 4 + (rgb[0] - rgb[1]) / (max - min);
  }
  hue *= 60;
  if (hue < 0) {
    hue = hue + 360;
  }
  const lightness = (min + max) / 2;
  let saturation;
  if (min === max) {
    saturation = 0;
  } else {
    if (lightness < 0.5) {
      saturation = (max - min) / (max + min);
    } else {
      saturation = (max - min) / (2 - max - min);
    }
  }
  return {hue, saturation, lightness};
}

export function getRGB(hue, saturation, lightness) {
  function hueToRgb(t1, t2, h) {
    if (h < 0) {
      h += 6;
    }
    if (h >= 6) {
      h -= 6;
    }
    if (h < 1) {
      return (t2 - t1) * h + t1;
    } else if (h < 3) {
      return t2;
    } else if (h < 4) {
      return (t2 - t1) * (4 - h) + t1;
    } else {
      return t1;
    }
  }

  let total2;
  hue /= 60;
  if (lightness <= 0.5) {
    total2 = lightness * (saturation + 1);
  } else {
    total2 = lightness + saturation - (lightness * saturation);
  }
  const total1 = lightness * 2 - total2;

  return {
    red : hueToRgb(total1, total2, hue + 2) * 255,
    green: hueToRgb(total1, total2, hue) * 255,
    blue : hueToRgb(total1, total2, hue - 2) * 255,
  };
}

export function hexToUint(string) {
  let hex = /^(#|0x)?([0-9a-f]{6}|[0-9a-f]{3})$/i.exec(string)?.[2];
  if (!hex) {
    return null;
  }
  if (hex.length === 3) {
    hex = hex[0] + hex[0] + hex[1] + hex[1] + hex[2] + hex[2];
  }
  return parseInt(`0x${hex}`, 16);
}

export function rgbStringToRGB(string) {
  const rgb = /rgba?\s*\(\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+)\s*,?\s*\d*\.?\d*\s*\)/i.exec(string);
  if (!rgb) {
    return null;
  }
  return {red: parseFloat(rgb[1]), green: parseFloat(rgb[2]), blue: parseFloat(rgb[3])};
}

export function hslStringToHSL(string) {
  const hsl = /hsla?\s*\(\s*(\d*\.?\d*)\s*,\s*(\d+)\s*%\s*,\s*(\d+)\s*%\s*,?\s*\d*\.?\d*\s*\)/i.exec(string);
  if (!hsl) {
    return null;
  }
  return {hue: parseFloat(hsl[1]), saturation: parseFloat(hsl[2]) / 100, lightness: parseFloat(hsl[3]) / 100};
}

export function getBrightness(red, green, blue) {
  return (red + green + blue) / WHITE;
}

export function getRGBString(red, green, blue, alpha = 1) {
  return `rgba(${red}, ${green}, ${blue}, ${alpha})`;
}

export function getHSLString(hue, saturation, lightness, alpha = 1) {
  return `hsla(${hue}, ${saturation * 100}%, ${lightness * 100}%, ${alpha})`;
}

export function getHex(uint) {
  return `#${prepend(uint.toString(16), 6)}`;
}

export function getEverything({string, uint, red, green, blue, hue, saturation, lightness}) {
  let hasUint = typeof uint === 'number';
  let hasRGB = typeof red === 'number' && typeof green === 'number' && typeof blue === 'number';
  let hasHSL = typeof hue === 'number' && typeof saturation === 'number' && typeof lightness === 'number';
  let hasString = !!string;
  if (hasString) {
    const _uint = hexToUint(string);
    if (typeof _uint === 'number') {
      uint = _uint;
      red = getRed(uint);
      green = getGreen(uint);
      blue = getBlue(uint);
      ({hue, saturation, lightness} = getHSL(red, green, blue));
    } else {
      const _rgb = rgbStringToRGB(string);
      if (_rgb) {
        ({red, green, blue} = _rgb);
        uint = getUint(red, green, blue);
        ({hue, saturation, lightness} = getHSL(red, green, blue));
      } else {
        ({hue, saturation, lightness} = hslStringToHSL(string));
        ({red, green, blue} = getRGB(hue, saturation, lightness));
        uint = getUint(red, green, blue);
      }
    }
  } else {
    if (hasUint) {
      red = getRed(uint);
      green = getGreen(uint);
      blue = getBlue(uint);
      ({hue, saturation, lightness} = getHSL(red, green, blue));
    } else if (hasRGB) {
      uint = getUint(red, green, blue);
      ({hue, saturation, lightness} = getHSL(red, green, blue));
    } else {
      ({red, green, blue} = getRGB(hue, saturation, lightness));
      uint = getUint(red, green, blue);
    }
  }

  const brightness = getBrightness(red, green, blue);
  const rgb = getRGBString(red, green, blue);
  const hsl = getHSLString(hue, saturation, lightness);
  const hex = getHex(uint);

  return {
    red,
    green,
    blue,
    hue,
    saturation,
    lightness,
    brightness,
    rgb,
    hsl,
    uint,
    hex,
  }
}

export function distance({red:rA, green:gA, blue: bA}, {red:rB, green:gB, blue: bB}) {
  let result = (rA - rB) ** 2;
  result += (gA - gB) ** 2;
  result += (bA - bB) ** 2;
  return result;
}

export sortColorsByHue from "./sortColorsByHue";
