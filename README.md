# color

The color library contains static methods to help manipulate colors.

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

* __red__(color:uint):uint  
[static] Returns the red portion of a uint.
* __green__(color:uint):uint  
[static] Returns the green portion of a uint.
* __blue__(color:uint):uint  
[static] Returns the blue portion of a uint.
* __rgbToBrightness__(r:uint, g:uint, b:uint, decimal:boolean = true):Number  
[static] Returns the overall brightness of an RGB color as a single value, optionally as a decimal between 0 and 1 or as a uint between 0 and 765.
* __stringToHex__(rgb:String):String  
[static] Converts a 'rgb(X,X,X)' string into a '#XXXXXX' string.
* __rgbToUint__(r:uint, g:uint, b:uint):uint  
[static] Converts 3 uints into a single uint.
* __uintToHex__(color:uint):String  
[static] Converts a uint into a '#XXXXXX' string.
* __uintToRGBString__(color:uint):String  
[static] Converts a uint into a 'rgb(X,X,X)' string.
* __uintToRGBAString__(color:uint, alpha:Number = 1):String  
[static] Converts a uint and alpha into a 'rgba(X,X,X,X)' string.
