# color ![npm bundle size (scoped)](https://img.shields.io/bundlephobia/minzip/@danehansen/color.svg) ![npm](https://img.shields.io/npm/dt/@danehansen/color.svg)

The color library contains static methods to help manipulate colors.

## Installation

`npm install --save @danehansen/color`

## Usage

As a module:

    import * as color from '@danehansen/color';

    var r = color.getRed(0xff0000);

In your browser:

    <script src='danehansen-color.min.js'></script>
    <script>
      var color = window.danehansen.color;
      var r = color.getRed(0xff0000);
    </script>

## Methods

- **getRed**(color:uint):uint  
  Returns the red portion of a uint.
- **getGreen**(color:uint):uint  
  Returns the green portion of a uint.
- **getBlue**(color:uint):uint  
  Returns the blue portion of a uint.
- **getUint**(r:uint, g:uint, b:uint):uint  
  Converts 3 uints into a single uint.
- **distance**({red:uint, green:uint, blue:uint}, {red:uint, green:uint, blue:uint}):Number  
  Returns the "distance" between two color objects with `red`, `green`, and `blue` properties. The distance is an arbitrary value.
- **sortColorsByHue**(rgbs:Array):Array  
  Approximately sorts a list of objects with `red`, `green`, and `blue` properties by their hue.
- **getHSL**(r:uint, g:uint, b:uint):Object  
  Converts 3 uints into an object with `hue`, `saturation`, and `lightness` properties.
- **getRGB**(h:uint, s:Number, b:Number):Object  
  Converts 3 numbers into an object with `red`, `green`, and `blue` properties.
- **hexToUint**(hex:String):uint  
  Converts a hex in string format to a uint.
- **getBrightness**(r:uint, g:uint, b:uint):Number  
  Returns the overall brightness of an RGB color as a single decimal between 0 and 1.
- **getRGBString**(r:uint, g:uint, b:uint, alpha:Number = 1):String  
  Converts 3 uints into a 'rgba(X,X,X,X)' string.
- **getHSLString**(h:uint, s:Number, l:Number, alpha:Number = 1):String  
  Converts 3 numbers into a 'hsla(X,X,X,X)' string.
- **rgbStringToRGB**(str:String):Object  
  Converts a 'rgb' style string into an object with `red`, `green`, and `blue` properties.
- **hslStringToHSL**(str:String):Object  
  Converts a 'hsl' style string into an object with `hue`, `saturation`, and `lightness` properties.
- **getHex**(color:uint):String  
  Converts a uint into a '#XXXXXX' string.
- **getHex**({string:String, uint:uint, red:uint, green:uint, blue: uint, hue: uint, saturation: Number, lightness: Number}):Object  
  Converts whatever you got into an object with `red`, `green`, `blue`, `hue`, `saturation`, `lightness`, `brightness`, `rgb`, `hsl`, `uint`, and `hex` properties.
