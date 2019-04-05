# color

The color library contains static methods to help manipulate colors.

![npm bundle size (scoped)](https://img.shields.io/bundlephobia/minzip/@danehansen/color.svg)
![npm](https://img.shields.io/npm/dt/@danehansen/color.svg)

## Installation

`npm install --save @danehansen/color`

## Usage

As a module:

    import * as color from '@danehansen/color';

    var r = color.red('#ff0000');

In your browser:

    <script src='danehansen-color.min.js'></script>
    <script>
      var color = window.danehansen.color;
      var r = color.red('#ff0000');
    </script>

## Public Methods

- **red**(color:uint):uint  
  [static] Returns the red portion of a uint.
- **green**(color:uint):uint  
  [static] Returns the green portion of a uint.
- **blue**(color:uint):uint  
  [static] Returns the blue portion of a uint.
- **distance**(a:Object, b:Object):Number  
  [static] Returns the "distance" between two color objects with `red`, `green`, and `blue` properties.
- **hexToUint**(hex:String):uint  
  [static] Converts a hex in string format to a uint.
- **rgbToBrightness**(r:uint, g:uint, b:uint, decimal:boolean = true):Number  
  [static] Returns the overall brightness of an RGB color as a single value, optionally as a decimal between 0 and 1 or as a uint between 0 and 765.
- **rgbToHSL**(r:uint, g:uint, b:uint):Object  
  [static] Converts 3 uints into an object with `hue`, `saturation`, and `lightness` properties.
- **rgbToUint**(r:uint, g:uint, b:uint):uint  
  [static] Converts 3 uints into a single uint.
- **sortColorsByHue**(rgbs:Array):Array  
  [static] Approximately sorts a list of objects with `red`, `green`, and `blue` properties by their hue.
- **stringToHex**(rgb:String):String  
  [static] Converts a 'rgb(X,X,X)' string into a '#XXXXXX' string.
- **uintToHex**(color:uint):String  
  [static] Converts a uint into a '#XXXXXX' string.
- **uintToRGBString**(color:uint):String  
  [static] Converts a uint into a 'rgb(X,X,X)' string.
- **uintToRGBAString**(color:uint, alpha:Number = 1):String  
  [static] Converts a uint and alpha into a 'rgba(X,X,X,X)' string.
- **uintToHSLString**(color:uint):String  
  [static] Converts a uint into an object with `hue`, `saturation`, and `lightness` properties.
