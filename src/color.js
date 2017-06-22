import { prepend } from '@danehansen/format'

const WHITE = 255 + 255 + 255

export function red(uint) {
  return uint >> 16 & 0xFF
}

export function green(uint) {
  return uint >> 8 & 0xFF
}

export function blue(uint) {
  return uint & 0xFF
}

export function rgbToBrightness(r, g, b) {
  return (r + g + b) / WHITE
}

const RGB_REGEX = /rgba?\(\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+)\s*,?\s*\d*\.?\d*\s*\)/i
export function stringToHex(rgb) {
  const exec = RGB_REGEX.exec(rgb)
  if (!exec) {
    return null
  }
  return uintToHex(rgbToUint(exec[1], exec[2], exec[3]))
}

export function rgbToUint(r, g, b) {
  return r << 16 | g << 8 | b
}

export function uintToHex(uint) {
  let str = uint.toString(16)
  return `#${prepend(str, 6)}`
}

export function uintToRGBString(uint) {
  return `rgb(${red(uint)},${green(uint)},${blue(uint)})`
}

export function uintToRGBAString(uint, alpha = 1) {
  return `rgba(${red(uint)},${green(uint)},${blue(uint)},${alpha})`
}
