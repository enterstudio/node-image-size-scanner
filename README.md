node-image-size-scanner
=======================
Reports the image file sizes for a given URL and optionally a minimum file size.

## Installation ##
`npm install node-image-size-scanner`

## Usage ##
```
$ node check
Usage: node check URL [max bytes allowed]
Ex: node check http://www.google.com 50k

$ node check www.google.com 1k
Image files > 1.00 kB (1000 bytes)
    1.83 kB http://www.google.com/images/icons/product/chrome-48.png
  209.03 kB http://www.google.com/logos/doodles/2014/halloween-2014-5647569745084416.3-hp.gif