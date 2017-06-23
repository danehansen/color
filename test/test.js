import * as color from '../src/color'

const REPEAT = 100
const CANVAS = makeCanvas()
const CONTEXT = makeContext(CANVAS)
const HOLDER = document.createElement('div')

function makeCanvas() {
  const canvas = document.createElement('canvas')
  canvas.width = 1
  canvas.height = 1
  return canvas
}

function makeContext(canvas) {
  const context = canvas.getContext('2d')
  context.imageSmoothingEnabled = false
  return context
}

function getPixelFromURL(color) {
  return new Promise(function(resolve) {
    const image = new Image()
    image.addEventListener('load', function() {
      const canvas = makeCanvas()
      const context = makeContext(canvas)
      context.drawImage(image, 0, 0)
      const imageData = context.getImageData(0, 0, 1, 1)
      const data = imageData.data

      resolve(data)
    })
    image.src = `https://dummyimage.com/1x1/${color}/${color}.png`
  })
}

function getPixelFromCanvas(str) {
  CONTEXT.fillStyle = str
  CONTEXT.fillRect(0, 0, 1, 1)
  return CONTEXT.getImageData(0, 0, 1, 1).data
}

function getFillStyleFromCanvas(str) {
  CONTEXT.fillStyle = str
  return CONTEXT.fillStyle
}

function getStringFromDOM(hex) {
  HOLDER.style.backgroundColor = hex
  return window.getComputedStyle(HOLDER).backgroundColor
}

function rand255() {
  return Math.floor(Math.random() * 256)
}

function randSpace() {
  return Math.random() > 0.5 ? '' : ' '
}

function randomBoolean() {
  return Math.random() > 0.5 ? true : false
}

function makeString(r = rand255(), g = rand255(), b = rand255(), a) {
  const hasA = (a !== undefined) ? a : randomBoolean()
  let str =  `rgb${hasA ? 'a' : ''}(${randSpace()}${r}${randSpace()},${randSpace()}${g}${randSpace()},${randSpace()}${b}${randSpace()}`

  if (hasA) {
    str += `,${randSpace()}${Math.random()}${randSpace()}`
  }
  str += ')'
  return str
}

describe('color', function() {
  before(function() {
    document.body.appendChild(HOLDER)
  })

  after(function() {
    document.body.removeChild(HOLDER)
  })

  describe('stringToHex', function() {
    it('returns null when theres no match', function() {
      expect(color.stringToHex('')).to.be.null
    })

    it('converts rgb(x,x,x) and rgba(x,x,x,x) to #XXXXXX', function() {
      for(let i = 0; i < REPEAT; i++) {
        const r = rand255()
        const g = rand255()
        const b = rand255()
        const str = makeString(r, g, b)
        const hex = color.stringToHex(str)
        const data = getPixelFromCanvas(hex)
        expect(data[0]).to.equal(r)
        expect(data[1]).to.equal(g)
        expect(data[2]).to.equal(b)
      }
    })
  })

  describe('rgbToUint', function() {
    it('converts seperate r, g, and b uints and converts to a single uint', function() {
      for(let i = 0; i < REPEAT; i++) {
        const r = rand255()
        const g = rand255()
        const b = rand255()
        const uint = color.rgbToUint(r, g, b)
        const str = uint.toString(16)
        const strR = str.slice(0, str.length - 4) || 0
        const strG = str.slice(str.length - 4, str.length - 2)
        const strB = str.slice(str.length - 2, str.length)
        expect(parseInt(`0x${strR}`)).to.equal(r)
        expect(parseInt(`0x${strG}`)).to.equal(g)
        expect(parseInt(`0x${strB}`)).to.equal(b)
      }
    })
  })

  describe('red, green, blue', function() {
    it('they get the appropriate color value from a uint as a uint', function() {
      for(let i = 0; i < REPEAT; i++) {
        const r = rand255()
        const g = rand255()
        const b = rand255()
        const uint = color.rgbToUint(r, g, b)
        expect(color.red(uint)).to.equal(r)
        expect(color.green(uint)).to.equal(g)
        expect(color.blue(uint)).to.equal(b)
      }
    })
  })

  describe('uintToRGBString', function() {
    it('converts a uint to rgb(x,x,x) format', function() {
      for(let i = 0; i < REPEAT; i++) {
        const r = rand255()
        const g = rand255()
        const b = rand255()
        const uint = color.rgbToUint(r, g, b)
        const str = color.uintToRGBString(uint)
        const data = getPixelFromCanvas(str)
        expect(data[0]).to.equal(r)
        expect(data[1]).to.equal(g)
        expect(data[2]).to.equal(b)
      }
    })
  })

  describe('uintToRGBAString', function() {
    it('converts a uint with alpha to rgba(x,x,x,x) format', function() {
      for(let i = 0; i < REPEAT; i++) {
        const r = rand255()
        const g = rand255()
        const b = rand255()
        const a = Math.random()
        const uint = color.rgbToUint(r, g, b)
        const str = color.uintToRGBAString(uint, a)
        const split = getStringFromDOM(str).split('(')[1].split(',')
        expect(parseInt(split[0])).to.equal(r)
        expect(parseInt(split[1])).to.equal(g)
        expect(parseInt(split[2])).to.equal(b)
        const newA = parseFloat(split[3] || 1)
        expect(Math.abs(newA - a)).to.be.below(0.004)
      }
    })

    it('converts a uint with default alpha to rgba(x,x,x,x) format', function() {
      for(let i = 0; i < REPEAT; i++) {
        const r = rand255()
        const g = rand255()
        const b = rand255()
        const uint = color.rgbToUint(r, g, b)
        const str = color.uintToRGBAString(uint)
        const split = getStringFromDOM(str).split('(')[1].split(',')
        expect(parseInt(split[0])).to.equal(r)
        expect(parseInt(split[1])).to.equal(g)
        expect(parseInt(split[2])).to.equal(b)
        expect(parseInt(split[3])).to.be.NaN
      }
    })
  })

  describe('uintToHex', function() {
    it('converts a uint to #XXXXXX format', function() {
      for(let i = 0; i < REPEAT; i++) {
        const r = rand255()
        const g = rand255()
        const b = rand255()
        const uint = color.rgbToUint(r, g, b)
        const str = color.uintToHex(uint)
        const data = getPixelFromCanvas(str)

        expect(Math.abs(data[0] - r)).to.be.below(2)
        expect(Math.abs(data[1] - g)).to.be.below(2)
        expect(Math.abs(data[2] - b)).to.be.below(2)
      }
    })
  })

  describe('rgbToBrightness', function() {
    it('converts seperate r, g, and b values to a brightness ratio between 0 and 1', function() {
      for(let i = 0; i < REPEAT; i++) {
        const r = rand255()
        const g = rand255()
        const b = rand255()
        const brightness = color.rgbToBrightness(r, g, b)

        expect((r + g + b) / (255 * 3)).to.equal(brightness)
      }
    })
  })

  describe('hexToUint', function() {
    it('converts a hex string into a uint', function() {
      for(let i = 0; i < REPEAT; i++) {
        const red = rand255()
        const green = rand255()
        const blue = rand255()
        const uint = color.rgbToUint(red, green, blue)
        let hex = color.uintToHex(uint)
        if (i % 3 === 1) {
          hex = hex.replace('#', '')
        } else if (i % 3 === 2) {
          hex = hex.replace('#', '0x')
        }
        expect(color.hexToUint(hex)).to.equal(uint)
      }
    })
  })

  // describe('rgbToHSL', function() {
  //   it('converts rgb into hsl', function() {
  //     for(let i = 0; i < REPEAT; i++) {
  //       const red = rand255()
  //       const green = rand255()
  //       const blue = rand255()
  //       const { hue, saturation, lightness } = color.rgbToHSL(red, green, blue)
  //
  //       if (i % 3 === 1) {
  //         hex = hex.replace('#', '')
  //       } else if (i % 3 === 2) {
  //         hex = hex.replace('#', '0x')
  //       }
  //       expect(color.hexToUint(hex)).to.equal(uint)
  //     }
  //   })
  // })

  describe('uintToHSLString', function() {
    it('converts rgb into hsl', function() {
      for(let i = 0; i < REPEAT; i++) {
        const red = rand255()
        const green = rand255()
        const blue = rand255()
        const uint = color.rgbToUint(red, green, blue)
        const str = color.uintToHSLString(uint)
        const pixel = getPixelFromCanvas(str)
        expect(pixel[0]).to.equal(red)
        expect(pixel[1]).to.equal(green)
        expect(pixel[2]).to.equal(blue)
      }
    })
  })
})
