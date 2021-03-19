import * as color from "../src/color";
import { prepend } from "@danehansen/format";
import min from "!raw-loader!../danehansen-color.min.js";

const REPEAT = 100;
const CANVAS = makeCanvas();
const CONTEXT = makeContext(CANVAS);
const HOLDER = document.createElement("div");

function makeCanvas() {
  const canvas = document.createElement("canvas");
  canvas.width = 1;
  canvas.height = 1;
  return canvas;
}

function makeContext(canvas) {
  const context = canvas.getContext("2d");
  context.imageSmoothingEnabled = false;
  return context;
}

function getPixelFromURL(color) {
  return new Promise((resolve) => {
    const image = new Image();
    image.addEventListener("load", () => {
      const canvas = makeCanvas();
      const context = makeContext(canvas);
      context.drawImage(image, 0, 0);
      const imageData = context.getImageData(0, 0, 1, 1);
      const data = imageData.data;

      resolve(data);
    });
    image.src = `https://dummyimage.com/1x1/${color}/${color}.png`;
  });
}

function getPixelFromCanvas(str) {
  CONTEXT.fillStyle = str;
  CONTEXT.fillRect(0, 0, 1, 1);
  return CONTEXT.getImageData(0, 0, 1, 1).data;
}

function getFillStyleFromCanvas(str) {
  CONTEXT.fillStyle = str;
  return CONTEXT.fillStyle;
}

function getStringFromDOM(hex) {
  HOLDER.style.backgroundColor = hex;
  return window.getComputedStyle(HOLDER).backgroundColor;
}

function rand255() {
  return Math.floor(Math.random() * 256);
}

function randSpace() {
  return Math.random() > 0.5 ? "" : " ";
}

function randomBoolean() {
  return Math.random() > 0.5 ? true : false;
}

function makeString(r = rand255(), g = rand255(), b = rand255(), a) {
  const hasA = a !== undefined ? a : randomBoolean();
  let str = `rgb${
    hasA ? "a" : ""
  }(${randSpace()}${r}${randSpace()},${randSpace()}${g}${randSpace()},${randSpace()}${b}${randSpace()}`;

  if (hasA) {
    str += `,${randSpace()}${Math.random()}${randSpace()}`;
  }
  str += ")";
  return str;
}

describe("color", () => {
  before(() => {
    document.body.appendChild(HOLDER);
  });

  after(() => {
    document.body.removeChild(HOLDER);
  });

  describe("danehansen-color.min.js", () => {
    it("is minified", () => {
      expect(min.match(/\n/g)).to.be.null;
    });
  });

  describe("getUint", () => {
    it("converts red green and blue into a uint", () => {
      expect(color.getUint(0,0,0)).to.equal(0);
      expect(color.getUint(255,255,255)).to.equal(256 * 256 * 256 - 1);
    });

    it("converts seperate r, g, and b uints and converts to a single uint", () => {
      // TODO this WAS flakey
      for (let i = 0; i < REPEAT; i++) {
        const r = rand255();
        const g = rand255();
        const b = rand255();
        const uint = color.getUint(r, g, b);
        const str = uint.toString(16);
        const strR = str.slice(0, str.length - 4) || 0;
        const strG = str.slice(str.length - 4, str.length - 2) || 0;
        const strB = str.slice(str.length - 2, str.length) || 0;
        expect(parseInt(`0x${strR}`)).to.equal(r);
        expect(parseInt(`0x${strG}`)).to.equal(g);
        expect(parseInt(`0x${strB}`)).to.equal(b);
      }
    });
  });

  describe("getRed, getGreen, getBlue", () => {
    it("they get the appropriate color value from a uint as a uint", () => {
      for (let i = 0; i < REPEAT; i++) {
        const r = rand255();
        const g = rand255();
        const b = rand255();
        const uint = color.getUint(r, g, b);
        expect(color.getRed(uint)).to.equal(r);
        expect(color.getGreen(uint)).to.equal(g);
        expect(color.getBlue(uint)).to.equal(b);
      }
    });
  });

  describe("hexToUint", () => {
    it("converts a 6 character hex string into a uint", () => {
      for (let i = 0; i < REPEAT; i++) {
        const red = rand255();
        const green = rand255();
        const blue = rand255();
        const uint = color.getUint(red, green, blue);
        let hex = color.getHex(uint);
        if (i % 3 === 1) {
          hex = hex.replace("#", "");
        } else if (i % 3 === 2) {
          hex = hex.replace("#", "0x");
        }
        expect(color.hexToUint(hex)).to.equal(uint);
      }
    });

    it("returns null when no match", () => {
      const red = rand255();
      const green = rand255();
      const blue = rand255();
      const uint = color.getUint(red, green, blue);
      let hex = color.getHex(uint);
      hex = hex + "x";
      expect(color.hexToUint(hex)).to.be.null;
    });

    it("converts a 3 character hex string into a uint", () => {
      function multOf17() {
        return Math.floor(Math.random() * 16) * 17;
      }

      for (let i = 0; i < REPEAT; i++) {
        const red = multOf17();
        const green = multOf17();
        const blue = multOf17();
        const uint = color.getUint(red, green, blue);
        let hex = color.getHex(uint);
        hex = `${hex[1]}${hex[3]}${hex[5]}`;
        if (i % 3 === 1) {
          hex = `#${hex}`;
        } else if (i % 3 === 2) {
          hex = `0x${hex}`;
        }
        expect(color.hexToUint(hex)).to.equal(uint);
      }
    });
  });

  describe("rgbStringToRGB", () => {
    it("returns null when theres no match", () => {
      expect(color.rgbStringToRGB("")).to.be.null;
    });

    it("converts rgb(x,x,x) and rgba(x,x,x,x) to red green and blue uints", () => {
      for (let i = 0; i < REPEAT; i++) {
        const r = rand255();
        const g = rand255();
        const b = rand255();
        let str = ['rgb','(',r,',',g,',',b,')'].join(randSpace());
        let {red, green, blue} = color.rgbStringToRGB(str);
        expect(red).to.equal(r);
        expect(green).to.equal(g);
        expect(blue).to.equal(b);

        str = ['rgba','(',r,',',g,',',b,',',Math.random(),')'].join(randSpace());
        ({red, green, blue} = color.rgbStringToRGB(str));
        expect(red).to.equal(r);
        expect(green).to.equal(g);
        expect(blue).to.equal(b);
      }
    });
  });

  describe("hslStringToHSL", () => {
    it("returns null when theres no match", () => {
      expect(color.hslStringToHSL("")).to.be.null;
    });

    it("converts hsl(x,x,x) and hsla(x,x,x,x) to hue saturation and lightness uints", () => {
      for (let i = 0; i < REPEAT; i++) {
        const h = Math.random() * 360;
        const s = Math.random();
        const l = Math.random();
        let str = ['hsl','(',h,',',Math.round(s * 100),'%',',',Math.round(l * 100),'%',')'].join(randSpace());
        let {hue, saturation, lightness} = color.hslStringToHSL(str);
        expect(Math.abs(h - hue)).to.be.below(2);
        expect(Math.abs(s - saturation)).to.be.below(2);
        expect(Math.abs(l - lightness)).to.be.below(2);

        str = ['hsla','(',h,',',Math.round(s * 100),'%',',',Math.round(l * 100),'%',',',Math.random(),')'].join(randSpace());
        ({hue, saturation, lightness} = color.hslStringToHSL(str));
        expect(Math.abs(h - hue)).to.be.below(0.01);
        expect(Math.abs(s - saturation)).to.be.below(0.01);
        expect(Math.abs(l - lightness)).to.be.below(0.01);
      }
    });
  });

  describe("getBrightness", () => {
    it("converts seperate r, g, and b values to a brightness ratio between 0 and 1", () => {
      for (let i = 0; i < REPEAT; i++) {
        const r = rand255();
        const g = rand255();
        const b = rand255();
        const brightness = color.getBrightness(r, g, b);
        expect((r + g + b) / (255 * 3)).to.equal(brightness);
      }
    });
  });

  describe("getHex", () => {
    it("converts a uint to #XXXXXX format", () => {
      for (let i = 0; i < REPEAT; i++) {
        const r = rand255();
        const g = rand255();
        const b = rand255();
        const uint = color.getUint(r, g, b);
        const str = color.getHex(uint);
        const data = getPixelFromCanvas(str);
        expect(data[0]).to.equal(r);
        expect(data[1]).to.equal(g);
        expect(data[2]).to.equal(b);
      }
    });
  });

  describe("distance", () => {
    it("calculates a distance between colors in arbitrary units", () => {
      for (let i = 0; i < REPEAT; i++) {
        const reddishA = {
          red: Math.round(Math.random() * 50 + 200),
          green: Math.round(Math.random() * 50),
          blue: Math.round(Math.random() * 50),
        };
        const reddishB = {
          red: Math.round(Math.random() * 50 + 200),
          green: Math.round(Math.random() * 50),
          blue: Math.round(Math.random() * 50),
        };
        const greenishA = {
          red: Math.round(Math.random() * 50),
          green: Math.round(Math.random() * 50 + 200),
          blue: Math.round(Math.random() * 50),
        };
        const greenishB = {
          red: Math.round(Math.random() * 50),
          green: Math.round(Math.random() * 50 + 200),
          blue: Math.round(Math.random() * 50),
        };
        const blueishA = {
          red: Math.round(Math.random() * 50),
          green: Math.round(Math.random() * 50),
          blue: Math.round(Math.random() * 50 + 200),
        };
        const blueishB = {
          red: Math.round(Math.random() * 50),
          green: Math.round(Math.random() * 50),
          blue: Math.round(Math.random() * 50 + 200),
        };

        expect(color.distance(reddishA,reddishB)).to.be.below(color.distance(reddishA,greenishA));
        expect(color.distance(reddishA,reddishB)).to.be.below(color.distance(reddishA,greenishB));
        expect(color.distance(reddishA,reddishB)).to.be.below(color.distance(reddishA,blueishA));
        expect(color.distance(reddishA,reddishB)).to.be.below(color.distance(reddishA,blueishB));

        expect(color.distance(reddishA,reddishB)).to.be.below(color.distance(reddishB,greenishA));
        expect(color.distance(reddishA,reddishB)).to.be.below(color.distance(reddishB,greenishB));
        expect(color.distance(reddishA,reddishB)).to.be.below(color.distance(reddishB,blueishA));
        expect(color.distance(reddishA,reddishB)).to.be.below(color.distance(reddishB,blueishB));

        expect(color.distance(reddishA,reddishB)).to.be.below(color.distance(greenishA,blueishA));
        expect(color.distance(reddishA,reddishB)).to.be.below(color.distance(greenishA,blueishB));

        expect(color.distance(reddishA,reddishB)).to.be.below(color.distance(greenishB,blueishA));
        expect(color.distance(reddishA,reddishB)).to.be.below(color.distance(greenishB,blueishB));
      }
    });
  });

  describe("sortColorsByHue", () => {
    const MAX_INT = 255 ** 3;
    function randomColors(bottom = 0, top = MAX_INT) {
      let colors = ["fff", "000", "f00", "ff0", "0f0", "0ff", "00f", "f0f"];
      for (let i = 0; i < 500; i++) {
        colors.push(
          color.getHex(Math.floor(Math.random() * (top - bottom)) + bottom)
        );
      }
      return colors;
    }

    function makeRGBs(strs) {
      const results = [];
      for (const str of strs) {
        const uint = color.hexToUint(str);
        results.push({
          red: color.getRed(uint),
          green: color.getGreen(uint),
          blue: color.getBlue(uint)
        });
      }
      return results;
    }

    function distanceOfRGBs(rgbs) {
      let distance = 0;
      for (let i = rgbs.length - 1; i > 0; i--) {
        distance += color.distance(rgbs[i], rgbs[i - 1]);
      }
      return distance;
    }

    it("gives an approximate sorting of colors", () => {
      const colors = makeRGBs(randomColors());
      const distanceBefore = distanceOfRGBs(colors);
      color.sortColorsByHue(colors);
      const distanceAfter = distanceOfRGBs(colors);
      expect(distanceAfter).is.below(distanceBefore * 0.1);
    });

    it("still sorts with seperate groups of close colors", () => {
      const colors = makeRGBs(["f00", "0f0", "f01", "0f1", "f02", "0f2"]);
      const distanceBefore = distanceOfRGBs(colors);
      color.sortColorsByHue(colors);
      const distanceAfter = distanceOfRGBs(colors);
      expect(distanceAfter).is.below(distanceBefore);
    });

    it("has all same items as the unaltered list", () => {
      const colors = makeRGBs(randomColors());
      const copy = [...colors];
      color.sortColorsByHue(colors);
      for (const c of copy) {
        expect(colors.indexOf(c)).is.above(-1);
      }
    });

    it("puts any duplicates next to each other", () => {
      const colors = makeRGBs(randomColors());
      const randomColor = colors[Math.floor(Math.random() * colors.length - 1)];
      const duplicate = { ...randomColor };
      colors.push(duplicate);
      color.sortColorsByHue(colors);
      expect(
        Math.abs(colors.indexOf(randomColor) - colors.indexOf(duplicate))
      ).to.equal(1);
    });
  });

  describe('getHSL', () => {
    it('converts red green and blue uints into hue saturation and lightness uints', () => {
      for(let i = 0; i < REPEAT; i++) {
        const red = rand255();
        const green = rand255();
        const blue = rand255();
        const { hue, saturation, lightness } = color.getHSL(red, green, blue);
        const hslString = color.getHSLString(hue, saturation, lightness);
        const pixel = getPixelFromCanvas(hslString);
        expect(pixel[0]).to.equal(red);
        expect(pixel[1]).to.equal(green);
        expect(pixel[2]).to.equal(blue);
      }
    })
  })

  describe("getRGBString", () => {
    it("converts red green and blue uints to rgba(x,x,x,x) format", () => {
      for (let i = 0; i < REPEAT; i++) {
        const r = rand255();
        const g = rand255();
        const b = rand255();
        const a = Math.random();
        const str = color.getRGBString(r, g, b, a);
        const split = getStringFromDOM(str)
          .split("(")[1]
          .split(",");
        expect(parseInt(split[0])).to.equal(r);
        expect(parseInt(split[1])).to.equal(g);
        expect(parseInt(split[2])).to.equal(b);
        const newA = parseFloat(split[3] || 1);
        expect(Math.abs(newA - a)).to.be.below(0.004);
      }
    });

    it("converts a uint with default alpha to rgba(x,x,x,x) format", () => {
      for (let i = 0; i < REPEAT; i++) {
        const r = rand255();
        const g = rand255();
        const b = rand255();
        const str = color.getRGBString(r, g, b);
        const split = getStringFromDOM(str)
          .split("(")[1]
          .split(",");
        expect(parseInt(split[0])).to.equal(r);
        expect(parseInt(split[1])).to.equal(g);
        expect(parseInt(split[2])).to.equal(b);
        expect(parseInt(split[3])).to.be.NaN;
      }
    });
  });

  describe("getHSLString", () => {
    it("converts hue saturation and lightness uints to hsla(x,x,x,x) format", () => {
      for (let i = 0; i < REPEAT; i++) {
        const h = Math.random() * 360;
        const s = Math.random() * 0.25 + 0.75;
        const l = Math.random() * 0.5 + 0.25;
        let a;
        if (Math.random() > 0.5) {
          a = Math.random();
        }
        const str = color.getHSLString(h, s, l, a);
        const domStr = getStringFromDOM(str);
        const {red, green, blue} = color.rgbStringToRGB(domStr);
        const {hue, saturation, lightness} = color.getHSL(red, green, blue);
        let minH = Math.min(hue, h);
        const maxH = Math.max(hue, h);
        if (maxH - minH > 180) {
          minH += 360;
        }
        expect(Math.abs(minH - maxH)).to.be.below(1);
        expect(Math.abs(saturation - s)).to.be.below(0.1);
        expect(Math.abs(lightness - l)).to.be.below(0.1);
      }
    });
  });

  describe('getRGB', () => {
    it('converts hue saturation and lightness numbers into red green and blue uints', () => {
      for(let i = 0; i < REPEAT; i++) {
        const h = Math.random() * 270 + 45;
        const s = Math.random() * 0.5 + 0.5;
        const l = Math.random() * 0.5 + 0.25;
        const str = color.getHSLString(h, s, l);
        const pixel = getPixelFromCanvas(str);
        const { red, green, blue } = color.getRGB(h, s, l);
        expect(Math.abs(pixel[0] - red)).to.be.below(1);
        expect(Math.abs(pixel[1] - green)).to.be.below(1);
        expect(Math.abs(pixel[2] - blue)).to.be.below(1);
      }
    })
  })

  describe('getEverything', () => {
    it('gets data from #XXXXXX string', () => {
      const everything = color.getEverything({string: '#f00'});
      expect(everything).to.deep.equal({
        red: 255,
        green: 0,
        blue: 0,
        hue: 0,
        saturation: 1,
        lightness: 0.5,
        brightness: 1 / 3,
        rgb: 'rgba(255, 0, 0, 1)',
        hsl: 'hsla(0, 100%, 50%, 1)',
        uint: 0xff0000,
        hex: '#ff0000',
      })
    })

    it('gets data from rgb() string', () => {
      const everything = color.getEverything({string: 'rgb(0,255,0)'});
      expect(everything).to.deep.equal({
        red: 0,
        green: 255,
        blue: 0,
        hue: 120,
        saturation: 1,
        lightness: 0.5,
        brightness: 1 / 3,
        rgb: 'rgba(0, 255, 0, 1)',
        hsl: 'hsla(120, 100%, 50%, 1)',
        uint: 0x00ff00,
        hex: '#00ff00',
      })
    })

    it('gets data from hsl() string', () => {
      const everything = color.getEverything({string: 'hsl(240,100%,50%)'});
      expect(everything).to.deep.equal({
        red: 0,
        green: 0,
        blue: 255,
        hue: 240,
        saturation: 1,
        lightness: 0.5,
        brightness: 1 / 3,
        rgb: 'rgba(0, 0, 255, 1)',
        hsl: 'hsla(240, 100%, 50%, 1)',
        uint: 0x0000ff,
        hex: '#0000ff',
      })
    })

    it('gets data from uint', () => {
      const everything = color.getEverything({uint: 0xff0000});
      expect(everything).to.deep.equal({
        red: 255,
        green: 0,
        blue: 0,
        hue: 0,
        saturation: 1,
        lightness: 0.5,
        brightness: 1 / 3,
        rgb: 'rgba(255, 0, 0, 1)',
        hsl: 'hsla(0, 100%, 50%, 1)',
        uint: 0xff0000,
        hex: '#ff0000',
      })
    })

    it('gets data from rgb uints', () => {
      const everything = color.getEverything({red: 0, green: 255, blue: 0});
      expect(everything).to.deep.equal({
        red: 0,
        green: 255,
        blue: 0,
        hue: 120,
        saturation: 1,
        lightness: 0.5,
        brightness: 1 / 3,
        rgb: 'rgba(0, 255, 0, 1)',
        hsl: 'hsla(120, 100%, 50%, 1)',
        uint: 0x00ff00,
        hex: '#00ff00',
      })
    })

    it('gets data from hue saturation lightness numbers', () => {
      const everything = color.getEverything({hue: 240, saturation: 1, lightness: 0.5});
      expect(everything).to.deep.equal({
        red: 0,
        green: 0,
        blue: 255,
        hue: 240,
        saturation: 1,
        lightness: 0.5,
        brightness: 1 / 3,
        rgb: 'rgba(0, 0, 255, 1)',
        hsl: 'hsla(240, 100%, 50%, 1)',
        uint: 0x0000ff,
        hex: '#0000ff',
      })
    })
  })
});
